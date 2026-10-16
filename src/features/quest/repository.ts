import type { CommandResponse, Feedback } from "@/features/offline/sync";
import type { Quest, Run, Operation } from "@/domain/quest";
import { requireBackend } from "@/lib/supabase";

export function parseQuest(input: unknown): Quest {
  const q = input as Quest;
  if (
    !q ||
    typeof q.title !== "string" ||
    !q.versionId ||
    !Array.isArray(q.stations) ||
    q.stations.length !== 8 ||
    new Set(q.stations.map((s) => s.id)).size !== 8 ||
    q.stations.some(
      (s, i) => s.order !== i + 1 || !s.puzzle || s.puzzle.hints.length < 2,
    )
  )
    throw new Error(
      "Die Questdaten sind unvollständig. Bitte erneut herunterladen.",
    );
  if (
    q.fieldReady &&
    (q.approval !== "approved" ||
      q.route.length < 2 ||
      q.stations.some(
        (s) => !s.point || s.coordinateStatus !== "field_checked",
      ))
  )
    throw new Error(
      "Die veröffentlichte Route besitzt keine vollständige Standortfreigabe.",
    );
  return q;
}
export const practiceQuest = () => {
  if (__DEV__)
    return parseQuest(require("../../../content/externsteine.v1.json"));
  throw new Error("Der Entwicklungsmodus ist in Release-Builds deaktiviert.");
};
export async function loadPublishedQuest(preferredVersion?: string) {
  let query = requireBackend()
    .from("quest_versions")
    .select("document")
    .eq("status", "published");
  if (preferredVersion) query = query.eq("id", preferredVersion);
  const { data, error } = await query
    .order("revision", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const quest = parseQuest(data.document);
  const assets = await requireBackend()
    .from("quest_assets")
    .select("id,storage_path")
    .eq("version_id", quest.versionId);
  if (assets.error) throw assets.error;
  for (const asset of assets.data) {
    if (!asset.storage_path) continue;
    const signed = await requireBackend()
      .storage.from("quest-assets")
      .createSignedUrl(asset.storage_path, 86400);
    if (signed.error) throw signed.error;
    const target = quest.assets.find((item) => item.id === asset.id);
    if (target) target.url = signed.data.signedUrl;
  }
  return quest;
}
export async function startFieldRun(quest: Quest, id: string) {
  const { data, error } = await requireBackend().rpc("start_quest", {
    p_version: quest.versionId,
    p_run: id,
    p_mode: "field",
  });
  if (error) throw error;
  return data as Run;
}
export async function sendOperation(operation: Operation) {
  const { data, error } = await requireBackend().rpc("quest_command", {
    p_run: operation.runId,
    p_operation: operation.id,
    p_station: operation.stationId || null,
    p_kind: operation.kind,
    p_answer: operation.answer ?? null,
    p_fix: operation.fix ?? null,
    p_occurred_at: operation.createdAt,
  });
  if (error) throw error;
  return data as CommandResponse;
}
export async function loadFieldRun(quest: Quest) {
  const { data, error } = await requireBackend().rpc("get_quest_state", {
    p_version: quest.versionId,
  });
  if (error) throw error;
  if (!data) return null;
  const state = data as { run: Run; feedback: Feedback[] };
  quest.stations = quest.stations.map((station) => {
    const feedback = state.feedback.find(
      (item) => item.stationId === station.id,
    );
    return feedback
      ? {
          ...station,
          success: feedback.success ?? station.success,
          puzzle: {
            ...station.puzzle,
            hints: station.puzzle.hints.map(
              (hint, index) => feedback.hints[index] ?? hint,
            ),
          },
        }
      : station;
  });
  return state.run;
}
