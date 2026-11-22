import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  FileText,
  MessageSquare,
  ShieldCheck,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { SubmissionUiStrings } from "../data/submissionTranslations";
import type { UiStrings } from "../data/translations";
import type { PortalGuidance } from "../types";
import { LANGUAGE_LOCALE_MAP } from "../data/languages";
import { isSpeechSynthesisSupported, speakText, stopSpeakingText } from "../utils/speech";

interface SubmissionGuideModalProps {
  open: boolean;
  onClose: () => void;
  t: UiStrings;
  st: SubmissionUiStrings;
  language: string;
  subject: string;
  draftText: string;
  portalGuidance: PortalGuidance;
  checkedDocs: Record<string, boolean>;
  onToggleDoc: (docId: string) => void;
  checkedSteps: Record<number, boolean>;
  onToggleStepCheck: (stepNum: number) => void;
  copied: boolean;
  onCopyDraft: () => void;
  onDownloadDraft: () => void;
  onPortalOpened: () => void;
  onOpenAssistant: (presetQuestion?: string) => void;
  portalLanguageNotice?: string;
}

function isSafeHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function SubmissionGuideModal({
  open,
  onClose,
  t,
  st,
  language,
  subject,
  draftText,
  portalGuidance,
  checkedDocs,
  onToggleDoc,
  checkedSteps,
  onToggleStepCheck,
  copied,
  onCopyDraft,
  onDownloadDraft,
  onPortalOpened,
  onOpenAssistant,
  portalLanguageNotice,
}: SubmissionGuideModalProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speechOutputSupported = isSpeechSynthesisSupported();

  useEffect(() => {
    if (!open) {
      stopSpeakingText();
      setIsSpeaking(false);
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        stopSpeakingText();
        setIsSpeaking(false);
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    stopSpeakingText();
    setIsSpeaking(false);
  }, [activeStep]);

  if (!open) return null;

  const totalSteps = 4;
  const docs = portalGuidance.requiredDocuments;
  const preparedDocCount = docs.filter((d) => checkedDocs[d.id]).length;

  const stepMeta = [
    { num: 1, title: st.modalStep1Title, desc: st.modalStep1Desc },
    { num: 2, title: st.modalStep2Title, desc: st.modalStep2Desc },
    { num: 3, title: st.modalStep3Title, desc: st.modalStep3Desc },
    { num: 4, title: st.modalStep4Title, desc: st.modalStep4Desc },
  ];

  const currentMeta = stepMeta[activeStep - 1] ?? stepMeta[0];

  const handleToggleReadStep = () => {
    if (isSpeaking) {
      stopSpeakingText();
      setIsSpeaking(false);
      return;
    }
    const locale = LANGUAGE_LOCALE_MAP[language] ?? "en-IN";
    let spokenContent = `${currentMeta.title}. ${currentMeta.desc}`;
    if (activeStep === 1 && docs.length > 0) {
      spokenContent += " " + docs.map((d) => d.title).join(". ");
    } else if (activeStep === 3 && portalGuidance.filingSteps?.length) {
      spokenContent += " " + portalGuidance.filingSteps.join(". ");
    }
    speakText(
      spokenContent,
      locale,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false),
    );
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 sm:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopSpeakingText();
          onClose();
        }
      }}
    >
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-medium text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {portalGuidance.primary.name}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {st.modalStepPrefix} 0{activeStep} / 0{totalSteps}
              </span>
            </div>
            <h2
              id="submission-modal-title"
              className="mt-1 font-display text-lg sm:text-xl font-semibold text-slate-950"
            >
              {st.modalTitle}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              stopSpeakingText();
              onClose();
            }}
            aria-label={st.modalCloseLabel}
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Stepper Tabs */}
        <div
          role="tablist"
          aria-label={st.modalTitle}
          className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 divide-x divide-slate-200"
        >
          {stepMeta.map((s) => {
            const isCurrent = activeStep === s.num;
            const isPast = s.num < activeStep;
            return (
              <button
                key={s.num}
                type="button"
                role="tab"
                aria-selected={isCurrent}
                onClick={() => setActiveStep(s.num)}
                className={`px-2 sm:px-3 py-3 text-start transition-colors min-h-[44px] ${
                  isCurrent
                    ? "bg-slate-900 text-white"
                    : isPast
                      ? "bg-white text-slate-800 hover:bg-slate-50"
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <span className="font-mono text-xs tabular-nums block">
                  0{s.num}
                </span>
                <span className="text-xs font-medium truncate block mt-0.5">
                  {s.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-950">
                0{activeStep}. {currentMeta.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                {currentMeta.desc}
              </p>
            </div>

            {speechOutputSupported && (
              <button
                type="button"
                onClick={handleToggleReadStep}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px]"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-blue-700" aria-hidden="true" />
                    {st.stopStepAudio}
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-blue-700" aria-hidden="true" />
                    {st.readStepAloud}
                  </>
                )}
              </button>
            )}
          </div>

          {/* STEP 1: Supporting Documents Checklist */}
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-2 border-b border-slate-100">
                <span>{st.documentsTitle}</span>
                <span className="font-mono tabular-nums font-medium text-slate-900">
                  {preparedDocCount} / {docs.length} {st.docsReadyLabel}
                </span>
              </div>

              <ul className="space-y-3">
                {docs.map((doc) => {
                  const isChecked = Boolean(checkedDocs[doc.id]);
                  return (
                    <li
                      key={doc.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50"
                    >
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => onToggleDoc(doc.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span
                              className={`text-sm font-medium ${
                                isChecked
                                  ? "line-through text-slate-400"
                                  : "text-slate-900"
                              }`}
                            >
                              {doc.title}
                            </span>
                            <span aria-hidden="true" className="text-xs text-slate-300">
                              ·
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                doc.mandatory ? "text-blue-700" : "text-slate-500"
                              }`}
                            >
                              {doc.mandatory ? st.docRequiredTag : st.docOptionalTag}
                            </span>
                          </div>
                          {doc.detail && (
                            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                              {doc.detail}
                            </p>
                          )}
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>

              <p className="text-xs text-slate-500 leading-relaxed">
                {st.docFormatNote}
              </p>
            </div>
          )}

          {/* STEP 2: Copy / Download Draft */}
          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  <span>{st.modalCopyHint}</span>
                </div>
                {subject.trim() && (
                  <p className="text-sm font-semibold text-slate-950">
                    {subject}
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line max-h-48 overflow-y-auto leading-relaxed pt-1 border-t border-slate-200/80">
                  {draftText}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onCopyDraft}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors whitespace-nowrap min-h-[46px]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" aria-hidden="true" />
                      {t.copiedSuccess}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" aria-hidden="true" />
                      {t.copyComplaint}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onDownloadDraft}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap min-h-[46px]"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  {t.downloadTxt}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Portal-Specific Steps & Direct Launch */}
          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70">
                <p className="text-xs font-semibold text-blue-700">
                  {t.primaryPortalBadge}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-950">
                  {portalGuidance.primary.name}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                  {portalGuidance.primary.domain && (
                    <span>
                      {t.verifiedDomainLabel}:{" "}
                      <span className="font-mono font-medium text-emerald-800">
                        {portalGuidance.primary.domain}
                      </span>
                    </span>
                  )}
                  {portalGuidance.primary.helpline && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>
                        {t.helplineLabel}:{" "}
                        <span className="font-mono font-semibold tabular-nums text-slate-900">
                          {portalGuidance.primary.helpline}
                        </span>
                      </span>
                    </>
                  )}
                </div>

                {portalLanguageNotice && (
                  <p className="mt-3 pt-3 border-t border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900">
                      {st.portalLanguageNoticeTitle}:
                    </strong>{" "}
                    {portalLanguageNotice}
                  </p>
                )}

                {isSafeHttpsUrl(portalGuidance.primary.url) && (
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a
                      href={portalGuidance.primary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onPortalOpened}
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors whitespace-nowrap min-h-[46px]"
                    >
                      {t.openOfficialPortal}
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </a>
                    <span className="text-xs text-slate-500">
                      {st.modalPortalLaunchHint}
                    </span>
                  </div>
                )}
              </div>

              {portalGuidance.englishButtonGuide && portalGuidance.englishButtonGuide.length > 0 && (
                <div className="p-4 rounded-lg border border-blue-200/80 bg-blue-50/40">
                  <h4 className="text-xs font-semibold text-slate-900">
                    {st.buttonGuideTitle}
                  </h4>
                  <p className="mt-0.5 text-xs text-slate-600">
                    {st.buttonGuideSubtitle}
                  </p>
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm">
                    {portalGuidance.englishButtonGuide.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-blue-100 last:border-b-0 last:pb-0"
                      >
                        <span className="font-mono text-xs font-semibold text-slate-900">
                          {item.englishLabel}
                        </span>
                        <span className="text-slate-700">{item.localMeaning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {portalGuidance.filingSteps && portalGuidance.filingSteps.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500">
                    {t.portalStepsTitle}
                  </h4>
                  <ol className="mt-2.5 space-y-2.5 text-sm text-slate-800">
                    {portalGuidance.filingSteps.map((stepText, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="font-mono text-xs font-semibold tabular-nums text-blue-700 mt-0.5 shrink-0">
                          0{idx + 1}.
                        </span>
                        <span className="leading-relaxed">{stepText}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Final Submission Verification & Tracking */}
          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="space-y-2.5">
                <h4 className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-700 shrink-0"
                    aria-hidden="true"
                  />
                  {t.submissionChecklistTitle}
                </h4>
                <ul className="space-y-2.5">
                  {[
                    { id: 1, label: t.checkStep1 },
                    { id: 2, label: t.checkStep2 },
                    { id: 3, label: t.checkStep3 },
                    { id: 4, label: t.checkStep4 },
                  ].map((item) => (
                    <li key={item.id}>
                      <label className="flex items-start gap-2.5 text-sm text-slate-800 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(checkedSteps[item.id])}
                          onChange={() => onToggleStepCheck(item.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0 cursor-pointer"
                        />
                        <span
                          className={
                            checkedSteps[item.id] ? "line-through text-slate-400" : ""
                          }
                        >
                          {item.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2">
                <p className="text-xs text-slate-700 leading-relaxed">
                  {st.modalTrackingReminder}
                </p>
                {portalGuidance.secondary && isSafeHttpsUrl(portalGuidance.secondary.url) && (
                  <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-slate-600">
                      {t.secondaryPortalBadge}:{" "}
                      <strong className="font-medium text-slate-900">
                        {portalGuidance.secondary.name}
                      </strong>
                    </span>
                    <a
                      href={portalGuidance.secondary.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-medium text-blue-700 hover:text-blue-900 whitespace-nowrap"
                    >
                      {t.visitPortal}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  stopSpeakingText();
                  onClose();
                  onOpenAssistant();
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
              >
                <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
                {st.chatAskInSectionBtn}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Navigation */}
        <div className="px-5 sm:px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap min-h-[44px] disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {st.modalPrevBtn}
          </button>

          {activeStep < totalSteps ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(totalSteps, prev + 1))}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
            >
              {st.modalNextBtn}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                stopSpeakingText();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap min-h-[44px]"
            >
              <Check className="w-4 h-4" aria-hidden="true" />
              {st.modalDoneBtn}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
