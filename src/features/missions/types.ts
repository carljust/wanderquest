export type Difficulty = "Leicht" | "Mittel";
export type MissionFilter = "Alle" | Difficulty | "Gemerkt";
export type Coordinate = { latitude: number; longitude: number };
export type Mission = {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  description: string;
  difficulty: Difficulty;
  distanceKm: number;
  durationMinutes: number;
  elevationMeters: number;
  artwork: "forest" | "lake" | "summit";
  highlights: string[];
  checkpoints: {
    id: string;
    title: string;
    hint: string;
    coordinate: Coordinate;
  }[];
};

export interface MissionRepository {
  list(): Promise<readonly Mission[]>;
  getById(id: string): Promise<Mission | undefined>;
}
