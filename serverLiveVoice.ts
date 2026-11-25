import type http from "http";
import type express from "express";
import { WebSocketServer, WebSocket } from "ws";
import {
  type FunctionDeclaration,
  GoogleGenAI,
  type LiveServerMessage,
  Modality,
  Type,
} from "@google/genai";
import { INDIAN_STATES_AND_UTS } from "./src/data/indiaLocations.ts";
import type { ComplaintCategory } from "./src/types.ts";

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
                  style: `Warm, calm, respectful, clear Indian civic assistant speaking naturally in ${language} at a comfortable pace for everyday citizens.`,
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
    "Generates the formal official Indian government complaint, RTI, or escalation letter and identifies the exact verified government portal. Call this once you have collected the problem details, location (at least state/district or city), citizen's full name, and 10-digit phone number — OR whenever the citizen asks to draft/create the letter now.",
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
    "Executes a completely hands-free post-draft action spoken by the citizen so they never have to tap any buttons.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      action: {
        type: Type.STRING,
        description:
          "One of: 'read_draft' (returns full official letter text so you can read it aloud clearly), 'download_pdf' (downloads the official A4 PDF immediately), 'copy_draft' (copies the official draft to clipboard), 'share_whatsapp' (opens WhatsApp share with the draft), 'save_tracker' (saves to the personal complaint tracker), or 'end_voice_flow' (ends the voice session cleanly and shows the draft screen).",
      },
    },
    required: ["action"],
  },
};

function buildLiveVoiceSystemInstruction(hintLanguage: string): string {
  return [
    "You are MakkalVoice, a warm, empathetic, crystal-clear Indian civic voice assistant operating in 100% HANDS-FREE CONTINUOUS VOICE MODE.",
    "The citizen does NOT have to touch any mic button, stop button, or form field — they simply speak naturally back-and-forth with you like a real helpful local officer.",
    "",
    "CRITICAL RULE #1 — AUTOMATIC SPOKEN LANGUAGE DETECTION (VOICE FLOW ONLY):",
    `- The dashboard header is currently set to "${hintLanguage}", which is ONLY a soft hint for your very first greeting.`,
    "- On EVERY turn, listen carefully to what language or Indian dialect the citizen ACTUALLY speaks: Tamil, Hindi, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, English, or natural code-mixed speech (Tanglish, Hinglish, Tenglish, Manglish).",
    "- IMMEDIATELY speak and continue the entire voice conversation in the citizen's ACTUAL spoken language — EVEN IF the dashboard header language is different!",
    "- If the citizen switches languages mid-conversation, smoothly switch your spoken replies to match their new spoken language immediately.",
    "- Whenever you detect their spoken language (or a language switch), call `update_complaint_details` with `detectedSpokenLanguage` set to that language name.",
    "",
    "CRITICAL RULE #2 — COMPLETE HANDS-FREE END-TO-END FLOW:",
    "Keep every spoken reply short, warm, polite, and easy to follow (1 to 2 natural sentences — never long monologues!).",
    "Guide the citizen step-by-step naturally:",
    "1. Listen to their civic/consumer/government problem. Acknowledge warmly and call `update_complaint_details` right away with the problem summary, category, and any location details they already mentioned.",
    "2. If key location details (State, District/City, Area/Landmark) or 1 crucial practical fact (such as how long the problem has persisted) are missing, ask ONE short, simple question at a time. NEVER repeat anything they already told you.",
    "3. Ask politely for their Full Name and 10-digit Mobile Number (reassuring them briefly that it stays private on their device for the letter signature). NEVER ask for Aadhaar, OTP, or bank PIN.",
    "4. As soon as you have the problem + location + full name + 10-digit phone number (or if they ask you to generate the letter now), say briefly in their spoken language that you are preparing their official letter now and call `generate_official_draft`.",
    "5. Once `generate_official_draft` returns the generated letter & verified official portal, warmly tell the citizen in their spoken language: (a) the letter is ready, (b) the exact government portal name & helpline, and (c) ask if they would like you to read the letter aloud, download the PDF, save it to their tracker, share on WhatsApp, or finish and view it on screen.",
    "6. Whenever the citizen asks for any action ('read it', 'download PDF', 'save it', 'copy', 'share on WhatsApp', 'done / close / bye'), call `execute_voice_action` immediately.",
    "   - If `execute_voice_action('read_draft')` returns the letter text, read it aloud calmly and clearly.",
    "   - If they say goodbye / finish / close, say a warm 1-sentence farewell and call `execute_voice_action('end_voice_flow')`.",
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
                    text: `[Voice session just started. Greet the citizen briefly in 1 warm, welcoming sentence in ${hintLanguage} and tell them they can speak freely in ANY Indian language they prefer — no buttons needed.]`,
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
