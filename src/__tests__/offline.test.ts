import { describe, expect, jest, test } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import data from "../../content/externsteine.v1.json";
import type { Operation, Quest } from "@/domain/quest";
import { complete, newRun, unlock } from "@/domain/engine";
import {
  type Snapshot,
  emptySnapshot,
  readSnapshot,
  saveSnapshot,
} from "@/features/offline/store";
import { synchronize } from "@/features/offline/sync";
const quest = data as Quest;
const run = newRun("r", "u", quest, "field");
const op = (id: string, stationId = quest.stations[0].id): Operation => ({
  id,
  runId: "r",
  userId: "u",
  stationId,
  kind: "answer",
  answer: "karte",
  createdAt: 1,
});
describe("offline persistence and replay", () => {
  test("legacy snapshots acquire an empty bookmark list without losing progress", async () => {
    const { savedQuestIds: _unused, ...legacy } = { ...emptySnapshot(), run };
    await AsyncStorage.setItem("wyldo.v1.legacy", JSON.stringify(legacy));
    const restored = await readSnapshot("legacy");
    expect(restored.savedQuestIds).toEqual([]);
    expect(restored.run).toEqual(run);
  });
  test("bookmarks survive restart and remain account-separated", async () => {
    await saveSnapshot("bookmark-owner", {
      ...emptySnapshot(),
      savedQuestIds: [quest.id],
    });
    expect((await readSnapshot("bookmark-owner")).savedQuestIds).toEqual([
      quest.id,
    ]);
    expect((await readSnapshot("bookmark-other")).savedQuestIds).toEqual([]);
  });
  test("restart restores the full run and its queue atomically in its account partition", async () => {
    const snapshot = {
      ...emptySnapshot(),
      quest,
      run: unlock(run, quest.stations[0].id),
      outbox: [op("a")],
      downloaded: true,
    };
    await saveSnapshot("u", snapshot);
    expect(await readSnapshot("u")).toEqual(snapshot);
    expect((await readSnapshot("other")).run).toBeNull();
  });
  test("offline failure retains work; reconnect replays ordered operations and persists each acknowledgement", async () => {
    const snapshot = {
      ...emptySnapshot(),
      run,
      outbox: [op("a"), op("b", quest.stations[1].id)],
    };
    const persist = jest
      .fn<(s: Snapshot) => Promise<void>>()
      .mockResolvedValue(undefined);
    const failed = jest
      .fn<(o: Operation) => Promise<{ run: typeof run; correct: boolean }>>()
      .mockRejectedValue(new Error("offline"));
    await expect(synchronize(snapshot, failed, persist)).rejects.toThrow(
      "offline",
    );
    expect(snapshot.outbox).toHaveLength(2);
    const seen: string[] = [];
    const result = await synchronize(
      snapshot,
      async (operation) => {
        seen.push(operation.id);
        return { run, correct: true };
      },
      persist,
    );
    expect(seen).toEqual(["a", "b"]);
    expect(result.snapshot.outbox).toHaveLength(0);
    expect(persist).toHaveBeenCalledTimes(2);
  });
  test("an incorrect provisional answer rolls back dependent actions", async () => {
    const snapshot = { ...emptySnapshot(), run, outbox: [op("a"), op("b")] };
    const result = await synchronize(
      snapshot,
      async () => ({ run, correct: false }),
      async () => undefined,
    );
    expect(result.rejected).toBe(true);
    expect(result.snapshot.run?.completed).toHaveLength(0);
    expect(result.snapshot.outbox).toHaveLength(0);
  });
  test("wrong-account response is rejected", async () => {
    await expect(
      synchronize(
        { ...emptySnapshot(), run, outbox: [op("a")] },
        async () => ({
          run: { ...run, userId: "someone-else" },
          correct: true,
        }),
        async () => undefined,
      ),
    ).rejects.toThrow("anderen Konto");
  });
  test("practice restores without a forged regular badge", async () => {
    await saveSnapshot("practice", {
      ...emptySnapshot(),
      run: { ...run, userId: "practice", mode: "practice", awarded: true },
    });
    expect((await readSnapshot("practice")).run?.awarded).toBe(false);
  });
  test("damaged snapshot is not silently overwritten", async () => {
    await AsyncStorage.setItem("wyldo.v1.damaged", "invalid-json");
    await expect(readSnapshot("damaged")).rejects.toThrow("beschädigt");
    expect(await AsyncStorage.getItem("wyldo.v1.damaged")).toBe("invalid-json");
  });
  test("completion is stable when the same confirmed station is replayed", () => {
    const s = quest.stations[0];
    let state = unlock(run, s.id);
    state = complete(state, s);
    expect(complete(state, s).completed).toHaveLength(1);
  });
});
