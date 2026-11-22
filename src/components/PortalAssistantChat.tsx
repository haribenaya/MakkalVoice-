import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  Mic,
  RotateCcw,
  Send,
  Square,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { LANGUAGE_LOCALE_MAP } from "../data/languages";
import type { SubmissionUiStrings } from "../data/submissionTranslations";
import type { PortalChatMessage } from "../types";
import {
  getSpeechRecognitionConstructor,
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  mapSpeechError,
  speakText,
  stopSpeakingText,
  type SpeechRecognitionLike,
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
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechInputSupported = isSpeechRecognitionSupported();
  const speechOutputSupported = isSpeechSynthesisSupported();

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

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
      return;
    }
    setVoiceError(null);
    stopSpeakingText();
    setSpeakingId(null);

    const SpeechCtor = getSpeechRecognitionConstructor();
    if (!SpeechCtor) {
      setVoiceError(voiceUnsupportedText || "Voice input is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechCtor();
      recognition.lang = LANGUAGE_LOCALE_MAP[language] ?? "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let spoken = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          if (event.results[i].isFinal) {
            spoken += event.results[i][0]?.transcript ?? "";
          }
        }
        if (spoken.trim()) {
          setInput((prev) =>
            prev.trim() ? `${prev.trim()} ${spoken.trim()}` : spoken.trim(),
          );
        }
      };
      recognition.onerror = (event) => {
        const mapped = mapSpeechError(event.error);
        if (mapped) setVoiceError(mapped);
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError(voiceUnsupportedText || "Could not start voice input. Please type your question.");
    }
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
                <span className="truncate">{language}</span>
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

          {/* Composer */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-slate-200 bg-slate-50 flex items-center gap-2"
          >
            {speechInputSupported && (
              <button
                type="button"
                onClick={toggleVoiceInput}
                disabled={busy}
                aria-label={isListening ? st.chatStopListening : st.chatSpeakBtn}
                title={isListening ? st.chatStopListening : st.chatSpeakBtn}
                className={`inline-flex items-center justify-center w-11 h-11 rounded-lg border transition-colors shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
                }`}
              >
                {isListening ? (
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
              disabled={busy || !input.trim()}
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
