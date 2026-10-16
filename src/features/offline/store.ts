import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Operation, Preferences, Quest, Run } from "@/domain/quest";
import { defaultPreferences } from "@/domain/quest";

export type Snapshot = {
  schema: 1;
  quest: Quest | null;
  run: Run | null;
  outbox: Operation[];
  downloaded: boolean;
  assetUris: Record<string, string>;
  preferences: Preferences;
};
export const emptySnapshot = (): Snapshot => ({
  schema: 1,
  quest: null,
  run: null,
  outbox: [],
  downloaded: false,
  assetUris: {},
  preferences: defaultPreferences,
});
const key = (owner: string) => `wyldo.v1.${owner}`;
export async function readSnapshot(owner: string): Promise<Snapshot> {
  const raw = await AsyncStorage.getItem(key(owner));
  if (!raw) return emptySnapshot();
  try {
    const data = JSON.parse(raw) as Snapshot;
    if (data.schema !== 1 || !Array.isArray(data.outbox))
      throw new Error("schema");
    if (data.run?.mode === "practice") data.run.awarded = false;
    return data;
  } catch {
    throw new Error(
      "Der lokale Spielstand ist beschädigt. Er bleibt erhalten; lade die Daten erneut oder setze ausschließlich den Übungslauf zurück.",
    );
  }
}
// One atomic storage record keeps optimistic state and its queued commands together.
export const saveSnapshot = (owner: string, value: Snapshot) =>
  AsyncStorage.setItem(key(owner), JSON.stringify(value));
export const removeSnapshot = (owner: string) =>
  AsyncStorage.removeItem(key(owner));
