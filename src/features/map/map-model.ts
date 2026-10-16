import type { Fix, Point, Quest } from "@/domain/quest";
import { orientationPoints } from "./references";

export type QuestMapProps = {
  quest: Quest | null;
  fix?: Fix;
  targetStationId?: string;
};
export function isMapPoint(point?: Point | null): point is Point {
  return Boolean(
    point &&
    Number.isFinite(point.latitude) &&
    Number.isFinite(point.longitude) &&
    Math.abs(point.latitude) <= 90 &&
    Math.abs(point.longitude) <= 180,
  );
}

// Shared by browser and WebView. No guessed track, unapproved target or virtual GPS.
export function mapPayload(
  quest: Quest | null,
  fix?: Fix,
  targetStationId?: string,
) {
  const released = Boolean(
    quest?.fieldReady &&
    quest.approval === "approved" &&
    quest.stations.length &&
    quest.stations.every(
      (station) =>
        station.coordinateStatus === "field_checked" &&
        isMapPoint(station.point),
    ),
  );
  const stations =
    released && quest
      ? quest.stations.map((station) => ({
          id: station.id,
          order: station.order,
          title: station.title,
          point: station.point!,
          radius: station.radius,
        }))
      : [];
  const target =
    stations.find((station) => station.id === targetStationId) ?? null;
  const route =
    released && quest && quest.route.length > 1 && quest.route.every(isMapPoint)
      ? quest.route
      : [];
  const usableFix =
    isMapPoint(fix) &&
    fix &&
    Number.isFinite(fix.accuracy) &&
    fix.accuracy >= 0 &&
    Number.isFinite(fix.timestamp) &&
    Math.abs(Date.now() - fix.timestamp) <= 60000
      ? fix
      : null;
  return {
    type: "config",
    references: orientationPoints,
    route,
    stations,
    target,
    fix: usableFix,
  };
}
