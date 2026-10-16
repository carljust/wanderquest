import { describe, expect, jest, test } from "@jest/globals";
import {
  act,
  fireEventAsync,
  renderAsync,
  waitFor,
} from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { useDialogue } from "@/features/dialogue/use-dialogue";
const mockPlayer = {
  pause: jest.fn(),
  play: jest.fn(),
  replace: jest.fn(),
  addListener: jest.fn(() => ({ remove: jest.fn() })),
};
jest.mock("expo-audio", () => ({ useAudioPlayer: () => mockPlayer }));
jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => () => void) => {
    jest
      .requireActual<typeof import("react")>("react")
      .useEffect(callback, [callback]);
  },
}));
jest.mock("expo-speech", () => ({
  stop: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
  speak: jest.fn(),
  getAvailableVoicesAsync: jest
    .fn<() => Promise<unknown[]>>()
    .mockResolvedValue([{ identifier: "de-test", language: "de-DE" }]),
}));
function Harness({ muted = false }: { muted?: boolean }) {
  const d = useDialogue(muted);
  return (
    <View>
      <Text>{d.state}</Text>
      <Text>{d.dialogue?.text ?? "Kein Dialog"}</Text>
      <Text>{d.audioError}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Sprechen"
        onPress={() =>
          void d.play({
            speaker: "Wyldo",
            text: "Eine Geschichte im Wald.",
            mood: "talk",
          })
        }
      >
        <Text>Sprechen</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Überspringen"
        onPress={d.skip}
      >
        <Text>Überspringen</Text>
      </Pressable>
    </View>
  );
}
describe("dialogue and audio lifecycle", () => {
  test("German speech, skip, replay, stale callbacks, finish and unmount", async () => {
    const ui = await renderAsync(<Harness />);
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await waitFor(() => expect(Speech.speak).toHaveBeenCalled());
    const first = jest.mocked(Speech.speak).mock.calls.at(-1)![1]!;
    expect(first.language).toBe("de-DE");
    await act(async () => {
      first.onStart?.();
    });
    expect(ui.getByText("talk")).toBeTruthy();
    await fireEventAsync.press(ui.getByLabelText("Überspringen"));
    expect(ui.getByText("Kein Dialog")).toBeTruthy();
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await waitFor(() => expect(Speech.speak).toHaveBeenCalledTimes(2));
    await act(async () => {
      first.onDone?.();
    });
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    const current = jest.mocked(Speech.speak).mock.calls.at(-1)![1]!;
    await act(async () => {
      current.onDone?.();
    });
    expect(ui.getByText("Kein Dialog")).toBeTruthy();
    const stops = jest.mocked(Speech.stop).mock.calls.length;
    await ui.unmountAsync();
    expect(jest.mocked(Speech.stop).mock.calls.length).toBeGreaterThan(stops);
    expect(mockPlayer.pause).toHaveBeenCalled();
  });
  test("muted dialogue remains readable and never invokes speech", async () => {
    const ui = await renderAsync(<Harness muted />);
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    expect(Speech.speak).not.toHaveBeenCalled();
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    await ui.unmountAsync();
  });
  test("missing German voice falls back to complete subtitles", async () => {
    jest.mocked(Speech.getAvailableVoicesAsync).mockResolvedValueOnce([]);
    const ui = await renderAsync(<Harness />);
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await waitFor(() =>
      expect(ui.getByText(/Keine deutsche Stimme/)).toBeTruthy(),
    );
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    await ui.unmountAsync();
  });
});
