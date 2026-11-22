import { useCallback, useEffect, useRef, useState } from "react";
import { requestAudioTranscription } from "../utils/api";

export interface UseVoiceRecorderOptions {
  language: string;
  onTranscript: (text: string) => void;
  onError?: (message: string) => void;
}

export interface UseVoiceRecorderResult {
  isSupported: boolean;
  isRecording: boolean;
  isTranscribing: boolean;
  audioLevel: number; // 0..100 live mic activity meter
  elapsedSeconds: number;
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
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof MediaRecorder !== "undefined"
  );
}

export function useVoiceRecorder({
  language,
  onTranscript,
  onError,
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
  languageRef.current = language;
  onTranscriptRef.current = onTranscript;
  onErrorRef.current = onError;

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
      onErrorRef.current?.(
        "Microphone recording is not supported on this browser. Please type your complaint directly.",
      );
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
        onErrorRef.current?.(
          "Microphone permission was blocked. Please allow microphone access in your browser address bar and try again.",
        );
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        onErrorRef.current?.(
          "No microphone was found on this device. Please connect a mic or type directly.",
        );
      } else {
        onErrorRef.current?.(
          "Could not access your microphone. Please check browser mic permissions or type directly.",
        );
      }
      return;
    }

    streamRef.current = stream;

    // Live audio level meter so citizen sees instant visual confirmation that voice is detected
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateMeter = () => {
          if (!audioCtxRef.current) return;
          analyser.getByteTimeDomainData(dataArray);
          let sumSq = 0;
          for (let i = 0; i < dataArray.length; i += 1) {
            const v = (dataArray[i] - 128) / 128;
            sumSq += v * v;
          }
          const rms = Math.sqrt(sumSq / dataArray.length);
          const pct = Math.min(100, Math.round(rms * 360));
          setAudioLevel(pct);
          rafRef.current = requestAnimationFrame(updateMeter);
        };
        rafRef.current = requestAnimationFrame(updateMeter);
      }
    } catch {
      // Meter is purely visual; recording still works without it
    }

    const mimeType = pickSupportedMimeType();
    let recorder: MediaRecorder;
    try {
      recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
    } catch {
      cleanupAudioHardware();
      onErrorRef.current?.("Could not start voice recording on this device. Please type directly.");
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
      if (blob.size < 400) {
        onErrorRef.current?.(
          "Recording was too short. Please tap the mic, speak clearly for a few seconds, then tap Stop.",
        );
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
            onErrorRef.current?.(
              "No clear speech was detected. Please speak closer to your microphone and try again.",
            );
          }
        })
        .catch((err) => {
          onErrorRef.current?.(
            err instanceof Error
              ? err.message
              : "Could not convert your voice to text. Please try again.",
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
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
