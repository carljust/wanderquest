import { mockMissions } from "./mock-missions";
import type { MissionFilter, MissionRepository, Mission } from "./types";

// Replace this adapter with a Supabase repository when a backend is introduced.
export const localMissionRepository: MissionRepository = {
  async list() {
    return mockMissions;
  },
  async getById(id) {
    return mockMissions.find((mission) => mission.id === id);
  },
};

export function filterMissions(
  missions: readonly Mission[],
  filter: MissionFilter,
  query: string,
  savedIds: readonly string[],
) {
  const term = query.trim().toLocaleLowerCase("de-DE");
  return missions.filter((mission) => {
    const matchesFilter =
      filter === "Alle" ||
      (filter === "Gemerkt"
        ? savedIds.includes(mission.id)
        : mission.difficulty === filter);
    const matchesQuery =
      `${mission.title} ${mission.region} ${mission.subtitle}`
        .toLocaleLowerCase("de-DE")
        .includes(term);
    return matchesFilter && matchesQuery;
  });
}

export function formatDistance(km: number) {
  return `${km.toLocaleString("de-DE", { maximumFractionDigits: 1 })} km`;
}
