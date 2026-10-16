import { describe, expect, test } from "@jest/globals";
import { mockMissions } from "@/features/missions/mock-missions";
import {
  filterMissions,
  formatDistance,
  localMissionRepository,
} from "@/features/missions/repository";

describe("local mission discovery", () => {
  test("lists distinct demo missions and resolves a detail link", async () => {
    const missions = await localMissionRepository.list();
    expect(missions.length).toBe(3);
    expect(new Set(missions.map((mission) => mission.id)).size).toBe(
      missions.length,
    );
    expect(await localMissionRepository.getById(missions[0].id)).toEqual(
      missions[0],
    );
    expect(await localMissionRepository.getById("unknown")).toBeUndefined();
  });

  test("combines difficulty and case-insensitive search", () => {
    expect(
      filterMissions(mockMissions, "Leicht", "  SPIEGELSEE  ", []),
    ).toEqual([mockMissions[1]]);
    expect(filterMissions(mockMissions, "Mittel", "Spiegelsee", [])).toEqual(
      [],
    );
    expect(filterMissions(mockMissions, "Alle", "Morgenhöhe", [])).toEqual([
      mockMissions[2],
    ]);
  });

  test("shows only bookmarked missions, still applying search", () => {
    expect(
      filterMissions(mockMissions, "Gemerkt", "", ["kiefernlicht"]),
    ).toEqual([mockMissions[0]]);
    expect(
      filterMissions(mockMissions, "Gemerkt", "Spiegel", ["kiefernlicht"]),
    ).toEqual([]);
    expect(filterMissions(mockMissions, "Gemerkt", "", [])).toEqual([]);
  });

  test("formats distances for German readers", () => {
    expect(formatDistance(3.4)).toBe("3,4 km");
  });
});
