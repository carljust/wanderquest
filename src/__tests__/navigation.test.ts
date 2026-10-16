import { expect, test } from "@jest/globals";
import {
  bearingDegrees,
  navigationReading,
  relativeBearing,
  simulationFix,
  simulationTarget,
  verifiedTarget,
  unwrapRotation,
} from "@/domain/navigation";
import questData from "../../content/externsteine.v1.json";
import type { Quest } from "@/domain/quest";
const quest = questData as Quest;
test("geographic bearing and wrap-around follow the shortest relative angle", () => {
  expect(
    bearingDegrees(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 },
    ),
  ).toBeCloseTo(90);
  expect(
    bearingDegrees(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: -1 },
    ),
  ).toBeCloseTo(270);
  expect(relativeBearing(5, 355)).toBe(10);
  expect(unwrapRotation(350, 10)).toBe(370);
  expect(unwrapRotation(720, 0)).toBe(720);
  expect(bearingDegrees(simulationTarget, simulationTarget)).toBeUndefined();
});
test("simulation uses virtual coordinates and computes distance", () => {
  const reading = navigationReading(simulationTarget, simulationFix(420));
  expect(reading.distance).toBeCloseTo(420);
  expect(reading.bearing).toBeCloseTo(0);
  expect(navigationReading(simulationTarget, simulationFix(0)).state).toBe(
    "arrived",
  );
});
test("inaccurate, stale and malformed fixes never cause an automatic arrival", () => {
  expect(
    navigationReading(simulationTarget, { ...simulationFix(0), accuracy: 100 })
      .state,
  ).toBe("inaccurate");
  expect(
    navigationReading(simulationTarget, { ...simulationFix(0), timestamp: 1 })
      .state,
  ).toBe("stale");
  expect(
    navigationReading(simulationTarget, { ...simulationFix(0), latitude: NaN })
      .state,
  ).toBe("invalid");
  expect(navigationReading(simulationTarget, undefined).state).toBe("waiting");
});
test("unverified quest coordinates do not become navigation targets", () => {
  expect(verifiedTarget(quest, quest.stations[0])).toBeUndefined();
  expect(
    verifiedTarget(
      { ...quest, fieldReady: true, approval: "approved" },
      {
        ...quest.stations[0],
        point: simulationTarget,
        coordinateStatus: "desk_checked",
      },
    ),
  ).toBeUndefined();
  expect(
    verifiedTarget(
      { ...quest, fieldReady: true, approval: "approved" },
      {
        ...quest.stations[0],
        point: simulationTarget,
        coordinateStatus: "field_checked",
      },
    ),
  ).toEqual(simulationTarget);
});
