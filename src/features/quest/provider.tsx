import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import * as Crypto from "expo-crypto";
import * as Network from "expo-network";
import type {
  Fix,
  Operation,
  Preferences,
  Quest,
  Run,
  Station,
} from "@/domain/quest";
import {
  canFinish,
  complete,
  newRun,
  unlock,
  unlockReason,
} from "@/domain/engine";
import { useAuth } from "@/features/auth/provider";
import {
  emptySnapshot,
  readSnapshot,
  saveSnapshot,
  type Snapshot,
} from "@/features/offline/store";
import { downloadAsset } from "@/features/offline/assets";
import { synchronize } from "@/features/offline/sync";
import { checkPracticeAnswer } from "@/features/development/practice-solutions";
import {
  loadFieldRun,
  loadPublishedQuest,
  practiceQuest,
  sendOperation,
  startFieldRun,
} from "./repository";
import { friendlyError } from "@/lib/supabase";
import { backendConfigured } from "@/lib/config";

type QuestContext = Snapshot & {
  loading: boolean;
  busy: boolean;
  online: boolean;
  error: string;
  notice: string;
  refresh: () => Promise<void>;
  start: () => Promise<void>;
  open: (station: Station, fix?: Fix) => Promise<void>;
  answer: (
    station: Station,
    value: string,
  ) => Promise<{
    status: "correct" | "incorrect" | "pending";
    feedback: string;
  }>;
  hint: (station: Station) => Promise<void>;
  finish: () => Promise<void>;
  download: () => Promise<void>;
  sync: () => Promise<void>;
  resetPractice: () => Promise<void>;
  recover: () => Promise<void>;
  setPreferences: (preferences: Preferences) => Promise<void>;
  clearError: () => void;
};
const Context = createContext<QuestContext | null>(null);
export function QuestProvider({ children }: PropsWithChildren) {
  const auth = useAuth();
  const owner = auth.practice
    ? "practice"
    : (auth.session?.user.id ?? "visitor");
  return (
    <QuestSessionProvider key={owner} owner={owner}>
      {children}
    </QuestSessionProvider>
  );
}
function QuestSessionProvider({
  children,
  owner,
}: PropsWithChildren<{ owner: string }>) {
  const auth = useAuth();
  const alive = useRef(true);
  const state = useRef<Snapshot>(emptySnapshot());
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [online, setOnline] = useState(true);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const persist = useCallback(
    async (next: Snapshot, partition = owner) => {
      if (next.run && next.run.userId !== partition)
        throw new Error(
          "Das Konto hat gewechselt. Der fremde Spielstand wurde nicht übernommen.",
        );
      await saveSnapshot(partition, next);
      if (alive.current) {
        state.current = next;
        setSnapshot(next);
      }
    },
    [owner],
  );
  const serial = useCallback(<T,>(job: () => Promise<T>): Promise<T> => {
    const task = queue.current
      .catch(() => undefined)
      .then(async () => {
        if (!alive.current)
          throw new Error("Das Konto hat gewechselt. Bitte erneut versuchen.");
        setBusy(true);
        setError("");
        try {
          return await job();
        } catch (e) {
          setError(friendlyError(e));
          throw e;
        } finally {
          setBusy(false);
        }
      });
    queue.current = task;
    return task;
  }, []);
  useEffect(() => {
    let alive = true;
    void readSnapshot(owner)
      .then(async (saved) => {
        if (!alive) return;
        if (owner === "practice") saved.quest = practiceQuest();
        state.current = saved;
        setSnapshot(state.current);
        if (owner !== "practice" && backendConfigured) {
          try {
            const quest = await loadPublishedQuest(
              saved.run && !saved.run.finished
                ? saved.run.versionId
                : undefined,
            );
            if (!alive) return;
            const run =
              quest && owner !== "visitor" ? await loadFieldRun(quest) : null;
            if (alive)
              await persist(
                {
                  ...saved,
                  quest: saved.outbox.length ? saved.quest : quest,
                  run: saved.outbox.length ? saved.run : run,
                },
                owner,
              );
          } catch (e) {
            if (alive) setError(friendlyError(e));
          }
        }
      })
      .catch((e: unknown) => {
        if (alive) setError(friendlyError(e));
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [owner, persist]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const sync = useCallback(
    () =>
      serial(async () => {
        if (!state.current.outbox.length || owner === "practice") {
          setNotice("Der Spielstand ist aktuell.");
          return;
        }
        const partition = owner;
        const result = await synchronize(state.current, sendOperation, (next) =>
          persist(next, partition),
        );
        setNotice(
          result.rejected
            ? "Eine vorgemerkte Antwort war noch nicht richtig. Folgeaktionen wurden zurückgenommen. Du kannst die Station erneut lösen."
            : "Dein Fortschritt wurde sicher synchronisiert.",
        );
      }),
    [persist, serial, owner],
  );
  useEffect(() => {
    const apply = (network: Network.NetworkState) => {
      const connected =
        network.isConnected !== false && network.isInternetReachable !== false;
      setOnline(connected);
      if (connected && !loading && state.current.outbox.length)
        void sync().catch(() => undefined);
    };
    void Network.getNetworkStateAsync()
      .then(apply)
      .catch(() => setOnline(false));
    const listener = Network.addNetworkStateListener(apply);
    return () => listener.remove();
  }, [loading, sync]);

  const getRun = (): { quest: Quest; run: Run } => {
    const { quest, run } = state.current;
    if (!quest || !run) throw new Error("Starte zuerst das Abenteuer.");
    return { quest, run };
  };
  const command = async (operation: Operation, optimistic: Run) => {
    const partition = owner;
    const queued = {
      ...state.current,
      run: optimistic,
      outbox: [...state.current.outbox, operation],
    };
    await persist(queued, partition);
    if (!online) return "pending" as const;
    try {
      const result = await synchronize(queued, sendOperation, (next) =>
        persist(next, partition),
      );
      if (result.rejected)
        setNotice(
          "Eine vorgemerkte Antwort war nicht richtig. Nachfolgende Schritte wurden zurückgenommen.",
        );
      return result.rejected ? ("incorrect" as const) : ("correct" as const);
    } catch (e) {
      setNotice(
        "Aktion lokal vorgemerkt. Bei erneuter Verbindung wird sie geprüft.",
      );
      setError(friendlyError(e));
      return "pending" as const;
    }
  };
  const operation = (
    run: Run,
    kind: Operation["kind"],
    stationId = "",
  ): Operation => ({
    id: Crypto.randomUUID(),
    userId: run.userId,
    runId: run.id,
    stationId,
    kind,
    createdAt: Date.now(),
  });

  return (
    <Context.Provider
      value={{
        ...snapshot,
        loading,
        busy,
        online,
        error,
        notice,
        sync,
        clearError: () => setError(""),
        refresh: () =>
          serial(async () => {
            if (state.current.outbox.length)
              throw new Error(
                "Synchronisiere zuerst die vorgemerkten Antworten, damit nichts verloren geht.",
              );
            const quest = auth.practice
              ? practiceQuest()
              : await loadPublishedQuest(
                  state.current.run && !state.current.run.finished
                    ? state.current.run.versionId
                    : undefined,
                );
            const run =
              quest && !auth.practice && auth.session
                ? await loadFieldRun(quest)
                : state.current.run;
            await persist({ ...state.current, quest, run });
          }),
        start: () =>
          serial(async () => {
            const quest = state.current.quest;
            if (!quest)
              throw new Error("Es ist noch keine Quest veröffentlicht.");
            if (!auth.practice && !auth.session)
              throw new Error("Melde dich zuerst an.");
            if (state.current.run) return;
            const run = auth.practice
              ? newRun(Crypto.randomUUID(), "practice", quest, "practice")
              : await startFieldRun(quest, Crypto.randomUUID());
            await persist({ ...state.current, run });
          }),
        open: (station, fix) =>
          serial(async () => {
            const { run, quest } = getRun();
            const reason = unlockReason(station, run, quest, fix);
            if (reason) throw new Error(reason);
            if (run.unlocked.includes(station.id)) return;
            const next = unlock(run, station.id);
            if (run.mode === "practice")
              await persist({ ...state.current, run: next });
            else
              await command(
                { ...operation(run, "unlock", station.id), fix },
                next,
              );
          }),
        answer: (station, value) =>
          serial(async () => {
            const { run, quest } = getRun();
            if (!value.trim()) throw new Error("Gib zuerst eine Antwort ein.");
            if (run.completed.includes(station.id))
              return { status: "correct", feedback: station.success };
            if (
              quest.stations.find(
                (s) =>
                  !run.completed.includes(s.id) && !run.pending.includes(s.id),
              )?.id !== station.id
            )
              throw new Error("Beende zuerst die vorherige Station.");
            if (!run.unlocked.includes(station.id))
              throw new Error("Station noch gesperrt.");
            if (run.mode === "practice") {
              const correct = checkPracticeAnswer(station.id, value);
              const attempted = {
                ...run,
                attempts: {
                  ...run.attempts,
                  [station.id]: (run.attempts[station.id] ?? 0) + 1,
                },
              };
              await persist({
                ...state.current,
                run: correct ? complete(attempted, station) : attempted,
              });
              return {
                status: correct ? ("correct" as const) : ("incorrect" as const),
                feedback: correct ? station.success : station.failure,
              };
            }
            const status = await command(
              { ...operation(run, "answer", station.id), answer: value },
              complete(run, station, true),
            );
            const updated = state.current.quest?.stations.find(
              (s) => s.id === station.id,
            );
            return {
              status,
              feedback:
                status === "correct"
                  ? (updated?.success ?? "")
                  : station.failure,
            };
          }),
        hint: (station) =>
          serial(async () => {
            const { run } = getRun();
            if (!run.unlocked.includes(station.id))
              throw new Error("Station noch gesperrt.");
            const next = {
              ...run,
              hints: {
                ...run.hints,
                [station.id]: Math.min(
                  station.puzzle.hints.length,
                  (run.hints[station.id] ?? 0) + 1,
                ),
              },
            };
            if (run.mode === "practice")
              await persist({ ...state.current, run: next });
            else await command(operation(run, "hint", station.id), next);
          }),
        finish: () =>
          serial(async () => {
            const { run, quest } = getRun();
            if (!canFinish(run, quest))
              throw new Error(
                "Es fehlen noch geprüfte Stationen oder Siegel. Synchronisiere vorgemerkte Antworten.",
              );
            if (run.mode === "practice")
              await persist({
                ...state.current,
                run: { ...run, finished: true, awarded: false },
              });
            else await command(operation(run, "finish"), run);
          }),
        download: () =>
          serial(async () => {
            const quest = state.current.quest;
            if (!quest) throw new Error("Keine Quest verfügbar.");
            const assetUris: Record<string, string> = {};
            for (const asset of quest.assets)
              if (asset.url)
                assetUris[asset.id] = await downloadAsset(asset.url, asset.id);
            await persist({ ...state.current, downloaded: true, assetUris });
            setNotice(
              quest.assets.some((a) => !a.url)
                ? "Vorhandene Texte und Medien gespeichert. Freigegebene Grafiken/Audiodateien fehlen noch. Karten werden nicht heruntergeladen."
                : "Quest-Inhalte gespeichert. Karten benötigen weiterhin eine Verbindung.",
            );
          }),
        recover: () =>
          serial(async () => {
            const { quest, run } = getRun();
            if (run.mode !== "field")
              throw new Error("Dieser Spielstand ist ein Übungslauf.");
            const restored = await loadFieldRun(quest);
            if (!restored)
              throw new Error(
                "Kein bestätigter Serverstand gefunden. Lokale Daten bleiben erhalten.",
              );
            await persist({
              ...state.current,
              quest,
              run: restored,
              outbox: [],
            });
            setNotice(
              "Bestätigten Spielstand wiederhergestellt. Unbestätigte lokale Aktionen wurden verworfen.",
            );
          }),
        resetPractice: () =>
          serial(async () => {
            if (!auth.practice)
              throw new Error(
                "Nur der Übungslauf lässt sich hier zurücksetzen.",
              );
            await persist({ ...state.current, run: null, outbox: [] });
            setNotice("Übungslauf zurückgesetzt.");
          }),
        setPreferences: (preferences) =>
          serial(() => persist({ ...state.current, preferences })),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useQuest() {
  const context = useContext(Context);
  if (!context) throw new Error("QuestProvider fehlt");
  return context;
}
