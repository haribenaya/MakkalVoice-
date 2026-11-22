import { useCallback, useEffect, useRef, useState } from "react";
import { LANGUAGE_LOCALE_MAP } from "../data/languages";
import {
  getLocalizedError,
  resolveLocalizedErrorMessage,
} from "../data/localizedErrors";
import { requestAudioTranscription } from "../utils/api";
import { getSpeechRecognitionConstructor } from "../utils/speech";

export interface UseVoiceRecorderOptions {
  language: string;
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
  /** When true (Hands-Free Mode), automatically stops recording ~2.4s after user finishes speaking */
  autoStopOnSilence?: boolean;
}

export interface UseVoiceRecorderResult {
  isSupported: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  audioLevel: number; // 0..100 live mic activity meter
  elapsedSeconds: number;
  liveTranscript: string; // Real-time preview while speaking (Wispr-Flow style)
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  cancelRecording: () => void;
}

function pickSupportedMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ];
  for (const type of candidates) {
    try {
      if (MediaRecorder.isTypeSupported(type)) return type;
    } catch {
      // ignore
    }
  }
  return "";
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const commaIdx = result.indexOf(",");
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read recorded audio."));
    reader.readAsDataURL(blob);
  });
}

export function isVoiceRecorderSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    ((typeof navigator.mediaDevices?.getUserMedia === "function" &&
      typeof MediaRecorder !== "undefined") ||
      Boolean(getSpeechRecognitionConstructor()))
  );
}

export function useVoiceRecorder({
  language,
  onTranscript,
  onError,
  autoStopOnSilence = false,
}: UseVoiceRecorderOptions): UseVoiceRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const liveRecogRef = useRef<
    InstanceType<NonNullable<ReturnType<typeof getSpeechRecognitionConstructor>>> | null
  >(null);
  const liveCapturedTextRef = useRef("");
  const usingRecognitionOnlyRef = useRef(false);

  const languageRef = useRef(language);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  const autoStopRef = useRef(autoStopOnSilence);
  languageRef.current = language;
  onTranscriptRef.current = onTranscript;
  onErrorRef.current = onError;
  autoStopRef.current = autoStopOnSilence;

  const stopLiveRecognizer = useCallback(() => {
    const recog = liveRecogRef.current;
    if (recog) {
      liveRecogRef.current = null;
      try {
        recog.onresult = null;
        recog.onerror = null;
        recog.onend = null;
        recog.stop();
      } catch {
        // ignore
      }
    }
  }, []);

  const cleanupAudioHardware = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioCtxRef.current) {
      void audioCtxRef.current.close().catch(() => undefined);
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    stopLiveRecognizer();
    setAudioLevel(0);
    setElapsedSeconds(0);
    setLiveTranscript("");
    setIsRecording(false);
  }, [stopLiveRecognizer]);

  const cancelRecording = useCallback(() => {
    cancelledRef.current = true;
    liveCapturedTextRef.current = "";
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        // ignore
      }
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    usingRecognitionOnlyRef.current = false;
    cleanupAudioHardware();
  }, [cleanupAudioHardware]);

  const stopRecording = useCallback(() => {
    cancelledRef.current = false;
    if (usingRecognitionOnlyRef.current) {
      usingRecognitionOnlyRef.current = false;
      const captured = liveCapturedTextRef.current.trim();
      liveCapturedTextRef.current = "";
      cleanupAudioHardware();
      if (captured) {
        onTranscriptRef.current(captured);
      } else {
        onErrorRef.current?.(getLocalizedError("MIC_NO_SPEECH", languageRef.current));
      }
      return;
    }
    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== "inactive") {
      try {
        rec.stop();
      } catch {
        cleanupAudioHardware();
      }
    } else {
      cleanupAudioHardware();
    }
  }, [cleanupAudioHardware]);

  useEffect(() => {
    return () => {
      cancelRecording();
    };
  }, [cancelRecording]);

  const startLivePreviewRecognizer = useCallback((onlyFallbackMode: boolean) => {
    const SpeechRecog = getSpeechRecognitionConstructor();
    if (!SpeechRecog) return false;
    try {
      const recog = new SpeechRecog();
      recog.lang = LANGUAGE_LOCALE_MAP[languageRef.current] ?? "en-IN";
      recog.continuous = true;
      recog.interimResults = true;

      let committed = "";
      recog.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const item = event.results[i];
          const text = item?.[0]?.transcript ?? "";
          if (item.isFinal) {
            committed = `${committed} ${text}`.trim();
          } else {
            interim = `${interim} ${text}`.trim();
          }
        }
        const combined = `${committed} ${interim}`.trim();
        liveCapturedTextRef.current = combined;
        setLiveTranscript(combined);
      };

      recog.onerror = () => {
        // Never interrupt MediaRecorder if browser SpeechRecognition errors
      };

      recog.onend = () => {
        if (onlyFallbackMode && usingRecognitionOnlyRef.current && !cancelledRef.current) {
          stopRecording();
        }
      };

      liveRecogRef.current = recog;
      recog.start();
      return true;
    } catch {
      return false;
    }
  }, [stopRecording]);

  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;
    if (!isVoiceRecorderSupported()) {
      onErrorRef.current?.(getLocalizedError("MIC_UNSUPPORTED", languageRef.current));
      return;
    }

    cancelledRef.current = false;
    chunksRef.current = [];
    liveCapturedTextRef.current = "";
    setLiveTranscript("");
    usingRecognitionOnlyRef.current = false;

    const canUseMediaRecorder =
      typeof navigator.mediaDevices?.getUserMedia === "function" &&
      typeof MediaRecorder !== "undefined";

    // Fallback to SpeechRecognition-only if MediaRecorder is unavailable on an older mobile browser
    if (!canUseMediaRecorder) {
      const started = startLivePreviewRecognizer(true);
      if (!started) {
        onErrorRef.current?.(getLocalizedError("MIC_UNSUPPORTED", languageRef.current));
        return;
      }
      usingRecognitionOnlyRef.current = true;
      setIsRecording(true);
      setElapsedSeconds(0);
      const startedAt = Date.now();
      timerRef.current = setInterval(() => {
        const secs = Math.floor((Date.now() - startedAt) / 1000);
        setElapsedSeconds(secs);
        if (secs >= 60) stopRecording();
      }, 300);
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        onErrorRef.current?.(getLocalizedError("MIC_PERMISSION_DENIED", languageRef.current));
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        onErrorRef.current?.(getLocalizedError("MIC_NOT_FOUND", languageRef.current));
      } else {
        onErrorRef.current?.(getLocalizedError("MIC_GENERIC", languageRef.current));
      }
      return;
    }

    streamRef.current = stream;

    // Live audio level meter + optional Hands-Free Auto-Silence Detection
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === "suspended") {
          void ctx.resume().catch(() => undefined);
        }
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let heardSpeech = false;
        let lastSpeechAt = Date.now();
        const startedAtMs = Date.now();

        const updateMeter = () => {
          if (!audioCtxRef.current) return;
          analyser.getByteTimeDomainData(dataArray);
          let sumSq = 0;
          for (let i = 0; i < dataArray.length; i += 1) {
            const v = (dataArray[i] - 128) / 128;
            sumSq += v * v;
          }
          const rms = Math.sqrt(sumSq / dataArray.length);
          const pct = Math.min(100, Math.round(rms * 380));
          setAudioLevel(pct);

          if (autoStopRef.current) {
            const now = Date.now();
            if (rms > 0.032) {
              heardSpeech = true;
              lastSpeechAt = now;
            }
            // Auto-stop ~2.4s after speaker pauses (once at least 1.4s recorded & speech detected)
            if (heardSpeech && now - startedAtMs > 1400 && now - lastSpeechAt > 2400) {
              stopRecording();
              return;
            }
          }

          rafRef.current = requestAnimationFrame(updateMeter);
        };
        rafRef.current = requestAnimationFrame(updateMeter);
      }
    } catch {
      // Meter is optional; recording continues cleanly
    }

    const mimeType = pickSupportedMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      cleanupAudioHardware();
      onErrorRef.current?.(getLocalizedError("MIC_GENERIC", languageRef.current));
      return;
    }

    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const wasCancelled = cancelledRef.current;
      const recordedChunks = chunksRef.current;
      const liveFallback = liveCapturedTextRef.current.trim();
      const finalMime = recorder.mimeType || mimeType || "audio/webm";
      mediaRecorderRef.current = null;
      chunksRef.current = [];
      liveCapturedTextRef.current = "";
      cleanupAudioHardware();

      if (wasCancelled || recordedChunks.length === 0) {
        return;
      }

      const blob = new Blob(recordedChunks, { type: finalMime });
      if (blob.size < 350) {
        if (liveFallback) {
          onTranscriptRef.current(liveFallback);
        } else {
          onErrorRef.current?.(getLocalizedError("MIC_TOO_SHORT", languageRef.current));
        }
        return;
      }

      setIsTranscribing(true);
      void blobToBase64(blob)
        .then((base64) => requestAudioTranscription(base64, finalMime, languageRef.current))
        .then((result) => {
          const text = (result.transcript ?? "").trim() || liveFallback;
          if (text) {
            onTranscriptRef.current(text);
          } else {
            onErrorRef.current?.(getLocalizedError("MIC_NO_SPEECH", languageRef.current));
          }
        })
        .catch((err) => {
          // Seamless resilience: if live browser SpeechRecognition already captured clean words, use them!
          if (liveFallback) {
            onTranscriptRef.current(liveFallback);
          } else {
            onErrorRef.current?.(
              resolveLocalizedErrorMessage(err, languageRef.current, "MIC_TRANSCRIBE_FAILED"),
            );
          }
        })
        .finally(() => {
          setIsTranscribing(false);
        });
    };

    recorder.start(250);
    setIsRecording(true);
    setElapsedSeconds(0);

    // Start live preview captioning in parallel (Wispr-Flow style real-time feedback)
    startLivePreviewRecognizer(false);

    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(secs);
      if (secs >= 60) {
        stopRecording();
      }
    }, 300);
  }, [cleanupAudioHardware, isRecording, isTranscribing, startLivePreviewRecognizer, stopRecording]);

  return {
    isSupported: isVoiceRecorderSupported(),
    isRecording,
    isTranscribing,
    audioLevel,
    elapsedSeconds,
    liveTranscript,
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
