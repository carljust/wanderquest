import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  fireEventAsync,
  renderAsync,
  screen,
  waitFor,
} from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";
import { BOOKMARKS_KEY } from "@/features/bookmarks/storage";
import { MissionProvider, useMissions } from "@/features/missions/provider";

function BookmarkProbe() {
  const { savedIds, bookmarksReady, storageError, toggleSaved, loading } =
    useMissions();
  return (
    <View>
      <Text>{loading ? "loading" : "ready"}</Text>
      <Text>{savedIds.join(",") || "empty"}</Text>
      {storageError && <Text>{storageError}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="merken"
        disabled={!bookmarksReady || loading}
        onPress={() => toggleSaved("spiegelsee")}
      >
        <Text>merken</Text>
      </Pressable>
    </View>
  );
}

describe("bookmark hydration and storage failures", () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test("keeps existing bookmarks and persists changes across a remount", async () => {
    await AsyncStorage.setItem(BOOKMARKS_KEY, '["kiefernlicht"]');
    const view = await renderAsync(
      <MissionProvider>
        <BookmarkProbe />
      </MissionProvider>,
    );
    await screen.findByText("kiefernlicht");
    await screen.findByText("ready");
    await fireEventAsync.press(screen.getByRole("button", { name: "merken" }));
    await waitFor(async () =>
      expect(await AsyncStorage.getItem(BOOKMARKS_KEY)).toBe(
        '["kiefernlicht","spiegelsee"]',
      ),
    );
    await view.unmountAsync();
    await renderAsync(
      <MissionProvider>
        <BookmarkProbe />
      </MissionProvider>,
    );
    expect(await screen.findByText("kiefernlicht,spiegelsee")).toBeTruthy();
  });

  test("does not overwrite saved data when the initial read fails", async () => {
    await AsyncStorage.setItem(BOOKMARKS_KEY, '["kiefernlicht"]');
    jest
      .mocked(AsyncStorage.getItem)
      .mockRejectedValueOnce(new Error("read failed"));
    await renderAsync(
      <MissionProvider>
        <BookmarkProbe />
      </MissionProvider>,
    );
    await screen.findByText(/Deine Merkliste konnte nicht geladen werden/);
    await screen.findByText("ready");
    await fireEventAsync.press(screen.getByRole("button", { name: "merken" }));
    expect(await screen.findByText("spiegelsee")).toBeTruthy();
    expect(await AsyncStorage.getItem(BOOKMARKS_KEY)).toBe('["kiefernlicht"]');
  });
});
