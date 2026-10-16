import { expect, test } from "@jest/globals";
import questData from "../../content/externsteine.v1.json";
import type { Quest } from "@/domain/quest";
import {
  defaultDiscoveryFilters as defaults,
  matchesDiscoveryFilters as matches,
} from "@/features/discovery/model";
const quest = questData as Quest;

test("discovery search and personal filters combine without inventing more quests", () => {
  expect(matches(quest, "  EXTERNSTEINE ", defaults, false, false)).toBe(true);
  expect(matches(quest, "Teutoburger", defaults, false, false)).toBe(true);
  expect(matches(quest, "Nicht vorhanden", defaults, true, true)).toBe(false);
  expect(
    matches(quest, "", { ...defaults, savedOnly: true }, false, true),
  ).toBe(false);
  expect(
    matches(
      quest,
      "",
      { ...defaults, savedOnly: true, offlineOnly: true },
      true,
      false,
    ),
  ).toBe(false);
  expect(
    matches(
      quest,
      "",
      { ...defaults, savedOnly: true, offlineOnly: true },
      true,
      true,
    ),
  ).toBe(true);
});
test("unknown age, time and distance never satisfy numeric filters", () => {
  expect(matches(quest, "", { ...defaults, age: 8 }, false, false)).toBe(false);
  expect(matches(quest, "", { ...defaults, minutes: 90 }, false, false)).toBe(
    false,
  );
  expect(matches(quest, "", { ...defaults, kilometers: 4 }, false, false)).toBe(
    false,
  );
  expect(
    matches(
      quest,
      "",
      { ...defaults, difficulty: quest.difficulty },
      false,
      false,
    ),
  ).toBe(true);
  expect(
    matches(
      { ...quest, listing: { durationMinutes: 30 } },
      "",
      { ...defaults, minutes: 90 },
      false,
      false,
    ),
  ).toBe(false);
});
test("verified listing metadata respects age and inclusive time/distance boundaries", () => {
  const listed = {
    ...quest,
    fieldReady: true,
    listing: { minimumAge: 7, durationMinutes: 90, distanceKm: 4 },
  };
  expect(
    matches(
      listed,
      "",
      { ...defaults, age: 8, minutes: 90, kilometers: 4 },
      false,
      false,
    ),
  ).toBe(true);
  expect(matches(listed, "", { ...defaults, age: 6 }, false, false)).toBe(
    false,
  );
  expect(matches(listed, "", { ...defaults, minutes: 60 }, false, false)).toBe(
    false,
  );
  expect(
    matches(listed, "", { ...defaults, kilometers: 2 }, false, false),
  ).toBe(false);
});
test("malformed listing numbers do not create apparently suitable family routes", () => {
  const listed = {
    ...quest,
    fieldReady: true,
    listing: { minimumAge: NaN, durationMinutes: -10, distanceKm: Infinity },
  };
  expect(matches(listed, "", { ...defaults, age: 8 }, false, false)).toBe(
    false,
  );
  expect(matches(listed, "", { ...defaults, minutes: 90 }, false, false)).toBe(
    false,
  );
  expect(
    matches(listed, "", { ...defaults, kilometers: 4 }, false, false),
  ).toBe(false);
});
