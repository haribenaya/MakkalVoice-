import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  AudioLines,
  CheckCircle2,
  Circle,
  FileCheck2,
  FileText,
  Globe,
  Loader2,
  MapPin,
  Mic,
  MicOff,
  PhoneOff,
  RefreshCw,
  User,
  Volume2,
  X,
} from "lucide-react";
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

interface LiveVoiceFlowModalProps {
  open: boolean;
  onClose: () => void;
  t: UiStrings;
  dashboardLanguage: string;
  form: ComplaintFormState;
  draftData: DraftResponse | null;
  portalName: string;
  actionToast: string | null;
  onIntakeUpdate: (patch: LiveIntakePatch) => void;
  onGenerateDraftCommand: (
    draftLanguage: string,
    spokenLanguage: string,
  ) => Promise<LiveVoiceCommandResult>;
  onExecuteVoiceAction: (
    action: string,
    spokenLanguage: string,
  ) => Promise<LiveVoiceCommandResult>;
  onOpenDraftScreen: () => void;
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function LiveVoiceFlowModal({
  open,
  onClose,
  t,
  dashboardLanguage,
  form,
  draftData,
  portalName,
  actionToast,
  onIntakeUpdate,
  onGenerateDraftCommand,
  onExecuteVoiceAction,
  onOpenDraftScreen,
}: LiveVoiceFlowModalProps) {
  const vf = getVoiceFlowStrings(dashboardLanguage);
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-voice-studio-title"
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto">
        {/* Top Studio Bar */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
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

          <div className="flex items-center gap-3 shrink-0">
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
          {/* Left Column: Live Continuous Audio Presence + Real-Time Conversation */}
          <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-5">
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
                <div
                  aria-hidden="true"
                  className="flex items-center gap-1 h-8 shrink-0"
                >
                  {barMultipliers.map((mult, idx) => {
                    const heightPct =
                      live.status === "speaking"
                        ? Math.max(22, Math.min(100, Math.round(activeEnergy * mult)))
                        : Math.max(14, Math.min(100, Math.round(activeEnergy * mult)));
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
                <span>{vf.voiceCommandsList}</span>
              </div>
            </div>

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
            <div className="flex-1 flex flex-col min-h-[210px] max-h-[290px]">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                {vf.transcriptHeading}
              </p>
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

          {/* Right Column: Live Auto-Filled Progress (Hands-Free Form Watch) */}
          <div className="lg:col-span-5 p-5 sm:p-6 bg-slate-50/60 flex flex-col justify-between gap-5">
            <div>
              <h3 className="text-xs font-semibold text-slate-700">
                {vf.progressHeading}
              </h3>

              <div className="mt-3.5 space-y-3">
                {/* 1. Problem & Category */}
                {(() => {
                  const ProblemCatIcon = getCategoryIcon(form.category);
                  return (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/90">
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
                        <div className="mt-1.5 ps-6 space-y-1">
                          <p className="text-[11px] font-medium text-blue-800">
                            {t.categories[form.category] ?? form.category}
                          </p>
                          <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed">
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
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90">
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
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/90">
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

                {/* 4. Generated Draft & Official Portal */}
                <div
                  className={`p-3.5 rounded-xl border ${
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
                    <div className="mt-1.5 ps-6 space-y-1">
                      <p className="text-xs font-semibold text-emerald-900">
                        {vf.draftReadyLabel} — {portalName}
                      </p>
                      <p className="text-xs text-slate-700 line-clamp-2">
                        {draftData.subject}
                      </p>
                    </div>
                  ) : (
                    <p className="mt-1 ps-6 text-xs text-slate-400">{vf.waitingToHear}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Quiet Safety Controls (optional — not required during normal hands-free voice flow) */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2.5">
              {hasDraft && (
                <button
                  type="button"
                  onClick={handleFinishToDraft}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors min-h-[44px]"
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
