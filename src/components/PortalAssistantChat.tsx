import { useEffect, useRef, useState } from "react";
import {
  Loader2,
  MessageSquare,
  Mic,
  RotateCcw,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { LANGUAGES, LANGUAGE_LOCALE_MAP } from "../data/languages";
import { getLocalizedError } from "../data/localizedErrors";
import type { SubmissionUiStrings } from "../data/submissionTranslations";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import type { PortalChatMessage } from "../types";
import {
  isSpeechSynthesisSupported,
  speakText,
  stopSpeakingText,
} from "../utils/speech";

interface PortalAssistantChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  st: SubmissionUiStrings;
  language: string;
  portalName: string;
  hasActiveDraft: boolean;
  messages: PortalChatMessage[];
  busy: boolean;
  errorMessage: string | null;
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  voiceUnsupportedText?: string;
}

export function PortalAssistantChat({
  open,
  onOpenChange,
  st,
  language,
  portalName,
  hasActiveDraft,
  messages,
  busy,
  errorMessage,
  onSendMessage,
  onClearChat,
  voiceUnsupportedText,
}: PortalAssistantChatProps) {
  const [input, setInput] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const speechOutputSupported = isSpeechSynthesisSupported();

  const recorder = useVoiceRecorder({
    language,
    onTranscript: (spoken) => {
      const cleanedSpoken = spoken.trim();
      if (!cleanedSpoken) return;
      setInput((prev) => {
        const trimmedPrev = prev.trim();
        if (!trimmedPrev) return cleanedSpoken;
        if (trimmedPrev.endsWith(cleanedSpoken)) return prev;
        return `${trimmedPrev} ${cleanedSpoken}`;
      });
    },
    onError: (msg) =>
      setVoiceError(msg || voiceUnsupportedText || getLocalizedError("MIC_GENERIC", language)),
  });

  const speechInputSupported = recorder.isSupported;
  const isListening = recorder.isRecording;

  // Auto-scroll scrollable thread whenever messages change or panel opens
  useEffect(() => {
    if (open) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, messages, busy]);

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  // Cleanup voice handles on unmount
  useEffect(() => {
    return () => {
      recorder.cancelRecording();
      stopSpeakingText();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopListening = () => {
    recorder.stopRecording();
  };

  const toggleVoiceInput = () => {
    if (recorder.isRecording) {
      recorder.stopRecording();
      return;
    }
    if (recorder.isTranscribing) return;
    setVoiceError(null);
    stopSpeakingText();
    setSpeakingId(null);
    void recorder.startRecording();
  };

  const toggleSpeakReply = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeakingText();
      setSpeakingId(null);
      return;
    }
    stopListening();
    const locale = LANGUAGE_LOCALE_MAP[language] ?? "en-IN";
    speakText(
      text,
      locale,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || busy) return;
    stopListening();
    setInput("");
    onSendMessage(trimmed);
  };

  const handleSuggestionClick = (question: string) => {
    if (busy) return;
    stopListening();
    onSendMessage(question);
  };

  const quickSuggestions = [
    st.chatSuggestion1,
    st.chatSuggestion2,
    st.chatSuggestion3,
  ];

  return (
    <>
      {/* Floating launcher button when closed */}
      {!open && (
        <div className="fixed bottom-4 end-4 z-40">
          <button
            type="button"
            onClick={() => onOpenChange(true)}
            className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md border border-slate-800 transition-colors whitespace-nowrap min-h-[48px]"
          >
            <MessageSquare className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{st.chatOpenBtn}</span>
          </button>
        </div>
      )}

      {/* Multi-Turn Gemini Chatbot Panel */}
      {open && (
        <aside
          aria-label={st.chatTitle}
          className="fixed bottom-3 end-3 sm:bottom-5 sm:end-5 z-50 w-[calc(100vw-1.5rem)] sm:w-[420px] max-h-[min(640px,84vh)] bg-white border border-slate-300 rounded-xl shadow-xl flex flex-col overflow-hidden"
        >
          {/* Chat Header */}
          <div className="px-4 py-3.5 border-b border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-medium text-blue-700">{st.chatRoleLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="truncate">
                  {LANGUAGES.find((l) => l.name === language)?.nativeLabel ?? language}
                </span>
              </div>
              <h2 className="mt-0.5 text-base font-semibold text-slate-950 truncate">
                {st.chatTitle}
              </h2>
              <p className="text-xs text-slate-600 truncate">
                {hasActiveDraft ? portalName : st.chatSubtitle}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    stopSpeakingText();
                    setSpeakingId(null);
                    onClearChat();
                  }}
                  title={st.chatClearBtn}
                  aria-label={st.chatClearBtn}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  stopListening();
                  stopSpeakingText();
                  setSpeakingId(null);
                  onOpenChange(false);
                }}
                aria-label={st.modalCloseLabel}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div
            role="log"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 bg-white min-h-[240px]"
          >
            {/* Assistant Welcome Message */}
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-xl px-3.5 py-3 text-sm leading-relaxed bg-slate-50 text-slate-900 border border-slate-200">
                <div className="flex items-center justify-between gap-3 text-xs text-slate-500 mb-1">
                  <span className="font-medium text-slate-700">MakkalVoice</span>
                  {hasActiveDraft && (
                    <span className="truncate text-blue-700">{st.chatContextActive}</span>
                  )}
                </div>
                <p>{st.chatWelcome}</p>
              </div>
            </div>

            {/* Quick Starter Prompts when thread is empty */}
            {messages.length === 0 && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-medium text-slate-500">
                  {st.chatSuggestionsLabel}
                </p>
                <div className="flex flex-col gap-2">
                  {quickSuggestions.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      disabled={busy}
                      onClick={() => handleSuggestionClick(prompt)}
                      className="text-start px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 rounded-lg transition-colors min-h-[40px]"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Multi-Turn Conversation History */}
            {messages.map((msg) => {
              const isModel = msg.role === "model";
              const isReadingThis = speakingId === msg.id;

              return (
                <div
                  key={msg.id}
                  className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3.5 py-3 text-sm leading-relaxed ${
                      isModel
                        ? "bg-slate-50 text-slate-900 border border-slate-200"
                        : "bg-slate-900 text-white"
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between gap-3 text-xs mb-1 ${
                        isModel ? "text-slate-500" : "text-slate-300"
                      }`}
                    >
                      <span className="font-medium">
                        {isModel ? "MakkalVoice" : st.chatYouLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono tabular-nums">{msg.timestamp}</span>
                        {isModel && speechOutputSupported && (
                          <button
                            type="button"
                            onClick={() => toggleSpeakReply(msg.id, msg.text)}
                            className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-medium"
                          >
                            {isReadingThis ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
                                {st.chatStopReply}
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
                                {st.chatListenReply}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {busy && (
              <div className="flex justify-start">
                <div className="rounded-xl px-3.5 py-2.5 text-xs text-slate-600 bg-slate-50 border border-slate-200">
                  {st.chatSending}
                </div>
              </div>
            )}

            <div ref={threadEndRef} />
          </div>

          {/* Errors */}
          {(errorMessage || voiceError) && (
            <div
              role="alert"
              className="mx-4 mb-2 px-3 py-2 text-xs text-red-800 bg-red-50 border border-red-200 rounded-lg"
            >
              {errorMessage || voiceError}
            </div>
          )}

          {/* Live Voice Recording / Transcribing Indicator */}
          {(isListening || recorder.isTranscribing) && (
            <div className="mx-3 mb-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50/90 space-y-1.5 text-xs">
              {isListening ? (
                <>
                  <div className="flex items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse shrink-0" />
                      <span className="font-medium text-red-800 truncate">
                        {st.chatStopListening}
                      </span>
                      <span className="font-mono tabular-nums text-red-700 shrink-0">
                        {Math.floor(recorder.elapsedSeconds / 60)}:
                        {String(recorder.elapsedSeconds % 60).padStart(2, "0")}
                      </span>
                    </div>
                    <div
                      className="w-16 h-1.5 bg-red-200 rounded-full overflow-hidden shrink-0"
                      aria-hidden="true"
                    >
                      <div
                        className="h-full bg-red-600 transition-all duration-75"
                        style={{ width: `${Math.max(10, recorder.audioLevel)}%` }}
                      />
                    </div>
                  </div>
                  {recorder.liveTranscript && (
                    <p className="text-[11px] text-slate-700 bg-white/90 rounded px-2 py-1 italic truncate">
                      {recorder.liveTranscript}
                    </p>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2 text-blue-800 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" aria-hidden="true" />
                  <span>{getLocalizedError("CONVERTING_VOICE", language)}</span>
                </div>
              )}
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2"
          >
            {speechInputSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={busy || recorder.isTranscribing}
                aria-label={isListening ? st.chatStopListening : st.chatSpeakBtn}
                title={isListening ? st.chatStopListening : st.chatSpeakBtn}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors shrink-0 disabled:opacity-60 ${
                  isListening
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                    : recorder.isTranscribing
                      ? "bg-blue-50 text-blue-700 border-blue-300"
                      : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {recorder.isTranscribing ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : isListening ? (
                  <Square className="w-4 h-4 fill-current" aria-hidden="true" />
                ) : (
                  <Mic className="w-4 h-4" aria-hidden="true" />
                )}
              </button>
            )}

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={busy}
              placeholder={st.chatPlaceholder}
              className="flex-1 min-w-0 h-11 px-3.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={busy || recorder.isTranscribing || !input.trim()}
              aria-label={st.chatSendBtn}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 h-11 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors whitespace-nowrap shrink-0 disabled:opacity-45"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">{st.chatSendBtn}</span>
            </button>
          </form>
        </aside>
      )}
    </>
  );
}
