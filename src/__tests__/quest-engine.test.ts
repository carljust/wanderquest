import { describe, expect, test } from "@jest/globals";
import data from "../../content/externsteine.v1.json";
import type { Fix, Quest } from "@/domain/quest";
import {
  activeStation,
  canFinish,
  complete,
  distanceMeters,
  newRun,
  unlock,
  unlockReason,
} from "@/domain/engine";
import { checkPracticeAnswer } from "@/features/development/practice-solutions";
import solutions from "../../content/solutions.private.json";
const quest = data as Quest;
const fieldQuest: Quest = {
  ...quest,
  approval: "approved",
  fieldReady: true,
  stations: quest.stations.map((s) => ({
    ...s,
    point: { latitude: 0, longitude: 0 },
    coordinateStatus: "field_checked",
  })),
};
const fix: Fix = { latitude: 0, longitude: 0, accuracy: 8, timestamp: 100000 };
describe("quest state machine", () => {
  test("eight complete varied stations, hints and exactly four seals", () => {
    let run = newRun("run", "practice", quest, "practice");
    expect(new Set(quest.stations.map((s) => s.puzzle.kind)).size).toBe(5);
    for (const s of quest.stations) {
      expect(s.puzzle.hints.length).toBeGreaterThanOrEqual(2);
      expect(activeStation(quest, run)?.id).toBe(s.id);
      expect(unlockReason(s, run, quest)).toBeNull();
      run = unlock(run, s.id);
      expect(
        checkPracticeAnswer(
          s.id,
          (solutions as Record<string, string[]>)[s.id][0],
        ),
      ).toBe(true);
      run = complete(run, s);
      run = complete(run, s);
    }
    expect(run.completed).toHaveLength(8);
    expect(run.seals).toHaveLength(4);
    expect(canFinish(run, quest)).toBe(true);
    expect(run.awarded).toBe(false);
  });
  test("locked stations cannot be completed and later stations cannot unlock", () => {
    const run = newRun("run", "practice", quest, "practice");
    expect(() => complete(run, quest.stations[0])).toThrow();
    expect(unlockReason(quest.stations[1], run, quest)).toMatch(/vorherige/);
  });
  test("rejects unverified route, stale and imprecise GPS and out-of-radius coordinates", () => {
    const run = newRun("run", "u", quest, "field");
    const station = fieldQuest.stations[0];
    expect(unlockReason(quest.stations[0], run, quest, fix, 100000)).toMatch(
      /nicht/,
    );
    expect(unlockReason(station, run, fieldQuest, undefined, 100000)).toMatch(
      /Standort/,
    );
    expect(
      unlockReason(station, run, fieldQuest, { ...fix, timestamp: 1 }, 100000),
    ).toMatch(/veraltet/);
    expect(
      unlockReason(station, run, fieldQuest, { ...fix, accuracy: 90 }, 100000),
    ).toMatch(/ungenau/);
    expect(
      unlockReason(station, run, fieldQuest, { ...fix, latitude: 1 }, 100000),
    ).toMatch(/außerhalb/);
    expect(unlockReason(station, run, fieldQuest, fix, 100000)).toBeNull();
  });
  test("unlocked stations stay accessible after GPS drops", () => {
    const run = unlock(
      newRun("run", "u", fieldQuest, "field"),
      fieldQuest.stations[0].id,
    );
    expect(
      unlockReason(fieldQuest.stations[0], run, fieldQuest, undefined),
    ).toBeNull();
  });
  test("pending offline answers advance provisionally but do not grant seals or finish", () => {
    let run = newRun("run", "u", fieldQuest, "field");
    for (const s of fieldQuest.stations) {
      run = unlock(run, s.id);
      run = complete(run, s, true);
    }
    expect(run.pending).toHaveLength(8);
    expect(run.seals).toHaveLength(0);
    expect(canFinish(run, fieldQuest)).toBe(false);
  });
  test("known-distance sanity check", () => {
    expect(
      distanceMeters(
        { latitude: 0, longitude: 0 },
        { latitude: 0, longitude: 0.001 },
      ),
    ).toBeCloseTo(111.195, 2);
  });
});
