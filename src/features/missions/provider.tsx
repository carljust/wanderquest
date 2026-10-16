import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { loadBookmarks, saveBookmarks } from "@/features/bookmarks/storage";
import { localMissionRepository } from "./repository";
import type { Mission, MissionRepository } from "./types";

type MissionState = {
  missions: readonly Mission[];
  loading: boolean;
  error: string | null;
  savedIds: string[];
  bookmarksReady: boolean;
  storageError: string | null;
  toggleSaved: (id: string) => void;
};
const MissionContext = createContext<MissionState | null>(null);

export function MissionProvider({
  children,
  repository = localMissionRepository,
}: PropsWithChildren<{ repository?: MissionRepository }>) {
  const [missions, setMissions] = useState<readonly Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [bookmarksReady, setBookmarksReady] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    repository
      .list()
      .then((data) => {
        if (active) setMissions(data);
      })
      .catch(() => {
        if (active)
          setError(
            "Die Missionen konnten nicht geladen werden. Bitte starte die App erneut.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    loadBookmarks()
      .then((ids) => {
        if (active) setSavedIds(ids);
      })
      .catch(() => {
        if (active)
          setStorageError(
            "Deine Merkliste konnte nicht geladen werden. Neue Änderungen werden nur für diese Sitzung gespeichert.",
          );
      })
      .finally(() => {
        if (active) setBookmarksReady(true);
      });
    return () => {
      active = false;
    };
  }, [repository]);

  // Do not overwrite existing storage after a failed read or before hydration.
  useEffect(() => {
    if (!bookmarksReady || storageError) return;
    saveBookmarks(savedIds).catch(() =>
      setStorageError(
        "Deine Merkliste kann gerade nur für diese Sitzung gespeichert werden.",
      ),
    );
  }, [savedIds, bookmarksReady, storageError]);

  function toggleSaved(id: string) {
    if (!bookmarksReady || !missions.some((mission) => mission.id === id))
      return;
    setSavedIds((ids) =>
      ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id],
    );
  }

  return (
    <MissionContext.Provider
      value={{
        missions,
        loading,
        error,
        savedIds,
        bookmarksReady,
        storageError,
        toggleSaved,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
}

export function useMissions() {
  const context = useContext(MissionContext);
  if (!context) throw new Error("useMissions requires MissionProvider");
  return context;
}
