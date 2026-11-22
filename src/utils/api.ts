import type {
  AnswerEntry,
  ComplaintFormState,
  DraftResponse,
  GpsLocationResult,
  SavedComplaintRecord,
  ScannedEvidenceResult,
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
    mode: form.mode,
    previousTicketId: form.previousTicketId.trim(),
    language: form.language,
    languageCode: LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN",
    category: form.category,
    state: form.state,
    district: resolveEffectiveDistrict(form),
    town: form.town.trim(),
    street: form.street.trim(),
    pincode: form.pincode.trim(),
    gpsLat: form.gpsLat,
    gpsLng: form.gpsLng,
    referenceNumber: form.referenceNumber.trim(),
    complaint: form.complaint.trim(),
    ...extras,
  };
}

export class ApiError extends Error {
  code?: string;
  status?: number;

  constructor(message: string, code?: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
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
    throw new ApiError(
      "Could not connect to the server. Please check your connection and try again.",
      "NETWORK_ERROR",
      0,
    );
  }

  let data: Record<string, unknown> = {};
  try {
    data = (await response.json()) as Record<string, unknown>;
  } catch {
    // Non-JSON response fallback
  }

  if (!response.ok) {
    // Tier 2 Google Maps Demo Key Quota Detection
    if (
      response.status === 429 &&
      (endpoint === "reverse-geocode" || data.code === "GMP_QUOTA_EXCEEDED")
    ) {
      window.dispatchEvent(new CustomEvent("gmp-quota-exceeded"));
    }
    const serverMessage =
      typeof data.error === "string" && data.error.trim()
        ? data.error.trim()
        : `Request failed with status ${response.status}. Please try again.`;
    const code = typeof data.code === "string" ? data.code : undefined;
    throw new ApiError(serverMessage, code, response.status);
  }

  return data as T;
}

export async function fetchMapsApiKey(): Promise<string> {
  const envKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim();
  if (envKey) return envKey;
  try {
    const res = await fetch(`${API_BASE}/maps-config`);
    if (!res.ok) return "";
    const data = (await res.json()) as { apiKey?: string };
    return typeof data.apiKey === "string" ? data.apiKey.trim() : "";
  } catch {
    return "";
  }
}

export function requestReverseGeocode(
  lat: number,
  lng: number,
): Promise<GpsLocationResult> {
  return postApiJSON<GpsLocationResult>("reverse-geocode", { lat, lng });
}

export function requestEvidenceScan(
  imageBase64: string,
  mimeType: string,
  language: string,
): Promise<ScannedEvidenceResult> {
  return postApiJSON<ScannedEvidenceResult>("analyze-evidence", {
    imageBase64,
    mimeType,
    language,
  });
}

export function requestAudioTranscription(
  audioBase64: string,
  mimeType: string,
  language: string,
): Promise<{ transcript: string }> {
  return postApiJSON<{ transcript: string }>("transcribe-audio", {
    audioBase64,
    mimeType,
    language,
  });
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

  // Locally fill citizen's mandatory name & phone details inside the browser only
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

export async function requestEscalationDraft(
  record: SavedComplaintRecord,
  citizenName: string,
  citizenPhone: string,
  uiLanguage: string,
): Promise<DraftResponse> {
  const raw = await postApiJSON<DraftResponse>("escalation-draft", {
    subject: record.subject,
    originalDraft: record.draft,
    category: record.category,
    state: record.state,
    district: record.district,
    town: record.town,
    street: record.street,
    pincode: record.pincode,
    referenceNumber: record.referenceNumber,
    portalName: record.portalName,
    trackingId: record.trackingId,
    filedDate: record.createdAt,
    uiLanguage,
    draftLanguage: "English",
  });

  return {
    ...raw,
    draft: hydrateLocalPersonalDetails(raw.draft ?? "", citizenName.trim(), citizenPhone.trim()),
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
