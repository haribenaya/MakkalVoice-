import { useEffect, useRef } from "react";
import {
  ArrowLeft,
  FileText,
  Loader2,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import { getLocalizedError } from "../data/localizedErrors";
import type { UiStrings } from "../data/translations";
import type { AnswerEntry, ChatMessage } from "../types";

interface ClarifyChatProps {
  t: UiStrings;
  language: string;
  categoryLabel: string;
  locationLabel: string;
  messages: ChatMessage[];
  answers: AnswerEntry[];
  currentQuestion: string;
  answerInput: string;
  onAnswerInputChange: (val: string) => void;
  onSubmitAnswer: () => void;
  onSkipToDraft: () => void;
  onBackToForm: () => void;
  busy: boolean;
  isListening: boolean;
  isTranscribing: boolean;
  voiceAudioLevel: number;
  voiceElapsedSeconds: number;
  voiceLiveTranscript?: string;
  speechSupported: boolean;
  onToggleVoice: () => void;
  isSpeakingId: string | null;
  speechOutputSupported: boolean;
  autoReadAloud: boolean;
  onToggleAutoRead: () => void;
  onSpeakMessage: (id: string, text: string) => void;
  onStopSpeaking: () => void;
  onRetryQuestion?: () => void;
  errorMessage: string | null;
}

export function ClarifyChat({
  t,
  language,
  categoryLabel,
  locationLabel,
  messages,
  answers,
  currentQuestion,
  answerInput,
  onAnswerInputChange,
  onSubmitAnswer,
  onSkipToDraft,
  onBackToForm,
  busy,
  isListening,
  isTranscribing,
  voiceAudioLevel,
  voiceElapsedSeconds,
  voiceLiveTranscript = "",
  speechSupported,
  onToggleVoice,
  isSpeakingId,
  speechOutputSupported,
  autoReadAloud,
  onToggleAutoRead,
  onSpeakMessage,
  onStopSpeaking,
  onRetryQuestion,
  errorMessage,
}: ClarifyChatProps) {
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, busy]);

  const elapsedLabel = `${Math.floor(voiceElapsedSeconds / 60)}:${voiceElapsedSeconds % 60 < 10 ? "0" : ""}${voiceElapsedSeconds % 60}`;

  return (
    <section
      aria-labelledby="clarify-heading"
      className="bg-white border border-slate-200/90 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.05)] p-5 sm:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-blue-700">{t.step2Kicker}</span>
            <span aria-hidden="true">·</span>
            <span>{categoryLabel}</span>
            {locationLabel && (
              <>
                <span aria-hidden="true">·</span>
                <span>{locationLabel}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              {answers.length} / 4 {t.answeredCountSuffix}
            </span>
          </div>
          <h2
            id="clarify-heading"
            className="mt-1.5 font-display text-2xl font-bold tracking-tight text-slate-950"
          >
            {t.step2Heading}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onBackToForm}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-50"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            {t.editForm}
          </button>

          <button
            type="button"
            onClick={onSkipToDraft}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-blue-700 border border-blue-200 bg-blue-50/60 hover:bg-blue-50 rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[44px] disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5" aria-hidden="true" />
            {t.generateDraftNow}
          </button>
        </div>
      </div>

      {/* Auto-read aloud accessibility switch */}
      {speechOutputSupported && (
        <div className="mt-4 flex items-center justify-between gap-3 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-lg">
          <label
            htmlFor="auto-read-toggle"
            className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
            {t.autoReadLabel}
          </label>
          <input
            id="auto-read-toggle"
            type="checkbox"
            checked={autoReadAloud}
            onChange={onToggleAutoRead}
            className="h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
          />
        </div>
      )}

      {/* Conversation Stream */}
      <div
        role="log"
        aria-live="polite"
        className="mt-5 space-y-4 max-h-[420px] overflow-y-auto pr-1"
      >
        {messages.map((msg) => {
          const isAssistant = msg.role === "assistant";
          const isReadingThis = isSpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[90%] md:max-w-[80%] rounded-xl px-4 py-3.5 text-base leading-relaxed ${
                  isAssistant
                    ? "bg-slate-50 border border-slate-200 text-slate-950"
                    : "bg-slate-900 text-white"
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1.5">
                  <span
                    className={`text-xs font-medium ${
                      isAssistant ? "text-slate-500" : "text-slate-300"
                    }`}
                  >
                    {isAssistant ? t.assistantLabel : t.yourAnswerLabel}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono tabular-nums text-slate-400">
                      {msg.timestamp}
                    </span>

                    {isAssistant && speechOutputSupported && (
                      <button
                        type="button"
                        onClick={() =>
                          isReadingThis
                            ? onStopSpeaking()
                            : onSpeakMessage(msg.id, msg.text)
                        }
                        className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 transition-colors whitespace-nowrap"
                      >
                        {isReadingThis ? (
                          <>
                            <VolumeX className="w-4 h-4" aria-hidden="true" />
                            {t.stopBtn}
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" aria-hidden="true" />
                            {t.listenBtn}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}

        {busy && (
          <div className="flex justify-start">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-600">
              {currentQuestion ? t.processingAnswer : t.preparingQuestion}
            </div>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mt-4 px-4 py-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        >
          <span>{errorMessage}</span>
          <div className="flex items-center gap-2 shrink-0">
            {onRetryQuestion && (
              <button
                type="button"
                disabled={busy}
                onClick={onRetryQuestion}
                className="px-3 py-1.5 text-xs font-semibold text-red-900 bg-white border border-red-300 hover:bg-red-100 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
              >
                {t.regenerate}
              </button>
            )}
            <button
              type="button"
              disabled={busy}
              onClick={onSkipToDraft}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
            >
              {t.generateDraftNow}
            </button>
          </div>
        </div>
      )}

      {/* Voice-First Answer Bar */}
      <form
        className="mt-6 pt-5 border-t border-slate-200 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitAnswer();
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label
            htmlFor="followup-answer-input"
            className="text-sm font-medium text-slate-800"
          >
            {t.replyPrompt}
          </label>

          {speechSupported && (
            <button
              type="button"
              onClick={onToggleVoice}
              disabled={busy || isTranscribing}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 min-h-[48px] ${
                isListening
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              }`}
            >
              {isTranscribing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  <span>{getLocalizedError("CONVERTING_VOICE", language)}</span>
                </>
              ) : isListening ? (
                <>
                  <MicOff className="w-4 h-4" aria-hidden="true" />
                  <span>
                    {t.stopListening} ({elapsedLabel})
                  </span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" aria-hidden="true" />
                  {t.speakAnswer}
                </>
              )}
            </button>
          )}
        </div>

        {isListening && (
          <div
            role="status"
            aria-live="polite"
            className="px-4 py-3 text-sm bg-red-50 text-red-900 border border-red-200 rounded-lg space-y-2"
          >
            <div className="flex items-center justify-between gap-2 text-xs font-medium">
              <span>{t.listeningNow}</span>
              <span className="font-mono tabular-nums">{elapsedLabel}</span>
            </div>
            <div className="w-full h-2 bg-red-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-75"
                style={{ width: `${Math.max(8, voiceAudioLevel)}%` }}
              />
            </div>
            {voiceLiveTranscript && (
              <p className="text-xs text-slate-800 bg-white/90 border border-red-200/70 rounded-lg px-3 py-2">
                {voiceLiveTranscript}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="followup-answer-input"
            type="text"
            value={answerInput}
            onChange={(e) => onAnswerInputChange(e.target.value)}
            disabled={busy}
            placeholder={t.answerPlaceholder}
            className="flex-1 h-12 px-4 text-base text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={busy || !answerInput.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 h-12 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            {t.sendAnswer}
          </button>
        </div>
      </form>
    </section>
  );
}
