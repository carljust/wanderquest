import type { Snapshot } from "./store";
import type { Operation, Run } from "@/domain/quest";
export type Feedback = {
  stationId: string;
  success: string | null;
  hints: string[];
};
export type CommandResponse = {
  run: Run;
  correct: boolean;
  feedback?: Feedback;
};
export async function synchronize(
  snapshot: Snapshot,
  send: (op: Operation) => Promise<CommandResponse>,
  persist: (next: Snapshot) => Promise<void>,
) {
  let current = snapshot;
  let rejected = false;
  while (current.outbox.length) {
    const operation = current.outbox[0];
    const response = await send(operation);
    if (
      response.run.mode !== "field" ||
      response.run.userId !== operation.userId
    )
      throw new Error("Synchronisierung gehört zu einem anderen Konto.");
    const remaining = response.correct ? current.outbox.slice(1) : [];
    const run = {
      ...response.run,
      pending: remaining
        .filter((op) => op.kind === "answer")
        .map((op) => op.stationId),
    };
    const quest = current.quest
      ? {
          ...current.quest,
          stations: current.quest.stations.map((station) => {
            const feedback = response.feedback;
            if (!feedback || feedback.stationId !== station.id) return station;
            return {
              ...station,
              success: feedback.success ?? station.success,
              puzzle: {
                ...station.puzzle,
                hints: station.puzzle.hints.map(
                  (hint, index) => feedback.hints[index] ?? hint,
                ),
              },
            };
          }),
        }
      : null;
    current = { ...current, quest, run, outbox: remaining };
    await persist(current);
    if (!response.correct) {
      rejected = true;
      break;
    }
  }
  return { snapshot: current, rejected };
}
