import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, Mic, MicOff, Volume2, X } from "lucide-react";
import { LANGUAGE_LOCALE_MAP } from "../data/languages";
import type { InnovationStrings } from "../data/innovationTranslations";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeakingText,
} from "../utils/speech";

interface HandsFreeVoiceModalProps {
  open: boolean;
  onClose: () => void;
  language: string;
  it: InnovationStrings;
  initialComplaint: string;
  onComplete: (spokenComplaint: string, spokenLocation: string) => void;
}

type VoiceStage = "describe" | "location" | "ready";

function formatElapsed(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export function HandsFreeVoiceModal({
  open,
  onClose,
  language,
  it,
  initialComplaint,
  onComplete,
}: HandsFreeVoiceModalProps) {
  const [stage, setStage] = useState<VoiceStage>("describe");
  const [spokenProblem, setSpokenProblem] = useState("");
  const [spokenLocation, setSpokenLocation] = useState("");
  const [errorText, setErrorText] = useState<string | null>(null);

  const locale = LANGUAGE_LOCALE_MAP[language] ?? "en-IN";
  const ttsSupported = isSpeechSynthesisSupported();

  const recorder = useVoiceRecorder({
    language,
    onTranscript: (text) => {
      if (stage === "describe") {
        setSpokenProblem((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      } else if (stage === "location") {
        setSpokenLocation((prev) => (prev.trim() ? `${prev.trim()} ${text}` : text));
      }
    },
    onError: (msg) => setErrorText(msg),
  });

  const readPrompt = useCallback(
    (text: string) => {
      if (!ttsSupported) return;
      stopSpeakingText();
      speakText(text, locale);
    },
    [locale, ttsSupported],
  );

  useEffect(() => {
    if (!open) {
      recorder.cancelRecording();
      stopSpeakingText();
      return;
    }
    setStage("describe");
    setSpokenProblem(initialComplaint);
    setSpokenLocation("");
    setErrorText(null);
    readPrompt(it.handsFreePromptDescribe);
    return () => {
      recorder.cancelRecording();
      stopSpeakingText();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialComplaint, it.handsFreePromptDescribe]);

  if (!open) return null;

  const currentPrompt =
    stage === "describe"
      ? it.handsFreePromptDescribe
      : stage === "location"
        ? it.handsFreePromptLocation
        : it.handsFreePromptReady;

  const toggleListen = () => {
    setErrorText(null);
    if (recorder.isRecording) {
      recorder.stopRecording();
      return;
    }
    stopSpeakingText();
    void recorder.startRecording();
  };

  const handleAdvance = () => {
    if (recorder.isRecording) recorder.stopRecording();
    if (stage === "describe") {
      setStage("location");
      readPrompt(it.handsFreePromptLocation);
    } else if (stage === "location") {
      setStage("ready");
      readPrompt(it.handsFreePromptReady);
    } else {
      stopSpeakingText();
      onComplete(spokenProblem.trim(), spokenLocation.trim());
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="hands-free-heading"
      className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
    >
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <h2
              id="hands-free-heading"
              className="font-display text-xl font-bold text-slate-950"
            >
              {it.handsFreeTitle}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {it.handsFreeSub}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              recorder.cancelRecording();
              stopSpeakingText();
              onClose();
            }}
            aria-label={it.handsFreeClose}
            className="p-2 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Spoken Prompt Box */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-start justify-between gap-3">
          <p className="text-base font-medium text-slate-900 leading-relaxed">
            {currentPrompt}
          </p>
          {ttsSupported && (
            <button
              type="button"
              onClick={() => readPrompt(currentPrompt)}
              className="p-2 text-blue-700 hover:bg-blue-100 rounded-lg shrink-0"
              aria-label="Replay voice prompt"
            >
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Big Accessible Tap-to-Speak Control with Live Voice Level Meter */}
        {stage !== "ready" && (
          <div className="flex flex-col items-center gap-3 py-2">
            <button
              type="button"
              disabled={!recorder.isSupported || recorder.isTranscribing}
              onClick={toggleListen}
              className={`w-full py-5 px-6 rounded-2xl text-lg font-semibold text-white flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 ${
                recorder.isRecording
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-700 hover:bg-blue-800"
              }`}
            >
              {recorder.isTranscribing ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin shrink-0" aria-hidden="true" />
                  <span>Converting voice to text...</span>
                </>
              ) : recorder.isRecording ? (
                <>
                  <MicOff className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span>
                    {it.handsFreeListening} ({formatElapsed(recorder.elapsedSeconds)})
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-6 h-6 shrink-0" aria-hidden="true" />
                  <span>{it.handsFreeTapSpeak}</span>
                </>
              )}
            </button>

            {recorder.isRecording && (
              <div className="w-full space-y-1.5">
                <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-600 transition-all duration-75"
                    style={{ width: `${Math.max(8, recorder.audioLevel)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Captured Transcript Preview */}
        <div className="space-y-3">
          {spokenProblem && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-medium text-slate-500">01</p>
              <p className="mt-1 text-sm text-slate-900 leading-relaxed">{spokenProblem}</p>
            </div>
          )}
          {spokenLocation && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-medium text-slate-500">02</p>
              <p className="mt-1 text-sm text-slate-900 leading-relaxed">{spokenLocation}</p>
            </div>
          )}
        </div>

        {errorText && (
          <p role="alert" className="text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {errorText}
          </p>
        )}

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              recorder.cancelRecording();
              stopSpeakingText();
              onClose();
            }}
            className="px-4 py-3 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
          >
            {it.handsFreeClose}
          </button>

          <button
            type="button"
            disabled={
              recorder.isTranscribing ||
              (stage === "describe" && spokenProblem.trim().length < 4)
            }
            onClick={handleAdvance}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{stage === "ready" ? it.handsFreeUseInForm : it.handsFreeDoneNext}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
