export type Point = { latitude: number; longitude: number };
export type Fix = Point & { accuracy: number; timestamp: number };
export type CompanionState =
  "idle" | "talk" | "think" | "surprise" | "celebrate" | "wave";
export type Dialogue = {
  speaker: string;
  text: string;
  mood: CompanionState;
  audioAsset?: string;
};
export type Puzzle = {
  kind: "text" | "choice" | "order" | "listen" | "code";
  prompt: string;
  options?: { id: string; label: string }[];
  transcript?: string;
  hints: string[];
};
export type Station = {
  id: string;
  order: number;
  title: string;
  place: string;
  point: Point | null;
  radius: number;
  coordinateStatus: "unverified" | "desk_checked" | "field_checked";
  intro: string;
  bridge: string;
  dialogues: Dialogue[];
  puzzle: Puzzle;
  success: string;
  failure: string;
  seal: string | null;
  imageAsset: string;
  fact?: { text: string; source: string; checked: boolean };
};
export type QuestAsset = {
  id: string;
  kind: "image" | "audio" | "animation";
  url: string | null;
  description: string;
  bundled?: "scenes" | "fox" | "seals";
};
export type Quest = {
  id: string;
  versionId: string;
  revision: number;
  title: string;
  subtitle: string;
  story: string;
  region: string;
  duration: string;
  distance: string;
  difficulty: string;
  // Read-only aggregate supplied by the quest data source; no player reviews here.
  ratingSummary?: { average: number | null; count: number };
  // Optional factual listing metadata. Time/distance are filtered only after field release.
  listing?: {
    minimumAge?: number;
    durationMinutes?: number;
    distanceKm?: number;
  };
  preparation: string[];
  start: string;
  approval: "pending_source_review" | "approved";
  fieldReady: boolean;
  route: Point[];
  routeStatus: string;
  stations: Station[];
  assets: QuestAsset[];
  badge: { name: string; description: string };
  ending: string;
};
export type RunMode = "practice" | "field";
export type Run = {
  id: string;
  userId: string;
  versionId: string;
  mode: RunMode;
  unlocked: string[];
  completed: string[];
  seals: string[];
  hints: Record<string, number>;
  attempts: Record<string, number>;
  pending: string[];
  finished: boolean;
  awarded: boolean;
  updatedAt: number;
};
export type Operation = {
  id: string;
  runId: string;
  userId: string;
  stationId: string;
  kind: "unlock" | "answer" | "hint" | "finish";
  answer?: string;
  fix?: Fix;
  createdAt: number;
};
export type Preferences = { muted: boolean; reducedMotion: boolean };
export const defaultPreferences: Preferences = {
  muted: true,
  reducedMotion: false,
};
