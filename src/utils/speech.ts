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
  return typeof window !== "undefined" && "speechSynthesis" in window;
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

export function speakText(
  text: string,
  locale: string,
  onStart?: () => void,
  onEnd?: () => void,
  onError?: (msg: string) => void,
): void {
  if (!isSpeechSynthesisSupported()) {
    onError?.("Read-aloud voice output is not supported in this browser.");
    return;
  }

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

    utterance.onstart = () => onStart?.();
    utterance.onend = () => onEnd?.();
    utterance.onerror = () => {
      onEnd?.();
      onError?.("Could not play audio in this language on your browser.");
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    onEnd?.();
    onError?.("Could not start speech playback.");
  }
}

export function stopSpeakingText(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}
