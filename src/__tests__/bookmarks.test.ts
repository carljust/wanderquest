import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BOOKMARKS_KEY,
  loadBookmarks,
  parseBookmarks,
  saveBookmarks,
} from "@/features/bookmarks/storage";

describe("bookmark persistence", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test.each([null, "", "not json", "{}", "null"])(
    "recovers safely from missing or invalid storage: %s",
    (raw) => {
      expect(parseBookmarks(raw)).toEqual([]);
    },
  );

  test("ignores invalid entries and duplicates", () => {
    expect(
      parseBookmarks('["kiefernlicht",null,12,"","kiefernlicht","spiegelsee"]'),
    ).toEqual(["kiefernlicht", "spiegelsee"]);
  });

  test("restores bookmarks after saving", async () => {
    await saveBookmarks(["kiefernlicht"]);
    expect(await loadBookmarks()).toEqual(["kiefernlicht"]);
  });

  test("writes rapid changes in order", async () => {
    await Promise.all([
      saveBookmarks(["kiefernlicht"]),
      saveBookmarks(["spiegelsee"]),
      saveBookmarks([]),
    ]);
    expect(await loadBookmarks()).toEqual([]);
  });

  test("reports a failed write and allows a later retry", async () => {
    jest
      .mocked(AsyncStorage.setItem)
      .mockRejectedValueOnce(new Error("disk unavailable"));
    await expect(saveBookmarks(["kiefernlicht"])).rejects.toThrow(
      "disk unavailable",
    );
    await saveBookmarks(["spiegelsee"]);
    expect(await AsyncStorage.getItem(BOOKMARKS_KEY)).toBe('["spiegelsee"]');
  });
});
