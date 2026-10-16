import type { Fix, Point, Quest, Run, Station } from "./quest";

export function distanceMeters(a: Point, b: Point) {
  const radians = Math.PI / 180;
  const lat = (b.latitude - a.latitude) * radians;
  const lon = (b.longitude - a.longitude) * radians;
  const h =
    Math.sin(lat / 2) ** 2 +
    Math.cos(a.latitude * radians) *
      Math.cos(b.latitude * radians) *
      Math.sin(lon / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
export const normalizeAnswer = (value: string) =>
  value.trim().toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
export function activeStation(quest: Quest, run: Run) {
  return quest.stations.find(
    (s) => !run.completed.includes(s.id) && !run.pending.includes(s.id),
  );
}
export function unlockReason(
  station: Station,
  run: Run,
  quest: Quest,
  fix?: Fix,
  now = Date.now(),
): string | null {
  if (run.unlocked.includes(station.id)) return null;
  if (activeStation(quest, run)?.id !== station.id)
    return "Beende zuerst die vorherige Station.";
  if (run.mode === "practice") return null;
  if (!quest.fieldReady || !station.point)
    return "Dieser Weg ist noch nicht für das Spielen vor Ort freigegeben.";
  if (!fix) return "Gib deinen Standort frei, um die Station zu erreichen.";
  if (
    !Number.isFinite(fix.latitude) ||
    !Number.isFinite(fix.longitude) ||
    !Number.isFinite(fix.accuracy) ||
    fix.accuracy < 0 ||
    Math.abs(fix.latitude) > 90 ||
    Math.abs(fix.longitude) > 180
  )
    return "Der Standort ist ungültig. Bitte erneut versuchen.";
  if (Math.abs(now - fix.timestamp) > 60000)
    return "Der Standort ist veraltet. Bitte erneut bestimmen.";
  if (fix.accuracy > Math.min(50, station.radius))
    return "Das GPS ist noch zu ungenau. Warte unter freiem Himmel.";
  if (distanceMeters(fix, station.point) > station.radius)
    return "Du bist noch außerhalb des Stationsradius. Bleibe auf freigegebenen Wegen.";
  return null;
}
export function unlock(run: Run, stationId: string): Run {
  return {
    ...run,
    unlocked: [...new Set([...run.unlocked, stationId])],
    updatedAt: Date.now(),
  };
}
export function complete(run: Run, station: Station, provisional = false): Run {
  if (!run.unlocked.includes(station.id))
    throw new Error("Station noch gesperrt.");
  if (provisional)
    return {
      ...run,
      pending: [...new Set([...run.pending, station.id])],
      updatedAt: Date.now(),
    };
  return {
    ...run,
    completed: [...new Set([...run.completed, station.id])],
    pending: run.pending.filter((id) => id !== station.id),
    seals: station.seal
      ? [...new Set([...run.seals, station.seal])]
      : run.seals,
    updatedAt: Date.now(),
  };
}
export function canFinish(run: Run, quest: Quest) {
  return (
    quest.stations.every((s) => run.completed.includes(s.id)) &&
    run.seals.length === 4 &&
    run.pending.length === 0
  );
}
export function newRun(
  id: string,
  userId: string,
  quest: Quest,
  mode: Run["mode"],
): Run {
  return {
    id,
    userId,
    versionId: quest.versionId,
    mode,
    unlocked: [],
    completed: [],
    seals: [],
    hints: {},
    attempts: {},
    pending: [],
    finished: false,
    awarded: false,
    updatedAt: Date.now(),
  };
}
