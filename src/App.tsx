import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  Check,
  ExternalLink,
  Globe,
  Mic,
  Shield,
  X,
} from "lucide-react";
import { ClarifyChat } from "./components/ClarifyChat";
import { ComplaintForm, type ComplaintFieldErrors } from "./components/ComplaintForm";
import { ComplaintTrackerSection } from "./components/ComplaintTrackerSection";
import { DraftReview } from "./components/DraftReview";
import { HandsFreeVoiceModal } from "./components/HandsFreeVoiceModal";
import { PortalAssistantChat } from "./components/PortalAssistantChat";
import { OfflineIndicator, PWAInstallButton } from "./components/PWAInstallButton";
import { INDIA_STATE_DISTRICTS } from "./data/indiaLocations";
import { getInnovationStrings } from "./data/innovationTranslations";
import {
  LANGUAGES,
  LANGUAGE_LOCALE_MAP,
  SAMPLE_SCENARIOS,
} from "./data/languages";
import { getLocalizedDistrictName, getLocalizedStateName } from "./data/localizedLocations";
import { localizePortalEntry, PORTAL_LANGUAGE_SUPPORT } from "./data/localizedPortals";
import { FEATURED_OFFICIAL_PORTALS, resolvePortalGuidance } from "./data/portals";
import { getSubmissionStrings } from "./data/submissionTranslations";
import { getUiStrings } from "./data/translations";
import type {
  AnswerEntry,
  ChatMessage,
  ComplaintFormState,
  DraftResponse,
  EvidenceAttachment,
  GpsLocationResult,
  PortalChatMessage,
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
import { compressImageForPortal } from "./utils/mediaTools";
import {
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  mapSpeechError,
  speakText,
  stopSpeakingText,
  type SpeechRecognitionLike,
} from "./utils/speech";
import {
  clearAutosavedForm,
  defaultReminderDateIso,
  loadAutosavedForm,
  loadSavedComplaints,
  persistSavedComplaints,
  saveAutosavedForm,
} from "./utils/storage";

const HERO_IMAGE_PATH = "/src/assets/images/hero_makkalvoice_1795284698438.jpg";
const HERO_BANNER_PATH = "/src/assets/images/civic_voice_backdrop_1795320159387.jpg";

const INITIAL_FORM: ComplaintFormState = {
  mode: "complaint",
  previousTicketId: "",
  language: "Tamil",
  category: "Civic Issues",
  state: "Tamil Nadu",
  district: "Chennai",
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

export default function App() {
  const [form, setForm] = useState<ComplaintFormState>(() => {
    const saved = loadAutosavedForm();
    return saved ? { ...INITIAL_FORM, ...saved } : INITIAL_FORM;
  });
  const [step, setStep] = useState<StepId>("describe");
  const [autosaved, setAutosaved] = useState(false);

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

  // Innovation 3: Proof Attachments for Photo Compressor & PDF Bundler
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>([]);

  // Innovation 4: Personal Complaint Tracker Vault
  const [savedRecords, setSavedRecords] = useState<SavedComplaintRecord[]>(() =>
    loadSavedComplaints(),
  );
  const [activeSavedId, setActiveSavedId] = useState<string | null>(null);
  const [escalatingId, setEscalatingId] = useState<string | null>(null);

  // Innovation 7: Hands-Free Voice Mode modal
  const [handsFreeOpen, setHandsFreeOpen] = useState(false);

  // Google Maps Demo Key Quota Banner (Case A mandatory handler)
  const [mapsQuotaExceeded, setMapsQuotaExceeded] = useState(false);

  // Multi-turn Gemini Portal Submission Assistant Chatbot state
  const [portalChatOpen, setPortalChatOpen] = useState(false);
  const [portalChatMessages, setPortalChatMessages] = useState<PortalChatMessage[]>([]);
  const [portalChatBusy, setPortalChatBusy] = useState(false);
  const [portalChatError, setPortalChatError] = useState<string | null>(null);

  // UI & Async state
  const [busy, setBusy] = useState(false);
  const [extractingVoice, setExtractingVoice] = useState(false);
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ComplaintFieldErrors>({});
  const [heroImgError, setHeroImgError] = useState(false);
  const [bannerImgError, setBannerImgError] = useState(false);

  // Voice input & speech output state
  const [voiceTarget, setVoiceTarget] = useState<"complaint" | "answer" | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [isReadingGuide, setIsReadingGuide] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const t = useMemo(() => getUiStrings(form.language), [form.language]);
  const st = useMemo(() => getSubmissionStrings(form.language), [form.language]);
  const it = useMemo(() => getInnovationStrings(form.language), [form.language]);
  const speechSupported = useMemo(() => isSpeechRecognitionSupported(), []);
  const speechOutputSupported = useMemo(() => isSpeechSynthesisSupported(), []);

  // Listen for Google Maps Platform Demo Key Quota events (Tier 1 + Tier 2)
  useEffect(() => {
    const onQuota = () => setMapsQuotaExceeded(true);
    window.addEventListener("gmp-quota-exceeded", onQuota);
    return () => window.removeEventListener("gmp-quota-exceeded", onQuota);
  }, []);

  // Innovation 6: Automatic Offline Form Auto-Save in localStorage
  useEffect(() => {
    const hasContent =
      form.complaint.trim().length > 0 ||
      form.name.trim().length > 0 ||
      form.contact.trim().length > 0 ||
      form.town.trim().length > 0 ||
      form.street.trim().length > 0;
    if (!hasContent) return;
    const timer = setTimeout(() => {
      saveAutosavedForm(form);
      setAutosaved(true);
    }, 450);
    return () => clearTimeout(timer);
  }, [form]);

  // Persist Complaint Tracker updates
  useEffect(() => {
    persistSavedComplaints(savedRecords);
  }, [savedRecords]);

  // Sync HTML lang and dir attributes whenever user changes dashboard language
  useEffect(() => {
    const locale = LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN";
    document.documentElement.lang = locale;
    document.documentElement.dir = t.isRtl ? "rtl" : "ltr";
  }, [form.language, t.isRtl]);

  const stopVoiceInput = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // Ignore already stopped recognition
      }
      recognitionRef.current = null;
    }
    setVoiceTarget(null);
    setInterimTranscript("");
  }, []);

  const handleStopSpeaking = useCallback(() => {
    stopSpeakingText();
    setSpeakingMessageId(null);
    setIsReadingGuide(false);
  }, []);

  // Cleanup browser audio handles on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
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
      setErrorMessage(err instanceof Error ? err.message : it.scanErrorGeneric);
    } finally {
      setScanningEvidence(false);
    }
  };

  // Innovation 7: Hands-Free Voice Assistant completion
  const handleHandsFreeComplete = (spokenComplaint: string, spokenLocation: string) => {
    setForm((prev) => ({
      ...prev,
      complaint: spokenComplaint || prev.complaint,
      street: spokenLocation && !prev.street.trim() ? spokenLocation : prev.street,
    }));
    setStep("describe");
    document.getElementById("complaint-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleApplySample = (sampleIndex: number) => {
    const sample = SAMPLE_SCENARIOS[sampleIndex];
    if (!sample) return;
    stopVoiceInput();
    handleStopSpeaking();
    setForm((prev) => ({
      ...prev,
      mode: "complaint",
      language: sample.language,
      category: sample.category,
      state: sample.state,
      district: sample.district,
      customDistrict: "",
      town: sample.town,
      street: sample.street,
      complaint: sample.complaint,
    }));
    setErrorMessage(null);
    setFieldErrors({});
    setAutoFillNotice(null);
  };

  const handleResetForm = () => {
    stopVoiceInput();
    handleStopSpeaking();
    clearAutosavedForm();
    setAutosaved(false);
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
    setScanPreviewUrl(null);
    setScanNotice(null);
    setPortalChatMessages([]);
    setPortalChatError(null);
    setErrorMessage(null);
    setFieldErrors({});
    setAutoFillNotice(null);
    setStep("describe");
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
      (msg) => setErrorMessage(msg),
    );
  };

  const startVoiceInput = (target: "complaint" | "answer") => {
    if (voiceTarget === target) {
      stopVoiceInput();
      return;
    }

    stopVoiceInput();
    handleStopSpeaking();
    setErrorMessage(null);

    const SpeechCtor = getSpeechRecognitionConstructor();
    if (!SpeechCtor) {
      setErrorMessage(t.voiceUnsupported);
      return;
    }

    try {
      const recognition = new SpeechCtor();
      recognition.lang = LANGUAGE_LOCALE_MAP[form.language] ?? "en-IN";
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setVoiceTarget(target);
        setInterimTranscript("");
      };

      recognition.onresult = (event) => {
        let finalChunk = "";
        let interimChunk = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const transcript = event.results[i][0]?.transcript ?? "";
          if (event.results[i].isFinal) {
            finalChunk += transcript;
          } else {
            interimChunk += transcript;
          }
        }

        setInterimTranscript(interimChunk.trim());

        if (finalChunk.trim()) {
          if (target === "complaint") {
            setForm((prev) => ({
              ...prev,
              complaint: prev.complaint.trim()
                ? `${prev.complaint.trim()} ${finalChunk.trim()}`
                : finalChunk.trim(),
            }));
          } else {
            setAnswerInput((prev) =>
              prev.trim() ? `${prev.trim()} ${finalChunk.trim()}` : finalChunk.trim(),
            );
          }
        }
      };

      recognition.onerror = (event) => {
        const msg = mapSpeechError(event.error);
        if (msg) setErrorMessage(msg);
        setVoiceTarget(null);
        setInterimTranscript("");
      };

      recognition.onend = () => {
        setVoiceTarget(null);
        setInterimTranscript("");
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setVoiceTarget(null);
      setErrorMessage("Voice input failed to start. Please try again or type directly.");
    }
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
        (msg) => setErrorMessage(msg),
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
      setErrorMessage(
        err instanceof Error ? err.message : "Could not detect details automatically.",
      );
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
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not generate the complaint draft. Please try again.",
      );
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
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not fetch the next clarification question. Please try again.",
      );
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
      subject: editableSubject.trim() || "Public Grievance Draft",
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
    setDraftData({
      subject: record.subject,
      draft: record.draft,
      suggestedAuthority: record.portalName,
      summaryPoints: [],
      draftLanguage: "English",
      primaryPortalId: "cpgrams",
      whyThisPortal: "",
      filingSteps: [],
      requiredDocuments: [],
    });
    setEditableSubject(record.subject);
    setEditableDraft(record.draft);
    setDraftLanguage("English");
    setActiveSavedId(record.id);
    setStep("review");
    document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
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
      setStep("review");
      document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not draft escalation letter right now. Please try again.",
      );
    } finally {
      setEscalatingId(null);
    }
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
      setPortalChatError(
        err instanceof Error
          ? err.message
          : "Could not reach the assistant right now. Please try again.",
      );
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

  const handleHeroStartSpeaking = () => {
    setStep("describe");
    document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
    if (speechSupported && voiceTarget !== "complaint") {
      setTimeout(() => {
        startVoiceInput("complaint");
      }, 350);
    }
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
                Google Maps daily demo quota has been reached. You can still select your State, District, and address manually.{" "}
                <a
                  href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline text-amber-900 hover:text-amber-950"
                >
                  Learn how to upgrade quota
                </a>
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMapsQuotaExceeded(false)}
              className="p-1 text-amber-800 hover:text-amber-950 rounded-lg shrink-0"
              aria-label="Dismiss quota notice"
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

          {/* Zone 2: Clean single-line text nav links (localized) */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#workspace"
              className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navDraft}
            </a>
            <a
              href="#complaint-tracker"
              className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {it.navTracker}
              {savedRecords.length > 0 ? ` (${savedRecords.length})` : ""}
            </a>
            <a
              href="#how-it-works"
              className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navHowItWorks}
            </a>
            <a
              href="#official-portals"
              className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navPortals}
            </a>
            <a
              href="#privacy"
              className="hover:text-slate-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              {t.navPrivacy}
            </a>
          </nav>

          {/* Zone 3: PWA Install Button (when installable) + Single compact language selector */}
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
              className="h-10 max-w-[155px] sm:max-w-none ps-3 pe-7 text-xs sm:text-sm font-medium text-slate-900 bg-slate-50 border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 whitespace-nowrap shrink-0"
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
        {/* Hero Section: Civic Concept Background Banner + Measured Contrast Scrim */}
        <section className="no-print relative overflow-hidden bg-slate-50 border-b border-slate-200/80">
          {!bannerImgError && (
            <img
              src={HERO_BANNER_PATH}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              onError={() => setBannerImgError(true)}
              className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover object-center opacity-55 sm:opacity-65"
            />
          )}

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/90 via-white/80 to-white/92 lg:bg-gradient-to-r lg:from-white/95 lg:via-white/82 lg:to-white/45"
          />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center">
              <div className="lg:col-span-7 flex flex-col justify-center">
                <p className="text-xs font-semibold text-blue-800">{t.heroKicker}</p>

                <h1 className="mt-2 font-display text-[1.8rem] sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-slate-950 [text-wrap:balance] leading-[1.14]">
                  {t.heroTitle}
                </h1>

                <p className="mt-3 text-base text-slate-700 leading-relaxed max-w-xl">
                  {t.heroSubtitle}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-slate-600">
                  <span>{t.heroMeta1}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.heroMeta2}</span>
                  <span aria-hidden="true">·</span>
                  <span>{t.heroMeta3}</span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={handleHeroStartSpeaking}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl shadow-sm transition-all active:scale-[0.99] whitespace-nowrap shrink-0 min-h-[52px]"
                  >
                    <Mic className="w-5 h-5" aria-hidden="true" />
                    {t.heroCta}
                  </button>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center sm:justify-start gap-1.5 px-3.5 py-2.5 text-sm font-medium text-slate-800 hover:text-slate-950 bg-white/75 sm:bg-transparent rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
                  >
                    {t.heroSecondary}
                    <ArrowDown className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 flex">
                <div className="w-full rounded-2xl overflow-hidden border border-white/80 ring-1 ring-slate-200/80 bg-white/90 shadow-[0_4px_18px_rgba(15,23,42,0.06)] flex items-center justify-center">
                  {!heroImgError ? (
                    <img
                      src={HERO_IMAGE_PATH}
                      alt="Indian citizens speaking into a smartphone to draft a structured public grievance letter"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-52 sm:h-64 lg:h-72 object-cover"
                    />
                  ) : (
                    <div className="p-8 text-center">
                      <Mic className="w-10 h-10 text-blue-700 mx-auto" aria-hidden="true" />
                      <p className="mt-3 text-sm font-medium text-slate-800">
                        {t.heroTitle}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Interactive Workflow Container */}
        <section id="workspace" className="max-w-5xl mx-auto px-4 sm:px-6 py-7 sm:py-11">
          {/* 3-Step Progress Strip */}
          <nav
            aria-label="Complaint drafting steps"
            className="no-print mb-6 sm:mb-7 grid grid-cols-3 border border-slate-200/90 bg-white rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden divide-x divide-slate-200/80"
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
                  className={`px-2.5 sm:px-5 py-3.5 text-start transition-colors min-h-[54px] ${
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
                        className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <span
                        className={`font-mono text-xs tabular-nums shrink-0 ${
                          isCurrent ? "text-blue-300" : "text-slate-400"
                        }`}
                      >
                        {s.number}
                      </span>
                    )}
                    <span className="text-xs sm:text-sm font-medium truncate">
                      {s.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Active Step View */}
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
              onOpenHandsFree={() => setHandsFreeOpen(true)}
              autosaved={autosaved}
              busy={busy}
              isListening={voiceTarget === "complaint"}
              interimTranscript={voiceTarget === "complaint" ? interimTranscript : ""}
              speechSupported={speechSupported}
              onToggleVoice={() => startVoiceInput("complaint")}
              speechOutputSupported={speechOutputSupported}
              isReadingGuide={isReadingGuide}
              onToggleReadGuide={handleToggleReadGuide}
              errorMessage={errorMessage}
              fieldErrors={fieldErrors}
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
              isListening={voiceTarget === "answer"}
              interimTranscript={voiceTarget === "answer" ? interimTranscript : ""}
              speechSupported={speechSupported}
              onToggleVoice={() => startVoiceInput("answer")}
              isSpeakingId={speakingMessageId}
              speechOutputSupported={speechOutputSupported}
              autoReadAloud={autoReadAloud}
              onToggleAutoRead={() => setAutoReadAloud((v) => !v)}
              onSpeakMessage={handleSpeakMessage}
              onStopSpeaking={handleStopSpeaking}
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
              isSavedToTracker={activeSavedId !== null}
              onSaveToTracker={handleSaveToTracker}
            />
          )}
        </section>

        {/* Innovation 4: Personal Complaint Tracker & Escalation Reminders Vault */}
        <ComplaintTrackerSection
          it={it}
          records={savedRecords}
          escalatingId={escalatingId}
          onUpdateRecord={handleUpdateTrackerRecord}
          onDeleteRecord={handleDeleteTrackerRecord}
          onGenerateEscalation={(rec) => void handleGenerateEscalationFromTracker(rec)}
          onLoadRecordIntoReview={handleLoadTrackerRecord}
        />

        {/* How It Works Section (Localized) */}
        <section id="how-it-works" className="no-print border-t border-slate-200 bg-white py-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">
              {t.howItWorksTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.howItWorksSub}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">{t.how1Title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.how1Desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">{t.how2Title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.how2Desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-base font-semibold text-slate-900">{t.how3Title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t.how3Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Official Portals Reference */}
        <section
          id="official-portals"
          className="no-print border-t border-slate-200 bg-slate-50 py-14"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-slate-950">
              {t.commonPortalsTitle}
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.commonPortalsSub}
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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

                return (
                  <div
                    key={portal.url}
                    className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] p-5 flex flex-col justify-between hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <p className="text-xs text-slate-500">{portal.authorityScope}</p>
                      <h3 className="mt-1 font-display text-base font-semibold text-slate-950">
                        {portal.name}
                      </h3>
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
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
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
          </div>
        </section>

        {/* Privacy & Trust */}
        <section id="privacy" className="no-print border-t border-slate-200/80 bg-white py-12">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-slate-700 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <h2 className="font-display text-lg font-semibold text-slate-950">
                  {t.privacyTitle}
                </h2>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600 leading-relaxed">
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
      <footer className="no-print border-t border-slate-200/80 bg-slate-50 pt-8 pb-24 sm:pb-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-500">
          <p>{t.footerText}</p>
          <div className="flex items-center gap-5 shrink-0">
            <a href="#workspace" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              {t.navDraft}
            </a>
            <a href="#complaint-tracker" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              {it.navTracker}
            </a>
            <a href="#official-portals" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              {t.navPortals}
            </a>
            <a href="#privacy" className="hover:text-slate-900 transition-colors whitespace-nowrap">
              {t.navPrivacy}
            </a>
          </div>
        </div>
      </footer>

      {/* Innovation 7: Hands-Free Voice Conversation Mode Modal */}
      <HandsFreeVoiceModal
        open={handsFreeOpen}
        onClose={() => setHandsFreeOpen(false)}
        language={form.language}
        it={it}
        initialComplaint={form.complaint}
        onComplete={handleHandsFreeComplete}
      />

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
