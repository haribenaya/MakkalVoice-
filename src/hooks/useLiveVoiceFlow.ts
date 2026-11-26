import { useCallback, useEffect, useRef, useState } from "react";
import { resolveLocalizedErrorMessage } from "../data/localizedErrors";
import type { ComplaintCategory, SubmissionMode } from "../types";

export type LiveVoiceStatus =
  | "idle"
  | "connecting"
  | "listening"
  | "speaking"
  | "drafting"
  | "paused"
  | "error";

export interface LiveIntakePatch {
  detectedSpokenLanguage?: string;
  complaint?: string;
  category?: ComplaintCategory;
  mode?: SubmissionMode;
  state?: string;
  district?: string;
  town?: string;
  street?: string;
  pincode?: string;
  name?: string;
  contact?: string;
  referenceNumber?: string;
  followupQuestion?: string;
  followupAnswer?: string;
}

export interface LiveTranscriptItem {
  id: string;
  role: "user" | "assistant";
  text: string;
}

export interface LiveVoiceCommandResult {
  success: boolean;
  [key: string]: unknown;
}

interface UseLiveVoiceFlowOptions {
  /** Soft hint for the initial welcome greeting ONLY — spoken language is auto-detected independently. */
  hintLanguage: string;
  /** Dashboard UI language used only for localizing error fallback messages if needed. */
  uiLanguage: string;
  onIntakeUpdate: (patch: LiveIntakePatch) => void;
  onGenerateDraftCommand: (
    draftLanguage: string,
    spokenLanguage: string,
  ) => Promise<LiveVoiceCommandResult>;
  onExecuteVoiceAction: (
    action: string,
    spokenLanguage: string,
    args?: Record<string, unknown>,
  ) => Promise<LiveVoiceCommandResult>;
  onSessionClosedByVoice?: () => void;
}

function downsampleFloat32To16k(
  input: Float32Array,
  inputSampleRate: number,
): Int16Array {
  if (inputSampleRate === 16000) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i += 1) {
      const s = Math.max(-1, Math.min(1, input[i]));
      out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
  }

  const ratio = inputSampleRate / 16000;
  const newLength = Math.max(1, Math.round(input.length / ratio));
  const out = new Int16Array(newLength);
  for (let i = 0; i < newLength; i += 1) {
    const start = Math.floor(i * ratio);
    const end = Math.min(input.length, Math.floor((i + 1) * ratio));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j += 1) {
      sum += input[j];
      count += 1;
    }
    const sample = count > 0 ? sum / count : input[Math.min(start, input.length - 1)] ?? 0;
    const clamped = Math.max(-1, Math.min(1, sample));
    out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
  }
  return out;
}

function int16ToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function decodeBase64Pcm24k(base64: string): Float32Array<ArrayBuffer> {
  const binary = atob(base64);
  const byteLen = binary.length;
  const bytes = new Uint8Array(byteLen);
  for (let i = 0; i < byteLen; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  const sampleCount = Math.floor(byteLen / 2);
  const view = new DataView(bytes.buffer, bytes.byteOffset, sampleCount * 2);
  const floats = new Float32Array(new ArrayBuffer(sampleCount * 4));
  for (let i = 0; i < sampleCount; i += 1) {
    floats[i] = view.getInt16(i * 2, true) / 32768;
  }
  return floats;
}

export function useLiveVoiceFlow({
  hintLanguage,
  uiLanguage,
  onIntakeUpdate,
  onGenerateDraftCommand,
  onExecuteVoiceAction,
  onSessionClosedByVoice,
}: UseLiveVoiceFlowOptions) {
  const [status, setStatus] = useState<LiveVoiceStatus>("idle");
  const [micPaused, setMicPaused] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [detectedSpokenLanguage, setDetectedSpokenLanguage] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [transcripts, setTranscripts] = useState<LiveTranscriptItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs to guarantee zero stale closures in audio / WebSocket callbacks
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const silentGainRef = useRef<GainNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const micPausedRef = useRef<boolean>(false);
  const statusRef = useRef<LiveVoiceStatus>("idle");
  const detectedLangRef = useRef<string>(hintLanguage);
  const timerRef = useRef<number | null>(null);
  const isClosingRef = useRef<boolean>(false);

  const onIntakeUpdateRef = useRef(onIntakeUpdate);
  const onGenerateDraftRef = useRef(onGenerateDraftCommand);
  const onExecuteActionRef = useRef(onExecuteVoiceAction);
  const onSessionClosedRef = useRef(onSessionClosedByVoice);
  const uiLangRef = useRef(uiLanguage);

  onIntakeUpdateRef.current = onIntakeUpdate;
  onGenerateDraftRef.current = onGenerateDraftCommand;
  onExecuteActionRef.current = onExecuteVoiceAction;
  onSessionClosedRef.current = onSessionClosedByVoice;
  uiLangRef.current = uiLanguage;
  statusRef.current = status;

  const stopAllPlayback = useCallback(() => {
    for (const src of activeSourcesRef.current) {
      try {
        src.onended = null;
        src.stop();
        src.disconnect();
      } catch {
        // Ignore already stopped sources
      }
    }
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    setAiSpeaking(false);
    if (statusRef.current === "speaking") {
      setStatus(micPausedRef.current ? "paused" : "listening");
    }
  }, []);

  const schedulePcm24kPlayback = useCallback((base64Audio: string) => {
    const ctx = outputAudioCtxRef.current;
    if (!ctx) return;

    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const floats = decodeBase64Pcm24k(base64Audio);
    if (floats.length === 0) return;

    const buffer = ctx.createBuffer(1, floats.length, 24000);
    buffer.copyToChannel(floats, 0);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startAt = Math.max(now + 0.02, nextStartTimeRef.current);
    nextStartTimeRef.current = startAt + buffer.duration;

    activeSourcesRef.current.add(source);
    setAiSpeaking(true);
    if (statusRef.current !== "drafting") {
      setStatus("speaking");
    }

    source.onended = () => {
      activeSourcesRef.current.delete(source);
      if (activeSourcesRef.current.size === 0) {
        setAiSpeaking(false);
        if (statusRef.current === "speaking") {
          setStatus(micPausedRef.current ? "paused" : "listening");
        }
      }
    };

    source.start(startAt);
  }, []);

  const appendTranscriptChunk = useCallback((role: "user" | "assistant", chunk: string) => {
    const cleaned = chunk.replace(/\s+/g, " ");
    if (!cleaned.trim()) return;
    setTranscripts((prev) => {
      const last = prev[prev.length - 1];
      if (last && last.role === role) {
        const needsSpace =
          last.text.length > 0 &&
          !/\s$/.test(last.text) &&
          !/^[\s.,!?،।]/.test(cleaned);
        const merged = `${last.text}${needsSpace ? " " : ""}${cleaned.trim()}`.trim();
        return [...prev.slice(0, -1), { ...last, text: merged }];
      }
      return [
        ...prev.slice(-28),
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role,
          text: cleaned.trim(),
        },
      ];
    });
  }, []);

  const teardownResources = useCallback(() => {
    isClosingRef.current = true;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    stopAllPlayback();

    if (processorRef.current) {
      try {
        processorRef.current.onaudioprocess = null;
        processorRef.current.disconnect();
      } catch {
        // Ignore
      }
      processorRef.current = null;
    }

    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.disconnect();
      } catch {
        // Ignore
      }
      sourceNodeRef.current = null;
    }

    if (silentGainRef.current) {
      try {
        silentGainRef.current.disconnect();
      } catch {
        // Ignore
      }
      silentGainRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (inputAudioCtxRef.current) {
      void inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current) {
      void outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.onopen = null;
        wsRef.current.onmessage = null;
        wsRef.current.onerror = null;
        wsRef.current.onclose = null;
        if (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING) {
          wsRef.current.close(1000, "User ended session");
        }
      } catch {
        // Ignore
      }
      wsRef.current = null;
    }

    setMicLevel(0);
    setAiSpeaking(false);
    setMicPaused(false);
    micPausedRef.current = false;
  }, [stopAllPlayback]);

  const stopSession = useCallback(() => {
    teardownResources();
    setStatus("idle");
  }, [teardownResources]);

  const startSession = useCallback(async () => {
    teardownResources();
    isClosingRef.current = false;
    setErrorMessage(null);
    setTranscripts([]);
    setDetectedSpokenLanguage(null);
    detectedLangRef.current = hintLanguage;
    setElapsedSeconds(0);
    setStatus("connecting");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1,
        },
      });

      if (isClosingRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      mediaStreamRef.current = stream;

      const AudioCtxCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      const inputCtx = new AudioCtxCtor({ sampleRate: 16000 });
      const outputCtx = new AudioCtxCtor({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      if (inputCtx.state === "suspended") await inputCtx.resume();
      if (outputCtx.state === "suspended") await outputCtx.resume();

      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/api/live-voice?hintLanguage=${encodeURIComponent(hintLanguage)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      const source = inputCtx.createMediaStreamSource(stream);
      const processor = inputCtx.createScriptProcessor(4096, 1, 1);
      // Connect through zero-gain node so mic audio never echoes into speakers
      const silentGain = inputCtx.createGain();
      silentGain.gain.value = 0;

      source.connect(processor);
      processor.connect(silentGain);
      silentGain.connect(inputCtx.destination);

      sourceNodeRef.current = source;
      processorRef.current = processor;
      silentGainRef.current = silentGain;

      let lastLevelTick = 0;
      processor.onaudioprocess = (event) => {
        if (isClosingRef.current || micPausedRef.current) return;
        const activeWs = wsRef.current;
        if (!activeWs || activeWs.readyState !== WebSocket.OPEN) return;

        const channelData = event.inputBuffer.getChannelData(0);

        // Compute smooth RMS audio level for live visual feedback
        const now = performance.now();
        if (now - lastLevelTick > 65) {
          lastLevelTick = now;
          let sumSq = 0;
          for (let i = 0; i < channelData.length; i += 4) {
            sumSq += channelData[i] * channelData[i];
          }
          const rms = Math.sqrt(sumSq / (channelData.length / 4));
          setMicLevel(Math.min(100, Math.round(rms * 380)));
        }

        const pcm16k = downsampleFloat32To16k(channelData, inputCtx.sampleRate);
        const base64Audio = int16ToBase64(pcm16k);
        activeWs.send(JSON.stringify({ type: "audio", audio: base64Audio }));
      };

      ws.onopen = () => {
        if (isClosingRef.current) return;
        timerRef.current = window.setInterval(() => {
          setElapsedSeconds((prev) => prev + 1);
        }, 1000);
      };

      ws.onmessage = async (event) => {
        if (isClosingRef.current) return;
        try {
          const msg = JSON.parse(String(event.data)) as {
            type?: string;
            data?: unknown;
            text?: string;
            callId?: string;
            name?: string;
            args?: Record<string, unknown>;
            code?: string;
            message?: string;
          };

          if (msg.type === "ready") {
            setStatus(micPausedRef.current ? "paused" : "listening");
          } else if (msg.type === "audio" && typeof msg.data === "string") {
            schedulePcm24kPlayback(msg.data);
          } else if (msg.type === "interrupted") {
            stopAllPlayback();
          } else if (msg.type === "turn_complete") {
            if (activeSourcesRef.current.size === 0 && statusRef.current !== "drafting") {
              setStatus(micPausedRef.current ? "paused" : "listening");
            }
          } else if (msg.type === "input_transcript" && typeof msg.text === "string") {
            appendTranscriptChunk("user", msg.text);
          } else if (msg.type === "output_transcript" && typeof msg.text === "string") {
            appendTranscriptChunk("assistant", msg.text);
          } else if (msg.type === "intake_update" && msg.data && typeof msg.data === "object") {
            const patch = msg.data as LiveIntakePatch;
            if (patch.detectedSpokenLanguage) {
              detectedLangRef.current = patch.detectedSpokenLanguage;
              setDetectedSpokenLanguage(patch.detectedSpokenLanguage);
            }
            onIntakeUpdateRef.current(patch);
          } else if (msg.type === "voice_command" && msg.callId && msg.name) {
            const callId = msg.callId;
            const fnName = msg.name;
            const args = msg.args ?? {};
            let result: LiveVoiceCommandResult = { success: false };

            if (fnName === "generate_official_draft") {
              setStatus("drafting");
              const requestedDraftLang =
                typeof args.draftLanguage === "string" && args.draftLanguage.trim()
                  ? args.draftLanguage.trim()
                  : "English";
              try {
                result = await onGenerateDraftRef.current(
                  requestedDraftLang,
                  detectedLangRef.current || hintLanguage,
                );
              } catch (err) {
                result = {
                  success: false,
                  error: resolveLocalizedErrorMessage(err, uiLangRef.current),
                };
              } finally {
                if (!isClosingRef.current) {
                  setStatus(micPausedRef.current ? "paused" : "listening");
                }
              }
            } else if (fnName === "execute_voice_action") {
              const action = typeof args.action === "string" ? args.action.trim() : "";
              try {
                result = await onExecuteActionRef.current(
                  action,
                  detectedLangRef.current || hintLanguage,
                  args,
                );
              } catch (err) {
                result = {
                  success: false,
                  error: resolveLocalizedErrorMessage(err, uiLangRef.current),
                };
              }

              if (action === "end_voice_flow") {
                if (wsRef.current?.readyState === WebSocket.OPEN) {
                  wsRef.current.send(
                    JSON.stringify({
                      type: "tool_response",
                      callId,
                      name: fnName,
                      response: result,
                    }),
                  );
                }
                // Let the brief farewell audio finish cleanly before closing
                window.setTimeout(() => {
                  if (!isClosingRef.current) {
                    teardownResources();
                    setStatus("idle");
                    onSessionClosedRef.current?.();
                  }
                }, 2600);
                return;
              }
            }

            if (wsRef.current?.readyState === WebSocket.OPEN) {
              wsRef.current.send(
                JSON.stringify({
                  type: "tool_response",
                  callId,
                  name: fnName,
                  response: result,
                }),
              );
            }
          } else if (msg.type === "error") {
            const errObj = Object.assign(new Error(msg.message || "Live voice error"), {
              code: msg.code,
            });
            setErrorMessage(resolveLocalizedErrorMessage(errObj, uiLangRef.current));
            setStatus("error");
            teardownResources();
          } else if (msg.type === "session_closed") {
            teardownResources();
            setStatus("idle");
          }
        } catch {
          // Ignore malformed WS frames
        }
      };

      ws.onerror = () => {
        if (isClosingRef.current) return;
        setErrorMessage(
          resolveLocalizedErrorMessage(
            Object.assign(new Error("Live voice connection interrupted"), { code: "NETWORK_ERROR" }),
            uiLangRef.current,
          ),
        );
        setStatus("error");
        teardownResources();
      };

      ws.onclose = (ev) => {
        if (isClosingRef.current) return;
        if (ev.code !== 1000 && statusRef.current !== "error") {
          setErrorMessage(
            resolveLocalizedErrorMessage(
              Object.assign(new Error("Live voice session closed"), { code: "AI_UNAVAILABLE" }),
              uiLangRef.current,
            ),
          );
          setStatus("error");
        }
        teardownResources();
      };
    } catch (err) {
      const domName = (err as { name?: string })?.name;
      if (domName === "NotAllowedError" || domName === "PermissionDeniedError") {
        setErrorMessage("MIC_PERMISSION_DENIED");
      } else {
        setErrorMessage(resolveLocalizedErrorMessage(err, uiLangRef.current));
      }
      setStatus("error");
      teardownResources();
    }
  }, [
    appendTranscriptChunk,
    hintLanguage,
    schedulePcm24kPlayback,
    stopAllPlayback,
    teardownResources,
  ]);

  const toggleMicPause = useCallback(() => {
    const nextPaused = !micPausedRef.current;
    micPausedRef.current = nextPaused;
    setMicPaused(nextPaused);
    if (nextPaused) {
      setMicLevel(0);
      if (statusRef.current === "listening") {
        setStatus("paused");
      }
    } else if (statusRef.current === "paused") {
      setStatus("listening");
    }
  }, []);

  useEffect(() => {
    return () => {
      teardownResources();
    };
  }, [teardownResources]);

  return {
    status,
    micPaused,
    micLevel,
    aiSpeaking,
    detectedSpokenLanguage,
    elapsedSeconds,
    transcripts,
    errorMessage,
    startSession,
    stopSession,
    toggleMicPause,
  };
}
