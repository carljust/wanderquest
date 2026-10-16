import AsyncStorage from "@react-native-async-storage/async-storage";

export const BOOKMARKS_KEY = "@wanderquest/bookmarks/v1";
let pendingWrite: Promise<void> = Promise.resolve();

export function parseBookmarks(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value)
      ? [
          ...new Set(
            value.filter(
              (id): id is string => typeof id === "string" && id.length > 0,
            ),
          ),
        ]
      : [];
  } catch {
    return [];
  }
}

export async function loadBookmarks() {
  return parseBookmarks(await AsyncStorage.getItem(BOOKMARKS_KEY));
}

export function saveBookmarks(ids: readonly string[]) {
  // Preserve tap order even when the native storage bridge is slow.
  const write = pendingWrite.then(() =>
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids)),
  );
  pendingWrite = write.catch(() => undefined);
  return write;
}
