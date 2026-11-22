import { useCallback, useEffect, useRef, useState } from "react";
import {
  getLocalizedError,
  resolveLocalizedErrorMessage,
} from "../data/localizedErrors";
import { requestAudioTranscription } from "../utils/api";

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
  liveTranscript: string;
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
    typeof navigator.mediaDevices?.getUserMedia === "function" &&
    typeof MediaRecorder !== "undefined"
  );
}

/**
 * Exclusive Hardware MediaRecorder -> Server-Side AI Audio Transcription hook.
 * Completely replaces browser Web Speech API so mobile/desktop microphones never
 * suffer audio-focus lock conflicts and all 13 Indian languages & dialects transcribe reliably.
 */
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cancelledRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const languageRef = useRef(language);
  const onTranscriptRef = useRef(onTranscript);
  const onErrorRef = useRef(onError);
  const autoStopRef = useRef(autoStopOnSilence);
  languageRef.current = language;
  onTranscriptRef.current = onTranscript;
  onErrorRef.current = onError;
  autoStopRef.current = autoStopOnSilence;

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
    setAudioLevel(0);
    setElapsedSeconds(0);
    setIsRecording(false);
  }, []);

  const cancelRecording = useCallback(() => {
    cancelledRef.current = true;
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
    cleanupAudioHardware();
  }, [cleanupAudioHardware]);

  const stopRecording = useCallback(() => {
    cancelledRef.current = false;
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

  const startRecording = useCallback(async () => {
    if (isRecording || isTranscribing) return;
    if (!isVoiceRecorderSupported()) {
      onErrorRef.current?.(getLocalizedError("MIC_UNSUPPORTED", languageRef.current));
      return;
    }

    cancelledRef.current = false;
    chunksRef.current = [];

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

    // Live sound-level meter + optional Hands-Free auto-silence detection
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
      // Meter is purely visual; recording continues cleanly
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
      const finalMime = recorder.mimeType || mimeType || "audio/webm";
      mediaRecorderRef.current = null;
      chunksRef.current = [];
      cleanupAudioHardware();

      if (wasCancelled || recordedChunks.length === 0) {
        return;
      }

      const blob = new Blob(recordedChunks, { type: finalMime });
      if (blob.size < 350) {
        onErrorRef.current?.(getLocalizedError("MIC_TOO_SHORT", languageRef.current));
        return;
      }

      setIsTranscribing(true);
      void blobToBase64(blob)
        .then((base64) => requestAudioTranscription(base64, finalMime, languageRef.current))
        .then((result) => {
          const text = (result.transcript ?? "").trim();
          if (text) {
            onTranscriptRef.current(text);
          } else {
            onErrorRef.current?.(getLocalizedError("MIC_NO_SPEECH", languageRef.current));
          }
        })
        .catch((err) => {
          onErrorRef.current?.(
            resolveLocalizedErrorMessage(err, languageRef.current, "MIC_TRANSCRIBE_FAILED"),
          );
        })
        .finally(() => {
          setIsTranscribing(false);
        });
    };

    recorder.start(250);
    setIsRecording(true);
    setElapsedSeconds(0);

    const startedAt = Date.now();
    timerRef.current = setInterval(() => {
      const secs = Math.floor((Date.now() - startedAt) / 1000);
      setElapsedSeconds(secs);
      if (secs >= 60) {
        stopRecording();
      }
    }, 300);
  }, [cleanupAudioHardware, isRecording, isTranscribing, stopRecording]);

  return {
    isSupported: isVoiceRecorderSupported(),
    isRecording,
    isTranscribing,
    audioLevel,
    elapsedSeconds,
    liveTranscript: "",
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
