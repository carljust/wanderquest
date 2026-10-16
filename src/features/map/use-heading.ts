import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import { useFocusEffect } from "expo-router";
import * as Location from "expo-location";
export function useHeading(active: boolean) {
  const [heading, setHeading] = useState<number>();
  const [error, setError] = useState("");
  const generation = useRef(0);
  const sub = useRef<Location.LocationSubscription | null>(null);
  const stop = useCallback(() => {
    generation.current++;
    sub.current?.remove();
    sub.current = null;
    setHeading(undefined);
  }, []);
  useFocusEffect(
    useCallback(() => {
      if (!active || Platform.OS === "web") return;
      const token = ++generation.current;
      let last = 0;
      void Location.watchHeadingAsync(
        (value) => {
          if (token !== generation.current) return;
          if (
            value.accuracy < 2 ||
            value.trueHeading < 0 ||
            !Number.isFinite(value.trueHeading)
          ) {
            setHeading(undefined);
            setError(
              "Kompass ungenau. Halte Abstand zu Metall und kalibriere das Gerät.",
            );
            return;
          }
          last = Date.now();
          setHeading(value.trueHeading);
          setError("");
        },
        () => {
          if (token === generation.current) {
            setHeading(undefined);
            setError(
              "Gerätekompass nicht verfügbar. Die Anzeige bleibt nach Norden ausgerichtet.",
            );
          }
        },
      )
        .then((value) => {
          if (token === generation.current) sub.current = value;
          else value.remove();
        })
        .catch(() => {
          if (token === generation.current)
            setError("Kein Gerätekompass verfügbar. Norden bleibt oben.");
        });
      const timer = setInterval(() => {
        if (last && Date.now() - last > 15000) {
          setHeading(undefined);
          setError("Kompasssignal veraltet. Norden bleibt oben.");
        }
      }, 5000);
      return () => {
        clearInterval(timer);
        stop();
      };
    }, [active, stop]),
  );
  useEffect(() => {
    const listener = AppState.addEventListener("change", (state) => {
      if (state !== "active") stop();
    });
    return () => listener.remove();
  }, [stop]);
  return { heading, error, northUp: heading === undefined };
}
