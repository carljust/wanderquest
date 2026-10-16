import { useCallback, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import type { Fix } from "@/domain/quest";
import { friendlyError } from "@/lib/supabase";
export function useLocation(active = true) {
  const [fix, setFix] = useState<Fix>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [watching, setWatching] = useState(false);
  const [stale, setStale] = useState(false);
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const alive = useRef(true),
    focused = useRef(true),
    generation = useRef(0),
    latestFix = useRef(fix);
  const disable = useCallback(() => {
    generation.current++;
    subscription.current?.remove();
    subscription.current = null;
    if (alive.current) {
      setWatching(false);
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    alive.current = true;
    const timer = setInterval(
      () =>
        setStale(
          Boolean(
            latestFix.current &&
            Math.abs(Date.now() - latestFix.current.timestamp) > 60000,
          ),
        ),
      5000,
    );
    const listener = AppState.addEventListener("change", (state) => {
      if (state !== "active") disable();
    });
    return () => {
      alive.current = false;
      clearInterval(timer);
      listener.remove();
      disable();
    };
  }, [disable]);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
        disable();
      };
    }, [disable]),
  );
  useEffect(() => {
    if (!active) disable();
  }, [active, disable]);
  const enable = useCallback(async () => {
    if (!active || !focused.current) return;
    disable();
    const token = generation.current;
    setBusy(true);
    setError("");
    const current = () =>
      alive.current && focused.current && token === generation.current;
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!current()) return;
      if (!permission.granted)
        throw new Error(
          "Standortfreigabe abgelehnt. Erlaube den Standort in den Geräteeinstellungen und versuche es erneut.",
        );
      if (!(await Location.hasServicesEnabledAsync()))
        throw new Error("GPS ist ausgeschaltet. Aktiviere die Ortungsdienste.");
      if (!current()) return;
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 4,
          timeInterval: 5000,
        },
        (position) => {
          if (!current()) return;
          const next = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy ?? Infinity,
            timestamp: position.timestamp,
          };
          latestFix.current = next;
          setFix(next);
          setStale(Math.abs(Date.now() - next.timestamp) > 60000);
          setError("");
          setWatching(true);
        },
        () => {
          if (current()) {
            setError(
              "GPS-Signal verloren. Bitte den Standort erneut bestimmen.",
            );
            setWatching(false);
          }
        },
      );
      if (current()) {
        subscription.current = sub;
        setWatching(true);
      } else sub.remove();
    } catch (e) {
      if (current()) setError(friendlyError(e));
    } finally {
      if (current()) setBusy(false);
    }
  }, [active, disable]);
  return { fix, error, busy, watching, stale, enable, disable };
}
