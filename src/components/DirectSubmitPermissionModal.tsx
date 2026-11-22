import { useEffect, useState } from "react";
import {
  BookmarkCheck,
  BookmarkPlus,
  Check,
  Copy,
  ExternalLink,
  Mail,
  MessageCircle,
  ShieldCheck,
  X,
} from "lucide-react";
import type { DirectSubmissionStrings } from "../data/directSubmissionTranslations";

export type DirectChannelType = "email" | "whatsapp";

interface DirectSubmitPermissionModalProps {
  open: boolean;
  channel: DirectChannelType;
  ds: DirectSubmissionStrings;
  portalName: string;
  recipientEmail?: string;
  recipientWhatsApp?: string;
  recipientWhatsAppDisplay?: string;
  initialSubject: string;
  initialBody: string;
  isSavedToTracker: boolean;
  onSaveToTracker: () => void;
  onConfirmedSend: () => void;
  onClose: () => void;
}

async function copyToClipboardSafe(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export function DirectSubmitPermissionModal({
  open,
  channel,
  ds,
  portalName,
  recipientEmail,
  recipientWhatsApp,
  recipientWhatsAppDisplay,
  initialSubject,
  initialBody,
  isSavedToTracker,
  onSaveToTracker,
  onConfirmedSend,
  onClose,
}: DirectSubmitPermissionModalProps) {
  const [subject, setSubject] = useState(initialSubject);
  const [body, setBody] = useState(initialBody);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (open) {
      setSubject(initialSubject);
      setBody(initialBody);
      setPermissionGranted(false);
      setCopied(false);
    }
  }, [open, initialSubject, initialBody, channel]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isEmail = channel === "email";
  const safeSubject = subject.trim() || "Public Grievance Complaint";
  const safeBody = body.trim();
  const formattedWhatsAppText = `${safeSubject}\n\n${safeBody}`.slice(0, 3500);

  const gmailComposeUrl = recipientEmail
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipientEmail)}&su=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(safeBody.slice(0, 3500))}`
    : "";

  const mailtoUrl = recipientEmail
    ? `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(safeSubject)}&body=${encodeURIComponent(safeBody.slice(0, 2800))}`
    : "";

  const whatsAppDirectUrl = recipientWhatsApp
    ? `https://wa.me/${recipientWhatsApp.replace(/\D/g, "")}?text=${encodeURIComponent(formattedWhatsAppText)}`
    : "";

  const handleCopy = async () => {
    const payload = isEmail
      ? `To: ${recipientEmail ?? ""}\nSubject: ${safeSubject}\n\n${safeBody}`
      : formattedWhatsAppText;
    await copyToClipboardSafe(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="direct-submit-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 backdrop-blur-[2px] p-3 sm:p-5"
    >
      <div className="w-full max-w-2xl max-h-[92vh] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
              {portalName}
            </p>
            <h2
              id="direct-submit-modal-title"
              className="mt-1 font-display text-lg sm:text-xl font-bold text-slate-950"
            >
              {isEmail ? ds.modalEmailTitle : ds.modalWhatsAppTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {ds.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close verification dialog"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Verification Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Verified Recipient */}
          <div className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-slate-500">{ds.recipientLabel}</p>
              <p className="mt-0.5 text-sm font-mono font-semibold text-slate-950 break-all">
                {isEmail ? recipientEmail : recipientWhatsAppDisplay || recipientWhatsApp}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-800">
              {isEmail ? (
                <Mail className="w-4 h-4 text-blue-700" aria-hidden="true" />
              ) : (
                <MessageCircle className="w-4 h-4 text-emerald-700" aria-hidden="true" />
              )}
              {isEmail ? ds.availableEmailLabel : ds.availableWhatsAppLabel}
            </span>
          </div>

          {/* Subject (Email) */}
          {isEmail && (
            <div>
              <label
                htmlFor="direct-submit-subject"
                className="block text-xs font-semibold text-slate-700"
              >
                {ds.subjectFieldLabel}
              </label>
              <input
                id="direct-submit-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 w-full h-11 px-3.5 text-sm font-medium text-slate-950 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600"
              />
            </div>
          )}

          {/* Prepared Complete Message */}
          <div>
            <label
              htmlFor="direct-submit-body"
              className="block text-xs font-semibold text-slate-700"
            >
              {ds.messageFieldLabel}
            </label>
            <textarea
              id="direct-submit-body"
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1.5 w-full p-3.5 text-sm leading-relaxed text-slate-950 bg-slate-50/40 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/15 focus:border-blue-600 resize-y"
            />
          </div>

          {/* Explicit Permission Checkbox */}
          <label className="flex items-start gap-3 p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 cursor-pointer">
            <input
              type="checkbox"
              checked={permissionGranted}
              onChange={(e) => setPermissionGranted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 shrink-0 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-medium text-slate-900 leading-relaxed">
              {ds.permissionCheckboxLabel}
            </span>
          </label>

          {!permissionGranted && (
            <p className="text-xs text-slate-500">{ds.permissionRequiredHint}</p>
          )}

          {/* Action Buttons */}
          <div className="pt-1 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5">
            {isEmail ? (
              <>
                <a
                  href={permissionGranted ? gmailComposeUrl : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!permissionGranted}
                  onClick={(e) => {
                    if (!permissionGranted) {
                      e.preventDefault();
                      return;
                    }
                    onConfirmedSend();
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap min-h-[48px] ${
                    permissionGranted
                      ? "bg-blue-700 text-white hover:bg-blue-800"
                      : "bg-slate-200 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {ds.openGmailBtn}
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </a>

                <a
                  href={permissionGranted ? mailtoUrl : undefined}
                  aria-disabled={!permissionGranted}
                  onClick={(e) => {
                    if (!permissionGranted) {
                      e.preventDefault();
                      return;
                    }
                    onConfirmedSend();
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium rounded-xl border transition-colors whitespace-nowrap min-h-[48px] ${
                    permissionGranted
                      ? "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                      : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {ds.openMailAppBtn}
                </a>
              </>
            ) : (
              <a
                href={permissionGranted ? whatsAppDirectUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                aria-disabled={!permissionGranted}
                onClick={(e) => {
                  if (!permissionGranted) {
                    e.preventDefault();
                    return;
                  }
                  onConfirmedSend();
                }}
                className={`inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap min-h-[48px] ${
                  permissionGranted
                    ? "bg-emerald-700 text-white hover:bg-emerald-800"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                {ds.openWhatsAppBtn}
                <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              </a>
            )}

            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap min-h-[48px]"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  {ds.copiedBtn}
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  {ds.copyMessageBtn}
                </>
              )}
            </button>
          </div>

          {/* Save to Tracker + Quiet Tip */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
            <button
              type="button"
              onClick={onSaveToTracker}
              className={`inline-flex items-center gap-1.5 font-semibold transition-colors whitespace-nowrap ${
                isSavedToTracker ? "text-emerald-800" : "text-blue-700 hover:text-blue-900"
              }`}
            >
              {isSavedToTracker ? (
                <BookmarkCheck className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
              ) : (
                <BookmarkPlus className="w-4 h-4 shrink-0" aria-hidden="true" />
              )}
              {ds.saveToTrackerHint}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-900 underline underline-offset-4 text-start sm:text-end"
            >
              {ds.cancelUsePortalBtn}
            </button>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">{ds.verifyRecipientTip}</p>
        </div>
      </div>
    </div>
  );
}
