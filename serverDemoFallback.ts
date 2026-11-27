import type WebSocket from "ws";
import { INDIAN_STATES_AND_UTS } from "./src/data/indiaLocations.ts";
import {
  selectFallbackPortalIds,
  VERIFIED_PORTALS,
} from "./src/data/verifiedPortals.ts";
import type { ComplaintCategory, SubmissionMode } from "./src/types.ts";

export function hasGeminiApiKey(): boolean {
  return Boolean(process.env.GEMINI_API_KEY?.trim());
}

const CITY_STATE_HINTS: Array<{ keyword: RegExp; state: string; district: string }> = [
  { keyword: /\b(chennai|ambattur|adyar|anna nagar|t nagar|mylapore|velachery|tambaram|guindy)\b/i, state: "Tamil Nadu", district: "Chennai" },
  { keyword: /\bcoimbatore\b/i, state: "Tamil Nadu", district: "Coimbatore" },
  { keyword: /\bmadurai\b/i, state: "Tamil Nadu", district: "Madurai" },
  { keyword: /\b(trichy|tiruchirappalli)\b/i, state: "Tamil Nadu", district: "Tiruchirappalli" },
  { keyword: /\bsalem\b/i, state: "Tamil Nadu", district: "Salem" },
  { keyword: /\b(bengaluru|bangalore|koramangala|indiranagar|whitefield|jayanagar|yelahanka)\b/i, state: "Karnataka", district: "Bengaluru Urban" },
  { keyword: /\bmysuru|mysore\b/i, state: "Karnataka", district: "Mysuru" },
  { keyword: /\b(mumbai|andheri|bandra|dadar|borivali|powai|thane)\b/i, state: "Maharashtra", district: "Mumbai" },
  { keyword: /\bpune|pimpri\b/i, state: "Maharashtra", district: "Pune" },
  { keyword: /\bnagpur\b/i, state: "Maharashtra", district: "Nagpur" },
  { keyword: /\b(hyderabad|secunderabad|gachibowli|madhapur|kukatpally|banjara hills)\b/i, state: "Telangana", district: "Hyderabad" },
  { keyword: /\b(delhi|new delhi|dwarka|rohini|karol bagh|lajpat nagar|janakpuri|saket)\b/i, state: "Delhi (NCT)", district: "New Delhi" },
  { keyword: /\b(kolkata|salt lake|howrah|ballygunge)\b/i, state: "West Bengal", district: "Kolkata" },
  { keyword: /\b(kochi|ernakulam)\b/i, state: "Kerala", district: "Ernakulam" },
  { keyword: /\bthiruvananthapuram|trivandrum\b/i, state: "Kerala", district: "Thiruvananthapuram" },
  { keyword: /\bahmedabad\b/i, state: "Gujarat", district: "Ahmedabad" },
  { keyword: /\bsurat\b/i, state: "Gujarat", district: "Surat" },
  { keyword: /\bjaipur\b/i, state: "Rajasthan", district: "Jaipur" },
  { keyword: /\blucknow\b/i, state: "Uttar Pradesh", district: "Lucknow" },
  { keyword: /\bpatna\b/i, state: "Bihar", district: "Patna" },
  { keyword: /\bbhubaneswar\b/i, state: "Odisha", district: "Khordha" },
  { keyword: /\bguwahati\b/i, state: "Assam", district: "Kamrup Metropolitan" },
  { keyword: /\bchandigarh\b/i, state: "Chandigarh", district: "Chandigarh" },
  { keyword: /\bvisakhapatnam|vizag\b/i, state: "Andhra Pradesh", district: "Visakhapatnam" },
  { keyword: /\bvijayawada\b/i, state: "Andhra Pradesh", district: "NTR" },
];

export function detectCategoryFromText(text: string): ComplaintCategory {
  const lower = text.toLowerCase();
  if (/(cyber|scam|otp|fraud|upi|bank|atm|loan|credit card|theft|harass|police|safety|assault|emergency)/.test(lower)) {
    return /bank|upi|atm|loan|credit card/.test(lower) ? "Consumer Complaints" : "Public Safety";
  }
  if (/(refund|overcharge|defective|ecommerce|bill dispute|broadband|airline|delivery|order|warranty|consumer)/.test(lower)) {
    return "Consumer Complaints";
  }
  if (/(rti|right to information|ration|pension|aadhaar|passport|certificate|scholarship|license|govt service|government office)/.test(lower)) {
    return "Government Services";
  }
  if (/(legal aid|court|lawyer|notice|tenant|wage|dispute)/.test(lower)) {
    return "Legal Assistance";
  }
  return "Civic Issues";
}

export function demoExtractFromComplaint(complaint: string): {
  category: ComplaintCategory;
  state: string;
  district: string;
  town: string;
  street: string;
  pincode: string;
} {
  const category = detectCategoryFromText(complaint);
  let state = "";
  let district = "";

  for (const hint of CITY_STATE_HINTS) {
    if (hint.keyword.test(complaint)) {
      state = hint.state;
      district = hint.district;
      break;
    }
  }

  if (!state) {
    const lower = complaint.toLowerCase();
    const stateMatch = INDIAN_STATES_AND_UTS.find((s) => lower.includes(s.toLowerCase()));
    if (stateMatch) state = stateMatch;
  }

  const wardMatch = complaint.match(/\b(ward\s*\d+|[A-Za-z]+\s+nagar|[A-Za-z]+\s+colony|[A-Za-z]+\s+puram)\b/i);
  const streetMatch = complaint.match(/\b([A-Za-z0-9\s]+(?:street|road|cross|lane|avenue|salai|marg|main))\b/i);
  const pinMatch = complaint.match(/\b([1-9]\d{5})\b/);

  return {
    category,
    state,
    district,
    town: wardMatch ? wardMatch[1].trim() : "",
    street: streetMatch ? streetMatch[1].trim().slice(0, 120) : "",
    pincode: pinMatch ? pinMatch[1] : "",
  };
}

export function demoFollowupQuestion(params: {
  complaint: string;
  language: string;
  state: string;
  district: string;
  town: string;
  answersCount: number;
  askedQuestions: string[];
}): { complete: boolean; question: string; reason: string } {
  if (params.answersCount >= 2) {
    return {
      complete: true,
      question: "",
      reason: "Key details collected to prepare your formal complaint draft.",
    };
  }

  const missingLoc = !params.state && !params.district && !params.town;
  const candidateLoc =
    params.language === "Tamil"
      ? "இந்தப் பிரச்சனை நடக்கும் பகுதி, தெரு அல்லது மாவட்டம் எது?"
      : params.language === "Hindi"
        ? "कृपया बताएं यह समस्या किस इलाके, सड़क या ज़िले में हो रही है?"
        : "Which exact area, street, or nearby landmark is this issue happening at?";

  if (missingLoc && !params.askedQuestions.some((q) => q.toLowerCase().includes("area") || q.includes("பகுதி") || q.includes("इलाके"))) {
    return {
      complete: false,
      question: candidateLoc,
      reason: "Location helps route to the exact municipal or state department.",
    };
  }

  const candidateDuration =
    params.language === "Tamil"
      ? "இந்தப் பிரச்சனை எத்தனை நாட்களாக உள்ளது, மற்றும் இதனால் பொதுமக்களுக்கு என்ன சிரமம் ஏற்படுகிறது?"
      : params.language === "Hindi"
        ? "यह समस्या कितने दिनों से है और इससे लोगों को क्या परेशानी हो रही है?"
        : "Since how many days has this issue been ongoing, and how is it affecting residents or commuters?";

  if (
    params.answersCount === 0 &&
    !params.askedQuestions.some((q) => q.toLowerCase().includes("days") || q.includes("நாட்களாக") || q.includes("दिनों"))
  ) {
    return {
      complete: false,
      question: candidateDuration,
      reason: "Duration and impact strengthen your official complaint.",
    };
  }

  return {
    complete: true,
    question: "",
    reason: "Sufficient details are ready for drafting.",
  };
}

export function demoGenerateComplaintDraft(params: {
  mode: SubmissionMode;
  previousTicketId?: string;
  complaint: string;
  category: ComplaintCategory;
  state: string;
  district: string;
  town: string;
  street: string;
  pincode: string;
  referenceNumber: string;
  answers: Array<{ question: string; answer: string }>;
  draftLanguage: string;
  uiLanguage: string;
}) {
  const portals = selectFallbackPortalIds(
    params.category,
    params.state,
    params.district,
    params.complaint,
  );
  const primaryPortalId =
    params.mode === "rti"
      ? "rti_online"
      : portals.primaryId;
  const secondaryPortalId =
    params.mode === "rti"
      ? "cpgrams"
      : portals.secondaryId !== primaryPortalId
        ? portals.secondaryId
        : "cpgrams";

  const portal = VERIFIED_PORTALS[primaryPortalId] ?? VERIFIED_PORTALS.cpgrams;
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const locParts = [params.street, params.town, params.district, params.state, params.pincode]
    .map((s) => s.trim())
    .filter(Boolean);
  const fullLocation = locParts.length > 0 ? locParts.join(", ") : "Concerned Locality / Ward";

  const extraDetails =
    params.answers.length > 0
      ? "\n\nAdditional Details:\n" +
        params.answers.map((a) => `- ${a.answer}`).join("\n")
      : "";

  const refLine = params.referenceNumber
    ? `\nReference / Consumer / Bill No.: ${params.referenceNumber}`
    : "";

  let subject = `Urgent Grievance Regarding ${params.category} at ${params.town || params.district || "Our Locality"}`;
  let authority = portal.authorityScope || "The Concerned Grievance Redressal Officer";
  let draft = "";

  if (params.mode === "rti") {
    subject = `Application under Section 6(1) of the RTI Act, 2005 — ${params.category}`;
    authority = `Public Information Officer (PIO), ${portal.authorityScope}`;
    draft = `Date: ${today}

To,
The Public Information Officer (PIO),
${authority}
${params.district ? `${params.district}, ` : ""}${params.state || "India"}

Subject: ${subject}

Respected Sir / Madam,

Under Section 6(1) of the Right to Information Act, 2005, I respectfully request the following official information regarding: ${params.complaint.trim()}

Location Concerned: ${fullLocation}${refLine}${extraDetails}

Information Requested:
1. Kindly provide the current action-taken status, file/work order details, and the officer/department responsible for resolving this matter.
2. Kindly provide the expected timeline for completion or redressal as per departmental norms.

I am ready to pay any prescribed RTI fee if applicable. Kindly send the reply within the statutory period of 30 days.

Thanking you,

Yours faithfully,
[COMPLAINANT_NAME]
Contact: [CONTACT_DETAILS]`;
  } else if (params.mode === "escalation") {
    subject = `Reminder & Escalation Notice (${params.previousTicketId || "Pending Grievance"}) — ${params.category}`;
    authority = `Senior Appellate Authority / Nodal Grievance Officer, ${portal.authorityScope}`;
    draft = `Date: ${today}

To,
${authority}
${params.district ? `${params.district}, ` : ""}${params.state || "India"}

Subject: ${subject}

Respected Sir / Madam,

I am writing to escalate an unresolved grievance${params.previousTicketId ? ` (Previous Ticket/Reference ID: ${params.previousTicketId})` : ""} concerning the following issue at ${fullLocation}:

${params.complaint.trim()}${refLine}${extraDetails}

Despite earlier submission, this matter remains unresolved, causing ongoing inconvenience and hardship to citizens in the area. I kindly request your urgent intervention to direct the concerned department to inspect and resolve this grievance at the earliest and share an updated action report.

Thanking you,

Yours sincerely,
[COMPLAINANT_NAME]
Contact: [CONTACT_DETAILS]`;
  } else {
    draft = `Date: ${today}

To,
The Concerned Officer / Grievance Redressal Authority,
${authority}
${params.district ? `${params.district}, ` : ""}${params.state || "India"}

Subject: ${subject}

Respected Sir / Madam,

I wish to bring the following urgent ${params.category.toLowerCase()} grievance to your kind attention for immediate redressal:

Location: ${fullLocation}${refLine}

Details of Grievance:
${params.complaint.trim()}${extraDetails}

This issue is causing significant hardship and safety/service inconvenience to residents in the area. I kindly request the concerned department to inspect the site, take necessary corrective action at the earliest, and issue a grievance tracking/acknowledgement reference.

Thanking you,

Yours faithfully,
[COMPLAINANT_NAME]
Contact: [CONTACT_DETAILS]`;
  }

  return {
    subject,
    draft,
    suggestedAuthority: authority,
    summaryPoints: [
      `Issue: ${params.complaint.trim().slice(0, 120)}${params.complaint.length > 120 ? "..." : ""}`,
      `Location: ${fullLocation}`,
      `Matched Official Portal: ${portal.name}`,
    ],
    draftLanguage: params.draftLanguage || "English",
    primaryPortalId,
    secondaryPortalId,
    whyThisPortal: `${portal.name} is the official verified portal handling ${params.category.toLowerCase()} for this region.`,
    portalLanguageTip: "You can submit this English draft directly on the official portal and save your tracking ID.",
    filingSteps: [
      `Open ${portal.name} (${portal.url}) or use pre-filled Gmail / Official WhatsApp if available.`,
      "Paste or upload your MakkalVoice draft and attach any photo/bill proof.",
      "Submit the form directly on the official portal and note down the acknowledgement number.",
      "Save the official tracking number in MakkalVoice's My Saved Complaints tracker.",
    ],
    requiredDocuments: [],
    englishButtonGuide: [],
  };
}

export function demoGenerateEscalationDraft(params: {
  subject: string;
  originalDraft: string;
  category: ComplaintCategory;
  state: string;
  district: string;
  portalName: string;
  trackingId: string;
  filedDate: string;
  draftLanguage: string;
}) {
  const fallback = selectFallbackPortalIds(
    params.category,
    params.state,
    params.district,
    `${params.subject} ${params.originalDraft}`,
  );
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const subject = `Escalation & Reminder: ${params.subject || "Pending Citizen Grievance"}`;
  const draft = `Date: ${today}

To,
The Senior Appellate Grievance Officer / District Collector,
${[params.district, params.state].filter(Boolean).join(", ") || "Concerned Jurisdiction"}

Subject: ${subject}

Respected Sir / Madam,

With reference to my earlier complaint filed on ${params.filedDate || "an earlier date"} via ${params.portalName || "the official grievance portal"} (Tracking ID: ${params.trackingId || "[OFFICIAL_TRACKING_ID]"}), I respectfully submit this follow-up escalation as the grievance remains unresolved.

Original Complaint Summary:
${params.originalDraft.slice(0, 700)}

I kindly request urgent review and time-bound resolution by the higher authority.

Yours faithfully,
[COMPLAINANT_NAME]
Contact: [CONTACT_DETAILS]`;

  return {
    subject,
    draft,
    suggestedAuthority: "Senior Appellate Grievance Officer / District Collector",
    summaryPoints: [
      `Follow-up for Tracking ID: ${params.trackingId || "Pending ID"}`,
      `Originally submitted via: ${params.portalName || "Official Portal"}`,
      "Requests priority intervention from senior appellate authority.",
    ],
    draftLanguage: params.draftLanguage || "English",
    primaryPortalId: "cpgrams",
    secondaryPortalId: fallback.primaryId !== "cpgrams" ? fallback.primaryId : "rti_online",
    whyThisPortal: "CPGRAMS enables formal escalation to central/state nodal officers when initial complaints remain unresolved.",
    portalLanguageTip: "Include your previous acknowledgement number when submitting.",
    filingSteps: [],
    requiredDocuments: [],
    englishButtonGuide: [],
  };
}

export function demoPortalAssistantReply(params: {
  message: string;
  portalName?: string;
  portalUrl?: string;
  portalHelpline?: string;
  suggestedAuthority?: string;
  documentTitles?: string[];
}): string {
  const portal = params.portalName || "the matched official portal";
  const url = params.portalUrl ? ` (${params.portalUrl})` : "";
  const helpline = params.portalHelpline ? ` Helpline: ${params.portalHelpline}.` : "";
  const docs =
    params.documentTitles && params.documentTitles.length > 0
      ? ` Keep ready: ${params.documentTitles.slice(0, 3).join(", ")}.`
      : "";

  return [
    `To submit your complaint on ${portal}${url}:`,
    `1. Copy or download your MakkalVoice draft (PDF/TXT) and verify your location details.`,
    `2. Click "Open Official Portal" (or use pre-filled Gmail / Official WhatsApp if available) and paste your draft.${docs}`,
    `3. Save the generated grievance/tracking number in MakkalVoice's "My Saved Complaints" tracker so you can follow up or escalate later.${helpline}`,
  ].join("\n");
}

function getTraditionalGreeting(hintLanguage: string): string {
  switch (hintLanguage) {
    case "Tamil":
      return "வணக்கம்! நான் மக்கள் வாய்ஸ் (MakkalVoice). உங்கள் பிரச்சனையைப் பற்றிச் சொல்லுங்கள், நான் உதவுகிறேன்.";
    case "Hindi":
      return "नमस्ते! मैं मक्कल वॉइस (MakkalVoice) हूँ। कृपया अपनी समस्या बताएं, मैं आपकी मदद करूँगा।";
    case "Telugu":
      return "నమస్కారం! నేను మక్కల్ వాయిస్ (MakkalVoice). దయచేసి మీ సమస్యను చెప్పండి, నేను సహాయం చేస్తాను.";
    case "Kannada":
      return "ನಮಸ್ಕಾರ! ನಾನು ಮಕ್ಕಳ್ ವಾಯ್ಸ್ (MakkalVoice). ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಹೇಳಿ, ನಾನು ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.";
    case "Malayalam":
      return "നമസ്കാരം! ഞാൻ മക്കൾ വോയ്‌സ് (MakkalVoice) ആണ്. ദയവായി നിങ്ങളുടെ പ്രശ്നം പറയൂ, ഞാൻ സഹായിക്കാം.";
    default:
      return "Namaste! I am MakkalVoice. Please tell me your civic problem and area, and I will help you draft and file your complaint.";
  }
}

export function attachDemoLiveVoiceSession(
  clientWs: WebSocket,
  hintLanguage: string,
  safeSendWs: (ws: WebSocket, payload: Record<string, unknown>) => void,
): void {
  let spokenComplaint = "";
  let extractedState = "";
  let extractedDistrict = "";
  let extractedTown = "";
  let citizenName = "";
  let citizenPhone = "";
  let pendingChannel: "gmail" | "whatsapp" | null = null;
  let draftCreated = false;
  let callCounter = 1;

  const sendReply = (text: string) => {
    safeSendWs(clientWs, { type: "output_transcript", text });
    safeSendWs(clientWs, { type: "turn_complete" });
  };

  // Mark WebSocket ready in demo fallback mode and deliver greeting immediately
  safeSendWs(clientWs, { type: "ready", demoMode: true });
  setTimeout(() => {
    sendReply(getTraditionalGreeting(hintLanguage));
  }, 200);

  clientWs.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString()) as {
        type?: string;
        text?: string;
        callId?: string;
        response?: Record<string, unknown>;
      };

      if (msg.type === "tool_response" && msg.response) {
        if (msg.response.success && !draftCreated && typeof msg.response.portalName === "string") {
          draftCreated = true;
          const portalName = msg.response.portalName;
          const officialEmail = typeof msg.response.officialEmail === "string" ? msg.response.officialEmail : "";
          const officialWa = typeof msg.response.officialWhatsApp === "string" ? msg.response.officialWhatsApp : "";
          let extra = "";
          if (officialEmail) {
            extra += ` Official email (${officialEmail}) is available — say "Open Gmail" if you want me to prepare a pre-filled email for your permission.`;
          }
          if (officialWa) {
            extra += ` Official WhatsApp is also available — say "Open WhatsApp" anytime.`;
          }
          sendReply(
            `Your formal complaint draft is ready and matched to ${portalName}.${extra} You can also say "Download PDF", "Save to tracker", or "Print".`,
          );
        }
        return;
      }

      if (msg.type !== "text" || typeof msg.text !== "string") return;
      const text = msg.text.trim();
      if (!text) return;

      safeSendWs(clientWs, { type: "input_transcript", text });
      const lower = text.toLowerCase();

      // Voice commands
      if (/\b(end|close|exit|bye|stop session|finish)\b/.test(lower)) {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "end_voice_flow" },
        });
        sendReply("Thank you for using MakkalVoice. Have a good day!");
        return;
      }

      if (pendingChannel === "gmail" && /\b(yes|allow|open|confirm|ok|okay|sure|sari|haan)\b/.test(lower)) {
        pendingChannel = null;
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "open_gmail_compose" },
        });
        sendReply("Opening Gmail with your subject and complaint letter filled in. Please verify the recipient and tap Send.");
        return;
      }

      if (pendingChannel === "whatsapp" && /\b(yes|allow|open|confirm|ok|okay|sure|sari|haan)\b/.test(lower)) {
        pendingChannel = null;
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "open_whatsapp_compose" },
        });
        sendReply("Opening Official WhatsApp with your complaint pre-filled.");
        return;
      }

      if (/\b(gmail|email|mail)\b/.test(lower)) {
        const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
        pendingChannel = "gmail";
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: {
            action: "prepare_gmail_compose",
            ...(emailMatch ? { recipientEmail: emailMatch[0] } : {}),
          },
        });
        sendReply(
          "I have prepared the Gmail draft on screen with subject and letter. Please say 'Yes, open Gmail' to confirm opening Gmail.",
        );
        return;
      }

      if (/\bwhatsapp\b/.test(lower)) {
        pendingChannel = "whatsapp";
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "prepare_whatsapp_compose" },
        });
        sendReply("I have prepared the WhatsApp complaint preview. Say 'Yes, open WhatsApp' to proceed.");
        return;
      }

      if (/\b(pdf|download)\b/.test(lower)) {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "download_pdf" },
        });
        sendReply("Downloading your formal complaint as an A4 PDF.");
        return;
      }

      if (/\bprint\b/.test(lower)) {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "print_letter" },
        });
        sendReply("Opening print view for your complaint letter.");
        return;
      }

      if (/\b(save|tracker|track)\b/.test(lower)) {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "execute_voice_action",
          args: { action: "save_tracker" },
        });
        sendReply("Saved your complaint to My Saved Complaints tracker.");
        return;
      }

      if (/\b(draft|create letter|generate|submit|ready)\b/.test(lower)) {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "generate_official_draft",
          args: { draftLanguage: "English" },
        });
        sendReply("Preparing your official complaint letter and matching the verified portal now.");
        return;
      }

      // Otherwise treat input as intake details
      const phoneMatch = text.replace(/[\s-]/g, "").match(/\b([6-9]\d{9})\b/);
      if (phoneMatch) citizenPhone = phoneMatch[1];

      const nameMatch = text.match(/(?:my name is|i am|name[:\s]+)\s*([A-Za-z][A-Za-z\s]{1,40})/i);
      if (nameMatch) citizenName = nameMatch[1].trim();

      const extracted = demoExtractFromComplaint(text);
      if (extracted.state) extractedState = extracted.state;
      if (extracted.district) extractedDistrict = extracted.district;
      if (extracted.town) extractedTown = extracted.town;

      if (text.length >= 6 && !phoneMatch && !nameMatch) {
        spokenComplaint = spokenComplaint ? `${spokenComplaint} ${text}` : text;
      } else if (!spokenComplaint && text.length >= 10) {
        spokenComplaint = text;
      }

      const patch: Record<string, string> = {};
      if (spokenComplaint) patch.complaint = spokenComplaint;
      patch.category = extracted.category;
      if (extractedState) patch.state = extractedState;
      if (extractedDistrict) patch.district = extractedDistrict;
      if (extractedTown) patch.town = extractedTown;
      if (extracted.street) patch.street = extracted.street;
      if (extracted.pincode) patch.pincode = extracted.pincode;
      if (citizenName) patch.name = citizenName;
      if (citizenPhone) patch.contact = citizenPhone;

      safeSendWs(clientWs, { type: "intake_update", data: patch });

      if (!spokenComplaint) {
        sendReply("Thank you. Please describe the civic or consumer problem you are facing.");
      } else if (!extractedState && !extractedDistrict && !extractedTown) {
        sendReply("Got it. Which city, area, or state is this issue in?");
      } else if (!citizenName || !citizenPhone) {
        sendReply(
          "Thank you. Please share your full name and 10-digit mobile number so I can prepare your formal letter.",
        );
      } else {
        safeSendWs(clientWs, {
          type: "voice_command",
          callId: `demo-${callCounter++}`,
          name: "generate_official_draft",
          args: { draftLanguage: "English" },
        });
        sendReply("I have all your details. Generating your formal official complaint draft now.");
      }
    } catch {
      // Ignore malformed frame
    }
  });
}
