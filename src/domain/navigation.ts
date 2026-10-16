import type { Fix, Point, Quest, Station } from "./quest";
import { distanceMeters } from "./engine";
export const normalizeDegrees = (value: number) => ((value % 360) + 360) % 360;
export const unwrapRotation = (previous: number, target: number) =>
  previous + normalizeDegrees(target - previous + 180) - 180;
export const relativeBearing = (bearing: number, heading = 0) =>
  normalizeDegrees(bearing - heading);
export function bearingDegrees(from: Point, to: Point) {
  if (distanceMeters(from, to) < 0.1) return undefined;
  const rad = Math.PI / 180;
  const delta = (to.longitude - from.longitude) * rad;
  const y = Math.sin(delta) * Math.cos(to.latitude * rad);
  const x =
    Math.cos(from.latitude * rad) * Math.sin(to.latitude * rad) -
    Math.sin(from.latitude * rad) *
      Math.cos(to.latitude * rad) *
      Math.cos(delta);
  return normalizeDegrees(Math.atan2(y, x) / rad);
}
export function verifiedTarget(quest: Quest | null, station?: Station) {
  return quest?.fieldReady &&
    quest.approval === "approved" &&
    station?.coordinateStatus === "field_checked"
    ? (station.point ?? undefined)
    : undefined;
}
export function navigationReading(
  target?: Point,
  fix?: Fix,
  radius = 40,
  now = Date.now(),
) {
  if (!target)
    return {
      state: "unavailable" as const,
      message:
        "Das Ziel ist noch nicht für die Outdoor-Navigation freigegeben.",
    };
  if (!fix)
    return {
      state: "waiting" as const,
      message: "Gib deinen Standort frei, um Richtung und Entfernung zu sehen.",
    };
  if (
    ![
      target.latitude,
      target.longitude,
      fix.latitude,
      fix.longitude,
      fix.accuracy,
      fix.timestamp,
    ].every(Number.isFinite) ||
    Math.abs(fix.latitude) > 90 ||
    Math.abs(fix.longitude) > 180 ||
    Math.abs(target.latitude) > 90 ||
    Math.abs(target.longitude) > 180 ||
    fix.accuracy < 0
  )
    return {
      state: "invalid" as const,
      message: "Der Standort ist ungültig. Bitte erneut bestimmen.",
    };
  if (Math.abs(now - fix.timestamp) > 60000)
    return {
      state: "stale" as const,
      message: "Das GPS-Signal ist veraltet. Bestimme deinen Standort erneut.",
    };
  if (fix.accuracy > Math.min(50, radius))
    return {
      state: "inaccurate" as const,
      message:
        "Das GPS ist zu ungenau. Warte unter freiem Himmel; es wird keine Station freigeschaltet.",
    };
  const distance = distanceMeters(fix, target);
  return {
    state: distance <= radius ? ("arrived" as const) : ("ready" as const),
    distance,
    bearing: bearingDegrees(fix, target),
    message:
      distance <= radius
        ? "Zielradius erreicht. Öffne die Spielansicht für die Aufgabe."
        : "Peilung zum Ziel. Folge ausschließlich freigegebenen Wegen.",
  };
}
// Virtual (0,0) test space, never shown on the Externsteine map or used for field rewards.
export const simulationTarget: Point = { latitude: 0, longitude: 0 };
export const simulationFix = (distance: number): Fix => ({
  latitude: ((-Math.max(0, distance) / 6371000) * 180) / Math.PI,
  longitude: 0,
  accuracy: 5,
  timestamp: Date.now(),
});
