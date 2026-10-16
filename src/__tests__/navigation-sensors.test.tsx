import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { act, renderHook } from "@testing-library/react-native";
import { Platform } from "react-native";
import * as Location from "expo-location";
import { useLocation } from "@/features/map/use-location";
import { useHeading } from "@/features/map/use-heading";
let mockBlur: (() => void) | undefined;
jest.mock("expo-router", () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    jest.requireActual<typeof import("react")>("react").useEffect(() => {
      const cleanup = callback();
      mockBlur = typeof cleanup === "function" ? cleanup : undefined;
      return cleanup;
    }, [callback]);
  },
}));
jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  watchPositionAsync: jest.fn(),
  watchHeadingAsync: jest.fn(),
  Accuracy: { High: 4 },
}));
jest.mock("@/lib/supabase", () => ({
  friendlyError: (error: Error) => error.message,
}));
const os = Platform.OS;
const permission = {
  granted: true,
  canAskAgain: true,
  expires: "never",
  status: "granted",
} as Location.LocationPermissionResponse;
beforeEach(() => {
  Object.defineProperty(Platform, "OS", { value: "ios", configurable: true });
  jest
    .mocked(Location.requestForegroundPermissionsAsync)
    .mockResolvedValue(permission);
  jest.mocked(Location.hasServicesEnabledAsync).mockResolvedValue(true);
});
afterEach(() => {
  Object.defineProperty(Platform, "OS", { value: os, configurable: true });
});
test("denied location permission never starts a position watcher", async () => {
  jest
    .mocked(Location.requestForegroundPermissionsAsync)
    .mockResolvedValue({ ...permission, granted: false });
  const hook = renderHook(() => useLocation());
  await act(() => hook.result.current.enable());
  expect(hook.result.current.error).toContain("abgelehnt");
  expect(Location.watchPositionAsync).not.toHaveBeenCalled();
  hook.unmount();
});
test("position subscription arriving after navigation blur is removed", async () => {
  const remove = jest.fn();
  let resolve!: (value: Location.LocationSubscription) => void;
  jest.mocked(Location.watchPositionAsync).mockImplementation(
    () =>
      new Promise((value) => {
        resolve = value;
      }),
  );
  const hook = renderHook(() => useLocation());
  let pending: Promise<void>;
  await act(async () => {
    pending = hook.result.current.enable();
    await Promise.resolve();
    await Promise.resolve();
  });
  expect(Location.watchPositionAsync).toHaveBeenCalledTimes(1);
  act(() => mockBlur?.());
  await act(async () => {
    resolve({ remove });
    await pending;
  });
  expect(remove).toHaveBeenCalledTimes(1);
  expect(hook.result.current.watching).toBe(false);
  hook.unmount();
});
test("unreliable compass readings are hidden and native subscriptions stop on exit", async () => {
  let callback!: Location.LocationHeadingCallback;
  const remove = jest.fn();
  jest.mocked(Location.watchHeadingAsync).mockImplementation(async (value) => {
    callback = value;
    return { remove };
  });
  const hook = renderHook(() => useHeading(true));
  await act(async () => {
    await Promise.resolve();
  });
  act(() => callback({ trueHeading: 35, magHeading: 33, accuracy: 3 }));
  expect(hook.result.current.heading).toBe(35);
  act(() => callback({ trueHeading: 35, magHeading: 33, accuracy: 0 }));
  expect(hook.result.current.heading).toBeUndefined();
  expect(hook.result.current.error).toContain("ungenau");
  hook.unmount();
  expect(remove).toHaveBeenCalledTimes(1);
});
