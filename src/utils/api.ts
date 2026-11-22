import type {
  AnswerEntry,
  ComplaintFormState,
  DraftResponse,
  VoiceExtractionResponse,
} from "../types";
import { LANGUAGE_LOCALE_MAP } from "../data/languages";

const API_BASE = "/api";

export interface FollowupApiResponse {
  complete: boolean;
  question: string;
  reason?: string;
}

export function resolveEffectiveDistrict(form: ComplaintFormState): string {
  if (form.district === "__other__") {
    return form.customDistrict.trim();
  }
  return form.district.trim();
}

export function buildPrivacySafePayload(
  form: ComplaintFormState,
  extras?: Record<string, unknown>,
): Record<string, unknown> {
  // Personal name & contact number are intentionally omitted from AI requests
  return {
    language: form.language,
    languageCode: LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN",
    category: form.category,
    state: form.state,
    district: resolveEffectiveDistrict(form),
    town: form.town.trim(),
    street: form.street.trim(),
    pincode: form.pincode.trim(),
    referenceNumber: form.referenceNumber.trim(),
    complaint: form.complaint.trim(),
    ...extras,
  };
}

export async function postApiJSON<T>(
  endpoint: string,
  payload: Record<string, unknown>,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Could not connect to the server. Please check your connection and try again.",
    );
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // Non-JSON response fallback
  }

  if (!response.ok) {
    const serverMessage =
      typeof data.error === "string" && data.error.trim()
        ? data.error.trim()
        : `Request failed with status ${response.status}. Please try again.`;
    throw new Error(serverMessage);
  }

  return data as T;
}

export function requestVoiceExtraction(
  complaint: string,
  language: string,
): Promise<VoiceExtractionResponse> {
  return postApiJSON<VoiceExtractionResponse>("voice-understand", {
    complaint,
    language,
  });
}

export function requestFollowupQuestion(
  form: ComplaintFormState,
  answers: AnswerEntry[],
  askedQuestions: string[],
): Promise<FollowupApiResponse> {
  return postApiJSON<FollowupApiResponse>(
    "complaint-followup",
    buildPrivacySafePayload(form, {
      answers,
      askedQuestions,
    }),
  );
}

export async function requestComplaintDraft(
  form: ComplaintFormState,
  answers: AnswerEntry[],
  draftLanguage: string,
  uiLanguage: string,
): Promise<DraftResponse> {
  const raw = await postApiJSON<DraftResponse>(
    "complaint-draft",
    buildPrivacySafePayload(form, {
      answers,
      draftLanguage,
      uiLanguage,
    }),
  );

  // Locally fill optional personal contact placeholders in the browser
  const hydratedDraft = hydrateLocalPersonalDetails(
    raw.draft ?? "",
    form.name.trim(),
    form.contact.trim(),
  );

  return {
    subject: raw.subject ?? "",
    draft: hydratedDraft,
    suggestedAuthority: raw.suggestedAuthority ?? "",
    summaryPoints: Array.isArray(raw.summaryPoints) ? raw.summaryPoints : [],
    draftLanguage: raw.draftLanguage ?? draftLanguage,
    primaryPortalId: raw.primaryPortalId ?? "cpgrams",
    secondaryPortalId: raw.secondaryPortalId,
    whyThisPortal: raw.whyThisPortal ?? "",
    portalLanguageTip: typeof raw.portalLanguageTip === "string" ? raw.portalLanguageTip : "",
    filingSteps: Array.isArray(raw.filingSteps) ? raw.filingSteps : [],
    requiredDocuments: Array.isArray(raw.requiredDocuments) ? raw.requiredDocuments : [],
    englishButtonGuide: Array.isArray(raw.englishButtonGuide) ? raw.englishButtonGuide : [],
  };
}

export interface PortalAssistantContext {
  uiLanguage: string;
  category: string;
  state: string;
  district: string;
  portalName: string;
  portalUrl: string;
  portalHelpline?: string;
  secondaryPortalName?: string;
  suggestedAuthority?: string;
  draftSubject?: string;
  documentTitles?: string[];
}

export function requestPortalAssistantChat(
  message: string,
  history: Array<{ role: "user" | "model"; text: string }>,
  context: PortalAssistantContext,
): Promise<{ reply: string }> {
  return postApiJSON<{ reply: string }>("portal-assistant-chat", {
    message,
    history,
    context,
  });
}

export function hydrateLocalPersonalDetails(
  draft: string,
  name: string,
  contact: string,
): string {
  const safeName = name || "[Your Full Name]";
  const safeContact = contact || "[Your Phone Number]";

  return draft
    .replace(/\[COMPLAINANT_NAME\]/g, safeName)
    .replace(/\[CONTACT_DETAILS\]/g, safeContact)
    .replace(/\[CONTACT_NUMBER\]/g, safeContact);
}

export function isClientDuplicateQuestion(
  candidate: string,
  askedQuestions: string[],
): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, " ")
      .replace(/\s+/g, " ")
      .trim();

  const normCand = normalize(candidate);
  if (!normCand) return true;

  const candWords = new Set(normCand.split(" ").filter((w) => w.length > 2));

  for (const prev of askedQuestions) {
    const normPrev = normalize(prev);
    if (!normPrev) continue;
    if (normCand === normPrev || normCand.includes(normPrev) || normPrev.includes(normCand)) {
      return true;
    }
    const prevWords = new Set(normPrev.split(" ").filter((w) => w.length > 2));
    if (candWords.size === 0 || prevWords.size === 0) continue;
    let common = 0;
    for (const word of candWords) {
      if (prevWords.has(word)) common += 1;
    }
    const union = new Set([...candWords, ...prevWords]).size;
    if (union > 0 && common / union >= 0.65) {
      return true;
    }
  }
  return false;
}
