import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import type { Fix } from "@/domain/quest";
import { friendlyError } from "@/lib/supabase";
export function useLocation() {
  const [fix, setFix] = useState<Fix>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [watching, setWatching] = useState(false);
  const [stale, setStale] = useState(false);
  const subscription = useRef<Location.LocationSubscription | null>(null);
  const alive = useRef(true);
  const focused = useRef(true);
  const latestFix = useRef(fix);
  useEffect(() => {
    alive.current = true;
    const timer = setInterval(
      () =>
        setStale(
          Boolean(
            latestFix.current &&
            Date.now() - latestFix.current.timestamp > 60000,
          ),
        ),
      5000,
    );
    return () => {
      alive.current = false;
      clearInterval(timer);
      subscription.current?.remove();
    };
  }, []);
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
        subscription.current?.remove();
        subscription.current = null;
      };
    }, []),
  );
  async function enable() {
    setBusy(true);
    setError("");
    subscription.current?.remove();
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted)
        throw new Error(
          "Standortfreigabe abgelehnt. Erlaube den Standort in den Geräteeinstellungen und versuche es erneut.",
        );
      if (!(await Location.hasServicesEnabledAsync()))
        throw new Error("GPS ist ausgeschaltet. Aktiviere die Ortungsdienste.");
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 4,
          timeInterval: 5000,
        },
        (position) => {
          if (alive.current && focused.current) {
            latestFix.current = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy ?? Infinity,
              timestamp: position.timestamp,
            };
            setFix({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy ?? Infinity,
              timestamp: position.timestamp,
            });
            setWatching(true);
            setError("");
          }
        },
        (reason) => {
          if (alive.current) {
            setError("GPS-Signal verloren: " + reason);
            setWatching(false);
          }
        },
      );
      if (alive.current && focused.current) subscription.current = sub;
      else sub.remove();
    } catch (e) {
      if (alive.current) setError(friendlyError(e));
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return { fix, error, busy, watching, stale, enable };
}
