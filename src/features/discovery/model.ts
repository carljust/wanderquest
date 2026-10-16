import type { Quest } from "@/domain/quest";

export type DiscoveryFilters = {
  age: number | null;
  minutes: number | null;
  kilometers: number | null;
  difficulty: string | null;
  savedOnly: boolean;
  offlineOnly: boolean;
};
export const defaultDiscoveryFilters: DiscoveryFilters = {
  age: null,
  minutes: null,
  kilometers: null,
  difficulty: null,
  savedOnly: false,
  offlineOnly: false,
};
export type DiscoveryFacet = "age" | "minutes" | "kilometers" | "difficulty";
const known = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;
export function matchesDiscoveryFilters(
  quest: Quest,
  query: string,
  filters: DiscoveryFilters,
  saved: boolean,
  offline: boolean,
) {
  if (
    ![quest.title, quest.region]
      .join(" ")
      .toLocaleLowerCase("de-DE")
      .includes(query.trim().toLocaleLowerCase("de-DE"))
  )
    return false;
  if ((filters.savedOnly && !saved) || (filters.offlineOnly && !offline))
    return false;
  if (filters.difficulty && quest.difficulty !== filters.difficulty)
    return false;
  if (
    filters.age !== null &&
    (!known(quest.listing?.minimumAge) ||
      quest.listing.minimumAge > filters.age)
  )
    return false;
  if (
    filters.minutes !== null &&
    (!quest.fieldReady ||
      !known(quest.listing?.durationMinutes) ||
      quest.listing.durationMinutes <= 0 ||
      quest.listing.durationMinutes > filters.minutes)
  )
    return false;
  if (
    filters.kilometers !== null &&
    (!quest.fieldReady ||
      !known(quest.listing?.distanceKm) ||
      quest.listing.distanceKm <= 0 ||
      quest.listing.distanceKm > filters.kilometers)
  )
    return false;
  return true;
}
