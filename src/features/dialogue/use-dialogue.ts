import { useCallback, useEffect, useRef, useState } from "react";
import { createAudioPlayer, type AudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import { useFocusEffect } from "expo-router";
import type { CompanionState, Dialogue } from "@/domain/quest";

type Recording = {
  player: AudioPlayer;
  listener?: { remove: () => void };
};

export function useDialogue(muted: boolean) {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [state, setState] = useState<CompanionState>("idle");
  const [mouthPulse, setMouthPulse] = useState(0);
  const [audioError, setAudioError] = useState("");
  // A recording owns its player. TTS/text never need an empty native player.
  // useAudioPlayer's automatic release can run before a focus cleanup on unmount;
  // calling pause on that released shared object rejects on native devices.
  const audio = useRef<Recording | null>(null);
  const focused = useRef(false);
  const releaseAudio = useCallback(() => {
    const current = audio.current;
    audio.current = null;
    if (!current) return;
    try {
      current.listener?.remove();
    } catch {
      // Native teardown may already have removed the subscription.
    }
    try {
      // release stops playback and frees resources; never pause after release.
      current.player.release();
    } catch {
      // Releasing an already invalidated native resource must not crash navigation.
    }
  }, []);

  const generation = useRef(0);
  const cancelPlayback = useCallback(() => {
    generation.current++;
    releaseAudio();
    return Speech.stop().catch(() => undefined);
  }, [releaseAudio]);
  const stop = useCallback(() => {
    void cancelPlayback();
    setState("idle");
  }, [cancelPlayback]);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
        stop();
      };
    }, [stop]),
  );
  useEffect(() => {
    if (!muted) return;
    const stopped = cancelPlayback();
    const token = generation.current;
    void stopped.then(() => {
      if (token === generation.current) setState("idle");
    });
  }, [muted, cancelPlayback]);
  const play = useCallback(
    async (line: Dialogue, audioUrl?: string) => {
      if (!focused.current) return;
      stop();
      setDialogue(line);
      setAudioError("");
      if (muted) {
        setState(line.mood === "talk" ? "idle" : line.mood);
        return;
      }
      const token = generation.current;
      try {
        if (audioUrl) {
          const player = createAudioPlayer(audioUrl);
          const current: Recording = { player };
          audio.current = current;
          current.listener = player.addListener(
            "playbackStatusUpdate",
            (status) => {
              if (
                status.didJustFinish &&
                token === generation.current &&
                audio.current === current
              ) {
                releaseAudio();
                setState("idle");
                setDialogue(null);
              }
            },
          );
          player.play();
          setState("talk");
          return;
        }
        const voices = await Speech.getAvailableVoicesAsync();
        if (token !== generation.current) return;
        const german = voices.find((voice) =>
          voice.language.toLowerCase().startsWith("de"),
        );
        if (!german) {
          setAudioError(
            "Keine deutsche Stimme verfügbar. Der vollständige Text bleibt lesbar.",
          );
          return;
        }
        Speech.speak(line.text, {
          language: "de-DE",
          voice: german.identifier,
          rate: 0.9,
          onStart: () => {
            if (token === generation.current) setState("talk");
          },
          onBoundary: () => {
            if (token === generation.current)
              setMouthPulse((pulse) => pulse + 1);
          },
          onDone: () => {
            if (token === generation.current) {
              setState("idle");
              setDialogue(null);
            }
          },
          onError: () => {
            if (token === generation.current) {
              setState("idle");
              setAudioError(
                "Die Sprachausgabe ist nicht verfügbar. Du kannst alles lesen.",
              );
            }
          },
        });
      } catch {
        if (token !== generation.current) return;
        releaseAudio();
        setState("idle");
        setAudioError(
          "Audio konnte nicht gestartet werden. Bitte erneut versuchen oder den Text lesen.",
        );
      }
    },
    [muted, releaseAudio, stop],
  );
  const skip = useCallback(() => {
    stop();
    setDialogue(null);
  }, [stop]);
  return {
    dialogue,
    state: muted && state === "talk" ? ("idle" as const) : state,
    mouthPulse,
    audioError,
    play,
    skip,
    stop,
    react: setState,
  };
}
