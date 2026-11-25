import "dotenv/config";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, ThinkingLevel, Type } from "@google/genai";
import {
  getPortalCatalogSummaryForPrompt,
  selectFallbackPortalIds,
  VERIFIED_PORTAL_IDS,
  VERIFIED_PORTALS,
} from "./src/data/verifiedPortals.ts";
import { INDIAN_STATES_AND_UTS } from "./src/data/indiaLocations.ts";
import type { ComplaintCategory } from "./src/types.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const MODEL_NAME = "gemini-4-hydrogen";
const FAST_TEXT_MODELS = ["gemini-4-hydrogen", "gemini-3.1-flash-lite"] as const;
const DRAFT_TEXT_MODELS = ["gemini-4-hydrogen", "gemini-3.1-flash-lite"] as const;
const TRANSCRIBE_MODELS = [
  "gemini-3.5-transcribe",
  "gemini-4-hydrogen",
  "gemini-3.1-flash-lite",
] as const;
const REQUEST_TIMEOUT_MS = 22_000;
const ATTEMPT_TIMEOUT_MS = 14_000;
const MAX_FOLLOWUP_QUESTIONS = 4;

// Per-model transient health cooldown so busy/rate-limited models are skipped immediately
const modelCooldownUntil = new Map<string, number>();

// Short TTL in-memory cache for identical idempotent AI requests (prevents duplicate quota spend on double-clicks)
const aiResponseCache = new Map<string, { expiresAt: number; data: unknown }>();
const AI_CACHE_TTL_MS = 90_000;

function getCachedAiResponse<T>(key: string): T | null {
  const entry = aiResponseCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    aiResponseCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCachedAiResponse(key: string, data: unknown): void {
  if (aiResponseCache.size >= 80) {
    const oldestKey = aiResponseCache.keys().next().value;
    if (oldestKey) aiResponseCache.delete(oldestKey);
  }
  aiResponseCache.set(key, { expiresAt: Date.now() + AI_CACHE_TTL_MS, data });
}

function thinkingConfigForModel(model: string) {
  if (model.includes("flash-lite")) {
    return { thinkingLevel: ThinkingLevel.MINIMAL };
  }
  return { thinkingLevel: ThinkingLevel.LOW };
}

const VALID_CATEGORIES: ComplaintCategory[] = [
  "Civic Issues",
  "Consumer Complaints",
  "Public Safety",
  "Legal Assistance",
  "Government Services",
  "Other",
];

interface AnswerItem {
  question: string;
  answer: string;
}

interface FollowupRequestBody {
  mode?: string;
  previousTicketId?: string;
  language?: string;
  languageCode?: string;
  category?: string;
  state?: string;
  district?: string;
  town?: string;
  street?: string;
  pincode?: string;
  gpsLat?: number;
  gpsLng?: number;
  referenceNumber?: string;
  complaint?: string;
  answers?: AnswerItem[];
  askedQuestions?: string[];
}

interface DraftRequestBody extends FollowupRequestBody {
  draftLanguage?: string;
  uiLanguage?: string;
}

function normalizeSubmissionMode(raw: unknown): "complaint" | "rti" | "escalation" {
  const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (s === "rti") return "rti";
  if (s === "escalation") return "escalation";
  return "complaint";
}

function getMapsApiKey(): string {
  return (
    process.env.GOOGLE_MAPS_API_KEY?.trim() ||
    process.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ||
    ""
  );
}

const STATE_ALIASES: Record<string, string> = {
  "delhi": "Delhi (NCT)",
  "national capital territory of delhi": "Delhi (NCT)",
  "new delhi": "Delhi (NCT)",
  "orissa": "Odisha",
  "pondicherry": "Puducherry",
  "jammu & kashmir": "Jammu and Kashmir",
  "andaman & nicobar islands": "Andaman and Nicobar Islands",
  "dadra & nagar haveli": "Dadra and Nagar Haveli and Daman and Diu",
  "daman and diu": "Dadra and Nagar Haveli and Daman and Diu",
  "daman & diu": "Dadra and Nagar Haveli and Daman and Diu",
};

function matchCanonicalIndianState(rawState: string): string {
  const cleaned = cleanText(rawState, 100);
  if (!cleaned) return "";
  const lower = cleaned.toLowerCase();
  if (STATE_ALIASES[lower]) return STATE_ALIASES[lower];
  const exact = INDIAN_STATES_AND_UTS.find((s) => s.toLowerCase() === lower);
  if (exact) return exact;
  const partial = INDIAN_STATES_AND_UTS.find(
    (s) => s.toLowerCase().includes(lower) || lower.includes(s.toLowerCase()),
  );
  return partial ?? "";
}

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw Object.assign(
      new Error("Gemini API key is not configured on the server."),
      { statusCode: 500, code: "MISSING_API_KEY" },
    );
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

function cleanText(value: unknown, maxLen = 1000): string {
  if (typeof value !== "string") return "";
  return value.replace(/\s+/g, " ").trim().slice(0, maxLen);
}

function cleanMultilineText(value: unknown, maxLen = 3000): string {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, maxLen);
}

function normalizeCategory(raw: unknown): ComplaintCategory {
  const str = cleanText(raw, 60);
  return (VALID_CATEGORIES.find((c) => c === str) ?? "Civic Issues") as ComplaintCategory;
}

function sanitizeAnswers(raw: unknown): AnswerItem[] {
  if (!Array.isArray(raw)) return [];
  const result: AnswerItem[] = [];
  for (const item of raw.slice(0, 10)) {
    if (item && typeof item === "object") {
      const record = item as Record<string, unknown>;
      const question = cleanText(record.question, 400);
      const answer = cleanText(record.answer, 800);
      if (question && answer) {
        result.push({ question, answer });
      }
    }
  }
  return result;
}

function sanitizeQuestionList(raw: unknown, answers: AnswerItem[]): string[] {
  const seen = new Set<string>();
  const list: string[] = [];

  const addIfNew = (q: string) => {
    const cleaned = cleanText(q, 400);
    if (!cleaned) return;
    const key = cleaned.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      list.push(cleaned);
    }
  };

  if (Array.isArray(raw)) {
    for (const q of raw.slice(0, 12)) {
      if (typeof q === "string") addIfNew(q);
    }
  }
  for (const a of answers) {
    addIfNew(a.question);
  }
  return list;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "to", "of", "in", "on",
  "at", "for", "with", "by", "this", "that", "it", "your", "you", "please",
  "can", "could", "would", "tell", "me", "us", "about", "has", "have", "had",
  "did", "does", "do",
]);

function tokenizeQuestion(q: string): Set<string> {
  const normalized = q
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
  return new Set(normalized);
}

function isDuplicateQuestion(candidate: string, previousQuestions: string[]): boolean {
  const normCandidate = candidate.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
  if (!normCandidate) return true;
  const candTokens = tokenizeQuestion(candidate);

  for (const prev of previousQuestions) {
    const normPrev = prev.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
    if (!normPrev) continue;
    if (
      normCandidate === normPrev ||
      normCandidate.includes(normPrev) ||
      normPrev.includes(normCandidate)
    ) {
      return true;
    }

    const prevTokens = tokenizeQuestion(prev);
    if (candTokens.size === 0 || prevTokens.size === 0) continue;

    let intersection = 0;
    for (const token of candTokens) {
      if (prevTokens.has(token)) intersection += 1;
    }
    const union = new Set([...candTokens, ...prevTokens]).size;
    const jaccard = union > 0 ? intersection / union : 0;
    if (jaccard >= 0.6) {
      return true;
    }
  }
  return false;
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(
        Object.assign(new Error("AI request timed out. Please try again."), {
          statusCode: 504,
          code: "TIMEOUT",
        }),
      );
    }, ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function safeParseJsonObject<T = Record<string, unknown>>(rawText: string): T {
  const trimmed = (rawText ?? "").replace(/^\uFEFF/, "").trim();
  if (!trimmed) {
    throw Object.assign(new Error("Empty JSON response from AI model."), {
      code: "MALFORMED_JSON",
    });
  }

  // Strip optional markdown ```json ... ``` fences
  const unfenced = trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(unfenced);
    if (parsed && typeof parsed === "object") return parsed as T;
  } catch {
    // Fall through to balanced-brace extraction
  }

  const firstBrace = unfenced.indexOf("{");
  const lastBrace = unfenced.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    const slice = unfenced.slice(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(slice);
      if (parsed && typeof parsed === "object") return parsed as T;
    } catch {
      // Fall through to error
    }
  }

  throw Object.assign(new Error("Malformed JSON response from AI model."), {
    code: "MALFORMED_JSON",
  });
}

function isRateLimitError(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  const msg = String(err?.message ?? "");
  return err?.status === 429 || /RESOURCE_EXHAUSTED|quota|rate.?limit|\b429\b/i.test(msg);
}

function isRetryableGeminiError(error: unknown): boolean {
  const err = error as { statusCode?: number; status?: number; code?: string | number; message?: string };
  const msg = String(err?.message ?? "");
  return (
    err?.statusCode === 504 ||
    err?.code === "TIMEOUT" ||
    err?.code === "MALFORMED_JSON" ||
    err?.status === 503 ||
    err?.status === 500 ||
    err?.status === 429 ||
    err?.status === 404 ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|overloaded|NOT_FOUND|high demand|timeout|ECONNRESET|fetch failed|socket hang up|Empty .*response/i.test(
      msg,
    )
  );
}

function extractRetryAfterMs(error: unknown): number | null {
  const msg = String((error as { message?: string })?.message ?? "");
  const secMatch = msg.match(/retry\s*(?:in|after|delay["']?\s*[:=]\s*["']?)\s*(\d+(?:\.\d+)?)\s*s/i);
  if (secMatch) {
    const secs = Number(secMatch[1]);
    if (Number.isFinite(secs) && secs > 0 && secs <= 30) {
      return Math.ceil(secs * 1000);
    }
  }
  return null;
}

function isQuotaOrBusyError(error: unknown): boolean {
  const err = error as { status?: number; message?: string };
  const msg = String(err?.message ?? "");
  return (
    err?.status === 503 ||
    err?.status === 429 ||
    err?.status === 500 ||
    /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|overloaded|high demand|quota/i.test(msg)
  );
}

function selectModelsForAttempt(models: readonly string[]): string[] {
  const now = Date.now();
  const healthy: string[] = [];
  const cooling: Array<{ model: string; until: number }> = [];

  for (const model of models) {
    const until = modelCooldownUntil.get(model) ?? 0;
    if (until <= now) {
      healthy.push(model);
    } else {
      cooling.push({ model, until });
    }
  }

  // If at least one model is healthy, ONLY try healthy models (skip busy/rate-limited models!)
  if (healthy.length > 0) {
    return healthy;
  }

  // If every model is cooling down, try the one closest to recovery first, then backup
  cooling.sort((a, b) => a.until - b.until);
  return cooling.map((c) => c.model);
}

async function generateWithFailover<T>(
  models: readonly string[],
  runForModel: (model: string) => Promise<T>,
  attemptTimeoutMs = ATTEMPT_TIMEOUT_MS,
  maxRounds = 3,
): Promise<T> {
  if (models.length === 0) {
    throw new Error("No AI models configured.");
  }

  let lastError: unknown;

  for (let round = 0; round < maxRounds; round += 1) {
    const candidateModels = selectModelsForAttempt(models);
    let sawOnlyRateLimits = true;

    for (const model of candidateModels) {
      try {
        const result = await withTimeout(runForModel(model), attemptTimeoutMs);
        modelCooldownUntil.delete(model);
        return result;
      } catch (err) {
        lastError = err;
        const errMsg = String((err as Error)?.message ?? "");
        const rateLimited = isRateLimitError(err);
        if (!rateLimited) sawOnlyRateLimits = false;

        console.warn(
          `[MakkalVoice AI] round ${round + 1}/${maxRounds} (${model}) failed:`,
          errMsg.slice(0, 180),
        );

        // Immediately fail fast on auth / key errors (never retry invalid key)
        if (
          (err as { status?: number })?.status === 403 ||
          /PERMISSION_DENIED|API_KEY_INVALID|MISSING_API_KEY/i.test(errMsg)
        ) {
          throw err;
        }

        // Cool down overloaded or rate-limited model so subsequent calls route to healthy backup first
        if (isQuotaOrBusyError(err)) {
          const retryHint = extractRetryAfterMs(err);
          const defaultCooldown = rateLimited ? 55_000 : 15_000;
          const cooldownMs = retryHint ? Math.max(retryHint, defaultCooldown) : defaultCooldown;
          modelCooldownUntil.set(model, Date.now() + cooldownMs);
        }

        // If error is non-retryable and not a model-compatibility error, propagate immediately
        if (
          !isRetryableGeminiError(err) &&
          !/INVALID_ARGUMENT|unsupported|not found/i.test(errMsg)
        ) {
          throw err;
        }
      }
    }

    // Never tight-loop retry when every attempted model returned 429 quota exhaustion
    if (sawOnlyRateLimits) {
      break;
    }

    if (round < maxRounds - 1) {
      const baseWait = round === 0 ? 1100 : 2300;
      const waitMs = baseWait + Math.floor(Math.random() * 450);
      await new Promise((res) => setTimeout(res, waitMs));
    }
  }

  throw lastError ?? new Error("All AI models failed to respond.");
}

export type ServerErrorCode =
  | "AI_TIMEOUT"
  | "AI_RATE_LIMIT"
  | "AI_AUTH_ERROR"
  | "AI_UNAVAILABLE"
  | "AI_BAD_REQUEST"
  | "AI_GENERIC";

function mapGeminiError(error: unknown): {
  status: number;
  code: ServerErrorCode;
  message: string;
  diagnostic?: string;
} {
  const err = error as { statusCode?: number; status?: number; code?: string | number; message?: string };
  const rawMessage = err?.message ?? "Unexpected error while communicating with Gemini.";
  const safeDiag = rawMessage
    .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[REDACTED]")
    .slice(0, 260);

  if (err?.statusCode === 504 || err?.code === "TIMEOUT" || /timed out/i.test(rawMessage)) {
    return {
      status: 504,
      code: "AI_TIMEOUT",
      message: "The AI service took too long to respond. Please try again.",
      diagnostic: safeDiag,
    };
  }
  if (
    err?.status === 429 ||
    /RESOURCE_EXHAUSTED|quota|\b429\b/i.test(rawMessage)
  ) {
    return {
      status: 429,
      code: "AI_RATE_LIMIT",
      message: "Rate limit reached on the AI service. Please wait a moment and try again.",
      diagnostic: safeDiag,
    };
  }
  if (
    err?.status === 403 ||
    /PERMISSION_DENIED|API_KEY_INVALID|MISSING_API_KEY|not configured/i.test(rawMessage)
  ) {
    return {
      status: 503,
      code: "AI_AUTH_ERROR",
      message: "Gemini API key is missing or invalid on the server. Check your server configuration.",
      diagnostic: safeDiag,
    };
  }
  if (
    err?.status === 503 ||
    err?.status === 500 ||
    /UNAVAILABLE|INTERNAL|overloaded|high demand|ECONNRESET|fetch failed|socket hang up/i.test(rawMessage)
  ) {
    return {
      status: 503,
      code: "AI_UNAVAILABLE",
      message: "The AI service is temporarily busy. Please try again in a few seconds.",
      diagnostic: safeDiag,
    };
  }
  if (err?.status === 400 || rawMessage.includes("INVALID_ARGUMENT")) {
    return {
      status: 400,
      code: "AI_BAD_REQUEST",
      message: "Could not process this request format. Please try again.",
      diagnostic: safeDiag,
    };
  }
  return {
    status: 502,
    code: "AI_GENERIC",
    message: "Unable to generate response right now. Please try again.",
    diagnostic: safeDiag,
  };
}

function buildLocationSummary(body: FollowupRequestBody): string {
  const parts = [
    cleanText(body.street, 200),
    cleanText(body.town, 120),
    cleanText(body.district, 120),
    cleanText(body.state, 120),
    cleanText(body.pincode, 12),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Not specified yet";
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: "8mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      app: "MakkalVoice API",
      status: "running",
      provider: "Gemini",
      model: MODEL_NAME,
    });
  });

  // Public Google Maps JS SDK config (serves provisioned key safely to client Map component)
  app.get("/api/maps-config", (_req, res) => {
    res.json({
      apiKey: getMapsApiKey(),
    });
  });

  // Innovation 2: Server-side Google Maps Geocoding REST API proxy (reverse geocode GPS pin -> Indian address)
  app.post("/api/reverse-geocode", async (req, res) => {
    try {
      const body = (req.body ?? {}) as { lat?: unknown; lng?: unknown };
      const lat = Number(body.lat);
      const lng = Number(body.lng);

      if (!Number.isFinite(lat) || !Number.isFinite(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        res.status(400).json({ error: "Valid GPS latitude and longitude are required." });
        return;
      }

      const mapsKey = getMapsApiKey();
      if (!mapsKey) {
        res.status(503).json({ error: "Google Maps API key is not configured on the server." });
        return;
      }

      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.set("latlng", `${lat.toFixed(6)},${lng.toFixed(6)}`);
      url.searchParams.set("language", "en");
      url.searchParams.set("region", "in");
      url.searchParams.set("key", mapsKey);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12_000);
      let geoRes: globalThis.Response;
      try {
        geoRes = await fetch(url.toString(), { signal: controller.signal });
      } finally {
        clearTimeout(timeout);
      }

      if (geoRes.status === 429) {
        res.status(429).json({
          code: "GMP_QUOTA_EXCEEDED",
          error: "Google Maps daily demo quota has been exceeded. Please select location manually.",
        });
        return;
      }

      const data = (await geoRes.json()) as {
        status?: string;
        error_message?: string;
        results?: Array<{
          formatted_address?: string;
          address_components?: Array<{
            long_name?: string;
            short_name?: string;
            types?: string[];
          }>;
        }>;
      };

      if (
        data.status === "OVER_QUERY_LIMIT" ||
        data.status === "OVER_DAILY_LIMIT" ||
        /quota|RESOURCE_EXHAUSTED/i.test(data.error_message ?? "")
      ) {
        res.status(429).json({
          code: "GMP_QUOTA_EXCEEDED",
          error: "Google Maps daily demo quota has been exceeded. Please select location manually.",
        });
        return;
      }

      if (data.status !== "OK" || !Array.isArray(data.results) || data.results.length === 0) {
        res.status(404).json({
          error: "Could not resolve an address for this map pin. Try moving the pin closer to a road or town.",
        });
        return;
      }

      const primary = data.results[0];
      const components = Array.isArray(primary.address_components) ? primary.address_components : [];
      const findComponent = (...types: string[]): string => {
        for (const t of types) {
          const match = components.find((c) => Array.isArray(c.types) && c.types.includes(t));
          if (match?.long_name) return cleanText(match.long_name, 120);
        }
        return "";
      };

      const rawState = findComponent("administrative_area_level_1");
      const rawDistrict = findComponent("administrative_area_level_2", "administrative_area_level_3")
        .replace(/\s+district$/i, "")
        .trim();
      const locality = findComponent("locality", "sublocality_level_1", "administrative_area_level_3");
      const sublocality = findComponent("sublocality_level_2", "sublocality_level_1", "neighborhood");
      const route = findComponent("route");
      const premise = findComponent("premise", "street_number", "point_of_interest");
      const pincode = findComponent("postal_code").replace(/\D/g, "").slice(0, 6);

      const streetParts = [premise, route, sublocality].filter(
        (v, idx, arr) => v && v.toLowerCase() !== locality.toLowerCase() && arr.indexOf(v) === idx,
      );

      res.json({
        lat,
        lng,
        state: matchCanonicalIndianState(rawState),
        district: rawDistrict,
        town: locality || sublocality,
        street: streetParts.join(", ").slice(0, 180),
        pincode,
        formattedAddress: cleanText(primary.formatted_address, 260),
      });
    } catch (error) {
      console.error("[/api/reverse-geocode] error:", error);
      res.status(502).json({ error: "Could not detect address from coordinates right now. Please try again." });
    }
  });

  // Innovation 1: Multimodal Photo & Bill Scanner (Gemini reads civic photo or utility bill)
  app.post("/api/analyze-evidence", async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        imageBase64?: string;
        mimeType?: string;
        language?: string;
      };
      const imageBase64 = typeof body.imageBase64 === "string" ? body.imageBase64.trim() : "";
      const mimeType = cleanText(body.mimeType, 40) || "image/jpeg";
      const language = cleanText(body.language, 40) || "English";

      if (!imageBase64 || imageBase64.length < 100) {
        res.status(400).json({ error: "Please select a valid photo or bill image first." });
        return;
      }

      if (!/^image\/(jpeg|jpg|png|webp)$/i.test(mimeType)) {
        res.status(400).json({ error: "Only JPG, PNG, or WEBP images are supported." });
        return;
      }

      const ai = getAiClient();
      const parsed = await generateWithFailover(
        FAST_TEXT_MODELS,
        async (model) => {
          const response = await ai.models.generateContent({
            model,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType === "image/jpg" ? "image/jpeg" : mimeType,
                    data: imageBase64,
                  },
                },
                {
                  text: [
                    `Citizen's preferred language: ${language}`,
                    `Allowed categories: ${VALID_CATEGORIES.join(", ")}`,
                    "Examine this photo uploaded by an Indian citizen (it may be a civic problem like a pothole, broken streetlight, garbage pile, sewage leak, damaged electric pole, OR a bill/receipt/notice like an electricity bill, water bill, consumer invoice, or government receipt).",
                    `1. Write 'issueSummary' (2-3 clear, factual sentences in ${language}) describing the visible issue or bill discrepancy so the citizen can review/edit it as their complaint description.`,
                    "2. If a consumer number, EB service number, bill number, PNR, order ID, or application/ticket number is visible, put it in 'extractedReferenceNumber' (otherwise empty string). NEVER extract Aadhaar numbers or bank card/PIN numbers.",
                    "3. Pick the single best 'suggestedCategory' from the allowed categories.",
                    "4. If a street name, ward, locality, or city is visibly printed on a bill/signboard, put it in 'extractedLocationHint' (otherwise empty string).",
                  ].join("\n"),
                },
              ],
            },
            config: {
              thinkingConfig: thinkingConfigForModel(model),
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  issueSummary: { type: Type.STRING },
                  extractedReferenceNumber: { type: Type.STRING },
                  suggestedCategory: { type: Type.STRING },
                  extractedLocationHint: { type: Type.STRING },
                },
                required: [
                  "issueSummary",
                  "extractedReferenceNumber",
                  "suggestedCategory",
                  "extractedLocationHint",
                ],
              },
            },
          });
          return safeParseJsonObject<Record<string, unknown>>(response.text ?? "");
        },
        REQUEST_TIMEOUT_MS,
      );

      res.json({
        issueSummary: cleanMultilineText(parsed.issueSummary, 1000),
        extractedReferenceNumber: cleanText(parsed.extractedReferenceNumber, 80),
        suggestedCategory: normalizeCategory(parsed.suggestedCategory),
        extractedLocationHint: cleanText(parsed.extractedLocationHint, 160),
      });
    } catch (error) {
      console.error("[/api/analyze-evidence] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // Universal Voice-to-Text Transcription using Gemini Multimodal Audio (works on every browser & mobile device)
  app.post("/api/transcribe-audio", async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        audioBase64?: string;
        mimeType?: string;
        language?: string;
      };
      const audioBase64 = typeof body.audioBase64 === "string" ? body.audioBase64.trim() : "";
      const rawMime = cleanText(body.mimeType, 60) || "audio/webm";
      const mimeType = rawMime.split(";")[0].trim().toLowerCase() || "audio/webm";
      const language = cleanText(body.language, 40) || "English";

      if (!audioBase64 || audioBase64.length < 120) {
        res.status(400).json({ error: "No audio was captured. Please speak clearly, then tap Stop." });
        return;
      }

      if (!/^audio\/(webm|mp4|mpeg|mp3|ogg|wav|aac|x-m4a|m4a)$/i.test(mimeType)) {
        res.status(400).json({ error: "Unsupported audio recording format." });
        return;
      }

      const normalizedMime =
        mimeType === "audio/x-m4a" || mimeType === "audio/m4a" ? "audio/mp4" : mimeType;

      // Optional Whisper / WhisperFlow-compatible server endpoint when configured via server env vars
      const whisperApiKey = process.env.WHISPER_API_KEY?.trim() || "";
      const whisperApiUrl =
        process.env.WHISPER_API_URL?.trim() ||
        "https://api.groq.com/openai/v1/audio/transcriptions";
      const whisperModel = process.env.WHISPER_MODEL?.trim() || "whisper-large-v3-turbo";

      if (whisperApiKey) {
        try {
          const audioBuffer = Buffer.from(audioBase64, "base64");
          const ext = normalizedMime.includes("mp4")
            ? "m4a"
            : normalizedMime.includes("ogg")
              ? "ogg"
              : normalizedMime.includes("wav")
                ? "wav"
                : "webm";
          const formData = new FormData();
          formData.append(
            "file",
            new Blob([audioBuffer], { type: normalizedMime }),
            `voice.${ext}`,
          );
          formData.append("model", whisperModel);
          formData.append(
            "prompt",
            `Indian citizen grievance dictation in ${language}. Keep local street names, districts, and numbers accurate with clean punctuation.`,
          );

          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 14_000);
          try {
            const wRes = await fetch(whisperApiUrl, {
              method: "POST",
              headers: { Authorization: `Bearer ${whisperApiKey}` },
              body: formData,
              signal: controller.signal,
            });
            if (wRes.ok) {
              const wJson = (await wRes.json()) as { text?: string };
              const wText = cleanMultilineText(wJson.text, 2500);
              if (wText) {
                res.json({ transcript: wText, engine: "whisper" });
                return;
              }
            }
          } finally {
            clearTimeout(timer);
          }
        } catch (wErr) {
          console.warn("[/api/transcribe-audio] Whisper endpoint fallback to Gemini:", (wErr as Error)?.message);
        }
      }

      const ai = getAiClient();

      const dictationPrompt = [
        `Transcribe this Indian citizen voice recording in ${language} (high-accuracy Indian dialect dictation).`,
        `Write clean, naturally punctuated sentences in ${language} script, accurately preserving Indian regional dialects, local street/area names, spoken English terms, and digits.`,
        "Transcribe each spoken phrase strictly ONCE. Never repeat sentences, never output both the native script and an English translation, and never duplicate clauses.",
        "Automatically remove filler sounds (um, uh, ahh, stammering) and false starts while preserving 100% of the speaker's true facts.",
        "Return ONLY the single cleaned transcript text with no labels, quotes, or commentary. If there is only silence or noise with no intelligible speech, return an empty string.",
      ].join("\n");

      const deduplicateServerTranscript = (raw: string): string => {
        const cleaned = cleanMultilineText(raw, 2500).replace(/\s+/g, " ").trim();
        if (!cleaned) return "";
        const norm = (s: string) =>
          s
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .replace(/\s+/g, " ")
            .trim();

        const words = cleaned.split(" ");
        if (words.length >= 4 && words.length % 2 === 0) {
          const half = words.length / 2;
          const a = words.slice(0, half).join(" ");
          const b = words.slice(half).join(" ");
          if (norm(a) === norm(b)) return a;
        }

        const sentences = cleaned
          .split(/(?<=[.?!।])\s+|\n+/)
          .map((s) => s.trim())
          .filter(Boolean);
        if (sentences.length <= 1) return cleaned;

        const out: string[] = [];
        for (const s of sentences) {
          const cur = norm(s);
          const prev = out.length > 0 ? norm(out[out.length - 1]) : "";
          if (cur && cur === prev) continue;
          out.push(s);
        }
        return out.join(" ");
      };

      const response = await generateWithFailover(
        TRANSCRIBE_MODELS,
        (model) =>
          ai.models.generateContent({
            model,
            contents: {
              parts: [
                {
                  inlineData: {
                    mimeType: normalizedMime,
                    data: audioBase64,
                  },
                },
                {
                  text:
                    model === "gemini-3.5-transcribe"
                      ? `Transcribe this Indian speech recording accurately in ${language} ONCE ONLY (preserve regional dialect meaning, local place names, and numbers; never repeat sentences or add a translation).`
                      : dictationPrompt,
                },
              ],
            },
            ...(model === "gemini-3.5-transcribe"
              ? {}
              : { config: { thinkingConfig: thinkingConfigForModel(model) } }),
          }),
        ATTEMPT_TIMEOUT_MS,
      );

      const transcript = deduplicateServerTranscript(response.text ?? "");
      res.json({ transcript, engine: "gemini-transcribe" });
    } catch (error) {
      console.error("[/api/transcribe-audio] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // Voice-First Auto-Extraction: detect category and location details directly from spoken text
  app.post("/api/voice-understand", async (req, res) => {
    try {
      const body = (req.body ?? {}) as { complaint?: string; language?: string };
      const complaint = cleanMultilineText(body.complaint, 2500);
      const language = cleanText(body.language, 40) || "English";

      if (!complaint || complaint.length < 5) {
        res.status(400).json({ error: "Please speak or enter your problem first." });
        return;
      }

      const cacheKey = `voice-understand:${language}:${complaint.toLowerCase()}`;
      const cached = getCachedAiResponse<Record<string, unknown>>(cacheKey);
      if (cached) {
        res.json(cached);
        return;
      }

      const ai = getAiClient();

      const parsed = await generateWithFailover(
        FAST_TEXT_MODELS,
        async (model) => {
          const response = await ai.models.generateContent({
            model,
            contents: [
              `Spoken/typed language: ${language}`,
              `Citizen statement: """${complaint}"""`,
              `Allowed categories: ${VALID_CATEGORIES.join(", ")}`,
              `Allowed Indian States/UTs: ${INDIAN_STATES_AND_UTS.join(", ")}`,
            ].join("\n\n"),
            config: {
              systemInstruction:
                "Extract ONLY what is explicitly stated or strongly implied by the citizen's spoken problem: category (one of the allowed categories), state (exact match from allowed Indian states/UTs list if mentioned or unambiguously implied by a city like Chennai->Tamil Nadu, Bengaluru->Karnataka, Mumbai->Maharashtra, Pune->Maharashtra, Hyderabad->Telangana, Delhi->Delhi (NCT), Kolkata->West Bengal; otherwise empty string), district (English name if mentioned/implied, else empty), town (city/locality if mentioned, else empty), street (street/landmark if mentioned, else empty). Never fabricate locations not mentioned.",
              thinkingConfig: thinkingConfigForModel(model),
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  state: { type: Type.STRING },
                  district: { type: Type.STRING },
                  town: { type: Type.STRING },
                  street: { type: Type.STRING },
                },
                required: ["category", "state", "district", "town", "street"],
              },
            },
          });
          return safeParseJsonObject<Record<string, unknown>>(response.text ?? "");
        },
        ATTEMPT_TIMEOUT_MS,
      );

      const matchedState = INDIAN_STATES_AND_UTS.find(
        (s) => s.toLowerCase() === cleanText(parsed.state, 80).toLowerCase(),
      );

      const payload = {
        category: normalizeCategory(parsed.category),
        state: matchedState ?? "",
        district: cleanText(parsed.district, 100),
        town: cleanText(parsed.town, 120),
        street: cleanText(parsed.street, 200),
      };
      setCachedAiResponse(cacheKey, payload);
      res.json(payload);
    } catch (error) {
      console.error("[/api/voice-understand] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // API 1: Follow-up clarification question with strict duplicate prevention
  app.post("/api/complaint-followup", async (req, res) => {
    try {
      const body = (req.body ?? {}) as FollowupRequestBody;
      const complaint = cleanMultilineText(body.complaint, 2500);
      const category = normalizeCategory(body.category);
      const language = cleanText(body.language, 40) || "English";
      const answers = sanitizeAnswers(body.answers);
      const askedQuestions = sanitizeQuestionList(body.askedQuestions, answers);
      const locationSummary = buildLocationSummary(body);

      if (!complaint || complaint.length < 6) {
        res.status(400).json({
          error: "Please describe your problem in at least a few words before continuing.",
        });
        return;
      }

      if (answers.length >= MAX_FOLLOWUP_QUESTIONS) {
        res.json({
          complete: true,
          question: "",
          reason: "Sufficient details collected to prepare your formal complaint draft.",
        });
        return;
      }

      const mode = normalizeSubmissionMode(body.mode);
      const previousTicketId = cleanText(body.previousTicketId, 100);

      const followupCacheKey = `followup:${mode}:${language}:${category}:${locationSummary}:${complaint.toLowerCase()}:${answers.map((a) => `${a.question}=${a.answer}`).join("|")}:${askedQuestions.join("|")}`;
      const cachedFollowup = getCachedAiResponse<{ complete: boolean; question: string; reason: string }>(followupCacheKey);
      if (cachedFollowup) {
        res.json(cachedFollowup);
        return;
      }

      const ai = getAiClient();

      const buildPrompt = (extraAvoidInstruction = "") => {
        const qaBlock =
          answers.length > 0
            ? answers
                .map((a, idx) => `Q${idx + 1}: ${a.question}\nA${idx + 1}: ${a.answer}`)
                .join("\n\n")
            : "None yet.";

        const askedBlock =
          askedQuestions.length > 0
            ? askedQuestions.map((q, idx) => `${idx + 1}. ${q}`).join("\n")
            : "None yet.";

        return [
          `Document mode: ${mode === "rti" ? "RTI Act 2005 Information Request" : mode === "escalation" ? "Escalation / Follow-up Notice" : "Standard Citizen Grievance / Complaint"}`,
          previousTicketId ? `Previous Complaint / Ticket ID: ${previousTicketId}` : "",
          `Citizen's preferred language: ${language}`,
          `Category: ${category}`,
          `Location provided: ${locationSummary}`,
          `Initial statement:\n"""${complaint}"""`,
          `Previously asked questions (NEVER repeat or paraphrase any of these):\n${askedBlock}`,
          `Collected follow-up Q&A so far:\n${qaBlock}`,
          `Questions answered so far: ${answers.length} of max ${MAX_FOLLOWUP_QUESTIONS}.`,
          extraAvoidInstruction,
        ]
          .filter(Boolean)
          .join("\n\n");
      };

      const systemInstruction = [
        "You are MakkalVoice, a calm, respectful civic assistance intake helper for everyday Indian citizens (including elderly and first-time smartphone users).",
        "Your goal is to decide whether ONE more very simple, short clarifying question is genuinely needed before writing the official letter.",
        "Strict rules:",
        `1. Write the 'question' strictly in simple, everyday spoken ${language} (short, warm, easy to understand when read aloud, 1 single sentence).`,
        "2. NEVER ask for information already stated in the initial statement, location fields, or previous answers.",
        "3. NEVER repeat or rephrase any question listed under 'Previously asked questions'.",
        mode === "rti"
          ? "4. Since this is an RTI Act 2005 inquiry, ask only for the exact department/office name or specific date/record period needed by the Public Information Officer (PIO) if missing."
          : mode === "escalation"
            ? "4. Since this is an Escalation / Reminder notice, ask only for the original complaint date or lack-of-response detail if missing."
            : "4. Ask only for practical facts that help the government department act immediately: exact area/landmark (if missing), how long it has been happening (if missing), how it affects residents/safety, or an existing bill/consumer/ticket number if relevant.",
        "5. NEVER ask for Aadhaar numbers, OTPs, bank PINs, or sensitive personal data.",
        "6. If you already have enough concrete facts to draft a strong original letter (usually after 2-3 answers, or sooner if already detailed), set complete=true and leave question empty.",
      ].join("\n");

      const callModel = async (extraAvoid = "") => {
        const parsed = await generateWithFailover(
          FAST_TEXT_MODELS,
          async (model) => {
            const response = await ai.models.generateContent({
              model,
              contents: buildPrompt(extraAvoid),
              config: {
                systemInstruction,
                thinkingConfig: thinkingConfigForModel(model),
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    complete: { type: Type.BOOLEAN },
                    question: { type: Type.STRING },
                    reason: { type: Type.STRING },
                  },
                  required: ["complete", "question", "reason"],
                },
              },
            });
            return safeParseJsonObject<{
              complete?: boolean;
              question?: string;
              reason?: string;
            }>(response.text ?? "");
          },
          ATTEMPT_TIMEOUT_MS,
        );

        return {
          complete: Boolean(parsed.complete),
          question: cleanText(parsed.question, 320),
          reason: cleanText(parsed.reason, 240),
        };
      };

      let result = await callModel();

      if (!result.complete && (!result.question || isDuplicateQuestion(result.question, askedQuestions))) {
        if (answers.length >= 2) {
          result = {
            complete: true,
            question: "",
            reason: "Key factual details have already been collected.",
          };
        } else {
          const retry = await callModel(
            `CRITICAL: Your last question "${result.question}" repeated an earlier question. Ask a completely DIFFERENT simple question about an uncovered fact, OR set complete=true.`,
          );
          if (!retry.complete && (!retry.question || isDuplicateQuestion(retry.question, askedQuestions))) {
            result = {
              complete: true,
              question: "",
              reason: "Enough information is available to draft your complaint.",
            };
          } else {
            result = retry;
          }
        }
      }

      setCachedAiResponse(followupCacheKey, result);
      res.json(result);
    } catch (error) {
      console.error("[/api/complaint-followup] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // API 2: Formal complaint draft + Verified Official Portal Routing
  app.post("/api/complaint-draft", async (req, res) => {
    try {
      const body = (req.body ?? {}) as DraftRequestBody;
      const complaint = cleanMultilineText(body.complaint, 2500);
      const category = normalizeCategory(body.category);
      const language = cleanText(body.language, 40) || "English";
      const uiLanguage = cleanText(body.uiLanguage, 40) || language;
      const draftLanguage = cleanText(body.draftLanguage, 40) || "English";
      const answers = sanitizeAnswers(body.answers);
      const state = cleanText(body.state, 100);
      const district = cleanText(body.district, 100);
      const town = cleanText(body.town, 120);
      const street = cleanText(body.street, 200);
      const pincode = cleanText(body.pincode, 12);
      const referenceNumber = cleanText(body.referenceNumber, 80);
      const locationSummary = buildLocationSummary(body);

      if (!complaint || complaint.length < 6) {
        res.status(400).json({
          error: "Complaint description is required to generate a draft.",
        });
        return;
      }

      const ai = getAiClient();
      const portalCatalog = getPortalCatalogSummaryForPrompt();

      const qaSection =
        answers.length > 0
          ? answers
              .map((a, idx) => `${idx + 1}. Question: ${a.question}\n   Citizen's Answer: ${a.answer}`)
              .join("\n")
          : "No additional follow-up answers provided.";

      const todayFormatted = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const mode = normalizeSubmissionMode(body.mode);
      const previousTicketId = cleanText(body.previousTicketId, 100);
      const gpsLat = typeof body.gpsLat === "number" && Number.isFinite(body.gpsLat) ? body.gpsLat : undefined;
      const gpsLng = typeof body.gpsLng === "number" && Number.isFinite(body.gpsLng) ? body.gpsLng : undefined;

      const modeInstruction =
        mode === "rti"
          ? "MODE = RTI ACT 2005 APPLICATION: Format as a formal Indian Right to Information (RTI) Application under Section 6(1) of the RTI Act, 2005 addressed to the Central/State Public Information Officer (PIO) of the relevant department, with numbered specific questions seeking status/action-taken records within 30 days. Set primaryPortalId to 'rti_online'."
          : mode === "escalation"
            ? `MODE = ESCALATION / REMINDER NOTICE: Format as a formal Follow-up / Escalation Notice addressed to the Higher Appellate Authority / District Collector / Nodal Grievance Officer, explicitly citing Previous Ticket/Complaint ID (${previousTicketId || "as mentioned by citizen"}) and requesting urgent time-bound resolution.`
            : "MODE = STANDARD CITIZEN GRIEVANCE: Format cleanly with Date, To (exact responsible department), Subject, factual description, exact location (include GPS coordinates only if provided), impact/duration (only if stated), and polite request for action.";

      const systemInstruction = [
        "You are MakkalVoice, an expert Indian civic complaint, RTI, and escalation drafter and official portal router.",
        "Your job has TWO equally critical parts:",
        "PART A — Formal Original Draft:",
        `1. Write 'subject' (1 concise line) and 'draft' (crisp, polite, complete official letter ~130-220 words) strictly in ${draftLanguage}.`,
        "2. Use ONLY facts explicitly given by the citizen. NEVER invent dates, house numbers, bill numbers, or officer names.",
        "3. Use the exact literal placeholders [COMPLAINANT_NAME] and [CONTACT_DETAILS] at the signature block so personal details stay on the citizen's device.",
        `4. ${modeInstruction}`,
        "PART B — Exact Official Portal Selection & Short Filing Steps:",
        "5. From the VERIFIED PORTAL CATALOG provided in the prompt, choose the EXACT best 'primaryPortalId' and 'secondaryPortalId' that match BOTH the document mode & topic (RTI -> rti_online; electricity -> state electricity board like tangedco_tn/bescom_karnataka/mahavitaran_mh; Chennai water/sewage -> cmwssb_chennai; Chennai streetlight/road -> gcc_chennai; railway -> railmadad; bank/UPI -> rbi_cms; cyber scam -> cybercrime_india; consumer bill -> national_consumer; legal aid -> nalsa_legal; state civic/ration/pension -> state grievance portal; central escalation -> cpgrams) AND the citizen's state/district.",
        "6. ONLY return IDs that appear verbatim in the VERIFIED PORTAL CATALOG.",
        `7. Write 'suggestedAuthority' (short official office title), 'summaryPoints' (3 concise factual bullets), 'whyThisPortal' (1 short clear sentence), and 'filingSteps' (4 short, simple step-by-step actions to submit on that portal and save the tracking number) strictly in ${uiLanguage}.`,
      ].join("\n");

      const prompt = [
        `Date: ${todayFormatted}`,
        `Document Mode: ${mode.toUpperCase()}`,
        previousTicketId ? `Previous Tracking / Ticket ID: ${previousTicketId}` : "",
        `Target letter language: ${draftLanguage}`,
        `User dashboard guidance language: ${uiLanguage}`,
        `Citizen's spoken/input language: ${language}`,
        `Category: ${category}`,
        `State / UT: ${state || "Not specified"}`,
        `District: ${district || "Not specified"}`,
        `Town / Area: ${town || "Not specified"}`,
        `Street / Landmark: ${street || "Not specified"}`,
        `Pincode: ${pincode || "Not specified"}`,
        gpsLat !== undefined && gpsLng !== undefined
          ? `Verified GPS Coordinates: ${gpsLat.toFixed(5)}, ${gpsLng.toFixed(5)}`
          : "",
        `Reference / Consumer / Bill / PNR / Application Number: ${referenceNumber || "None provided"}`,
        `Combined Location: ${locationSummary}`,
        `Citizen's Original Statement:\n"""${complaint}"""`,
        `Clarification Q&A:\n${qaSection}`,
        `VERIFIED PORTAL CATALOG (select primaryPortalId and secondaryPortalId ONLY from these exact IDs):\n${portalCatalog}`,
      ]
        .filter(Boolean)
        .join("\n\n");

      const draftCacheKey = `complaint-draft:${mode}:${draftLanguage}:${uiLanguage}:${category}:${state}:${district}:${previousTicketId}:${complaint.toLowerCase()}:${answers.map((a) => `${a.question}=${a.answer}`).join("|")}`;
      const cachedDraft = getCachedAiResponse<Record<string, unknown>>(draftCacheKey);
      if (cachedDraft) {
        res.json(cachedDraft);
        return;
      }

      const parsed = await generateWithFailover(
        DRAFT_TEXT_MODELS,
        async (model) => {
          const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              systemInstruction,
              thinkingConfig: thinkingConfigForModel(model),
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  draft: { type: Type.STRING },
                  suggestedAuthority: { type: Type.STRING },
                  summaryPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  primaryPortalId: {
                    type: Type.STRING,
                    description: `Must be one of: ${VERIFIED_PORTAL_IDS.join(", ")}`,
                  },
                  secondaryPortalId: {
                    type: Type.STRING,
                    description: `Must be a different ID from: ${VERIFIED_PORTAL_IDS.join(", ")}`,
                  },
                  whyThisPortal: {
                    type: Type.STRING,
                    description: `1 short sentence in ${uiLanguage} explaining why this official portal is the right place.`,
                  },
                  filingSteps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: `4 short, simple filing steps in ${uiLanguage} for this official portal.`,
                  },
                },
                required: [
                  "subject",
                  "draft",
                  "suggestedAuthority",
                  "summaryPoints",
                  "primaryPortalId",
                  "secondaryPortalId",
                  "whyThisPortal",
                  "filingSteps",
                ],
              },
            },
          });

          const parsedObj = safeParseJsonObject<{
            subject?: string;
            draft?: string;
            suggestedAuthority?: string;
            summaryPoints?: unknown;
            primaryPortalId?: string;
            secondaryPortalId?: string;
            whyThisPortal?: string;
            portalLanguageTip?: string;
            filingSteps?: unknown;
            requiredDocuments?: unknown;
            englishButtonGuide?: unknown;
          }>(response.text ?? "");

          if (!cleanMultilineText(parsedObj.draft, 8000)) {
            throw Object.assign(new Error("Empty draft text in AI response."), {
              code: "MALFORMED_JSON",
            });
          }
          return parsedObj;
        },
        REQUEST_TIMEOUT_MS,
      );

      const draft = cleanMultilineText(parsed.draft, 8000);

      // Strictly enforce verified portal allowlist on the server
      const fallbackPortals = selectFallbackPortalIds(category, state, district, complaint);
      const rawPrimary = cleanText(parsed.primaryPortalId, 60);
      const rawSecondary = cleanText(parsed.secondaryPortalId, 60);

      const primaryPortalId =
        mode === "rti"
          ? "rti_online"
          : VERIFIED_PORTALS[rawPrimary]
            ? rawPrimary
            : fallbackPortals.primaryId;

      const secondaryPortalId =
        mode === "rti"
          ? "cpgrams"
          : VERIFIED_PORTALS[rawSecondary] && rawSecondary !== primaryPortalId
            ? rawSecondary
            : fallbackPortals.secondaryId !== primaryPortalId
              ? fallbackPortals.secondaryId
              : "cpgrams";

      const summaryPoints = Array.isArray(parsed.summaryPoints)
        ? parsed.summaryPoints
            .filter((p): p is string => typeof p === "string")
            .map((p) => cleanText(p, 220))
            .filter(Boolean)
            .slice(0, 5)
        : [];

      const filingSteps = Array.isArray(parsed.filingSteps)
        ? parsed.filingSteps
            .filter((p): p is string => typeof p === "string")
            .map((p) => cleanText(p, 260))
            .filter(Boolean)
            .slice(0, 6)
        : [];

      const requiredDocuments = Array.isArray(parsed.requiredDocuments)
        ? parsed.requiredDocuments
            .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
            .map((item, idx) => ({
              id: `doc-ai-${idx + 1}`,
              title: cleanText(item.title, 180),
              detail: cleanText(item.detail, 280),
              mandatory: Boolean(item.mandatory),
            }))
            .filter((item) => item.title.length > 0)
            .slice(0, 6)
        : [];

      const englishButtonGuide = Array.isArray(parsed.englishButtonGuide)
        ? parsed.englishButtonGuide
            .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
            .map((item) => ({
              englishLabel: cleanText(item.englishLabel, 100),
              localMeaning: cleanText(item.localMeaning, 180),
            }))
            .filter((item) => item.englishLabel.length > 0 && item.localMeaning.length > 0)
            .slice(0, 6)
        : [];

      const draftPayload = {
        subject: cleanText(parsed.subject, 240),
        draft,
        suggestedAuthority: cleanText(parsed.suggestedAuthority, 200),
        summaryPoints,
        draftLanguage,
        primaryPortalId,
        secondaryPortalId,
        whyThisPortal: cleanText(parsed.whyThisPortal, 400),
        portalLanguageTip: cleanText(parsed.portalLanguageTip, 320),
        filingSteps,
        requiredDocuments,
        englishButtonGuide,
      };
      setCachedAiResponse(draftCacheKey, draftPayload);
      res.json(draftPayload);
    } catch (error) {
      console.error("[/api/complaint-draft] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // Innovation 4: One-click Escalation / Reminder Letter from saved Complaint Tracker record
  app.post("/api/escalation-draft", async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        subject?: string;
        originalDraft?: string;
        category?: string;
        state?: string;
        district?: string;
        town?: string;
        street?: string;
        pincode?: string;
        referenceNumber?: string;
        portalName?: string;
        trackingId?: string;
        filedDate?: string;
        uiLanguage?: string;
        draftLanguage?: string;
      };

      const originalDraft = cleanMultilineText(body.originalDraft, 4000);
      const subject = cleanText(body.subject, 240);
      const category = normalizeCategory(body.category);
      const state = cleanText(body.state, 100);
      const district = cleanText(body.district, 100);
      const uiLanguage = cleanText(body.uiLanguage, 40) || "English";
      const draftLanguage = cleanText(body.draftLanguage, 40) || "English";
      const trackingId = cleanText(body.trackingId, 100);
      const portalName = cleanText(body.portalName, 160);
      const filedDate = cleanText(body.filedDate, 40);

      if (!originalDraft && !subject) {
        res.status(400).json({ error: "Saved complaint details are required to draft an escalation letter." });
        return;
      }

      const ai = getAiClient();
      const todayFormatted = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const parsed = await generateWithFailover(
        FAST_TEXT_MODELS,
        async (model) => {
          const response = await ai.models.generateContent({
            model,
            contents: [
              `Today's Date: ${todayFormatted}`,
              `Original Filing Date: ${filedDate || "Earlier"}`,
              `Original Portal: ${portalName || "Official Government Portal"}`,
              `Official Portal Tracking / Ticket ID: ${trackingId || "Not yet entered (use [OFFICIAL_TRACKING_ID])"}`,
              `State / District: ${[district, state].filter(Boolean).join(", ") || "India"}`,
              `Original Subject: ${subject}`,
              `Original Complaint Text:\n"""${originalDraft}"""`,
            ].join("\n\n"),
            config: {
              systemInstruction: [
                `You are MakkalVoice. Draft a firm, respectful official Escalation / Reminder Notice in ${draftLanguage} addressed to the Senior Nodal Officer / District Collector / Appellate Authority.`,
                "Clearly reference the original filing date, portal name, and Tracking/Ticket ID. Request immediate time-bound intervention since the grievance remains unresolved.",
                "Use literal placeholders [COMPLAINANT_NAME] and [CONTACT_DETAILS] in the signature block.",
                `Provide suggestedAuthority, whyThisPortal, portalLanguageTip, and 4 concise summaryPoints in ${uiLanguage}.`,
              ].join("\n"),
              thinkingConfig: thinkingConfigForModel(model),
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  subject: { type: Type.STRING },
                  draft: { type: Type.STRING },
                  suggestedAuthority: { type: Type.STRING },
                  summaryPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
                  whyThisPortal: { type: Type.STRING },
                  portalLanguageTip: { type: Type.STRING },
                },
                required: [
                  "subject",
                  "draft",
                  "suggestedAuthority",
                  "summaryPoints",
                  "whyThisPortal",
                  "portalLanguageTip",
                ],
              },
            },
          });
          const obj = safeParseJsonObject<Record<string, unknown>>(response.text ?? "");
          if (!cleanMultilineText(obj.draft, 8000)) {
            throw Object.assign(new Error("Empty escalation draft in AI response."), {
              code: "MALFORMED_JSON",
            });
          }
          return obj;
        },
        REQUEST_TIMEOUT_MS,
      );

      const fallback = selectFallbackPortalIds(category, state, district, `${subject} ${originalDraft}`);

      res.json({
        subject: cleanText(parsed.subject, 240) || `Reminder & Escalation: ${subject}`,
        draft: cleanMultilineText(parsed.draft, 8000),
        suggestedAuthority: cleanText(parsed.suggestedAuthority, 200) || "Appellate Grievance Officer / District Collector",
        summaryPoints: Array.isArray(parsed.summaryPoints)
          ? parsed.summaryPoints.filter((s): s is string => typeof s === "string").slice(0, 4)
          : [],
        draftLanguage,
        primaryPortalId: "cpgrams",
        secondaryPortalId: fallback.primaryId !== "cpgrams" ? fallback.primaryId : "rti_online",
        whyThisPortal: cleanText(parsed.whyThisPortal, 360),
        portalLanguageTip: cleanText(parsed.portalLanguageTip, 320),
        filingSteps: [],
        requiredDocuments: [],
        englishButtonGuide: [],
      });
    } catch (error) {
      console.error("[/api/escalation-draft] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // API 3: Multi-turn Gemini Portal & Submission Assistant Chatbot
  app.post("/api/portal-assistant-chat", async (req, res) => {
    try {
      const body = (req.body ?? {}) as {
        message?: string;
        history?: Array<{ role?: string; text?: string }>;
        context?: {
          uiLanguage?: string;
          category?: string;
          state?: string;
          district?: string;
          portalName?: string;
          portalUrl?: string;
          portalHelpline?: string;
          secondaryPortalName?: string;
          suggestedAuthority?: string;
          draftSubject?: string;
          documentTitles?: unknown;
        };
      };

      const message = cleanMultilineText(body.message, 1500);
      if (!message) {
        res.status(400).json({ error: "Please enter or speak a question first." });
        return;
      }

      const ctx = body.context ?? {};
      const uiLanguage = cleanText(ctx.uiLanguage, 40) || "English";
      const category = cleanText(ctx.category, 60) || "Civic Issues";
      const state = cleanText(ctx.state, 80);
      const district = cleanText(ctx.district, 80);
      const portalName = cleanText(ctx.portalName, 160);
      const portalUrl = cleanText(ctx.portalUrl, 200);
      const portalHelpline = cleanText(ctx.portalHelpline, 60);
      const secondaryPortalName = cleanText(ctx.secondaryPortalName, 160);
      const suggestedAuthority = cleanText(ctx.suggestedAuthority, 160);
      const draftSubject = cleanText(ctx.draftSubject, 220);
      const docTitles = Array.isArray(ctx.documentTitles)
        ? ctx.documentTitles
            .filter((d): d is string => typeof d === "string")
            .map((d) => cleanText(d, 160))
            .filter(Boolean)
            .slice(0, 8)
        : [];

      // Sanitize multi-turn history so it starts with a user turn and alternates strictly
      const sanitizedHistory: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(body.history)) {
        for (const turn of body.history.slice(-20)) {
          const role = turn?.role === "user" ? "user" : turn?.role === "model" ? "model" : null;
          const text = cleanMultilineText(turn?.text, 2000);
          if (!role || !text) continue;
          if (sanitizedHistory.length === 0 && role !== "user") {
            continue;
          }
          const last = sanitizedHistory[sanitizedHistory.length - 1];
          if (last && last.role === role) {
            last.parts[0].text = `${last.parts[0].text}\n${text}`.slice(0, 2500);
          } else {
            sanitizedHistory.push({ role, parts: [{ text }] });
          }
        }
        // Ensure history ends with model before sending next user message
        if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === "user") {
          sanitizedHistory.pop();
        }
      }

      const contextLines = [
        `Dashboard language (MUST reply in this language): ${uiLanguage}`,
        `Complaint category: ${category}`,
        state ? `State / UT: ${state}` : "",
        district ? `District: ${district}` : "",
        portalName ? `Matched Primary Official Portal: ${portalName}` : "",
        portalUrl ? `Verified Portal URL: ${portalUrl}` : "",
        portalHelpline ? `Portal Helpline: ${portalHelpline}` : "",
        secondaryPortalName ? `Backup / Escalation Portal: ${secondaryPortalName}` : "",
        suggestedAuthority ? `Suggested Department: ${suggestedAuthority}` : "",
        draftSubject ? `Current Complaint Subject: ${draftSubject}` : "",
        docTitles.length > 0 ? `Suggested Supporting Documents: ${docTitles.join("; ")}` : "",
      ].filter(Boolean);

      const systemInstruction = [
        "You are MakkalVoice Portal & Submission Guide, a patient, trustworthy Indian civic filing assistant.",
        "Your specific role is to guide everyday Indian citizens (including elderly and first-time internet users) step-by-step on how to submit their complaint to the official Indian government portal, prepare and attach supporting documents, track status using their grievance ID, and escalate if unresolved.",
        "Strict rules:",
        `1. ALWAYS reply clearly and warmly in ${uiLanguage} using short, easy-to-follow sentences or numbered steps.`,
        "2. Keep answers concise, practical, and easy to read or hear aloud (around 3–6 short sentences or a short numbered list).",
        "3. NEVER invent unverified government URLs. Only cite the verified portal URL provided in context or official Indian helplines (112 emergency, 1930 cyber fraud, 1915 consumer, 139 railways, 1100/181/1902 state helplines when applicable).",
        "4. NEVER ask the user to share Aadhaar numbers, OTPs, passwords, or bank PINs in chat.",
        "5. Always remind the user (when relevant) that MakkalVoice helps prepare and guide them, while the actual submission happens directly on the official government portal so they receive a real tracking number.",
        "",
        "Current citizen complaint context:",
        ...contextLines,
      ].join("\n");

      const ai = getAiClient();
      const reply = await generateWithFailover(
        FAST_TEXT_MODELS,
        async (model) => {
          const chat = ai.chats.create({
            model,
            history: sanitizedHistory,
            config: {
              systemInstruction,
              thinkingConfig: thinkingConfigForModel(model),
            },
          });
          const response = await chat.sendMessage({ message });
          const text = cleanMultilineText(response.text, 4000);
          if (!text) {
            throw Object.assign(new Error("Empty reply from AI assistant."), {
              code: "MALFORMED_JSON",
            });
          }
          return text;
        },
        ATTEMPT_TIMEOUT_MS,
      );

      res.json({ reply });
    } catch (error) {
      console.error("[/api/portal-assistant-chat] error:", error);
      const mapped = mapGeminiError(error);
      res.status(mapped.status).json({
        error: mapped.message,
        code: mapped.code,
        ...(process.env.NODE_ENV !== "production" && mapped.diagnostic ? { detail: mapped.diagnostic } : {}),
      });
    }
  });

  // Mount Vite middleware in development or serve built dist in production
  const isProd = process.env.NODE_ENV === "production";
  const distDir = path.resolve(__dirname, "dist");

  if (!isProd || !fs.existsSync(distDir)) {
    process.env.DISABLE_HMR = "true";
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        ws: false,
      },
      appType: "spa",
    });

    // Vite 8 still injects /@vite/client with a WebSocket connection even when hmr/ws are false.
    // Serve a clean zero-WebSocket shim exporting the 5 client helpers (CSS + HMR no-ops).
    const noHmrViteClient = `
const sheetsMap = new Map();
let lastInsertedStyle;
export function updateStyle(id, content) {
  let style = sheetsMap.get(id);
  if (!style) {
    style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.setAttribute("data-vite-dev-id", id);
    style.textContent = content;
    if (!lastInsertedStyle) {
      document.head.appendChild(style);
      setTimeout(() => { lastInsertedStyle = undefined; }, 0);
    } else {
      lastInsertedStyle.insertAdjacentElement("afterend", style);
    }
    lastInsertedStyle = style;
  } else if (style.textContent !== content) {
    style.textContent = content;
  }
  sheetsMap.set(id, style);
}
export function removeStyle(id) {
  const style = sheetsMap.get(id);
  if (style) {
    document.head.removeChild(style);
    sheetsMap.delete(id);
  }
}
export function createHotContext() {
  return {
    data: {},
    accept() {},
    acceptExports() {},
    dispose() {},
    prune() {},
    decline() {},
    invalidate() {},
    on() {},
    off() {},
    send() {},
  };
}
export function injectQuery(url, queryToInject) {
  if (!url || !queryToInject) return url;
  const hashIndex = url.indexOf("#");
  const hash = hashIndex >= 0 ? url.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
  const sep = withoutHash.includes("?") ? "&" : "?";
  return withoutHash + sep + queryToInject + hash;
}
export class ErrorOverlay extends HTMLElement {}
`.trim();

    app.get("/@vite/client", (_req, res) => {
      res.setHeader("Cache-Control", "no-store");
      res.type("application/javascript").send(noHmrViteClient);
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(distDir));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distDir, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MakkalVoice server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start MakkalVoice server:", err);
  process.exit(1);
});
