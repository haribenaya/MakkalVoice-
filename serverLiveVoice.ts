import type http from "http";
import type express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {
  EndSensitivity,
  type FunctionDeclaration,
  GoogleGenAI,
  type LiveServerMessage,
  Modality,
  StartSensitivity,
  Type,
} from "@google/genai";
import { INDIAN_STATES_AND_UTS } from "./src/data/indiaLocations.ts";
import type { ComplaintCategory } from "./src/types.ts";
import { attachDemoLiveVoiceSession, hasGeminiApiKey } from "./serverDemoFallback.ts";

function getVoiceAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw Object.assign(new Error("Gemini API key is not configured on the server."), {
      statusCode: 500,
      code: "MISSING_API_KEY",
    });
  }
  return new GoogleGenAI({
    apiKey,
    apiVersion: "v1beta",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const TTS_MODEL = "gemini-3.8-flash-lite-tts";
const LIVE_MODEL = "gemini-3.8-live";

const SUPPORTED_VOICE_LANGUAGES = [
  "English",
  "Tamil",
  "Hindi",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Marathi",
  "Gujarati",
  "Punjabi",
  "Odia",
  "Assamese",
  "Urdu",
] as const;

const VALID_CATEGORIES: ComplaintCategory[] = [
  "Civic Issues",
  "Consumer Complaints",
  "Public Safety",
  "Legal Assistance",
  "Government Services",
  "Other",
];

const ttsCache = new Map<string, { expiresAt: number; audioBase64: string }>();
const TTS_CACHE_TTL_MS = 15 * 60_000;

function getCachedTts(key: string): string | null {
  const entry = ttsCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    ttsCache.delete(key);
    return null;
  }
  return entry.audioBase64;
}

function setCachedTts(key: string, audioBase64: string): void {
  if (ttsCache.size >= 40) {
    const oldest = ttsCache.keys().next().value;
    if (oldest) ttsCache.delete(oldest);
  }
  ttsCache.set(key, { expiresAt: Date.now() + TTS_CACHE_TTL_MS, audioBase64 });
}

function cleanStr(raw: unknown, maxLen: number): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function normalizeSpokenLanguage(raw: unknown): string | undefined {
  if (typeof raw !== "string") return undefined;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return undefined;
  const exact = SUPPORTED_VOICE_LANGUAGES.find((l) => l.toLowerCase() === cleaned);
  if (exact) return exact;
  if (/tamil|tanglish|தமிழ்/i.test(cleaned)) return "Tamil";
  if (/hindi|hinglish|हिन्दी|हिंदी/i.test(cleaned)) return "Hindi";
  if (/telugu|tenglish|తెలుగు/i.test(cleaned)) return "Telugu";
  if (/kannada|கன்னட|ಕನ್ನಡ/i.test(cleaned)) return "Kannada";
  if (/malayalam|manglish|മലയാളം/i.test(cleaned)) return "Malayalam";
  if (/bengali|bangla|বাংলা/i.test(cleaned)) return "Bengali";
  if (/marathi|मराठी/i.test(cleaned)) return "Marathi";
  if (/gujarati|ગુજરાતી/i.test(cleaned)) return "Gujarati";
  if (/punjabi|ਪੰਜਾਬੀ/i.test(cleaned)) return "Punjabi";
  if (/odia|oriya|ଓଡ଼ିଆ/i.test(cleaned)) return "Odia";
  if (/assamese|অসমীয়া/i.test(cleaned)) return "Assamese";
  if (/urdu|اردو/i.test(cleaned)) return "Urdu";
  if (/english|en/i.test(cleaned)) return "English";
  return undefined;
}

function normalizeStateName(raw: unknown): string | undefined {
  const s = cleanStr(raw, 100);
  if (!s) return undefined;
  const lower = s.toLowerCase();
  const exact = INDIAN_STATES_AND_UTS.find((st) => st.toLowerCase() === lower);
  if (exact) return exact;
  if (lower.includes("delhi")) return "Delhi (NCT)";
  if (lower.includes("orissa")) return "Odisha";
  if (lower.includes("pondicherry")) return "Puducherry";
  const partial = INDIAN_STATES_AND_UTS.find(
    (st) => st.toLowerCase().includes(lower) || lower.includes(st.toLowerCase()),
  );
  return partial;
}

function normalizeCategory(raw: unknown): ComplaintCategory | undefined {
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  const exact = VALID_CATEGORIES.find((c) => c.toLowerCase() === trimmed.toLowerCase());
  return exact;
}

type ErrorMapper = (error: unknown) => {
  status: number;
  code: string;
  message: string;
  diagnostic?: string;
};

/**
 * Registers POST /api/tts using Gemini 3.8 Flash Lite TTS for warm, natural Indian regional voice output.
 */
export function registerTtsRoute(
  app: express.Express,
  getAiClient: () => GoogleGenAI,
  mapGeminiError: ErrorMapper,
): void {
  app.post("/api/tts", async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        text?: string;
        language?: string;
        voiceName?: string;
      };
      const text = cleanStr(body.text, 1600);
      const language = normalizeSpokenLanguage(body.language) ?? cleanStr(body.language, 40) ?? "English";
      const allowedVoices = ["Kore", "Zephyr", "Puck", "Charon", "Fenrir"] as const;
      const requestedVoice = typeof body.voiceName === "string" ? body.voiceName.trim() : "Kore";
      const voiceName = allowedVoices.includes(requestedVoice as (typeof allowedVoices)[number])
        ? requestedVoice
        : "Kore";

      if (!text) {
        res.status(400).json({ error: "Text is required for speech output." });
        return;
      }

      const cacheKey = `${voiceName}:${language}:${text}`;
      const cached = getCachedTts(cacheKey);
      if (cached) {
        res.json({ audioBase64: cached, mimeType: "audio/wav", voiceName });
        return;
      }

      if (!hasGeminiApiKey()) {
        res.status(503).json({
          error: "Using local browser speech synthesis.",
          code: "NO_API_KEY_FALLBACK",
        });
        return;
      }

      const ai = getVoiceAiClient();
      const response = await ai.models.generateContent({
        model: TTS_MODEL,
        contents: [
          {
            role: "user",
            parts: [
              {
                text,
                speechMetadata: {
                  style: `Speak in one consistent, warm, natural, deeply comforting local Indian voice in ${language}—like a trusted neighborhood civic helper who uses polite, traditional regional phrasing and natural everyday cadence (never robotic, never rushed).`,
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName },
            },
          },
        },
      });

      const base64Audio =
        response.candidates?.[0]?.content?.parts?.find((p) => p.inlineData?.data)?.inlineData?.data;

      if (!base64Audio) {
        res.status(502).json({
          error: "Neural speech engine returned empty audio.",
          code: "AI_UNAVAILABLE",
        });
        return;
      }

      setCachedTts(cacheKey, base64Audio);
      res.json({
        audioBase64: base64Audio,
        mimeType: "audio/wav",
        voiceName,
      });
    } catch (error) {
      console.error("[/api/tts] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });
}

const updateComplaintDetailsTool: FunctionDeclaration = {
  name: "update_complaint_details",
  description:
    "Saves any newly spoken citizen details into the live MakkalVoice form automatically (zero buttons needed) AND records the citizen's detected spoken language strictly for this voice session. Call immediately whenever the citizen shares their language, problem, location, name, phone number, reference number, or clarifying detail.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      detectedSpokenLanguage: {
        type: Type.STRING,
        description:
          "The exact Indian language or English the citizen is currently speaking (e.g., Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, English). Updates ONLY the voice flow language, never changes the dashboard header language.",
      },
      complaint: {
        type: Type.STRING,
        description:
          "Updated complete factual summary of the citizen's problem (in the citizen's spoken language or clear English) combining all details they have shared so far.",
      },
      category: {
        type: Type.STRING,
        description:
          "Best matching category: 'Civic Issues', 'Consumer Complaints', 'Public Safety', 'Legal Assistance', 'Government Services', or 'Other'.",
      },
      mode: {
        type: Type.STRING,
        description: "Document mode: 'complaint' (default), 'rti' (RTI Act 2005), or 'escalation'.",
      },
      state: {
        type: Type.STRING,
        description: "Official Indian State or Union Territory name in English (e.g., 'Tamil Nadu', 'Maharashtra', 'Karnataka').",
      },
      district: {
        type: Type.STRING,
        description: "District or city name in English (e.g., 'Chennai', 'Pune', 'Bengaluru Urban').",
      },
      town: {
        type: Type.STRING,
        description: "Town, locality, ward, or area name.",
      },
      street: {
        type: Type.STRING,
        description: "Street name, cross road, or nearby landmark.",
      },
      pincode: {
        type: Type.STRING,
        description: "6-digit Indian PIN code if mentioned.",
      },
      name: {
        type: Type.STRING,
        description: "Citizen's full name spoken aloud.",
      },
      contact: {
        type: Type.STRING,
        description: "Citizen's 10-digit Indian mobile number spoken aloud (digits only).",
      },
      referenceNumber: {
        type: Type.STRING,
        description: "Optional bill number, consumer number, or earlier ticket number if mentioned.",
      },
      followupQuestion: {
        type: Type.STRING,
        description: "The clarifying question that was just answered (optional).",
      },
      followupAnswer: {
        type: Type.STRING,
        description: "The citizen's concise answer to that clarifying question (optional).",
      },
    },
  },
};

const generateOfficialDraftTool: FunctionDeclaration = {
  name: "generate_official_draft",
  description:
    "Generates the formal official Indian government complaint, RTI, or escalation letter and identifies the exact verified government portal. NEVER call this prematurely! You MUST FIRST collect ALL required details and save them via update_complaint_details: (1) problem details & how long/impact, (2) State, (3) District/City, (4) specific Town/Area/Street/Landmark, (5) Citizen's Full Name, and (6) Citizen's 10-digit Mobile Number.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      draftLanguage: {
        type: Type.STRING,
        description:
          "Target language for the formal letter: default 'English' (accepted on all Indian portals), or the citizen's spoken regional language if they specifically asked for a regional-language letter.",
      },
    },
  },
};

const executeVoiceActionTool: FunctionDeclaration = {
  name: "execute_voice_action",
  description:
    "Executes EVERY MakkalVoice dashboard feature completely hands-free by voice — including permission-gated Gmail compose (prepare_gmail_compose -> ask explicit permission -> open_gmail_compose with To/Subject/Body pre-filled), permission-gated Official WhatsApp (prepare_whatsapp_compose -> ask explicit permission -> open_whatsapp_compose), reading draft aloud, regenerating draft language, downloading A4 PDF/TXT, printing, copying, saving to tracker, checking saved complaints, adding neighbor co-signers, opening official portal, switching tabs, opening Portal Assistant, resetting form, or ending voice flow.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description:
          "One of: 'read_draft', 'prepare_gmail_compose' (shows pre-filled To/Subject/Body permission card for Gmail and lets user say or confirm recipient email), 'open_gmail_compose' (opens pre-filled Gmail compose ONLY after citizen explicitly says yes/allow), 'prepare_whatsapp_compose' (shows official WhatsApp number & message permission card), 'open_whatsapp_compose' (opens pre-filled Official WhatsApp ONLY after citizen explicitly says yes/allow), 'download_pdf', 'download_txt', 'print_letter', 'copy_draft', 'save_tracker', 'open_official_portal', 'add_cosigner', 'check_saved_complaints', 'switch_dashboard_tab', 'open_portal_assistant', 'regenerate_draft_language', 'reset_form', or 'end_voice_flow'.",
      },
      recipientEmail: {
        type: Type.STRING,
        description:
          "Email ID dictated by the citizen when using 'prepare_gmail_compose' or 'open_gmail_compose' (optional if the matched official portal already provides an official email ID).",
      },
      draftLanguage: {
        type: Type.STRING,
        description:
          "Target language when using 'regenerate_draft_language' (e.g., 'English', 'Tamil', 'Hindi').",
      },
      coSignerName: {
        type: Type.STRING,
        description: "Neighbor / co-signer full name when using 'add_cosigner'.",
      },
      coSignerAddress: {
        type: Type.STRING,
        description: "Optional neighbor / co-signer address when using 'add_cosigner'.",
      },
      tab: {
        type: Type.STRING,
        description: "Dashboard tab for 'switch_dashboard_tab': 'write', 'saved', or 'portals'.",
      },
    },
    required: ["action"],
  },
};

function buildLiveVoiceSystemInstruction(hintLanguage: string): string {
  return [
    "You are MakkalVoice, a warm, deeply comforting, culturally rooted Indian civic voice companion operating in 100% HANDS-FREE CONTINUOUS VOICE MODE with COMPLETE control over every feature in the dashboard.",
    "The citizen NEVER has to touch a keyboard, mic button, or stop button — they speak naturally with you from start to finish.",
    "",
    "CRITICAL RULE #1 — CALM SPEAKING PACE, CLEAR WORD SEPARATION & NATURAL PAUSES:",
    "- Speak at a calm, unhurried, gentle conversational pace so every citizen (including elders) understands effortlessly.",
    "- Articulate EVERY word distinctly with a natural pause between phrases, a clear pause after commas, and a distinct full breath pause between sentences.",
    "- NEVER rush, swallow syllables, or join two sentences together continuously without pausing.",
    "- Keep each spoken turn concise (1 to 2 short, clearly spaced sentences).",
    "",
    "CRITICAL RULE #2 — PURE NATIVE VOCABULARY & RESPECTFUL REGIONAL VOICE (NO ENGLISH MIXING):",
    "- Maintain ONE warm, calm, human-like local voice throughout the session.",
    "- When the citizen speaks an Indian regional language, speak 100% in natural, everyday polite native words of THAT language — NEVER mix English words like 'state', 'district', 'area', 'street', 'pincode', 'phone number', 'full name', 'complaint', 'draft', or 'portal' into a Tamil/regional sentence (unless the citizen themselves speaks in English). Note: when calling `update_complaint_details`, still store standardized English names in JSON fields silently while speaking pure native words aloud!",
    "- Always use respectful local honorifics and pure civic terms for the spoken language:",
    "  * Tamil (தமிழ்): 'வணக்கம்' + respectful 'நீங்கள் / சொல்லுங்கள்'. ALWAYS use pure Tamil civic words: மாநிலம் (NEVER say 'state'), மாவட்டம் (NEVER say 'district'), ஊர் / பகுதி / தெரு / அருகிலுள்ள அடையாளம் (NEVER say 'area/street/landmark'), எத்தனை நாட்களாக (duration), முழுப் பெயர் (NEVER say 'full name'), பத்து இலக்க கைபேசி எண் அல்லது தொலைபேசி எண் (NEVER say 'phone number'), புகார் கடிதம், அரசு இணையதளம்.",
    "  * Hindi (हिन्दी): 'नमस्ते' + respectful 'आप / बताइए'. Use pure Hindi words: राज्य, ज़िला, शहर / मोहल्ला / गली, कितने दिनों से, पूरा नाम, दस अंकों का मोबाइल नंबर, शिकायत पत्र, सरकारी पोर्टल.",
    "  * Telugu (తెలుగు): 'నమస్కారం' + respectful 'మీరు / చెప్పండి'. Use: రాష్ట్రం, జిల్లా, ఊరు / ప్రాంతం / వీధి, పూర్తి పేరు, పది అంకెల ఫోన్ నంబర్.",
    "  * Kannada (ಕನ್ನಡ): 'ನಮಸ್ಕಾರ' + respectful 'ನೀವು / ಹೇಳಿ'. Use: ರಾಜ್ಯ, ಜಿಲ್ಲೆ, ಊರು / ಪ್ರದೇಶ / ರಸ್ತೆ, ಪೂರ್ಣ ಹೆಸರು, ಹತ್ತು ಅಂಕಿಯ ಫೋನ್ ನಂಬರ್.",
    "  * Malayalam (മലയാളം): 'നമസ്കാരം' + respectful 'നിങ്ങൾ / പറയൂ'. Use: സംസ്ഥാനം, ജില്ല, സ്ഥലം / പ്രദേശം / തെരുവ്, മുഴുവൻ പേര്, പത്ത് അക്ക ഫോൺ നമ്പർ.",
    "  * Bengali (বাংলা): 'নমস্কার' + respectful 'আপনি / বলুন'. Use: রাজ্য, জেলা, এলাকা বা রাস্তা, পুরো নাম, দশ সংখ্যার মোবাইল নম্বর.",
    "  * Marathi (मराठी): 'नमस्कार' + respectful 'तुम्ही / सांगा'. Use: राज्य, जिल्हा, गाव किंवा रस्ता, पूर्ण नाव, दहा अंकी मोबाईल क्रमांक.",
    "  * Gujarati (ગુજરાતી): 'નમસ્તે' + respectful 'તમે / કહો'. Use: રાજ્ય, જિલ્લો, વિસ્તાર અથવા શેરી, પૂરું નામ, દસ અંકનો ફોન નંબર.",
    "  * Punjabi (ਪੰਜਾਬੀ): 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ਜੀ' + respectful 'ਤੁਸੀਂ / ਦੱਸੋ'. Use: ਰਾਜ, ਜ਼ਿਲ੍ਹਾ, ਇਲਾਕਾ ਜਾਂ ਗਲੀ, ਪੂਰਾ ਨਾਮ, ਦਸ ਅੰਕਾਂ ਦਾ ਫ਼ੋਨ ਨੰਬਰ.",
    "  * Odia (ଓଡ଼ିଆ): 'ନମସ୍କାର' + respectful 'ଆପଣ / କୁହନ୍ତୁ'. Use: ରାଜ୍ୟ, ଜିଲ୍ଲା, ଅଞ୍ଚଳ ବା ରାସ୍ତା, ପୂରା ନାମ, ଦଶ ଅଙ୍କ ଫୋନ୍ ନମ୍ବର.",
    "  * Assamese (অসমীয়া): 'নমস্কাৰ' + respectful 'আপুনি / কওক'. Use: ৰাজ্য, জিলা, অঞ্চল বা ৰাস্তা, সম্পূৰ্ণ নাম, দহ অংকৰ ফোন নম্বৰ.",
    "  * Urdu (اردو): 'آداب' + respectful 'آپ / فرمائیے'. Use: ریاست، ضلع، علاقہ یا گلی، پورا نام، دس ہندسوں کا فون نمبر.",
    "  * English: Warm respectful Indian English ('Namaste, please tell me how I can help you today.').",
    "",
    "CRITICAL RULE #3 — ATTENTIVE RECOGNITION OF REGIONAL SPEECH & CLARIFICATION:",
    `- The dashboard header is set to "${hintLanguage}", which is ONLY a soft hint for your very first greeting.`,
    "- On EVERY turn, detect what language the citizen actually speaks, immediately respond in THAT language, and call `update_complaint_details` with `detectedSpokenLanguage` — without changing the dashboard header language.",
    "- Listen carefully to Indian accents, regional town/street names, and phone numbers spoken digit-by-digit or in pairs. If any spoken phrase, place name, or digit is unclear or cut off, NEVER guess — politely ask the citizen in their pure spoken language to repeat that specific detail once more.",
    "",
    "CRITICAL RULE #4 — COLLECT ALL REQUIRED DETAILS BEFORE GENERATING THE DRAFT (MANDATORY ORDER):",
    "NEVER call `generate_official_draft` after just one question! Check every item below carefully and ask for ALL missing required fields one gentle question at a time (never repeating anything they already told you):",
    "1. PROBLEM & DURATION/IMPACT: Listen to their civic, consumer, RTI, or escalation issue. Immediately call `update_complaint_details` with problem summary, category, mode ('complaint', 'rti', or 'escalation'), and any location mentioned. If it helps clarity, briefly ask how many days/weeks it has been happening or how it affects residents, and save via `followupAnswer`.",
    "2. COMPLETE ADDRESS: You MUST collect ALL FOUR parts of the location if not yet given — State (e.g. மாநிலம்), District/City (மாவட்டம்), and exact Town/Locality/Street/Landmark (ஊர் / பகுதி / தெரு). Do NOT stop after only State and District — always ask for their town/street/landmark too!",
    "3. CITIZEN'S FULL NAME: Politely ask for their Full Name (`name`) so the official complaint letter is properly addressed in their name.",
    "4. 10-DIGIT MOBILE NUMBER: Politely ask for their 10-digit Mobile Number (`contact`) required by official Indian portals for complaint registration & status SMS updates (briefly reassuring them it stays private on their device). Never ask for Aadhaar, OTP, or bank PIN.",
    "5. OPTIONAL REFERENCE: If it is a utility bill, consumer order, or follow-up escalation, briefly ask if they have a bill/consumer/earlier ticket number (`referenceNumber`), otherwise move straight to drafting.",
    "6. ONLY AFTER problem + State + District + Town/Street + Citizen Full Name + 10-digit Mobile Number are ALL saved via `update_complaint_details`, warmly tell the citizen you are preparing their official letter and call `generate_official_draft`.",
    "",
    "CRITICAL RULE #5 — POST-DRAFT DELIVERY & PERMISSION-GATED ACTIONS:",
    "- When `generate_official_draft` returns the draft, portal name, helpline, `officialEmail`, and `officialWhatsApp`, warmly inform the citizen in their spoken language:",
    "   * State the verified portal name and helpline clearly.",
    "   * If `officialEmail` is present, offer to prepare and open pre-filled Gmail after getting their permission.",
    "   * If `officialWhatsApp` is present, tell them an official WhatsApp number is also available and offer to open pre-filled WhatsApp.",
    "   * Mention other hands-free options: reading the draft aloud, regenerating in another language, downloading A4 PDF/TXT, printing, copying, saving to tracker, adding neighbor co-signers, checking saved complaints, opening the official portal, or opening the Portal Assistant.",
    "- MANDATORY PERMISSION FLOW FOR GMAIL & WHATSAPP: ALWAYS call `prepare_gmail_compose` or `prepare_whatsapp_compose` first, read the email/number aloud, ask explicit permission, and ONLY after explicit confirmation call `open_gmail_compose` or `open_whatsapp_compose`.",
  ].join("\n");
}

function safeSendWs(ws: WebSocket, payload: Record<string, unknown>): void {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

/**
 * Attaches the /api/live-voice WebSocket server bridging browser 16kHz PCM audio
 * directly into Gemini Live API (gemini-3.8-live) and streaming 24kHz native neural audio back.
 */
export function attachLiveVoiceWebSocket(
  httpServer: http.Server,
  getAiClient: () => GoogleGenAI,
  mapGeminiError: ErrorMapper,
): void {
  const wss = new WebSocketServer({
    server: httpServer,
    path: "/api/live-voice",
  });

  wss.on("connection", async (clientWs, req) => {
    const reqUrl = new URL(req.url ?? "/api/live-voice", "http://localhost");
    const rawHintLang = reqUrl.searchParams.get("hintLanguage") ?? "English";
    const hintLanguage = normalizeSpokenLanguage(rawHintLang) ?? "English";

    if (!hasGeminiApiKey()) {
      attachDemoLiveVoiceSession(clientWs, hintLanguage, safeSendWs);
      return;
    }

    let closed = false;
    // Track pending browser-executed tool calls (generate_official_draft, execute_voice_action)
    const pendingToolCalls = new Map<
      string,
      {
        name: string;
        timer: ReturnType<typeof setTimeout>;
      }
    >();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let liveSession: any = null;

    const cleanup = () => {
      if (closed) return;
      closed = true;
      for (const entry of pendingToolCalls.values()) {
        clearTimeout(entry.timer);
      }
      pendingToolCalls.clear();
      try {
        liveSession?.close?.();
      } catch {
        // Ignore close errors
      }
      liveSession = null;
    };

    clientWs.on("close", cleanup);
    clientWs.on("error", cleanup);

    try {
      const ai = getVoiceAiClient();

      liveSession = await ai.live.connect({
        model: LIVE_MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Kore" },
            },
          },
          realtimeInputConfig: {
            automaticActivityDetection: {
              startOfSpeechSensitivity: StartSensitivity.START_SENSITIVITY_HIGH,
              endOfSpeechSensitivity: EndSensitivity.END_SENSITIVITY_LOW,
              prefixPaddingMs: 260,
              silenceDurationMs: 1100,
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: buildLiveVoiceSystemInstruction(hintLanguage),
          tools: [
            {
              functionDeclarations: [
                updateComplaintDetailsTool,
                generateOfficialDraftTool,
                executeVoiceActionTool,
              ],
            },
          ],
        },
        callbacks: {
          onopen: () => {
            if (closed) return;
            safeSendWs(clientWs, { type: "ready" });
          },
          onmessage: (message: LiveServerMessage) => {
            if (closed) return;

            const content = message.serverContent;
            if (content) {
              if (content.interrupted) {
                safeSendWs(clientWs, { type: "interrupted" });
              }

              if (content.inputTranscription?.text) {
                safeSendWs(clientWs, {
                  type: "input_transcript",
                  text: content.inputTranscription.text,
                });
              }

              if (content.outputTranscription?.text) {
                safeSendWs(clientWs, {
                  type: "output_transcript",
                  text: content.outputTranscription.text,
                });
              }

              for (const part of content.modelTurn?.parts ?? []) {
                if (part.inlineData?.data) {
                  safeSendWs(clientWs, {
                    type: "audio",
                    data: part.inlineData.data,
                  });
                }
              }

              if (content.turnComplete) {
                safeSendWs(clientWs, { type: "turn_complete" });
              }
            }

            // Handle Live API Function Calls cleanly
            const calls = message.toolCall?.functionCalls ?? [];
            for (const call of calls) {
              const callId = call.id ?? `call-${Date.now()}`;
              const fnName = call.name ?? "";
              const args = (call.args ?? {}) as Record<string, unknown>;

              if (fnName === "update_complaint_details") {
                const normalized: Record<string, string> = {};
                const detectedLang = normalizeSpokenLanguage(args.detectedSpokenLanguage);
                if (detectedLang) normalized.detectedSpokenLanguage = detectedLang;

                const complaint = cleanStr(args.complaint, 2200);
                if (complaint) normalized.complaint = complaint;

                const category = normalizeCategory(args.category);
                if (category) normalized.category = category;

                const modeRaw = cleanStr(args.mode, 20).toLowerCase();
                if (modeRaw === "complaint" || modeRaw === "rti" || modeRaw === "escalation") {
                  normalized.mode = modeRaw;
                }

                const state = normalizeStateName(args.state);
                if (state) normalized.state = state;

                const district = cleanStr(args.district, 100);
                if (district) normalized.district = district;

                const town = cleanStr(args.town, 120);
                if (town) normalized.town = town;

                const street = cleanStr(args.street, 200);
                if (street) normalized.street = street;

                const pincode = cleanStr(args.pincode, 12).replace(/\D/g, "").slice(0, 6);
                if (pincode) normalized.pincode = pincode;

                const name = cleanStr(args.name, 100);
                if (name) normalized.name = name;

                const contactDigits = cleanStr(args.contact, 24).replace(/\D/g, "");
                if (contactDigits.length >= 10) {
                  normalized.contact = contactDigits.slice(-10);
                }

                const refNum = cleanStr(args.referenceNumber, 80);
                if (refNum) normalized.referenceNumber = refNum;

                const fq = cleanStr(args.followupQuestion, 240);
                const fa = cleanStr(args.followupAnswer, 500);
                if (fa) {
                  normalized.followupQuestion = fq || "Additional detail";
                  normalized.followupAnswer = fa;
                }

                // Immediately push live update to browser UI & acknowledge back to Gemini in 0ms
                safeSendWs(clientWs, { type: "intake_update", data: normalized });

                try {
                  liveSession?.sendToolResponse({
                    functionResponses: [
                      {
                        id: callId,
                        name: fnName,
                        response: {
                          status: "updated",
                          savedFields: Object.keys(normalized),
                        },
                      },
                    ],
                  });
                } catch (err) {
                  console.error("[/api/live-voice] sendToolResponse error:", err);
                }
              } else if (
                fnName === "generate_official_draft" ||
                fnName === "execute_voice_action"
              ) {
                // Delegate execution to browser (which holds live form/draft state & triggers PDF/tracker)
                const timer = setTimeout(() => {
                  if (!pendingToolCalls.has(callId)) return;
                  pendingToolCalls.delete(callId);
                  try {
                    liveSession?.sendToolResponse({
                      functionResponses: [
                        {
                          id: callId,
                          name: fnName,
                          response: {
                            success: false,
                            error: "Action took too long. Please try again.",
                          },
                        },
                      ],
                    });
                  } catch {
                    // Ignore
                  }
                }, 28_000);

                pendingToolCalls.set(callId, { name: fnName, timer });
                safeSendWs(clientWs, {
                  type: "voice_command",
                  callId,
                  name: fnName,
                  args,
                });
              }
            }
          },
          onerror: (errEvent: unknown) => {
            if (closed) return;
            console.error("[/api/live-voice] Gemini Live error:", errEvent);
            const rawErr =
              errEvent instanceof Error
                ? errEvent
                : new Error(
                    String(
                      (errEvent as { message?: string; error?: { message?: string } })?.message ??
                        (errEvent as { error?: { message?: string } })?.error?.message ??
                        "Live voice connection error.",
                    ),
                  );
            const mapped = mapGeminiError(rawErr);
            safeSendWs(clientWs, {
              type: "error",
              code: mapped.code,
              message: mapped.message,
              ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
            });
          },
          onclose: (closeEvent: unknown) => {
            if (closed) return;
            const reason = String((closeEvent as { reason?: string })?.reason ?? "");
            const codeNum = (closeEvent as { code?: number })?.code;
            if (codeNum && codeNum !== 1000) {
              const mapped = mapGeminiError(new Error(reason || `Live voice session closed (${codeNum})`));
              safeSendWs(clientWs, {
                type: "error",
                code: mapped.code,
                message: mapped.message,
                ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
              });
            } else {
              safeSendWs(clientWs, { type: "session_closed" });
            }
            cleanup();
          },
        },
      });

      // Trigger a warm immediate opening welcome so the citizen knows they can start speaking right away
      if (!closed && liveSession) {
        try {
          liveSession.sendClientContent({
            turns: [
              {
                role: "user",
                parts: [
                  {
                    text: `[Voice session just started. Greet the citizen calmly, slowly, and clearly with natural pauses in 1 short sentence using pure ${hintLanguage} (with authentic local greeting like Vanakkam/Namaste/Namaskaram/Sat Sri Akal/Nomoshkar/Adaab — NO mixed English words if speaking a regional language) and invite them to describe their problem comfortably.]`,
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        } catch (err) {
          console.warn("[/api/live-voice] initial greeting trigger warning:", err);
        }
      }

      clientWs.on("message", (raw) => {
        if (closed || !liveSession) return;
        try {
          const msg = JSON.parse(raw.toString()) as {
            type?: string;
            audio?: string;
            callId?: string;
            name?: string;
            response?: Record<string, unknown>;
            text?: string;
          };

          if (msg.type === "audio" && typeof msg.audio === "string" && msg.audio.length > 0) {
            liveSession.sendRealtimeInput({
              audio: {
                data: msg.audio,
                mimeType: "audio/pcm;rate=16000",
              },
            });
          } else if (msg.type === "tool_response" && msg.callId && msg.name) {
            const pending = pendingToolCalls.get(msg.callId);
            if (pending) {
              clearTimeout(pending.timer);
              pendingToolCalls.delete(msg.callId);
            }
            liveSession.sendToolResponse({
              functionResponses: [
                {
                  id: msg.callId,
                  name: msg.name,
                  response: msg.response ?? { success: true },
                },
              ],
            });
          } else if (msg.type === "text" && typeof msg.text === "string" && msg.text.trim()) {
            liveSession.sendClientContent({
              turns: [{ role: "user", parts: [{ text: msg.text.trim().slice(0, 600) }] }],
              turnComplete: true,
            });
          }
        } catch (err) {
          console.error("[/api/live-voice] client message error:", err);
        }
      });
    } catch (error) {
      console.error("[/api/live-voice] failed to connect Gemini Live:", error);
      const mapped = mapGeminiError(error);
      safeSendWs(clientWs, {
        type: "error",
        code: mapped.code,
        message: mapped.message,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
      cleanup();
    }
  });
}
