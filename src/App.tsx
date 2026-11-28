import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  AudioLines,
  BookmarkCheck,
  Check,
  ExternalLink,
  FileCheck2,
  FileEdit,
  Globe,
  Landmark,
  MessageSquare,
  Mic,
  PhoneCall,
  Send,
  Shield,
  X,
} from "lucide-react";
import { ClarifyChat } from "./components/ClarifyChat";
import { ComplaintForm, type ComplaintFieldErrors } from "./components/ComplaintForm";
import { ComplaintTrackerSection } from "./components/ComplaintTrackerSection";
import { DraftReview } from "./components/DraftReview";
import {
  buildGmailComposeUrl,
  buildOfficialWhatsAppUrl,
  LiveVoiceFlowModal,
  type PendingLiveChannelConfirm,
} from "./components/LiveVoiceFlowModal";
import { PortalAssistantChat } from "./components/PortalAssistantChat";
import { OfflineIndicator, PWAInstallButton } from "./components/PWAInstallButton";
import { getCivicShowcaseStrings } from "./data/civicShowcaseTranslations";
import { getDashboardExtrasStrings } from "./data/dashboardExtrasTranslations";
import { INDIA_STATE_DISTRICTS } from "./data/indiaLocations";
import { getInnovationStrings } from "./data/innovationTranslations";
import {
  LANGUAGES,
  LANGUAGE_LOCALE_MAP,
  SAMPLE_SCENARIOS,
} from "./data/languages";
import { getLocalizedDistrictName, getLocalizedStateName } from "./data/localizedLocations";
import { resolveLocalizedErrorMessage } from "./data/localizedErrors";
import {
  getLocalizedSampleComplaint,
  localizePortalEntry,
  PORTAL_LANGUAGE_SUPPORT,
} from "./data/localizedPortals";
import { FEATURED_OFFICIAL_PORTALS, resolvePortalGuidance } from "./data/portals";
import { getSubmissionStrings } from "./data/submissionTranslations";
import { getUiStrings } from "./data/translations";
import { getVoiceFlowStrings } from "./data/voiceFlowTranslations";
import type {
  AnswerEntry,
  ChatMessage,
  ComplaintFormState,
  CoSignerEntry,
  DraftResponse,
  EvidenceAttachment,
  GpsLocationResult,
  PortalChatMessage,
  QueuedOfflineComplaint,
  SavedComplaintRecord,
  StepId,
} from "./types";
import {
  isClientDuplicateQuestion,
  requestComplaintDraft,
  requestEscalationDraft,
  requestEvidenceScan,
  requestFollowupQuestion,
  requestPortalAssistantChat,
  requestVoiceExtraction,
  resolveEffectiveDistrict,
} from "./utils/api";
import {
  compressImageForPortal,
  downloadOfficialLetterPdf,
  shareOfficialLetterPdf,
} from "./utils/mediaTools";
import { getHelplineIcon, getPortalIcon } from "./utils/civicIcons";
import type { LiveIntakePatch, LiveVoiceCommandResult } from "./hooks/useLiveVoiceFlow";
import { useVoiceRecorder } from "./hooks/useVoiceRecorder";
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeakingText,
} from "./utils/speech";
import {
  clearAutosavedForm,
  defaultReminderDateIso,
  loadSavedComplaints,
  persistSavedComplaints,
} from "./utils/storage";

const CONSTITUTION_BANNER_PATH =
  "/src/assets/images/constitution_justice_banner_1795712869625.jpg";
const LAW_ORDER_BANNER_PATH =
  "/src/assets/images/law_order_civic_dome_1795712870964.jpg";
const CITIZEN_VOICE_BANNER_PATH =
  "/src/assets/images/citizen_voice_seva_1795712872881.jpg";
const HERO_ANIMATED_BANNERS = [
  CONSTITUTION_BANNER_PATH,
  LAW_ORDER_BANNER_PATH,
  CITIZEN_VOICE_BANNER_PATH,
];

function openExternalUrlSafely(url: string): void {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

const INITIAL_FORM: ComplaintFormState = {
  mode: "complaint",
  previousTicketId: "",
  language: "English",
  category: "Civic Issues",
  state: "",
  district: "",
  customDistrict: "",
  town: "",
  street: "",
  pincode: "",
  gpsLat: undefined,
  gpsLng: undefined,
  referenceNumber: "",
  name: "",
  contact: "",
  complaint: "",
};

function currentTimeLabel(): string {
  return new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function makeMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const OFFLINE_QUEUE_KEY = "makkalvoice_offline_queue_v1";

function loadOfflineQueue(): QueuedOfflineComplaint[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as QueuedOfflineComplaint[]) : [];
  } catch {
    return [];
  }
}

function persistOfflineQueue(items: QueuedOfflineComplaint[]): void {
  try {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(items.slice(0, 20)));
  } catch {
    // Ignore storage quota errors
  }
}

export default function App() {
  const [form, setForm] = useState<ComplaintFormState>(INITIAL_FORM);
  const [step, setStep] = useState<StepId>("describe");

  // Clarify state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<AnswerEntry[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answerInput, setAnswerInput] = useState("");
  const [autoReadAloud, setAutoReadAloud] = useState(true);

  // Review / Draft state
  const [draftData, setDraftData] = useState<DraftResponse | null>(null);
  const [editableSubject, setEditableSubject] = useState("");
  const [editableDraft, setEditableDraft] = useState("");
  const [draftLanguage, setDraftLanguage] = useState("English");

  // Innovation 1: Photo & Bill Scanner state
  const [scanningEvidence, setScanningEvidence] = useState(false);
  const [scanPreviewUrl, setScanPreviewUrl] = useState<string | null>(null);
  const [scanNotice, setScanNotice] = useState<string | null>(null);

  // Innovation 3: Proof Attachments & Joint Petition Co-Signers
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);
  const [coSigners, setCoSigners] = useState<CoSignerEntry[]>([]);

  // Offline Queue (Step 1)
  const [isOffline, setIsOffline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? !navigator.onLine : false,
  );
  const [offlineQueue, setOfflineQueue] = useState<QueuedOfflineComplaint[]>(() =>
    loadOfflineQueue(),
  );
  const [offlineQueueNotice, setOfflineQueueNotice] = useState<string | null>(null);

  // Innovation 4: Personal Complaint Tracker Vault
  const [savedRecords, setSavedRecords] = useState<SavedComplaintRecord[]>(() =>
    loadSavedComplaints(),
  );
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);
  const [escalatingId, setEscalatingId] = useState<string | null>(null);
  const [rtiDraftingId, setRtiDraftingId] = useState<string | null>(null);

  // Beginner-friendly primary dashboard view switcher
  const [dashboardTab, setDashboardTab] = useState<"write" | "saved" | "portals">("write");

  // Google Maps Demo Key Quota Banner (Case A mandatory handler)
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  // Multi-turn Gemini Portal Submission Assistant Chatbot state
  const [portalChatOpen, setPortalChatOpen] = useState(false);
  const [portalChatMessages, setPortalChatMessages] = useState<PortalChatMessage[]>([]);
  const [portalChatBusy, setPortalChatBusy] = useState(false);
  const [portalChatError, setPortalChatError] = useState<string | null>(null);

  // Hands-Free Gemini Live Voice Flow Studio state
  const [liveVoiceOpen, setLiveVoiceOpen] = useState(false);
  const [liveActionToast, setLiveActionToast] = useState<string | null>(null);
  const [pendingChannelConfirm, setPendingChannelConfirm] =
    useState<PendingLiveChannelConfirm | null>(null);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);

  // UI & Async state
  const [busy, setBusy] = useState(false);
  const [extractingVoice, setExtractingVoice] = useState(false);
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ComplaintFieldErrors>({});

  // Voice input & speech output state
  const [voiceTarget, setVoiceTarget] = useState<"complaint" | "answer" | null>(null);
  const voiceTargetRef = useRef<"complaint" | "answer" | null>(null);
  voiceTargetRef.current = voiceTarget;
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isReadingGuide, setIsReadingGuide] = useState(false);

  const t = useMemo(() => getUiStrings(form.language), [form.language]);
  const st = useMemo(() => getSubmissionStrings(form.language), [form.language]);
  const it = useMemo(() => getInnovationStrings(form.language), [form.language]);
  const dx = useMemo(() => getDashboardExtrasStrings(form.language), [form.language]);
  const vf = useMemo(() => getVoiceFlowStrings(form.language), [form.language]);
  const cs = useMemo(() => getCivicShowcaseStrings(form.language), [form.language]);
  const speechOutputSupported = useMemo(() => isSpeechSynthesisSupported(), []);

  const voiceRecorder = useVoiceRecorder({
    language: form.language,
    onTranscript: (spokenText) => {
      const cleanedSpoken = spokenText.trim();
      if (!cleanedSpoken) {
        setVoiceTarget(null);
        return;
      }
      if (voiceTargetRef.current === "answer") {
        setAnswerInput((prev) => {
          const trimmedPrev = prev.trim();
          if (!trimmedPrev) return cleanedSpoken;
          if (trimmedPrev.endsWith(cleanedSpoken)) return prev;
          return `${trimmedPrev} ${cleanedSpoken}`;
        });
      } else {
        setForm((prev) => {
          const trimmedPrev = prev.complaint.trim();
          if (trimmedPrev && trimmedPrev.endsWith(cleanedSpoken)) {
            return prev;
          }
          return {
            ...prev,
            complaint: trimmedPrev ? `${trimmedPrev} ${cleanedSpoken}` : cleanedSpoken,
          };
        });
        setFieldErrors((prev) => (prev.complaint ? { ...prev, complaint: false } : prev));
      }
      setVoiceTarget(null);
    },
    onError: (msg) => {
      setErrorMessage(msg);
      setVoiceTarget(null);
    },
  });

  const speechSupported = voiceRecorder.isSupported;

  // Listen for Google Maps Platform Demo Key Quota events (Tier 1 + Tier 2)
  useEffect(() => {
    const onQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", onQuota);
    return () => window.removeEventListener("gmp-quota-exceeded", onQuota);
  }, []);

  // Privacy & Fresh-Start Guarantee: Always start with a blank form on reopen
  // and immediately wipe any legacy autosaved form data from previous visits.
  useEffect(() => {
    clearAutosavedForm();
  }, []);

  // Gentle automatic cross-fade for the unified constitutional/civic hero banner
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActiveHeroSlide((prev) => (prev + 1) % HERO_ANIMATED_BANNERS.length);
    }, 5500);
    return () => window.clearInterval(id);
  }, []);

  // Persist Complaint Tracker updates
  useEffect(() => {
    persistSavedComplaints(savedRecords);
  }, [savedRecords]);

  // Track online/offline connectivity and persist offline queue
  useEffect(() => {
    const goOnline = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  useEffect(() => {
    persistOfflineQueue(offlineQueue);
  }, [offlineQueue]);

  // Sync HTML lang and dir attributes whenever user changes dashboard language
  useEffect(() => {
    const locale = LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN";
    document.documentElement.lang = locale;
    document.documentElement.dir = t.isRtl ? "rtl" : "ltr";
  }, [form.language, t.isRtl]);

  const stopVoiceInput = useCallback(() => {
    voiceRecorder.cancelRecording();
    setVoiceTarget(null);
  }, [voiceRecorder]);

  const handleStopSpeaking = useCallback(() => {
    stopSpeakingText();
    setSpeakingMessageId(null);
    setIsReadingGuide(false);
  }, []);

  // Cleanup browser audio handles on unmount
  useEffect(() => {
    return () => {
      stopSpeakingText();
    };
  }, []);

  const handleLanguageSelect = (newLanguage: string) => {
    stopVoiceInput();
    handleStopSpeaking();
    setForm((prev) => ({ ...prev, language: newLanguage }));
    setErrorMessage(null);
  };

  const handleFieldChange = <K extends keyof ComplaintFormState>(
    field: K,
    value: ComplaintFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
    if (field === "complaint" || field === "name" || field === "contact") {
      const errorKey: keyof ComplaintFieldErrors = field;
      setFieldErrors((prev) => (prev[errorKey] ? { ...prev, [errorKey]: false } : prev));
    }
    if (autoFillNotice && field === "complaint") setAutoFillNotice(null);
  };

  const applyDistrictToForm = useCallback(
    (prev: ComplaintFormState, nextState: string, rawDistrict: string): Pick<ComplaintFormState, "district" | "customDistrict"> => {
      const districts = nextState ? INDIA_STATE_DISTRICTS[nextState] ?? [] : [];
      if (rawDistrict) {
        const exactDistrict = districts.find(
          (d) => d.toLowerCase() === rawDistrict.toLowerCase(),
        );
        if (exactDistrict) {
          return { district: exactDistrict, customDistrict: "" };
        }
        const partialDistrict = districts.find(
          (d) =>
            d.toLowerCase().includes(rawDistrict.toLowerCase()) ||
            rawDistrict.toLowerCase().includes(d.toLowerCase()),
        );
        if (partialDistrict) {
          return { district: partialDistrict, customDistrict: "" };
        }
        if (districts.length > 0) {
          return { district: "__other__", customDistrict: rawDistrict };
        }
        return { district: rawDistrict, customDistrict: "" };
      }
      if (nextState && nextState !== prev.state) {
        return { district: "", customDistrict: "" };
      }
      return { district: prev.district, customDistrict: prev.customDistrict };
    },
    [],
  );

  // Innovation 2: Apply reverse-geocoded GPS location cleanly to State, District, Town, Street, Pincode
  const handleGpsLocationResolved = useCallback(
    (result: GpsLocationResult) => {
      setForm((prev) => {
        const nextState = result.state || prev.state;
        const { district, customDistrict } = applyDistrictToForm(
          prev,
          nextState,
          result.district,
        );
        return {
          ...prev,
          state: nextState,
          district,
          customDistrict,
          town: result.town || prev.town,
          street: result.street || prev.street,
          pincode: result.pincode || prev.pincode,
          gpsLat: result.lat,
          gpsLng: result.lng,
        };
      });
    },
    [applyDistrictToForm],
  );

  // Innovation 1: AI Photo & Bill Scanner (also saves compressed proof photo for Step 3)
  const handleScanEvidenceFile = async (file: File) => {
    if (scanningEvidence || busy) return;
    stopVoiceInput();
    setScanningEvidence(true);
    setErrorMessage(null);
    setScanNotice(null);

    try {
      const compressed = await compressImageForPortal(file, 1280, 650);
      setScanPreviewUrl(compressed.dataUrl);
      const base64Body = compressed.dataUrl.split(",")[1] ?? "";
      const scanned = await requestEvidenceScan(base64Body, "image/jpeg", form.language);

      // Keep scanned photo automatically ready in Step 3 evidence list too
      setAttachments((prev) =>
        prev.length < 6 ? [compressed, ...prev] : prev,
      );

      setForm((prev) => ({
        ...prev,
        complaint: scanned.issueSummary
          ? prev.complaint.trim()
            ? `${prev.complaint.trim()}\n${scanned.issueSummary}`
            : scanned.issueSummary
          : prev.complaint,
        category: scanned.suggestedCategory ?? prev.category,
        referenceNumber: scanned.extractedReferenceNumber || prev.referenceNumber,
        street: scanned.extractedLocationHint && !prev.street.trim()
          ? scanned.extractedLocationHint
          : prev.street,
      }));

      const extras = [
        scanned.extractedReferenceNumber ? `Ref: ${scanned.extractedReferenceNumber}` : "",
        scanned.suggestedCategory ? t.categories[scanned.suggestedCategory] : "",
      ]
        .filter(Boolean)
        .join(" · ");
      setScanNotice(extras ? `${it.scanSuccessPrefix} (${extras})` : it.scanSuccessPrefix);
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setScanningEvidence(false);
    }
  };

  const navigateToDashboardTab = (tab: "write" | "saved" | "portals", scrollTargetId = "workspace") => {
    setDashboardTab(tab);
    requestAnimationFrame(() => {
      document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleApplySample = (sampleIndex: number) => {
    const sample = SAMPLE_SCENARIOS[sampleIndex];
    if (!sample) return;
    stopVoiceInput();
    handleStopSpeaking();
    setForm((prev) => ({
      ...prev,
      mode: "complaint",
      category: sample.category,
      state: sample.state,
      district: sample.district,
      customDistrict: "",
      town: sample.town,
      street: sample.street,
      complaint: getLocalizedSampleComplaint(sampleIndex, prev.language, sample.complaint),
    }));
    setErrorMessage(null);
    setFieldErrors({});
    setAutoFillNotice(null);
  };

  const handleResetForm = () => {
    stopVoiceInput();
    handleStopSpeaking();
    clearAutosavedForm();
    setForm((prev) => ({
      ...INITIAL_FORM,
      language: prev.language,
    }));
    setMessages([]);
    setAnswers([]);
    setAskedQuestions([]);
    setCurrentQuestion("");
    setAnswerInput("");
    setDraftData(null);
    setEditableSubject("");
    setEditableDraft("");
    setActiveSavedId(null);
    setAttachments([]);
    setCoSigners([]);
    setScanPreviewUrl(null);
    setScanNotice(null);
    setPortalChatMessages([]);
    setPortalChatError(null);
    setErrorMessage(null);
    setFieldErrors({});
    setAutoFillNotice(null);
    setStep("describe");
  };

  const handleSaveToOfflineQueue = () => {
    if (!form.complaint.trim()) {
      setErrorMessage(t.errEmptyComplaint);
      return;
    }
    const item: QueuedOfflineComplaint = {
      id: makeMessageId(),
      queuedAt: new Date().toISOString().slice(0, 10),
      form: { ...form },
    };
    setOfflineQueue((prev) => [item, ...prev]);
    setOfflineQueueNotice(dx.offlineQueueSavedToast);
    setTimeout(() => setOfflineQueueNotice(null), 4500);
  };

  const handleLoadOfflineItem = (item: QueuedOfflineComplaint) => {
    stopVoiceInput();
    handleStopSpeaking();
    setForm((prev) => ({ ...INITIAL_FORM, ...item.form, language: prev.language }));
    setOfflineQueue((prev) => prev.filter((q) => q.id !== item.id));
    setErrorMessage(null);
    setFieldErrors({});
    setDashboardTab("write");
    setStep("describe");
    requestAnimationFrame(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleRemoveOfflineItem = (id: string) => {
    setOfflineQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const handleToggleReadGuide = () => {
    if (isReadingGuide) {
      handleStopSpeaking();
      return;
    }
    stopVoiceInput();
    const locale = LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN";
    const guideText = `${t.step1Heading}. ${t.step1Subheading}`;
    speakText(
      guideText,
      locale,
      () => {
        setSpeakingMessageId(null);
        setIsReadingGuide(true);
      },
      () => setIsReadingGuide(false),
      (msg) => {
        if (msg) setErrorMessage(msg);
      },
      form.language,
    );
  };

  const startVoiceInput = (target: "complaint" | "answer") => {
    if (voiceRecorder.isRecording) {
      if (voiceTarget === target) {
        voiceRecorder.stopRecording();
        return;
      }
      voiceRecorder.cancelRecording();
    }
    if (voiceRecorder.isTranscribing) return;

    handleStopSpeaking();
    setErrorMessage(null);
    setVoiceTarget(target);
    voiceTargetRef.current = target;
    void voiceRecorder.startRecording();
  };

  const handleSpeakMessage = useCallback(
    (id: string, text: string) => {
      stopVoiceInput();
      setIsReadingGuide(false);
      const locale = LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN";
      speakText(
        text,
        locale,
        () => setSpeakingMessageId(id),
        () => setSpeakingMessageId(null),
        (msg) => {
          if (msg) setErrorMessage(msg);
        },
        form.language,
      );
    },
    [form.language, stopVoiceInput],
  );

  const handleAutoDetectFromVoice = async () => {
    if (!form.complaint.trim() || extractingVoice || busy) return;
    stopVoiceInput();
    setExtractingVoice(true);
    setErrorMessage(null);
    setAutoFillNotice(null);

    try {
      const extracted = await requestVoiceExtraction(form.complaint, form.language);
      setForm((prev) => {
        const nextState = extracted.state || prev.state;
        const { district, customDistrict } = applyDistrictToForm(
          prev,
          nextState,
          extracted.district ?? "",
        );
        return {
          ...prev,
          category: extracted.category ?? prev.category,
          state: nextState,
          district,
          customDistrict,
          town: extracted.town || prev.town,
          street: extracted.street || prev.street,
        };
      });
      setAutoFillNotice(t.autoFilledSuccess);
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setExtractingVoice(false);
    }
  };

  const generateDraftWithAnswers = async (
    collectedAnswers: AnswerEntry[],
    targetDraftLanguage = "English",
  ) => {
    setBusy(true);
    setErrorMessage(null);
    stopVoiceInput();
    handleStopSpeaking();

    try {
      const generated = await requestComplaintDraft(
        form,
        collectedAnswers,
        targetDraftLanguage,
        form.language,
      );
      setDraftData(generated);
      setEditableSubject(generated.subject);
      setEditableDraft(generated.draft);
      setDraftLanguage(generated.draftLanguage);
      setActiveSavedId(null);
      setStep("review");
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setBusy(false);
    }
  };

  const askNextQuestion = async (
    nextAnswers: AnswerEntry[],
    nextAsked: string[],
    currentMessages: ChatMessage[],
  ) => {
    setBusy(true);
    setErrorMessage(null);

    try {
      const data = await requestFollowupQuestion(form, nextAnswers, nextAsked);

      if (data.complete || !data.question.trim()) {
        const closingMsg: ChatMessage = {
          id: makeMessageId(),
          role: "assistant",
          text: t.closingMessage,
          timestamp: currentTimeLabel(),
        };
        setMessages([...currentMessages, closingMsg]);
        setCurrentQuestion("");
        await generateDraftWithAnswers(nextAnswers, "English");
        return;
      }

      if (isClientDuplicateQuestion(data.question, nextAsked)) {
        await generateDraftWithAnswers(nextAnswers, "English");
        return;
      }

      const questionId = makeMessageId();
      const questionMsg: ChatMessage = {
        id: questionId,
        role: "assistant",
        text: data.question,
        timestamp: currentTimeLabel(),
      };
      setMessages([...currentMessages, questionMsg]);
      setAskedQuestions([...nextAsked, data.question]);
      setCurrentQuestion(data.question);

      if (autoReadAloud && speechOutputSupported) {
        handleSpeakMessage(questionId, data.question);
      }
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setBusy(false);
    }
  };

  // Strictly enforces mandatory Full Name and 10-digit Phone Number before moving forward
  const beginComplaint = async () => {
    stopVoiceInput();
    handleStopSpeaking();

    const trimmedComplaint = form.complaint.trim();
    const trimmedName = form.name.trim();
    const phoneDigits = form.contact.replace(/\D/g, "");

    const nextFieldErrors: ComplaintFieldErrors = {
      complaint: !trimmedComplaint || trimmedComplaint.length < 6,
      name: trimmedName.length < 2,
      contact: phoneDigits.length < 10,
    };

    if (nextFieldErrors.complaint || nextFieldErrors.name || nextFieldErrors.contact) {
      setFieldErrors(nextFieldErrors);
      if (nextFieldErrors.complaint) {
        setErrorMessage(t.errEmptyComplaint);
        document.getElementById("complaint-textarea")?.focus();
      } else if (nextFieldErrors.name) {
        setErrorMessage(st.errMissingName);
        document.getElementById("name-input")?.focus();
      } else {
        setErrorMessage(st.errInvalidPhone);
        document.getElementById("contact-input")?.focus();
      }
      return;
    }

    setFieldErrors({});
    setAnswers([]);
    setAskedQuestions([]);
    setCurrentQuestion("");
    setAnswerInput("");
    setDraftData(null);
    setActiveSavedId(null);
    setErrorMessage(null);

    const introMsg: ChatMessage = {
      id: makeMessageId(),
      role: "assistant",
      text: t.introMessage,
      timestamp: currentTimeLabel(),
    };
    setMessages([introMsg]);
    setStep("clarify");

    await askNextQuestion([], [], [introMsg]);
  };

  const submitAnswer = async () => {
    const trimmed = answerInput.trim();
    if (!trimmed || busy) return;

    stopVoiceInput();
    handleStopSpeaking();

    const activeQ = currentQuestion || "Additional details";
    const updatedAnswers: AnswerEntry[] = [
      ...answers,
      { question: activeQ, answer: trimmed },
    ];
    const userMsg: ChatMessage = {
      id: makeMessageId(),
      role: "user",
      text: trimmed,
      timestamp: currentTimeLabel(),
    };
    const updatedMessages = [...messages, userMsg];

    setAnswers(updatedAnswers);
    setMessages(updatedMessages);
    setAnswerInput("");
    setCurrentQuestion("");

    await askNextQuestion(updatedAnswers, askedQuestions, updatedMessages);
  };

  const effectiveDistrict = resolveEffectiveDistrict(form);
  const locationLabel = [
    form.town.trim(),
    effectiveDistrict ? getLocalizedDistrictName(effectiveDistrict, form.language) : "",
    form.state ? getLocalizedStateName(form.state, form.language) : "",
  ]
    .filter(Boolean)
    .join(", ");

  const portalGuidance = useMemo(
    () =>
      resolvePortalGuidance(
        form.category,
        form.state,
        effectiveDistrict,
        form.complaint,
        draftData,
        t.emergency112Note,
        t.verificationDisclaimer,
        form.language,
      ),
    [
      form.category,
      form.state,
      effectiveDistrict,
      form.complaint,
      draftData,
      t.emergency112Note,
      t.verificationDisclaimer,
      form.language,
    ],
  );

  // Innovation 4: Personal Complaint Tracker handlers
  const handleSaveToTracker = () => {
    if (!editableDraft.trim()) return;
    if (activeSavedId) {
      setSavedRecords((prev) =>
        prev.map((rec) =>
          rec.id === activeSavedId
            ? { ...rec, subject: editableSubject, draft: editableDraft }
            : rec,
        ),
      );
      return;
    }

    const newId = makeMessageId();
    const newRecord: SavedComplaintRecord = {
      id: newId,
      createdAt: new Date().toISOString().slice(0, 10),
      mode: form.mode,
      language: form.language,
      category: form.category,
      subject: editableSubject.trim() || t.step3Heading,
      draft: editableDraft.trim(),
      state: form.state,
      district: effectiveDistrict,
      town: form.town.trim(),
      street: form.street.trim(),
      pincode: form.pincode.trim(),
      referenceNumber: form.referenceNumber.trim(),
      portalName: portalGuidance.primary.name,
      portalUrl: portalGuidance.primary.url,
      portalHelpline: portalGuidance.primary.helpline,
      trackingId: form.previousTicketId.trim(),
      status: "drafted",
      reminderDate: defaultReminderDateIso(15),
    };

    setSavedRecords((prev) => [newRecord, ...prev]);
    setActiveSavedId(newId);
  };

  const handleUpdateTrackerRecord = (id: string, patch: Partial<SavedComplaintRecord>) => {
    setSavedRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, ...patch } : rec)),
    );
  };

  const handleDeleteTrackerRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((rec) => rec.id !== id));
    if (activeSavedId === id) setActiveSavedId(null);
  };

  const handleLoadTrackerRecord = (record: SavedComplaintRecord) => {
    setForm((prev) => ({
      ...prev,
      mode: record.mode,
      previousTicketId: record.trackingId,
      category: record.category,
      state: record.state,
      district: record.district,
      customDistrict: "",
      town: record.town,
      street: record.street,
      pincode: record.pincode,
      referenceNumber: record.referenceNumber,
    }));
    const detectedDraftLang =
      /[^\u0000-\u024F\u2000-\u206F]/.test(record.draft) && record.language
        ? record.language
        : "English";
    setDraftData({
      subject: record.subject,
      draft: record.draft,
      suggestedAuthority: record.portalName,
      summaryPoints: [],
      draftLanguage: detectedDraftLang,
      primaryPortalId: "cpgrams",
      whyThisPortal: "",
      filingSteps: [],
      requiredDocuments: [],
    });
    setEditableSubject(record.subject);
    setEditableDraft(record.draft);
    setDraftLanguage(detectedDraftLang);
    setActiveSavedId(record.id);
    setDashboardTab("write");
    setStep("review");
    requestAnimationFrame(() => {
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleGenerateEscalationFromTracker = async (record: SavedComplaintRecord) => {
    if (escalatingId || busy) return;
    setEscalatingId(record.id);
    setErrorMessage(null);

    try {
      const escalation = await requestEscalationDraft(
        record,
        form.name.trim(),
        form.contact.trim(),
        form.language,
      );
      setDraftData(escalation);
      setEditableSubject(escalation.subject);
      setEditableDraft(escalation.draft);
      setDraftLanguage(escalation.draftLanguage);
      setActiveSavedId(null);
      setDashboardTab("write");
      setStep("review");
      requestAnimationFrame(() => {
        document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setEscalatingId(null);
    }
  };

  const handleGenerateRtiFromTracker = async (record: SavedComplaintRecord) => {
    if (rtiDraftingId || escalatingId || busy) return;
    setRtiDraftingId(record.id);
    setErrorMessage(null);

    try {
      const rtiForm: ComplaintFormState = {
        ...form,
        mode: "rti",
        previousTicketId: record.trackingId || record.referenceNumber || "",
        category: record.category,
        state: record.state,
        district: record.district,
        customDistrict: "",
        town: record.town,
        street: record.street,
        pincode: record.pincode,
        referenceNumber: record.referenceNumber,
        complaint: `Formal Right to Information (RTI) Act, 2005 status inquiry regarding unresolved public grievance "${record.subject}" filed on ${record.createdAt} with ${record.portalName}${record.trackingId ? ` (Tracking / Acknowledgement ID: ${record.trackingId})` : ""}. Please provide: (1) current status and daily progress report, (2) name and designation of the officer responsible for action, (3) copies of all file notings, inspection reports, and action-taken memos, and (4) expected date of resolution.`,
      };
      const rtiDraft = await requestComplaintDraft(
        rtiForm,
        [],
        "English",
        form.language,
      );
      setForm((prev) => ({
        ...prev,
        mode: "rti",
        previousTicketId: rtiForm.previousTicketId,
        category: rtiForm.category,
        state: rtiForm.state,
        district: rtiForm.district,
        customDistrict: "",
        town: rtiForm.town,
        street: rtiForm.street,
        pincode: rtiForm.pincode,
        referenceNumber: rtiForm.referenceNumber,
      }));
      setDraftData(rtiDraft);
      setEditableSubject(rtiDraft.subject);
      setEditableDraft(rtiDraft.draft);
      setDraftLanguage(rtiDraft.draftLanguage);
      setActiveSavedId(null);
      setDashboardTab("write");
      setStep("review");
      requestAnimationFrame(() => {
        document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (err) {
      setErrorMessage(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setRtiDraftingId(null);
    }
  };

  const handleImportTrackerRecords = (imported: SavedComplaintRecord[]) => {
    setSavedRecords((prev) => {
      const existingIds = new Set(prev.map((r) => r.id));
      const fresh = imported.filter((r) => !existingIds.has(r.id));
      return [...fresh, ...prev].slice(0, 60);
    });
  };

  const steps: Array<{ id: StepId; number: string; label: string; enabled: boolean }> = [
    { id: "describe", number: "01", label: t.step1Label, enabled: true },
    { id: "clarify", number: "02", label: t.step2Label, enabled: messages.length > 0 },
    { id: "review", number: "03", label: t.step3Label, enabled: draftData !== null },
  ];

  const handleSendPortalChat = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || portalChatBusy) return;

    const userMessage: PortalChatMessage = {
      id: makeMessageId(),
      role: "user",
      text: trimmed,
      timestamp: currentTimeLabel(),
    };

    const historyForApi = portalChatMessages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setPortalChatMessages((prev) => [...prev, userMessage]);
    setPortalChatBusy(true);
    setPortalChatError(null);

    try {
      const data = await requestPortalAssistantChat(trimmed, historyForApi, {
        uiLanguage: form.language,
        category: form.category,
        state: form.state,
        district: effectiveDistrict,
        portalName: portalGuidance.primary.name,
        portalUrl: portalGuidance.primary.url,
        portalHelpline: portalGuidance.primary.helpline,
        secondaryPortalName: portalGuidance.secondary?.name,
        suggestedAuthority: draftData?.suggestedAuthority,
        draftSubject: editableSubject || draftData?.subject,
        documentTitles: portalGuidance.requiredDocuments.map((d) => d.title),
      });

      const assistantMessage: PortalChatMessage = {
        id: makeMessageId(),
        role: "model",
        text: data.reply,
        timestamp: currentTimeLabel(),
      };
      setPortalChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setPortalChatError(resolveLocalizedErrorMessage(err, form.language));
    } finally {
      setPortalChatBusy(false);
    }
  };

  const handleOpenAssistant = (presetQuestion?: string) => {
    setPortalChatOpen(true);
    if (presetQuestion && presetQuestion.trim()) {
      void handleSendPortalChat(presetQuestion);
    }
  };

  // Live refs so Hands-Free Voice Flow tools always read the latest state with zero stale closures
  const formRef = useRef(form);
  formRef.current = form;
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const draftDataRef = useRef(draftData);
  draftDataRef.current = draftData;
  const editableSubjectRef = useRef(editableSubject);
  editableSubjectRef.current = editableSubject;
  const editableDraftRef = useRef(editableDraft);
  editableDraftRef.current = editableDraft;
  const portalGuidanceRef = useRef(portalGuidance);
  portalGuidanceRef.current = portalGuidance;
  const attachmentsRef = useRef(attachments);
  attachmentsRef.current = attachments;
  const coSignersRef = useRef(coSigners);
  coSignersRef.current = coSigners;
  const savedRecordsRef = useRef(savedRecords);
  savedRecordsRef.current = savedRecords;
  const pendingChannelConfirmRef = useRef(pendingChannelConfirm);
  pendingChannelConfirmRef.current = pendingChannelConfirm;

  const showLiveToast = useCallback((message: string) => {
    setLiveActionToast(message);
    window.setTimeout(() => {
      setLiveActionToast((prev) => (prev === message ? null : prev));
    }, 4500);
  }, []);

  const handleOpenLiveVoiceFlow = useCallback(() => {
    stopVoiceInput();
    handleStopSpeaking();
    setErrorMessage(null);
    setLiveActionToast(null);
    setPendingChannelConfirm(null);
    setDashboardTab("write");
    setLiveVoiceOpen(true);
  }, [handleStopSpeaking, stopVoiceInput]);

  // Live intake update from continuous hands-free speech — NEVER mutates dashboard form.language!
  const handleLiveIntakeUpdate = useCallback(
    (patch: LiveIntakePatch) => {
      setForm((prev) => {
        const nextState = patch.state || prev.state;
        const { district, customDistrict } = patch.district
          ? applyDistrictToForm(prev, nextState, patch.district)
          : patch.state && patch.state !== prev.state
            ? { district: "", customDistrict: "" }
            : { district: prev.district, customDistrict: prev.customDistrict };

        const updated: ComplaintFormState = {
          ...prev,
          // Strictly preserve the user's chosen dashboard header language
          language: prev.language,
          mode: patch.mode ?? prev.mode,
          category: patch.category ?? prev.category,
          state: nextState,
          district,
          customDistrict,
          town: patch.town || prev.town,
          street: patch.street || prev.street,
          pincode: patch.pincode || prev.pincode,
          name: patch.name || prev.name,
          contact: patch.contact || prev.contact,
          referenceNumber: patch.referenceNumber || prev.referenceNumber,
          complaint: patch.complaint || prev.complaint,
        };
        formRef.current = updated;
        return updated;
      });

      if (patch.followupAnswer) {
        setAnswers((prev) => {
          const next = [
            ...prev,
            {
              question: patch.followupQuestion || "Additional detail",
              answer: patch.followupAnswer!,
            },
          ];
          answersRef.current = next;
          return next;
        });
      }
      setFieldErrors({});
    },
    [applyDistrictToForm],
  );

  const handleLiveGenerateDraftCommand = useCallback(
    async (
      requestedDraftLang: string,
      spokenLanguage: string,
    ): Promise<LiveVoiceCommandResult> => {
      const latestForm = formRef.current;
      const latestAnswers = answersRef.current;
      const effectiveDistrict = resolveEffectiveDistrict(latestForm).trim();
      const contactDigits = latestForm.contact.replace(/\D/g, "");
      const missingFields: string[] = [];

      if (!latestForm.complaint.trim() || latestForm.complaint.trim().length < 8) {
        missingFields.push("complaint_problem_description");
      }
      if (!latestForm.state.trim()) {
        missingFields.push("state");
      }
      if (!effectiveDistrict) {
        missingFields.push("district_or_city");
      }
      if (!latestForm.town.trim() && !latestForm.street.trim()) {
        missingFields.push("town_area_street_or_landmark");
      }
      if (latestForm.name.trim().length < 2) {
        missingFields.push("citizen_full_name");
      }
      if (contactDigits.length < 10) {
        missingFields.push("mobile_number_10_digits");
      }

      if (missingFields.length > 0) {
        return {
          success: false,
          missingFields,
          error: `Do NOT generate the draft yet. Still missing required details: ${missingFields.join(", ")}. Ask the citizen politely for ONE missing item at a time in pure natural ${spokenLanguage || "spoken language"} (NEVER use English loanwords like 'state', 'district', 'area', or 'phone number' inside a regional language), save it with update_complaint_details, and call generate_official_draft only once all required fields are filled.`,
        };
      }

      const generated = await requestComplaintDraft(
        latestForm,
        latestAnswers,
        requestedDraftLang || "English",
        spokenLanguage || latestForm.language,
      );

      setDraftData(generated);
      setEditableSubject(generated.subject);
      setEditableDraft(generated.draft);
      setDraftLanguage(generated.draftLanguage);
      setActiveSavedId(null);
      setStep("review");

      draftDataRef.current = generated;
      editableSubjectRef.current = generated.subject;
      editableDraftRef.current = generated.draft;

      const resolvedGuidance = resolvePortalGuidance(
        latestForm.category,
        latestForm.state,
        resolveEffectiveDistrict(latestForm),
        latestForm.complaint,
        generated,
        t.emergency112Note,
        t.verificationDisclaimer,
        spokenLanguage || latestForm.language,
      );

      showLiveToast(vf.toastDraftReady);

      return {
        success: true,
        subject: generated.subject,
        suggestedAuthority: generated.suggestedAuthority,
        portalName: resolvedGuidance.primary.name,
        portalUrl: resolvedGuidance.primary.url,
        portalHelpline: resolvedGuidance.primary.helpline ?? "",
        officialEmail: resolvedGuidance.primary.officialEmail ?? "",
        officialWhatsApp:
          resolvedGuidance.primary.officialWhatsAppDisplay ??
          resolvedGuidance.primary.officialWhatsApp ??
          "",
        whyThisPortal: generated.whyThisPortal,
        draftPreview: generated.draft.slice(0, 700),
      };
    },
    [showLiveToast, t.emergency112Note, t.verificationDisclaimer, vf.toastDraftReady],
  );

  const handleLiveExecuteVoiceAction = useCallback(
    async (
      action: string,
      spokenLanguage?: string,
      args?: Record<string, unknown>,
    ): Promise<LiveVoiceCommandResult> => {
      const subject = editableSubjectRef.current.trim();
      const draftText = editableDraftRef.current.trim();
      const latestForm = formRef.current;
      const guidance = portalGuidanceRef.current;

      if (action === "end_voice_flow") {
        setPendingChannelConfirm(null);
        if (draftDataRef.current) {
          setDashboardTab("write");
          setStep("review");
        }
        return { success: true, closed: true };
      }

      if (action === "switch_dashboard_tab") {
        const rawTab = typeof args?.tab === "string" ? args.tab.trim().toLowerCase() : "write";
        const nextTab =
          rawTab === "saved" || rawTab === "portals" || rawTab === "write" ? rawTab : "write";
        setDashboardTab(nextTab);
        showLiveToast(`Switched dashboard to ${nextTab}.`);
        return { success: true, activeTab: nextTab };
      }

      if (action === "check_saved_complaints") {
        const recs = savedRecordsRef.current;
        return {
          success: true,
          count: recs.length,
          complaints: recs.slice(0, 5).map((r) => ({
            subject: r.subject,
            portalName: r.portalName,
            status: r.status,
            createdAt: r.createdAt,
            trackingId: r.trackingId || "",
          })),
        };
      }

      if (action === "open_portal_assistant") {
        setPortalChatOpen(true);
        return { success: true, message: "Opened the step-by-step Portal Submission Assistant." };
      }

      if (action === "reset_form") {
        handleResetForm();
        setPendingChannelConfirm(null);
        return { success: true, message: "Cleared the form for a fresh complaint." };
      }

      if (action === "add_cosigner") {
        const cleanName = typeof args?.coSignerName === "string" ? args.coSignerName.trim() : "";
        const cleanAddr =
          typeof args?.coSignerAddress === "string" ? args.coSignerAddress.trim() : "";
        if (!cleanName) {
          return {
            success: false,
            error: "Please tell me the neighbor's name to add as a co-signer.",
          };
        }
        setCoSigners((prev) => [
          ...prev,
          { id: `cs-${Date.now()}`, name: cleanName, address: cleanAddr },
        ]);
        showLiveToast(`Added co-signer: ${cleanName}`);
        return { success: true, addedCoSigner: cleanName };
      }

      if (action === "regenerate_draft_language") {
        const targetLang =
          typeof args?.draftLanguage === "string" && args.draftLanguage.trim()
            ? args.draftLanguage.trim()
            : spokenLanguage || "English";
        return handleLiveGenerateDraftCommand(targetLang, spokenLanguage || latestForm.language);
      }

      if (!draftText) {
        return {
          success: false,
          error: "No official draft has been generated yet. Generate the draft first.",
        };
      }

      if (action === "prepare_gmail_compose") {
        const spokenEmail =
          typeof args?.recipientEmail === "string" ? args.recipientEmail.trim() : "";
        const targetEmail =
          spokenEmail ||
          pendingChannelConfirmRef.current?.toEmail ||
          guidance.primary.officialEmail ||
          "";
        const payload: PendingLiveChannelConfirm = {
          channel: "gmail",
          toEmail: targetEmail,
          toWhatsApp: guidance.primary.officialWhatsApp ?? "",
          toWhatsAppDisplay: guidance.primary.officialWhatsAppDisplay ?? "",
          subject: subject || "Public Grievance Complaint",
          body: draftText,
        };
        setPendingChannelConfirm(payload);
        pendingChannelConfirmRef.current = payload;
        return {
          success: true,
          awaitingPermission: true,
          recipientEmail: targetEmail,
          subject: payload.subject,
          instruction: targetEmail
            ? `Tell the citizen the official email (${targetEmail}) and subject are ready, and ask explicit permission to open Gmail with To, Subject, and Letter pre-filled so they can just tap Send.`
            : "Tell the citizen the subject and letter are ready for Gmail, and invite them to say or type the recipient email ID and confirm to open Gmail.",
        };
      }

      if (action === "open_gmail_compose") {
        const spokenEmail =
          typeof args?.recipientEmail === "string" ? args.recipientEmail.trim() : "";
        const pending = pendingChannelConfirmRef.current;
        const targetEmail = spokenEmail || pending?.toEmail || guidance.primary.officialEmail || "";
        const mailSubject = pending?.subject || subject || "Public Grievance Complaint";
        const mailBody = pending?.body || draftText;
        const url = buildGmailComposeUrl(targetEmail, mailSubject, mailBody);
        openExternalUrlSafely(url);
        handleSaveToTracker();
        showLiveToast(cs.toastGmailOpened);
        return {
          success: true,
          openedGmail: true,
          recipientEmail: targetEmail,
          message:
            "Opened Gmail with To, Subject, and the full complaint letter pre-filled. The citizen can verify the email ID and tap Send.",
        };
      }

      if (action === "prepare_whatsapp_compose") {
        const payload: PendingLiveChannelConfirm = {
          channel: "whatsapp",
          toEmail: guidance.primary.officialEmail ?? "",
          toWhatsApp: guidance.primary.officialWhatsApp ?? "",
          toWhatsAppDisplay: guidance.primary.officialWhatsAppDisplay ?? "",
          subject: subject || "Public Grievance Complaint",
          body: draftText,
        };
        setPendingChannelConfirm(payload);
        pendingChannelConfirmRef.current = payload;
        return {
          success: true,
          awaitingPermission: true,
          officialWhatsApp: payload.toWhatsAppDisplay || payload.toWhatsApp,
          instruction: payload.toWhatsApp
            ? `Tell the citizen the verified official WhatsApp number (${payload.toWhatsAppDisplay || payload.toWhatsApp}) is ready with the full complaint message, and ask explicit permission to open WhatsApp.`
            : "Ask explicit permission to open WhatsApp with the full complaint message pre-filled.",
        };
      }

      if (action === "open_whatsapp_compose" || action === "share_whatsapp") {
        const pending = pendingChannelConfirmRef.current;
        const targetWa = pending?.toWhatsApp || guidance.primary.officialWhatsApp || "";
        const waSubject = pending?.subject || subject || "Public Grievance Complaint";
        const waBody = pending?.body || draftText;
        if (targetWa) {
          openExternalUrlSafely(buildOfficialWhatsAppUrl(targetWa, waSubject, waBody));
          handleSaveToTracker();
          showLiveToast(cs.toastWhatsAppOpened);
          return {
            success: true,
            openedWhatsApp: true,
            officialWhatsApp: guidance.primary.officialWhatsAppDisplay ?? targetWa,
            message: "Opened Official WhatsApp with the complaint message ready to tap Send.",
          };
        }
        await shareOfficialLetterPdf({
          subject: waSubject,
          draftText: waBody,
          portalName: guidance.primary.name,
          referenceNumber: latestForm.referenceNumber.trim() || undefined,
          attachments: attachmentsRef.current,
          coSigners: coSignersRef.current,
          filename: "makkalvoice-complaint-paper.pdf",
        });
        showLiveToast(vf.toastSharedWhatsapp);
        return { success: true, message: "Prepared WhatsApp share with the official letter." };
      }

      if (action === "read_draft") {
        return {
          success: true,
          instruction: "Read this official complaint letter clearly and warmly to the citizen.",
          subject,
          draft: draftText,
        };
      }

      if (action === "download_pdf") {
        downloadOfficialLetterPdf({
          subject,
          draftText,
          portalName: guidance.primary.name,
          referenceNumber: latestForm.referenceNumber.trim() || undefined,
          attachments: attachmentsRef.current,
          coSigners: coSignersRef.current,
          filename: "makkalvoice-official-letter.pdf",
        });
        showLiveToast(vf.toastPdfDownloaded);
        return { success: true, message: "Official A4 PDF has been downloaded." };
      }

      if (action === "download_txt") {
        const fullText = subject ? `Subject: ${subject}\n\n${draftText}` : draftText;
        const blob = new Blob([fullText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "makkalvoice-complaint-draft.txt";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showLiveToast("Downloaded plain text letter.");
        return { success: true, message: "Plain text letter downloaded." };
      }

      if (action === "print_letter") {
        setDashboardTab("write");
        setStep("review");
        window.setTimeout(() => window.print(), 300);
        return { success: true, message: "Opened the A4 print dialog." };
      }

      if (action === "copy_draft") {
        const fullText = subject ? `Subject: ${subject}\n\n${draftText}` : draftText;
        try {
          await navigator.clipboard.writeText(fullText);
        } catch {
          // Ignore clipboard permission restrictions
        }
        showLiveToast(vf.toastCopied);
        return { success: true, message: "Official letter copied to clipboard." };
      }

      if (action === "save_tracker") {
        handleSaveToTracker();
        showLiveToast(vf.toastSavedTracker);
        return { success: true, message: "Saved to the citizen's Complaint Tracker." };
      }

      if (action === "open_official_portal") {
        setDashboardTab("write");
        setStep("review");
        if (guidance.primary.url.startsWith("https://")) {
          openExternalUrlSafely(guidance.primary.url);
        }
        return {
          success: true,
          portalName: guidance.primary.name,
          portalUrl: guidance.primary.url,
          helpline: guidance.primary.helpline ?? "",
          message: `Opened ${guidance.primary.name}.`,
        };
      }

      return { success: false, error: `Unknown voice action: ${action}` };
    },
    [
      cs.toastGmailOpened,
      cs.toastWhatsAppOpened,
      handleLiveGenerateDraftCommand,
      handleResetForm,
      handleSaveToTracker,
      showLiveToast,
      vf.toastCopied,
      vf.toastPdfDownloaded,
      vf.toastSavedTracker,
      vf.toastSharedWhatsapp,
    ],
  );

  const handleHeroStartSpeaking = () => {
    handleOpenLiveVoiceFlow();
  };

  return (
    <div
      dir={t.isRtl ? "rtl" : "ltr"}
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col"
    >
      {/* Mandatory Google Maps Platform Demo Key Quota Banner (Case A) */}
      {mapsQuotaExceeded && (
        <div
          role="alert"
          className="no-print sticky top-0 z-50 bg-amber-50 border-b border-amber-300 text-amber-950 px-4 py-3 text-xs sm:text-sm"
        >
          <div className="max-w-5xl mx-auto flex items-start sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <p className="leading-relaxed">
                {it.mapsQuotaBanner}{" "}
                <a
                  href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline text-amber-900 hover:text-amber-950"
                >
                  {it.mapsQuotaLearnMore}
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMapsQuotaExceeded(false)}
              className="p-1 text-amber-800 hover:text-amber-950 rounded-lg shrink-0"
              aria-label={it.mapsQuotaDismiss}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* PWA Offline Banner */}
      <OfflineIndicator it={it} />

      {/* Top Bar Contract: Single row, 3 zones aligned with workspace max-w-5xl */}
      <header className="no-print sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3 sm:gap-6">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-lg sm:text-xl font-bold tracking-tight text-slate-950 whitespace-nowrap shrink-0"
          >
            MakkalVoice
          </a>

          {/* Zone 2: Clean 3-link primary navigation synced to dashboard tabs */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium"
          >
            <button
              type="button"
              onClick={() => navigateToDashboardTab("write")}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                dashboardTab === "write"
                  ? "text-blue-700 font-semibold border-b-2 border-blue-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.navDraft}
            </button>
            <button
              type="button"
              onClick={() => navigateToDashboardTab("saved")}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                dashboardTab === "saved"
                  ? "text-blue-700 font-semibold border-b-2 border-blue-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {it.navTracker}
              {savedRecords.length > 0 ? ` (${savedRecords.length})` : ""}
            </button>
            <button
              type="button"
              onClick={() => navigateToDashboardTab("portals")}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                dashboardTab === "portals"
                  ? "text-blue-700 font-semibold border-b-2 border-blue-700"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {t.navPortals}
            </button>
          </nav>

          {/* Zone 3: PWA Install + Compact Language Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <PWAInstallButton it={it} />
            <label htmlFor="header-language-select" className="sr-only">
              {t.chooseLanguageLabel}
            </label>
            <Globe className="w-4 h-4 text-slate-500 hidden sm:block shrink-0" aria-hidden="true" />
            <select
              id="header-language-select"
              value={form.language}
              onChange={(e) => handleLanguageSelect(e.target.value)}
              disabled={busy}
              className="h-10 max-w-[140px] sm:max-w-[180px] ps-2.5 pe-6 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50 border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 whitespace-nowrap shrink-0"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.name} value={lang.name}>
                  {lang.nativeLabel} — {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* One Unified Animated Constitutional & Civic Hero Banner */}
        <section className="no-print relative overflow-hidden bg-slate-950 border-b border-slate-200/80">
          {/* Smoothly cross-fading full-bleed editorial civic photographs */}
          <div aria-hidden="true" className="pointer-events-none select-none absolute inset-0">
            {HERO_ANIMATED_BANNERS.map((src, idx) => {
              const isActive = idx === activeHeroSlide;
              return (
                <img
                  key={src}
                  src={src}
                  alt=""
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[1800ms] ease-out ${
                    isActive ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  }`}
                />
              );
            })}
          </div>

          {/* Crisp left-to-right scrim keeping text effortless to read while showcasing the banner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/35"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-11 sm:py-16">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-wide text-blue-300">
                {t.heroKicker}
              </p>

              <h1 className="mt-2 font-display text-[1.95rem] sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-white [text-wrap:balance] leading-[1.13]">
                {t.heroTitle}
              </h1>

              <p className="mt-3 text-base text-slate-200 leading-relaxed max-w-xl">
                {t.heroSubtitle}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-300">
                <span>{t.heroMeta1}</span>
                <span aria-hidden="true">·</span>
                <span>{t.heroMeta2}</span>
                <span aria-hidden="true">·</span>
                <span>{t.heroMeta3}</span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="button"
                  onClick={handleHeroStartSpeaking}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-sm transition-all active:scale-[0.99] whitespace-nowrap shrink-0 min-h-[52px]"
                >
                  <AudioLines className="w-5 h-5" aria-hidden="true" />
                  {vf.launchHeroBtn}
                </button>

                <button
                  type="button"
                  onClick={() => navigateToDashboardTab("write", "workspace")}
                  className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-4 py-3 text-sm font-medium text-white hover:bg-white/20 bg-white/10 border border-white/25 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px]"
                >
                  {t.heroCta}
                  <ArrowDown className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Clean, Beginner-Friendly Dashboard Workspace */}
        <section id="workspace" className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-10">
          {/* Clear 3-Section Dashboard Navigation (Works cleanly on Mobile + Desktop) */}
          <div
            role="tablist"
            aria-label="Dashboard sections"
            className="no-print mb-6 grid grid-cols-3 gap-2 p-1.5 bg-slate-200/70 rounded-2xl"
          >
            <button
              type="button"
              role="tab"
              aria-selected={dashboardTab === "write"}
              onClick={() => setDashboardTab("write")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all min-h-[48px] ${
                dashboardTab === "write"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileEdit className="w-4 h-4 text-blue-700 shrink-0 hidden sm:block" aria-hidden="true" />
              <span className="truncate">{t.navDraft}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={dashboardTab === "saved"}
              onClick={() => setDashboardTab("saved")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all min-h-[48px] ${
                dashboardTab === "saved"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-blue-700 shrink-0 hidden sm:block" aria-hidden="true" />
              <span className="truncate">
                {it.navTracker}
                {savedRecords.length > 0 ? ` (${savedRecords.length})` : ""}
              </span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={dashboardTab === "portals"}
              onClick={() => setDashboardTab("portals")}
              className={`inline-flex items-center justify-center gap-2 px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all min-h-[48px] ${
                dashboardTab === "portals"
                  ? "bg-white text-slate-950 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Landmark className="w-4 h-4 text-blue-700 shrink-0 hidden sm:block" aria-hidden="true" />
              <span className="truncate">{t.navPortals}</span>
            </button>
          </div>

          {/* VIEW 1: Guided 3-Step Complaint Writer */}
          {dashboardTab === "write" && (
            <>
              {/* Calm 3-Step Progress Bar */}
              <nav
                aria-label="Complaint drafting steps"
                className="no-print mb-6 grid grid-cols-3 border border-slate-200/90 bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden divide-x divide-slate-200/80"
              >
                {steps.map((s, idx) => {
                  const isCurrent = step === s.id;
                  const currentIdx = steps.findIndex((item) => item.id === step);
                  const isCompleted = idx < currentIdx && s.enabled;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      disabled={!s.enabled || busy}
                      onClick={() => {
                        if (s.enabled) {
                          stopVoiceInput();
                          handleStopSpeaking();
                          setStep(s.id);
                        }
                      }}
                      className={`px-2.5 sm:px-5 py-3.5 text-start transition-colors min-h-[52px] ${
                        isCurrent
                          ? "bg-slate-900 text-white"
                          : s.enabled
                            ? "bg-white text-slate-800 hover:bg-slate-50"
                            : "bg-slate-50/70 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2.5">
                        {isCompleted ? (
                          <Check
                            className="w-4 h-4 text-emerald-600 shrink-0"
                            aria-hidden="true"
                          />
                        ) : s.id === "describe" ? (
                          <Mic
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? "text-blue-300" : "text-slate-400"
                            }`}
                            aria-hidden="true"
                          />
                        ) : s.id === "clarify" ? (
                          <MessageSquare
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? "text-blue-300" : "text-slate-400"
                            }`}
                            aria-hidden="true"
                          />
                        ) : (
                          <FileCheck2
                            className={`w-4 h-4 shrink-0 ${
                              isCurrent ? "text-blue-300" : "text-slate-400"
                            }`}
                            aria-hidden="true"
                          />
                        )}
                        <span
                          className={`hidden sm:inline font-mono text-xs tabular-nums shrink-0 ${
                            isCurrent ? "text-blue-300" : "text-slate-400"
                          }`}
                        >
                          {s.number}
                        </span>
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {s.label}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              {step === "describe" && (
                <ComplaintForm
                  t={t}
                  st={st}
                  it={it}
                  form={form}
                  onChange={handleFieldChange}
                  onApplySample={handleApplySample}
                  onReset={handleResetForm}
                  onSubmit={beginComplaint}
                  onAutoDetectFromVoice={handleAutoDetectFromVoice}
                  extractingVoice={extractingVoice}
                  autoFillNotice={autoFillNotice}
                  onScanEvidenceFile={(file) => void handleScanEvidenceFile(file)}
                  scanningEvidence={scanningEvidence}
                  scanPreviewUrl={scanPreviewUrl}
                  scanNotice={scanNotice}
                  onGpsLocationResolved={handleGpsLocationResolved}
                  busy={busy}
                  isListening={voiceRecorder.isRecording && voiceTarget === "complaint"}
                  isTranscribing={voiceRecorder.isTranscribing && voiceTarget === "complaint"}
                  voiceAudioLevel={voiceRecorder.audioLevel}
                  voiceElapsedSeconds={voiceRecorder.elapsedSeconds}
                  voiceLiveTranscript={voiceTarget === "complaint" ? voiceRecorder.liveTranscript : ""}
                  speechSupported={speechSupported}
                  onToggleVoice={() => startVoiceInput("complaint")}
                  onOpenLiveVoiceFlow={handleOpenLiveVoiceFlow}
                  speechOutputSupported={speechOutputSupported}
                  isReadingGuide={isReadingGuide}
                  onToggleReadGuide={handleToggleReadGuide}
                  errorMessage={errorMessage}
                  fieldErrors={fieldErrors}
                  isOffline={isOffline}
                  offlineQueue={offlineQueue}
                  offlineQueueNotice={offlineQueueNotice}
                  onSaveToOfflineQueue={handleSaveToOfflineQueue}
                  onLoadOfflineItem={handleLoadOfflineItem}
                  onRemoveOfflineItem={handleRemoveOfflineItem}
                />
              )}

              {step === "clarify" && (
                <ClarifyChat
                  t={t}
                  language={form.language}
                  categoryLabel={t.categories[form.category] ?? form.category}
                  locationLabel={locationLabel}
                  messages={messages}
                  answers={answers}
                  currentQuestion={currentQuestion}
                  answerInput={answerInput}
                  onAnswerInputChange={setAnswerInput}
                  onSubmitAnswer={submitAnswer}
                  onSkipToDraft={() => generateDraftWithAnswers(answers, "English")}
                  onBackToForm={() => {
                    stopVoiceInput();
                    handleStopSpeaking();
                    setStep("describe");
                  }}
                  busy={busy}
                  isListening={voiceRecorder.isRecording && voiceTarget === "answer"}
                  isTranscribing={voiceRecorder.isTranscribing && voiceTarget === "answer"}
                  voiceAudioLevel={voiceRecorder.audioLevel}
                  voiceElapsedSeconds={voiceRecorder.elapsedSeconds}
                  voiceLiveTranscript={voiceTarget === "answer" ? voiceRecorder.liveTranscript : ""}
                  speechSupported={speechSupported}
                  onToggleVoice={() => startVoiceInput("answer")}
                  isSpeakingId={speakingMessageId}
                  speechOutputSupported={speechOutputSupported}
                  autoReadAloud={autoReadAloud}
                  onToggleAutoRead={() => setAutoReadAloud((v) => !v)}
                  onSpeakMessage={handleSpeakMessage}
                  onStopSpeaking={handleStopSpeaking}
                  onRetryQuestion={() => void askNextQuestion(answers, askedQuestions, messages)}
                  errorMessage={errorMessage}
                />
              )}

              {step === "review" && draftData && (
                <DraftReview
                  t={t}
                  st={st}
                  it={it}
                  form={form}
                  draftData={draftData}
                  subject={editableSubject}
                  draftText={editableDraft}
                  onSubjectChange={setEditableSubject}
                  onDraftTextChange={setEditableDraft}
                  userLanguage={form.language}
                  draftLanguage={draftLanguage}
                  onRegenerate={(lang) => generateDraftWithAnswers(answers, lang)}
                  onBackToClarify={() => setStep("clarify")}
                  onBackToForm={() => setStep("describe")}
                  portalGuidance={portalGuidance}
                  busy={busy}
                  errorMessage={errorMessage}
                  onOpenAssistant={handleOpenAssistant}
                  attachments={attachments}
                  onAttachmentsChange={setAttachments}
                  coSigners={coSigners}
                  onCoSignersChange={setCoSigners}
                  isSavedToTracker={activeSavedId !== null}
                  onSaveToTracker={handleSaveToTracker}
                />
              )}
            </>
          )}

          {/* VIEW 2: Saved Complaints & Follow-Up Tracker */}
          {dashboardTab === "saved" && (
            <ComplaintTrackerSection
              it={it}
              language={form.language}
              visitPortalLabel={t.visitPortal}
              records={savedRecords}
              escalatingId={escalatingId}
              rtiDraftingId={rtiDraftingId}
              onUpdateRecord={handleUpdateTrackerRecord}
              onDeleteRecord={handleDeleteTrackerRecord}
              onGenerateEscalation={(rec) => void handleGenerateEscalationFromTracker(rec)}
              onGenerateRtiInquiry={(rec) => void handleGenerateRtiFromTracker(rec)}
              onLoadRecordIntoReview={handleLoadTrackerRecord}
              onImportRecords={handleImportTrackerRecords}
            />
          )}

          {/* VIEW 3: Verified Official Portals, National Helplines & How It Works */}
          {dashboardTab === "portals" && (
            <div className="space-y-6">
              {/* Squared National Toll-Free Helplines Strip */}
              <section
                aria-labelledby="national-helplines-heading"
                className="no-print bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <h2
                      id="national-helplines-heading"
                      className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-950"
                    >
                      {dx.helplinesTitle}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                      {dx.helplinesSub}
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { number: "112", label: dx.helplineEmergency },
                    { number: "1930", label: dx.helplineCyber },
                    { number: "1915", label: dx.helplineConsumer },
                    { number: "139", label: dx.helplineRailway },
                    { number: "181", label: dx.helplineWomen },
                    { number: "1098", label: dx.helplineChild },
                  ].map((item) => {
                    const HelplineIcon = getHelplineIcon(item.number);
                    return (
                      <a
                        key={item.number}
                        href={`tel:${item.number}`}
                        aria-label={`${dx.tapToCallLabel} ${item.number} — ${item.label}`}
                        className="group min-h-[104px] flex flex-col justify-between p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-blue-50/60 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200/90 text-blue-700 group-hover:border-blue-200 shrink-0">
                            <HelplineIcon className="w-4 h-4" aria-hidden="true" />
                          </span>
                          <PhoneCall
                            className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 shrink-0"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-2.5">
                          <span className="block font-mono text-lg font-bold tracking-tight tabular-nums text-slate-950 group-hover:text-blue-800">
                            {item.number}
                          </span>
                          <span className="mt-0.5 block text-xs font-medium text-slate-700 leading-snug line-clamp-2">
                            {item.label}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>

              <section
                id="official-portals"
                className="no-print bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
              >
                <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">
                  {t.commonPortalsTitle}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t.commonPortalsSub}
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {FEATURED_OFFICIAL_PORTALS.map((rawPortal) => {
                    const portal = localizePortalEntry(rawPortal, form.language);
                    const langSupport = rawPortal.id
                      ? PORTAL_LANGUAGE_SUPPORT[rawPortal.id]
                      : undefined;
                    const langSupportLabel =
                      langSupport?.supportedNoteKey === "tamilAndEnglish"
                        ? st.portalLangTamilAndEnglish
                        : langSupport?.supportedNoteKey === "hindiAndEnglish"
                          ? st.portalLangHindiAndEnglish
                          : langSupport?.supportedNoteKey === "multiIndian"
                            ? st.portalLangMultiIndian
                            : st.portalLangEnglishOnly;

                    const PortalIcon = getPortalIcon(rawPortal.id);

                    return (
                      <div
                        key={portal.url}
                        className="bg-slate-50/60 border border-slate-200/90 rounded-xl p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
                      >
                        <div>
                          <div className="flex items-start gap-3">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white border border-slate-200 text-blue-700 shrink-0 mt-0.5">
                              <PortalIcon className="w-4 h-4" aria-hidden="true" />
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs text-slate-500">{portal.authorityScope}</p>
                              <h3 className="mt-0.5 font-display text-base font-semibold text-slate-950">
                                {portal.name}
                              </h3>
                            </div>
                          </div>
                          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                            {portal.description}
                          </p>
                          <p className="mt-2.5 text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                            <Globe
                              className="w-3.5 h-3.5 text-blue-700 mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            <span>{langSupportLabel}</span>
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between gap-4">
                          <span className="text-xs font-mono tabular-nums text-slate-500 truncate">
                            {portal.helpline
                              ? `${t.helplineLabel}: ${portal.helpline}`
                              : portal.domain ?? portal.url.replace("https://", "")}
                          </span>
                          <a
                            href={portal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 whitespace-nowrap shrink-0"
                          >
                            {t.visitPortal}
                            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section
                id="how-it-works"
                className="no-print bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
              >
                <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                  {t.howItWorksTitle}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
                  {t.howItWorksSub}
                </p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="pt-4 border-t border-slate-200">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-700 mb-3">
                      <AudioLines className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{t.how1Title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{t.how1Desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-700 mb-3">
                      <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{t.how2Title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{t.how2Desc}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-700 mb-3">
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">{t.how3Title}</h3>
                    <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{t.how3Desc}</p>
                  </div>
                </div>
              </section>
            </div>
          )}
        </section>

        {/* Subtle Constitutional Rights & Civic Governance Visual Banner Strip */}
        <section className="no-print max-w-5xl mx-auto px-4 sm:px-6 pb-8">
          <div className="mb-3.5">
            <h2 className="font-display text-base sm:text-lg font-bold tracking-tight text-slate-950">
              {cs.stripHeading}
            </h2>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{cs.stripSub}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                src: CONSTITUTION_BANNER_PATH,
                title: cs.slide1Title,
                caption: cs.slide1Caption,
                tab: "write" as const,
              },
              {
                src: LAW_ORDER_BANNER_PATH,
                title: cs.slide2Title,
                caption: cs.slide2Caption,
                tab: "portals" as const,
              },
              {
                src: CITIZEN_VOICE_BANNER_PATH,
                title: cs.slide3Title,
                caption: cs.slide3Caption,
                tab: "saved" as const,
              },
            ].map((card) => (
              <button
                key={card.src}
                type="button"
                onClick={() => navigateToDashboardTab(card.tab, "workspace")}
                className="group text-start rounded-2xl overflow-hidden bg-white border border-slate-200/90 hover:border-blue-300 shadow-[0_1px_3px_rgba(15,23,42,0.05)] hover:shadow-md transition-all"
              >
                <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
                  <img
                    src={card.src}
                    alt={card.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5">
                  <h3 className="font-display text-sm font-semibold text-slate-950 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {card.caption}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Quiet Privacy & Trust Strip */}
        <section id="privacy" className="no-print border-t border-slate-200/80 bg-white py-9">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="font-display text-base sm:text-lg font-semibold text-slate-950">
                  {t.privacyTitle}
                </h2>
                <div className="mt-2.5 grid grid-cols-1 md:grid-cols-3 gap-5 text-sm text-slate-600 leading-relaxed">
                  <p>
                    <strong className="font-medium text-slate-900">
                      {t.privacy1Title}:
                    </strong>{" "}
                    {st.privacyRequiredLocalDesc}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-900">
                      {t.privacy2Title}:
                    </strong>{" "}
                    {t.privacy2Desc}
                  </p>
                  <p>
                    <strong className="font-medium text-slate-900">
                      {t.privacy3Title}:
                    </strong>{" "}
                    {t.privacy3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Quiet Footer */}
      <footer className="no-print border-t border-slate-200/80 bg-slate-50 pt-7 pb-24 sm:pb-9">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footerText}</p>
          <div className="flex items-center gap-5 shrink-0">
            <button
              type="button"
              onClick={() => navigateToDashboardTab("write")}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {t.navDraft}
            </button>
            <button
              type="button"
              onClick={() => navigateToDashboardTab("saved")}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {it.navTracker}
            </button>
            <button
              type="button"
              onClick={() => navigateToDashboardTab("portals")}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              {t.navPortals}
            </button>
            <a href="#privacy" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              {t.navPrivacy}
            </a>
          </div>
        </div>
      </footer>

      {/* Hands-Free Continuous Gemini Live Voice Flow Studio */}
      <div className="no-print">
        <LiveVoiceFlowModal
          open={liveVoiceOpen}
          onClose={() => {
            setLiveVoiceOpen(false);
            setPendingChannelConfirm(null);
          }}
          t={t}
          dashboardLanguage={form.language}
          form={form}
          draftData={draftData}
          portalName={portalGuidance.primary.name}
          portalUrl={portalGuidance.primary.url}
          officialEmail={portalGuidance.primary.officialEmail}
          officialWhatsApp={portalGuidance.primary.officialWhatsApp}
          officialWhatsAppDisplay={portalGuidance.primary.officialWhatsAppDisplay}
          actionToast={liveActionToast}
          pendingChannelConfirm={pendingChannelConfirm}
          onUpdatePendingEmail={(nextEmail) => {
            setPendingChannelConfirm((prev) => {
              const updated = prev ? { ...prev, toEmail: nextEmail } : prev;
              pendingChannelConfirmRef.current = updated;
              return updated;
            });
          }}
          onCancelPendingChannel={() => {
            setPendingChannelConfirm(null);
            pendingChannelConfirmRef.current = null;
          }}
          onConfirmOpenChannel={(channel) => {
            handleSaveToTracker();
            showLiveToast(channel === "gmail" ? cs.toastGmailOpened : cs.toastWhatsAppOpened);
          }}
          onIntakeUpdate={handleLiveIntakeUpdate}
          onGenerateDraftCommand={handleLiveGenerateDraftCommand}
          onExecuteVoiceAction={handleLiveExecuteVoiceAction}
          onOpenDraftScreen={() => {
            setDashboardTab("write");
            if (draftDataRef.current) {
              setStep("review");
            }
            requestAnimationFrame(() => {
              document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
            });
          }}
        />
      </div>

      {/* Multi-turn Gemini Portal & Submission Assistant Chatbot */}
      <div className="no-print">
        <PortalAssistantChat
          open={portalChatOpen}
          onOpenChange={setPortalChatOpen}
          st={st}
          language={form.language}
          portalName={portalGuidance.primary.name}
          hasActiveDraft={draftData !== null}
          messages={portalChatMessages}
          busy={portalChatBusy}
          errorMessage={portalChatError}
          onSendMessage={handleSendPortalChat}
          onClearChat={() => {
            setPortalChatMessages([]);
            setPortalChatError(null);
          }}
          voiceUnsupportedText={t.voiceUnsupported}
        />
      </div>
    </div>
  );
}
