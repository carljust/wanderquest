import { useCallback, useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";
import { useFocusEffect } from "expo-router";
import type { CompanionState, Dialogue } from "@/domain/quest";

export function useDialogue(muted: boolean) {
  const [dialogue, setDialogue] = useState<Dialogue | null>(null);
  const [state, setState] = useState<CompanionState>("idle");
  const [mouthPulse, setMouthPulse] = useState(0);
  const [audioError, setAudioError] = useState("");
  const player = useAudioPlayer(null);

  const generation = useRef(0);
  const stop = useCallback(() => {
    generation.current++;
    void Speech.stop().catch(() => undefined);
    player.pause();
    setState("idle");
  }, [player]);
  useFocusEffect(
    useCallback(
      () => () => {
        stop();
      },
      [stop],
    ),
  );
  useEffect(() => {
    if (muted) {
      generation.current++;
      void Speech.stop();
      player.pause();
    }
  }, [muted, player]);
  useEffect(() => {
    const sub = player.addListener("playbackStatusUpdate", (status) => {
      if (status.didJustFinish) {
        setState("idle");
        setDialogue(null);
      }
    });
    return () => sub.remove();
  }, [player]);
  const play = useCallback(
    async (line: Dialogue, audioUrl?: string) => {
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
          player.replace(audioUrl);
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
        setState("idle");
        setAudioError(
          "Audio konnte nicht gestartet werden. Bitte erneut versuchen oder den Text lesen.",
        );
      }
    },
    [muted, player, stop],
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
