export interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [altIndex: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognitionErrorEventLike {
  error: string;
}

export interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

export function getSpeechRecognitionConstructor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

export function isSpeechRecognitionSupported(): boolean {
  return getSpeechRecognitionConstructor() !== null;
}

export function isSpeechSynthesisSupported(): boolean {
  // Neural WAV playback via /api/tts + Audio works across all modern browsers
  return typeof window !== "undefined" && (typeof Audio !== "undefined" || "speechSynthesis" in window);
}

export function mapSpeechError(errorCode: string): string {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone permission was blocked. Please allow microphone access in your browser settings, or type your complaint.";
    case "no-speech":
      return "No speech was detected. Please speak clearly near your microphone and try again.";
    case "audio-capture":
      return "No microphone was found on this device. Please connect a microphone or type your complaint.";
    case "network":
      return "Voice recognition requires an active internet connection. Please check your connection or type instead.";
    case "aborted":
      return "";
    default:
      return "Voice input failed. Please try again or type your text directly.";
  }
}

// Active neural TTS audio state for clean interruption / cancellation
let activeAudioElement: HTMLAudioElement | null = null;
let activeAudioObjectUrl: string | null = null;
let activeTtsAbort: AbortController | null = null;
let activePlaybackGeneration = 0;

function cleanupActiveNeuralAudio(): void {
  if (activeTtsAbort) {
    activeTtsAbort.abort();
    activeTtsAbort = null;
  }
  if (activeAudioElement) {
    try {
      activeAudioElement.onplay = null;
      activeAudioElement.onended = null;
      activeAudioElement.onerror = null;
      activeAudioElement.pause();
      activeAudioElement.src = "";
    } catch {
      // Ignore cleanup errors
    }
    activeAudioElement = null;
  }
  if (activeAudioObjectUrl) {
    try {
      URL.revokeObjectURL(activeAudioObjectUrl);
    } catch {
      // Ignore
    }
    activeAudioObjectUrl = null;
  }
}

function speakWithBrowserFallback(
  text: string,
  locale: string,
  generation: number,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (msg: string) => void,
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    onEnd?.();
    return;
  }
  if (generation !== activePlaybackGeneration) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = locale;
    utterance.rate = 0.96;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = locale.split("-")[0].toLowerCase();
    const exactMatch = voices.find((v) => v.lang.toLowerCase() === locale.toLowerCase());
    const prefixMatch = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
    if (exactMatch) {
      utterance.voice = exactMatch;
    } else if (prefixMatch) {
      utterance.voice = prefixMatch;
    }

    utterance.onstart = () => {
      if (generation === activePlaybackGeneration) onStart?.();
    };
    utterance.onend = () => {
      if (generation === activePlaybackGeneration) onEnd?.();
    };
    utterance.onerror = (event) => {
      if (generation !== activePlaybackGeneration) return;
      onEnd?.();
      const code = (event as SpeechSynthesisErrorEvent)?.error;
      if (code === "canceled" || code === "interrupted") {
        return;
      }
      onError?.("");
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
    onError?.("");
  }
}

function inferLanguageFromLocale(locale: string): string {
  const prefix = (locale || "en-IN").split("-")[0].toLowerCase();
  const map: Record<string, string> = {
    en: "English",
    ta: "Tamil",
    hi: "Hindi",
    te: "Telugu",
    kn: "Kannada",
    ml: "Malayalam",
    bn: "Bengali",
    mr: "Marathi",
    gu: "Gujarati",
    pa: "Punjabi",
    or: "Odia",
    as: "Assamese",
    ur: "Urdu",
  };
  return map[prefix] ?? "English";
}

function base64ToBlobUrl(base64: string, mimeType: string): string {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Speaks text using Gemini 3.8 Flash Lite Neural TTS (/api/tts) for warm, natural Indian regional voices.
 * Falls back cleanly to browser speechSynthesis only when offline or if neural TTS is temporarily unavailable.
 */
export function speakText(
  text: string,
  locale: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (msg: string) => void,
  languageName?: string,
): void {
  const trimmed = text.trim();
  if (!trimmed || typeof window === "undefined") {
    onEnd?.();
    return;
  }

  stopSpeakingText();
  const generation = ++activePlaybackGeneration;

  // If device is offline, use local speechSynthesis immediately
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    speakWithBrowserFallback(trimmed, locale, generation, onStart, onEnd, onError);
    return;
  }

  const controller = new AbortController();
  activeTtsAbort = controller;
  const resolvedLanguage = languageName || inferLanguageFromLocale(locale);

  // Immediately signal active speaking state so UI button toggles to "Stop" right away
  onStart?.();

  void (async () => {
    try {
      const resp = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: trimmed.slice(0, 1600),
          language: resolvedLanguage,
          voiceName: "Kore",
        }),
        signal: controller.signal,
      });

      if (generation !== activePlaybackGeneration) return;

      if (!resp.ok) {
        speakWithBrowserFallback(trimmed, locale, generation, undefined, onEnd, onError);
        return;
      }

      const data = (await resp.json()) as { audioBase64?: string; mimeType?: string };
      if (generation !== activePlaybackGeneration) return;

      if (!data.audioBase64) {
        speakWithBrowserFallback(trimmed, locale, generation, undefined, onEnd, onError);
        return;
      }

      const objectUrl = base64ToBlobUrl(data.audioBase64, data.mimeType || "audio/wav");
      if (generation !== activePlaybackGeneration) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      const audio = new Audio(objectUrl);
      activeAudioElement = audio;
      activeAudioObjectUrl = objectUrl;

      audio.onended = () => {
        if (generation === activePlaybackGeneration) {
          cleanupActiveNeuralAudio();
          onEnd?.();
        }
      };

      audio.onerror = () => {
        if (generation === activePlaybackGeneration) {
          cleanupActiveNeuralAudio();
          speakWithBrowserFallback(trimmed, locale, generation, undefined, onEnd, onError);
        }
      };

      await audio.play();
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        return;
      }
      if (generation !== activePlaybackGeneration) return;
      speakWithBrowserFallback(trimmed, locale, generation, undefined, onEnd, onError);
    }
  })();
}

export function stopSpeakingText(): void {
  activePlaybackGeneration += 1;
  cleanupActiveNeuralAudio();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
