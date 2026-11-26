import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  AudioLines,
  BookmarkPlus,
  CheckCircle2,
  Circle,
  ExternalLink,
  FileCheck2,
  FileDown,
  FileText,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Mic,
  MicOff,
  PhoneOff,
  Printer,
  RefreshCw,
  User,
  Volume2,
  X,
} from "lucide-react";
import { getCivicShowcaseStrings } from "../data/civicShowcaseTranslations";
import { LANGUAGES } from "../data/languages";
import { getLocalizedDistrictName, getLocalizedStateName } from "../data/localizedLocations";
import type { UiStrings } from "../data/translations";
import { getVoiceFlowStrings } from "../data/voiceFlowTranslations";
import type {
  LiveIntakePatch,
  LiveTranscriptItem,
  LiveVoiceCommandResult,
  LiveVoiceStatus,
} from "../hooks/useLiveVoiceFlow";
import { useLiveVoiceFlow } from "../hooks/useLiveVoiceFlow";
import type { ComplaintFormState, DraftResponse } from "../types";
import { resolveEffectiveDistrict } from "../utils/api";
import { getCategoryIcon } from "../utils/civicIcons";

export interface PendingLiveChannelConfirm {
  channel: "gmail" | "whatsapp";
  toEmail: string;
  toWhatsApp: string;
  toWhatsAppDisplay: string;
  subject: string;
  body: string;
}

interface LiveVoiceFlowModalProps {
  open: boolean;
  onClose: () => void;
  t: UiStrings;
  dashboardLanguage: string;
  form: ComplaintFormState;
  draftData: DraftResponse | null;
  portalName: string;
  portalUrl?: string;
  officialEmail?: string;
  officialWhatsApp?: string;
  officialWhatsAppDisplay?: string;
  actionToast: string | null;
  pendingChannelConfirm: PendingLiveChannelConfirm | null;
  onUpdatePendingEmail: (nextEmail: string) => void;
  onCancelPendingChannel: () => void;
  onConfirmOpenChannel: (channel: "gmail" | "whatsapp") => void;
  onIntakeUpdate: (patch: LiveIntakePatch) => void;
  onGenerateDraftCommand: (
    draftLanguage: string,
    spokenLanguage: string,
  ) => Promise<LiveVoiceCommandResult>;
  onExecuteVoiceAction: (
    action: string,
    spokenLanguage: string,
    args?: Record<string, unknown>,
  ) => Promise<LiveVoiceCommandResult>;
  onOpenDraftScreen: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function buildGmailComposeUrl(to: string, subject: string, body: string): string {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to.trim())}&su=${encodeURIComponent(subject.trim() || "Public Grievance Complaint")}&body=${encodeURIComponent(body.trim().slice(0, 3500))}`;
}

export function buildOfficialWhatsAppUrl(phone: string, subject: string, body: string): string {
  const digits = phone.replace(/\D/g, "");
  const message = `${subject.trim() || "Public Grievance Complaint"}\n\n${body.trim()}`.slice(0, 3500);
  return digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function LiveVoiceFlowModal({
  open,
  onClose,
  t,
  dashboardLanguage,
  form,
  draftData,
  portalName,
  portalUrl,
  officialEmail,
  officialWhatsApp,
  officialWhatsAppDisplay,
  actionToast,
  pendingChannelConfirm,
  onUpdatePendingEmail,
  onCancelPendingChannel,
  onConfirmOpenChannel,
  onIntakeUpdate,
  onGenerateDraftCommand,
  onExecuteVoiceAction,
  onOpenDraftScreen,
}: LiveVoiceFlowModalProps) {
  const vf = getVoiceFlowStrings(dashboardLanguage);
  const cs = getCivicShowcaseStrings(dashboardLanguage);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const live = useLiveVoiceFlow({
    hintLanguage: dashboardLanguage,
    uiLanguage: dashboardLanguage,
    onIntakeUpdate,
    onGenerateDraftCommand,
    onExecuteVoiceAction,
    onSessionClosedByVoice: () => {
      onClose();
    },
  });

  // Auto-start continuous hands-free listening the moment the studio opens
  useEffect(() => {
    if (open) {
      void live.startSession();
    } else {
      live.stopSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Smoothly keep latest live conversation turn in view
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [live.transcripts]);

  if (!open) return null;

  const detectedLangObj = live.detectedSpokenLanguage
    ? LANGUAGES.find((l) => l.name === live.detectedSpokenLanguage)
    : null;
  const dashboardLangObj = LANGUAGES.find((l) => l.name === dashboardLanguage);
  const effectiveDistrict = resolveEffectiveDistrict(form);

  const locationSummary = [
    form.street.trim(),
    form.town.trim(),
    effectiveDistrict ? getLocalizedDistrictName(effectiveDistrict, dashboardLanguage) : "",
    form.state ? getLocalizedStateName(form.state, dashboardLanguage) : "",
  ]
    .filter(Boolean)
    .join(", ");

  const hasProblem = form.complaint.trim().length >= 6;
  const hasLocation = Boolean(form.state || effectiveDistrict || form.town.trim());
  const hasContact = form.name.trim().length >= 2 && form.contact.replace(/\D/g, "").length >= 10;
  const hasDraft = Boolean(draftData);
  const spokenLang = live.detectedSpokenLanguage ?? dashboardLanguage;

  const statusText: Record<LiveVoiceStatus, string> = {
    idle: vf.statusConnecting,
    connecting: vf.statusConnecting,
    listening: vf.statusListening,
    speaking: vf.statusSpeaking,
    drafting: vf.statusDrafting,
    paused: vf.statusPaused,
    error: vf.statusError,
  };

  const displayError =
    live.errorMessage === "MIC_PERMISSION_DENIED"
      ? vf.micPermissionError
      : live.errorMessage;

  const handleClose = () => {
    live.stopSession();
    onClose();
  };

  const handleFinishToDraft = () => {
    live.stopSession();
    onClose();
    onOpenDraftScreen();
  };

  // Reactive 7-bar audio level visual reflecting real microphone level or AI speech playback
  const barMultipliers = [0.42, 0.7, 0.92, 1.0, 0.88, 0.68, 0.45];
  const activeEnergy =
    live.status === "speaking"
      ? 68
      : live.status === "listening"
        ? Math.max(14, live.micLevel)
        : 10;

  const gmailHref =
    pendingChannelConfirm?.channel === "gmail"
      ? buildGmailComposeUrl(
          pendingChannelConfirm.toEmail,
          pendingChannelConfirm.subject,
          pendingChannelConfirm.body,
        )
      : "";

  const waHref =
    pendingChannelConfirm?.channel === "whatsapp"
      ? buildOfficialWhatsAppUrl(
          pendingChannelConfirm.toWhatsApp,
          pendingChannelConfirm.subject,
          pendingChannelConfirm.body,
        )
      : "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-voice-studio-title"
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
    >
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Top Studio Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="live-voice-studio-title"
              className="font-display text-lg sm:text-xl font-bold text-slate-950 truncate"
            >
              {vf.studioTitle}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-medium text-blue-800">
                <Globe className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                {vf.voiceLangLabel}:{" "}
                <strong className="font-semibold text-slate-950">
                  {detectedLangObj
                    ? `${detectedLangObj.nativeLabel} (${detectedLangObj.name})`
                    : vf.autoDetectingLang}
                </strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500">
                {vf.dashboardUnchangedNote}
                {dashboardLangObj ? ` (${dashboardLangObj.nativeLabel})` : ""}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-mono text-xs font-semibold tabular-nums text-slate-600">
              {formatTimer(live.elapsedSeconds)}
            </span>
            <button
              type="button"
              onClick={handleClose}
              aria-label={vf.endSessionBtn}
              className="p-2 text-slate-500 hover:text-slate-950 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Live Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {/* Left Column: Live Continuous Audio Presence + Permission Card + Real-Time Conversation */}
          <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-4">
            {/* Live Voice Presence Panel */}
            <div className="p-5 rounded-xl bg-slate-950 text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  {live.status === "connecting" || live.status === "drafting" ? (
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin shrink-0" aria-hidden="true" />
                  ) : live.status === "speaking" ? (
                    <Volume2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
                  ) : live.status === "paused" ? (
                    <MicOff className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
                  ) : live.status === "error" ? (
                    <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" aria-hidden="true" />
                  ) : (
                    <AudioLines className="w-5 h-5 text-blue-400 shrink-0" aria-hidden="true" />
                  )}
                  <p className="text-sm sm:text-base font-semibold tracking-tight truncate">
                    {statusText[live.status]}
                  </p>
                </div>

                {/* Live 7-Bar Waveform Meter */}
                <div aria-hidden="true" className="flex items-center gap-1 h-8 shrink-0">
                  {barMultipliers.map((mult, idx) => {
                    const heightPct = Math.max(14, Math.min(100, Math.round(activeEnergy * mult)));
                    return (
                      <span
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          live.status === "speaking"
                            ? "bg-emerald-400"
                            : live.status === "listening"
                              ? "bg-blue-400"
                              : live.status === "paused"
                                ? "bg-amber-400/60"
                                : "bg-slate-600"
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              <p className="mt-2.5 text-xs text-slate-300 leading-relaxed">
                {live.status === "speaking" ? vf.bargeInHint : vf.noButtonsHint}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-200 me-1.5">
                  {vf.voiceCommandsLabel}:
                </span>
                <span>{vf.voiceCommandsList} · “Open Gmail” · “Open WhatsApp” · “Print”</span>
              </div>
            </div>

            {/* Permission Card for Pre-Filled Gmail / Official WhatsApp */}
            {pendingChannelConfirm && (
              <div
                role="region"
                aria-label={
                  pendingChannelConfirm.channel === "gmail"
                    ? cs.liveGmailConfirmTitle
                    : cs.liveWhatsAppConfirmTitle
                }
                className={`p-4 rounded-xl border space-y-3 ${
                  pendingChannelConfirm.channel === "gmail"
                    ? "bg-blue-50/80 border-blue-200"
                    : "bg-emerald-50/80 border-emerald-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 flex items-center gap-1.5">
                      {pendingChannelConfirm.channel === "gmail" ? (
                        <Mail className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                      )}
                      {pendingChannelConfirm.channel === "gmail"
                        ? cs.liveGmailConfirmTitle
                        : cs.liveWhatsAppConfirmTitle}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-700">
                      {pendingChannelConfirm.channel === "gmail"
                        ? cs.liveGmailConfirmDesc
                        : cs.liveWhatsAppConfirmDesc}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onCancelPendingChannel}
                    aria-label={cs.cancelBtn}
                    className="p-1 text-slate-500 hover:text-slate-900 rounded-lg"
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {pendingChannelConfirm.channel === "gmail" ? (
                  <div className="space-y-2">
                    <div>
                      <label
                        htmlFor="live-voice-gmail-to"
                        className="block text-[11px] font-semibold text-slate-700"
                      >
                        {cs.recipientEmailLabel}
                      </label>
                      <input
                        id="live-voice-gmail-to"
                        type="email"
                        value={pendingChannelConfirm.toEmail}
                        onChange={(e) => onUpdatePendingEmail(e.target.value)}
                        placeholder="department@gov.in"
                        className="mt-1 w-full h-10 px-3 text-xs sm:text-sm font-mono font-semibold text-slate-950 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                      />
                    </div>
                    <p className="text-xs text-slate-800 truncate">
                      <strong className="font-semibold">{t.subjectLabel}:</strong>{" "}
                      {pendingChannelConfirm.subject}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={gmailHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onConfirmOpenChannel("gmail")}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                        {cs.openGmailPrefilledBtn}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={onCancelPendingChannel}
                        className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        {cs.cancelBtn}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingChannelConfirm.toWhatsApp && (
                      <p className="text-xs font-mono font-semibold text-emerald-950">
                        {cs.recipientWhatsAppLabel}:{" "}
                        {pendingChannelConfirm.toWhatsAppDisplay || pendingChannelConfirm.toWhatsApp}
                      </p>
                    )}
                    <p className="text-xs text-slate-800 truncate">
                      <strong className="font-semibold">{t.subjectLabel}:</strong>{" "}
                      {pendingChannelConfirm.subject}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onConfirmOpenChannel("whatsapp")}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        {cs.openWhatsAppPrefilledBtn}
                        <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </a>
                      <button
                        type="button"
                        onClick={onCancelPendingChannel}
                        className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                      >
                        {cs.cancelBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {actionToast && (
              <div
                role="status"
                className="px-4 py-2.5 text-xs sm:text-sm font-medium text-emerald-950 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                <span>{actionToast}</span>
              </div>
            )}

            {displayError && (
              <div
                role="alert"
                className="px-4 py-3 text-xs sm:text-sm text-red-900 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <span>{displayError}</span>
                <button
                  type="button"
                  onClick={() => void live.startSession()}
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg whitespace-nowrap shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  {vf.retryConnectBtn}
                </button>
              </div>
            )}

            {/* Live Transcript Window */}
            <div className="flex-1 flex flex-col min-h-[205px] max-h-[285px]">
              <p className="text-xs font-semibold text-slate-500 mb-2">{vf.transcriptHeading}</p>
              <div className="flex-1 overflow-y-auto space-y-2.5 pe-1">
                {live.transcripts.length === 0 ? (
                  <div className="h-full min-h-[160px] flex items-center justify-center text-center px-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm">
                      {vf.transcriptEmpty}
                    </p>
                  </div>
                ) : (
                  live.transcripts.map((item: LiveTranscriptItem) => (
                    <div
                      key={item.id}
                      className={`flex flex-col ${
                        item.role === "user" ? "items-end" : "items-start"
                      }`}
                    >
                      <span className="text-[11px] font-medium text-slate-500 mb-1">
                        {item.role === "user" ? vf.youLabel : vf.assistantLabel}
                      </span>
                      <div
                        className={`max-w-[88%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${
                          item.role === "user"
                            ? "bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-900 border border-slate-200/80"
                        }`}
                      >
                        {item.text}
                      </div>
                    </div>
                  ))
                )}
                <div ref={transcriptEndRef} />
              </div>
            </div>
          </div>

          {/* Right Column: Live Auto-Filled Progress + Full Voice/Tap Actions */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/60 flex flex-col justify-between gap-4">
            <div>
              <h3 className="text-xs font-semibold text-slate-700">{vf.progressHeading}</h3>

              <div className="mt-3 space-y-2.5">
                {/* 1. Problem & Category */}
                {(() => {
                  const ProblemCatIcon = getCategoryIcon(form.category);
                  return (
                    <div className="p-3 rounded-xl bg-white border border-slate-200/90">
                      <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                        <span className="inline-flex items-center gap-2">
                          <ProblemCatIcon className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                          <span>{vf.fieldProblem}</span>
                        </span>
                        {hasProblem ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                        )}
                      </div>
                      {hasProblem ? (
                        <div className="mt-1 ps-6 space-y-0.5">
                          <p className="text-[11px] font-medium text-blue-800">
                            {t.categories[form.category] ?? form.category}
                          </p>
                          <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                            {form.complaint}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-1 ps-6 text-xs text-slate-400">{vf.waitingToHear}</p>
                      )}
                    </div>
                  );
                })()}

                {/* 2. Location */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/90">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                      <span>{vf.fieldLocation}</span>
                    </span>
                    {hasLocation ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  <p
                    className={`mt-1 ps-6 text-xs leading-relaxed ${
                      hasLocation ? "text-slate-700" : "text-slate-400"
                    }`}
                  >
                    {hasLocation ? locationSummary : vf.waitingToHear}
                  </p>
                </div>

                {/* 3. Citizen Name & Phone */}
                <div className="p-3 rounded-xl bg-white border border-slate-200/90">
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                    <span className="inline-flex items-center gap-2">
                      <User className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                      <span>{vf.fieldContact}</span>
                    </span>
                    {hasContact ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  {form.name.trim() || form.contact.trim() ? (
                    <p className="mt-1 ps-6 text-xs text-slate-700 font-mono tabular-nums">
                      {[form.name.trim(), form.contact.trim()].filter(Boolean).join(" · ")}
                    </p>
                  ) : (
                    <p className="mt-1 ps-6 text-xs text-slate-400">{vf.waitingToHear}</p>
                  )}
                </div>

                {/* 4. Generated Draft, Official Portal & Channels */}
                <div
                  className={`p-3 rounded-xl border ${
                    hasDraft
                      ? "bg-emerald-50/70 border-emerald-200/90"
                      : "bg-white border-slate-200/90"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-900">
                    <span className="inline-flex items-center gap-2">
                      <FileCheck2
                        className={`w-4 h-4 shrink-0 ${hasDraft ? "text-emerald-700" : "text-blue-700"}`}
                        aria-hidden="true"
                      />
                      <span>{vf.fieldDraft}</span>
                    </span>
                    {hasDraft ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                    )}
                  </div>
                  {hasDraft && draftData ? (
                    <div className="mt-1 ps-6 space-y-1">
                      <p className="text-xs font-semibold text-emerald-900">
                        {vf.draftReadyLabel} — {portalName}
                      </p>
                      {officialEmail && (
                        <p className="text-[11px] font-mono text-blue-800 break-all">
                          <Mail className="w-3 h-3 inline me-1" aria-hidden="true" />
                          {officialEmail}
                        </p>
                      )}
                      {officialWhatsApp && (
                        <p className="text-[11px] font-mono text-emerald-800">
                          <MessageCircle className="w-3 h-3 inline me-1" aria-hidden="true" />
                          {officialWhatsAppDisplay || officialWhatsApp}
                        </p>
                      )}
                      <p className="text-xs text-slate-700 line-clamp-2">{draftData.subject}</p>
                    </div>
                  ) : (
                    <p className="mt-1 ps-6 text-xs text-slate-400">{vf.waitingToHear}</p>
                  )}
                </div>

                {/* All Dashboard Actions Available by Voice or Quick Tap */}
                {hasDraft && (
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 space-y-2">
                    <p className="text-[11px] font-semibold text-slate-600">{cs.liveActionsTitle}</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() => void onExecuteVoiceAction("prepare_gmail_compose", spokenLang)}
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Mail className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{cs.actionGmail}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          void onExecuteVoiceAction("prepare_whatsapp_compose", spokenLang)
                        }
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <MessageCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{cs.actionWhatsApp}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void onExecuteVoiceAction("download_pdf", spokenLang)}
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <FileDown className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{cs.actionPdf}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void onExecuteVoiceAction("save_tracker", spokenLang)}
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <BookmarkPlus className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{cs.actionTracker}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void onExecuteVoiceAction("print_letter", spokenLang)}
                        className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        <Printer className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span className="truncate">{cs.actionPrint}</span>
                      </button>

                      {portalUrl ? (
                        <a
                          href={portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{cs.actionPortal}</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishToDraft}
                          className="inline-flex items-center justify-center gap-1 px-2 py-2 text-[11px] font-semibold text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                          <span className="truncate">{cs.actionPortal}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quiet Safety Controls */}
            <div className="pt-3 border-t border-slate-200/80 space-y-2">
              {hasDraft && (
                <button
                  type="button"
                  onClick={handleFinishToDraft}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors min-h-[44px]"
                >
                  <FileText className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {vf.viewDraftBtn}
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={live.toggleMicPause}
                  disabled={live.status === "connecting" || live.status === "error"}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl transition-colors min-h-[44px] disabled:opacity-50"
                >
                  {live.micPaused ? (
                    <>
                      <Mic className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                      {vf.resumeMicBtn}
                    </>
                  ) : (
                    <>
                      <MicOff className="w-4 h-4 text-slate-600 shrink-0" aria-hidden="true" />
                      {vf.pauseMicBtn}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors min-h-[44px]"
                >
                  <PhoneOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {vf.endSessionBtn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
