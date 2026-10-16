import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import {
  act,
  fireEventAsync,
  renderAsync,
  waitFor,
} from "@testing-library/react-native";
import { Pressable, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { createAudioPlayer } from "expo-audio";
import { useDialogue } from "@/features/dialogue/use-dialogue";
let mockReleased = false;
const mockPlayer = {
  pause: jest.fn(() => {
    if (mockReleased)
      throw new Error(
        "Call to function 'AudioPlayer.pause' has been rejected.",
      );
  }),
  play: jest.fn(),
  replace: jest.fn(),
  release: jest.fn(() => {
    mockReleased = true;
  }),
  addListener: jest.fn(
    (
      _event: string,
      _listener: (status: { didJustFinish: boolean }) => void,
    ) => ({ remove: jest.fn() }),
  ),
};
jest.mock("expo-audio", () => ({
  useAudioPlayer: () => {
    jest.requireActual<typeof import("react")>("react").useEffect(() => {
      mockReleased = false;
      // Mirrors Expo SDK57's earlier automatic release effect, before our cleanup.
      return () => mockPlayer.release();
    }, []);
    return mockPlayer;
  },
  createAudioPlayer: jest.fn(() => {
    mockReleased = false;
    return mockPlayer;
  }),
}));
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
function Harness({
  muted = false,
  audioUrl,
}: {
  muted?: boolean;
  audioUrl?: string;
}) {
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
          void d.play(
            {
              speaker: "Wyldo",
              text: "Eine Geschichte im Wald.",
              mood: "talk",
            },
            audioUrl,
          )
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
  beforeEach(() => {
    mockReleased = false;
  });
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
    expect(mockPlayer.pause).not.toHaveBeenCalled();
    expect(createAudioPlayer).not.toHaveBeenCalled();
  });
  test("muted dialogue remains readable and never invokes speech", async () => {
    const ui = await renderAsync(<Harness muted />);
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    expect(Speech.speak).not.toHaveBeenCalled();
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    expect(createAudioPlayer).not.toHaveBeenCalled();
    expect(mockPlayer.pause).not.toHaveBeenCalled();
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
  test("a recording is released exactly once on skip, without pause after release", async () => {
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    expect(createAudioPlayer).toHaveBeenCalledTimes(1);
    expect(createAudioPlayer).toHaveBeenCalledWith(
      "https://example.invalid/dialogue.mp3",
    );
    expect(mockPlayer.play).toHaveBeenCalledTimes(1);
    expect(ui.getByText("talk")).toBeTruthy();
    const result = mockPlayer.addListener.mock.results.at(-1)!;
    if (result.type !== "return")
      throw new Error("Listener registration failed");
    const listener = result.value;
    await fireEventAsync.press(ui.getByLabelText("Überspringen"));
    expect(listener.remove).toHaveBeenCalledTimes(1);
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pause).not.toHaveBeenCalled();
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
  });
  test("muting a playing recording stops it, preserves subtitles and leaves no player for unmount", async () => {
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await ui.rerenderAsync(
      <Harness muted audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
    expect(ui.getByText("idle")).toBeTruthy();
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
  });
  test("pending voice discovery cannot start speaking after leaving the screen", async () => {
    let resolve!: (voices: Speech.Voice[]) => void;
    jest.mocked(Speech.getAvailableVoicesAsync).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const ui = await renderAsync(<Harness />);
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await ui.unmountAsync();
    await act(async () => {
      resolve([{ identifier: "de-test", language: "de-DE" } as Speech.Voice]);
    });
    expect(Speech.speak).not.toHaveBeenCalled();
  });
  test("leaving with a playing recording releases its player without any pause call", async () => {
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pause).not.toHaveBeenCalled();
  });
  test("late recording completion cannot close a newer dialog", async () => {
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    const first = mockPlayer.addListener.mock.calls.at(-1)![1];
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    const current = mockPlayer.addListener.mock.calls.at(-1)![1];
    await act(async () => {
      first({ didJustFinish: true });
    });
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
    await act(async () => {
      current({ didJustFinish: true });
    });
    expect(ui.getByText("Kein Dialog")).toBeTruthy();
    expect(mockPlayer.release).toHaveBeenCalledTimes(2);
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(2);
  });
  test("failed audio start preserves the story and permits a retry", async () => {
    jest.mocked(createAudioPlayer).mockImplementationOnce(() => {
      throw new Error("Native audio unavailable");
    });
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    expect(ui.getByText(/Audio konnte nicht gestartet/)).toBeTruthy();
    expect(ui.getByText("Eine Geschichte im Wald.")).toBeTruthy();
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    expect(ui.getByText("talk")).toBeTruthy();
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
  });
  test("native teardown and speech-stop rejection cannot crash leaving a dialog", async () => {
    const ui = await renderAsync(
      <Harness audioUrl="https://example.invalid/dialogue.mp3" />,
    );
    await fireEventAsync.press(ui.getByLabelText("Sprechen"));
    const result = mockPlayer.addListener.mock.results.at(-1)!;
    if (result.type !== "return")
      throw new Error("Listener registration failed");
    result.value.remove.mockImplementationOnce(() => {
      throw new Error("Subscription removed");
    });
    mockPlayer.release.mockImplementationOnce(() => {
      throw new Error("Shared object released");
    });
    jest
      .mocked(Speech.stop)
      .mockRejectedValueOnce(new Error("Speech unavailable"));
    await ui.unmountAsync();
    expect(mockPlayer.release).toHaveBeenCalledTimes(1);
    expect(mockPlayer.pause).not.toHaveBeenCalled();
  });
});
