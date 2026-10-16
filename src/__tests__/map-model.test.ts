import { expect, test } from "@jest/globals";
import source from "../../content/externsteine.v1.json";
import type { Quest } from "@/domain/quest";
import { mapPayload } from "@/features/map/map-model";
import { questPinSvg } from "@/features/map/quest-pin";

const draft = source as Quest;
// Synthetic equatorial fixture, never a proposed Externsteine route.
const released: Quest = {
  ...draft,
  fieldReady: true,
  approval: "approved",
  stations: draft.stations.map((station, index) => ({
    ...station,
    point: { latitude: 0, longitude: index * 0.001 },
    coordinateStatus: "field_checked",
  })),
  route: [
    { latitude: 0, longitude: 0 },
    { latitude: 0, longitude: 0.001 },
  ],
};

test("draft coordinates and lines cannot masquerade as a released walking route", () => {
  const data = mapPayload(
    { ...released, fieldReady: false },
    undefined,
    released.stations[0].id,
  );
  expect(data.stations).toEqual([]);
  expect(data.route).toEqual([]);
  expect(data.target).toBeNull();
  expect(data.references).toHaveLength(5);
  expect(
    mapPayload({ ...released, approval: "pending_source_review" }).route,
  ).toEqual([]);
  const partial = {
    ...released,
    stations: released.stations.map((s, i) => (i ? s : { ...s, point: null })),
  };
  expect(mapPayload(partial).stations).toEqual([]);
});

test("approved track and selected target share a single projection on both platforms", () => {
  const data = mapPayload(released, undefined, released.stations[2].id);
  expect(data.stations).toHaveLength(8);
  expect(data.target?.order).toBe(3);
  expect(data.target?.point).toEqual({ latitude: 0, longitude: 0.002 });
  expect(data.route).toEqual(released.route);
  expect(mapPayload(released, undefined, "unknown").target).toBeNull();
  expect(
    mapPayload({
      ...released,
      route: [...released.route, { latitude: 91, longitude: 0 }],
    }).route,
  ).toEqual([]);
});

test("map position rejects malformed or stale fixes, while retaining honest accuracy", () => {
  const fix = {
    latitude: 0,
    longitude: 0,
    accuracy: 90,
    timestamp: Date.now(),
  };
  expect(mapPayload(null, fix).fix).toEqual(fix); // broad circle is not arrival evidence
  for (const invalid of [
    { ...fix, timestamp: 1 },
    { ...fix, accuracy: -1 },
    { ...fix, latitude: NaN },
    { ...fix, longitude: 181 },
  ])
    expect(mapPayload(null, invalid).fix).toBeNull();
});

test("pin markup accepts numeric station labels without injecting content HTML", () => {
  expect(questPinSvg(3, true)).toContain(">3</text>");
  expect(questPinSvg(NaN)).toContain(">?</text>");
  expect(questPinSvg(3, true)).not.toEqual(questPinSvg(3));
});
