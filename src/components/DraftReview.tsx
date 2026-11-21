import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  Copy,
  Download,
  ExternalLink,
  FileCheck2,
  MessageSquare,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import type { SubmissionUiStrings } from "../data/submissionTranslations";
import type { UiStrings } from "../data/translations";
import type { DraftResponse, PortalGuidance } from "../types";
import { SubmissionGuideModal } from "./SubmissionGuideModal";

interface DraftReviewProps {
  t: UiStrings;
  st: SubmissionUiStrings;
  draftData: DraftResponse;
  subject: string;
  draftText: string;
  onSubjectChange: (val: string) => void;
  onDraftTextChange: (val: string) => void;
  userLanguage: string;
  draftLanguage: string;
  onRegenerate: (targetLanguage: string) => void;
  onBackToClarify: () => void;
  onBackToForm: () => void;
  portalGuidance: PortalGuidance;
  busy: boolean;
  errorMessage: string | null;
  onOpenAssistant: (presetQuestion?: string) => void;
}

function isSafeHttpsUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function DraftReview({
  t,
  st,
  draftData,
  subject,
  draftText,
  onSubjectChange,
  onDraftTextChange,
  userLanguage,
  draftLanguage,
  onRegenerate,
  onBackToClarify,
  onBackToForm,
  portalGuidance,
  busy,
  errorMessage,
  onOpenAssistant,
}: DraftReviewProps) {
  const [copied, setCopied] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
  });

  const combinedCopyText = subject.trim()
    ? `Subject: ${subject.trim()}\n\n${draftText.trim()}`
    : draftText.trim();

  const toggleCheck = (num: number) => {
    setCheckedSteps((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) => {
      const next = { ...prev, [docId]: !prev[docId] };
      const anyChecked = Object.values(next).some(Boolean);
      if (anyChecked) {
        setCheckedSteps((stepsPrev) => ({ ...stepsPrev, 3: true }));
      }
      return next;
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(combinedCopyText);
    } catch {
      const el = document.createElement("textarea");
      el.value = combinedCopyText;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setCheckedSteps((prev) => ({ ...prev, 2: true }));
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([combinedCopyText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "makkalvoice-complaint-draft.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const showLanguageToggle = userLanguage !== "English";
  const wordCount = draftText.trim() ? draftText.trim().split(/\s+/).length : 0;
  const docs = portalGuidance.requiredDocuments;
  const preparedDocCount = docs.filter((d) => checkedDocs[d.id]).length;

  return (
    <div className="space-y-6">
      {/* Main Draft Review Card */}
      <section
        aria-labelledby="review-heading"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-blue-700">{t.step3Kicker}</span>
              <span aria-hidden="true">·</span>
              <span>{draftLanguage}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">
                {wordCount} {t.wordsLabel}
              </span>
            </div>
            <h2
              id="review-heading"
              className="mt-1.5 font-display text-2xl font-bold tracking-tight text-slate-950"
            >
              {t.step3Heading}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {t.step3Subheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onBackToForm}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              {t.editOriginalDetails}
            </button>

            <button
              type="button"
              onClick={onBackToClarify}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-50"
            >
              {t.viewQa}
            </button>
          </div>
        </div>

        {/* Language Switcher for the Complaint Letter itself */}
        {showLanguageToggle && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <span className="text-xs text-slate-600">{t.draftLanguagePrompt}</span>
            <div
              role="group"
              aria-label={t.draftLanguagePrompt}
              className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
            >
              <button
                type="button"
                disabled={busy}
                onClick={() => onRegenerate("English")}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  draftLanguage === "English"
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.formalEnglish}
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onRegenerate(userLanguage)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  draftLanguage === userLanguage
                    ? "bg-white text-slate-950 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {userLanguage}
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div
            role="alert"
            className="mt-5 px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-lg"
          >
            {errorMessage}
          </div>
        )}

        {/* Editable Subject & Body */}
        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="draft-subject-input"
              className="block text-sm font-medium text-slate-800"
            >
              {t.subjectLabel}
            </label>
            <input
              id="draft-subject-input"
              type="text"
              value={subject}
              onChange={(e) => onSubjectChange(e.target.value)}
              disabled={busy}
              className="mt-1.5 w-full h-12 px-4 text-base sm:text-sm font-medium text-slate-950 bg-white border border-slate-300/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
            />
          </div>

          <div>
            <label
              htmlFor="draft-body-textarea"
              className="block text-sm font-medium text-slate-800"
            >
              {t.letterBodyLabel}
            </label>
            <textarea
              id="draft-body-textarea"
              rows={12}
              value={draftText}
              onChange={(e) => onDraftTextChange(e.target.value)}
              disabled={busy}
              className="mt-1.5 w-full p-4 text-base leading-relaxed text-slate-950 bg-slate-50/40 border border-slate-300/90 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 resize-y"
            />
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopy}
              disabled={busy || !draftText.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px] disabled:opacity-50"
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
              onClick={handleDownloadTxt}
              disabled={busy || !draftText.trim()}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px] disabled:opacity-50"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              {t.downloadTxt}
            </button>

            <button
              type="button"
              onClick={() => onRegenerate(draftLanguage)}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px] disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${busy ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              {busy ? t.regenerating : t.regenerate}
            </button>
          </div>
        </div>

        {/* Department & Verified Facts */}
        {(draftData.suggestedAuthority || draftData.summaryPoints.length > 0) && (
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
            {draftData.suggestedAuthority && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500">
                  {t.suggestedDeptLabel}
                </h3>
                <p className="mt-1.5 text-sm font-semibold text-slate-950">
                  {draftData.suggestedAuthority}
                </p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  {t.suggestedDeptNote}
                </p>
              </div>
            )}

            {draftData.summaryPoints.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500">
                  {t.includedFactsLabel}
                </h3>
                <ul className="mt-1.5 space-y-1.5 text-sm text-slate-700 list-disc ps-4">
                  {draftData.summaryPoints.map((pt, index) => (
                    <li key={index}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Verified Official Portal & Submission Checklist Card */}
      <section
        aria-labelledby="portal-guidance-heading"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
      >
        <div className="pb-5 border-b border-slate-200">
          <p className="text-xs font-medium text-emerald-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
            {t.portalKicker}
          </p>
          <h2
            id="portal-guidance-heading"
            className="mt-1.5 text-xl sm:text-2xl font-semibold tracking-tight text-slate-950"
          >
            {t.portalHeading}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
            {t.portalSubheading}
          </p>
        </div>

        {portalGuidance.emergencyNote && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-950"
          >
            <AlertTriangle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <p>{portalGuidance.emergencyNote}</p>
          </div>
        )}

        {/* Why this exact portal matches */}
        {portalGuidance.whyThisPortal && (
          <div className="mt-5 p-4 bg-blue-50/60 border border-blue-200/80 rounded-lg">
            <p className="text-xs font-semibold text-blue-900">
              {t.whyRightPortalLabel}
            </p>
            <p className="mt-1 text-sm text-slate-800 leading-relaxed">
              {portalGuidance.whyThisPortal}
            </p>
          </div>
        )}

        {/* Verified Portals Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Primary Verified Portal */}
          <div className="flex flex-col justify-between p-5 border border-slate-300 rounded-xl bg-slate-50/70">
            <div>
              <p className="text-xs font-semibold text-blue-700">
                {t.primaryPortalBadge}
              </p>
              <h3 className="mt-1.5 text-base font-semibold text-slate-950">
                {portalGuidance.primary.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {portalGuidance.primary.authorityScope}
              </p>
              <p className="mt-2.5 text-sm text-slate-700 leading-relaxed">
                {portalGuidance.primary.description}
              </p>

              <div className="mt-3 space-y-1 text-xs text-slate-700">
                {portalGuidance.primary.domain && (
                  <p>
                    {t.verifiedDomainLabel}:{" "}
                    <span className="font-mono font-medium text-emerald-800">
                      {portalGuidance.primary.domain}
                    </span>
                  </p>
                )}
                {portalGuidance.primary.helpline && (
                  <p>
                    {t.helplineLabel}:{" "}
                    <span className="font-mono font-semibold tabular-nums text-slate-950">
                      {portalGuidance.primary.helpline}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {isSafeHttpsUrl(portalGuidance.primary.url) && (
              <div className="mt-5">
                <a
                  href={portalGuidance.primary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCheckedSteps((prev) => ({ ...prev, 4: true }))}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors whitespace-nowrap min-h-[48px]"
                >
                  {t.openOfficialPortal}
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                </a>
              </div>
            )}
          </div>

          {/* Secondary / Escalation Portal */}
          {portalGuidance.secondary && (
            <div className="flex flex-col justify-between p-5 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {t.secondaryPortalBadge}
                </p>
                <h3 className="mt-1.5 text-base font-semibold text-slate-950">
                  {portalGuidance.secondary.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {portalGuidance.secondary.authorityScope}
                </p>
                <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                  {portalGuidance.secondary.description}
                </p>

                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  {portalGuidance.secondary.domain && (
                    <p>
                      {t.verifiedDomainLabel}:{" "}
                      <span className="font-mono text-slate-800">
                        {portalGuidance.secondary.domain}
                      </span>
                    </p>
                  )}
                  {portalGuidance.secondary.helpline && (
                    <p>
                      {t.helplineLabel}:{" "}
                      <span className="font-mono font-semibold tabular-nums text-slate-900">
                        {portalGuidance.secondary.helpline}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {isSafeHttpsUrl(portalGuidance.secondary.url) && (
                <div className="mt-5">
                  <a
                    href={portalGuidance.secondary.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-medium text-slate-800 border border-slate-300 hover:bg-slate-50 rounded-xl transition-colors whitespace-nowrap min-h-[44px]"
                  >
                    {t.visitPortal}
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
          {portalGuidance.verificationNote}
        </p>
      </section>

      {/* Dedicated Next Steps & Document Checklist Section at End of Draft Review */}
      <section
        aria-labelledby="next-steps-heading"
        className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-blue-700 flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 shrink-0" aria-hidden="true" />
              {st.nextStepsKicker}
            </p>
            <h2
              id="next-steps-heading"
              className="mt-1.5 font-display text-xl sm:text-2xl font-semibold tracking-tight text-slate-950"
            >
              {st.nextStepsHeading}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 max-w-2xl leading-relaxed">
              {st.nextStepsSubheading}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setGuideModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px]"
            >
              <ClipboardList className="w-4 h-4 shrink-0" aria-hidden="true" />
              {st.openStepGuideBtn}
            </button>

            <button
              type="button"
              onClick={() => onOpenAssistant()}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px]"
            >
              <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
              {st.chatAskInSectionBtn}
            </button>
          </div>
        </div>

        {/* Supporting Documents Checklist */}
        <div className="mt-6 pb-6 border-b border-slate-200">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-slate-950 flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                {st.documentsTitle}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {st.documentsSubtitle}
              </p>
            </div>
            <span className="font-mono text-xs font-medium tabular-nums text-slate-700">
              {preparedDocCount} / {docs.length} {st.docsReadyLabel}
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {docs.map((doc) => {
              const isChecked = Boolean(checkedDocs[doc.id]);
              return (
                <li
                  key={doc.id}
                  className="p-4 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleDoc(doc.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span
                          className={`text-sm font-medium ${
                            isChecked ? "line-through text-slate-400" : "text-slate-900"
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

          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            {st.docFormatNote}
          </p>
        </div>

        {/* Tailored Step-by-Step Portal Filing Guide + Originality Checklist */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {portalGuidance.filingSteps && portalGuidance.filingSteps.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                {t.portalStepsTitle}
              </h3>
              <ol className="mt-3 space-y-2.5 text-sm text-slate-700">
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

          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              {t.submissionChecklistTitle}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {[
                { id: 1, label: t.checkStep1 },
                { id: 2, label: t.checkStep2 },
                { id: 3, label: t.checkStep3 },
                { id: 4, label: t.checkStep4 },
              ].map((item) => (
                <li key={item.id}>
                  <label className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(checkedSteps[item.id])}
                      onChange={() => toggleCheck(item.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600 shrink-0 cursor-pointer"
                    />
                    <span className={checkedSteps[item.id] ? "line-through text-slate-400" : ""}>
                      {item.label}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive Step-by-Step Submission Guide Modal */}
      <SubmissionGuideModal
        open={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
        t={t}
        st={st}
        language={userLanguage}
        subject={subject}
        draftText={draftText}
        portalGuidance={portalGuidance}
        checkedDocs={checkedDocs}
        onToggleDoc={toggleDoc}
        checkedSteps={checkedSteps}
        onToggleStepCheck={toggleCheck}
        copied={copied}
        onCopyDraft={handleCopy}
        onDownloadDraft={handleDownloadTxt}
        onPortalOpened={() => setCheckedSteps((prev) => ({ ...prev, 4: true }))}
        onOpenAssistant={onOpenAssistant}
      />
    </div>
  );
}
