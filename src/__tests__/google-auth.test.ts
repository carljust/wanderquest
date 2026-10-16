import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import * as WebBrowser from "expo-web-browser";
import { signInWithGoogle } from "@/features/auth/google";
import { exchangeAuthCode, finishOAuthReturn } from "@/features/auth/callback";
import { requireBackend } from "@/lib/supabase";
jest.mock("expo", () => ({ isRunningInExpoGo: jest.fn(() => false) }));
jest.mock("expo-auth-session", () => ({
  makeRedirectUri: () => "wyldo://auth/callback",
}));
jest.mock("expo-web-browser", () => ({
  openAuthSessionAsync: jest.fn(),
  WebBrowserResultType: { CANCEL: "cancel" },
}));
jest.mock("@/lib/config", () => ({
  config: {
    supabaseUrl: "https://example.supabase.co",
    supabaseKey: "synthetic-public-test-key",
  },
}));
jest.mock("@/lib/supabase", () => ({ requireBackend: jest.fn() }));
const oauth =
  jest.fn<() => Promise<{ data: { url: string }; error: Error | null }>>();
const exchange = jest.fn<() => Promise<{ error: Error | null }>>();
const fetchMock = jest.fn<typeof fetch>();
const originalFetch = global.fetch;
const originalPlatform = Platform.OS;
beforeEach(() => {
  Object.defineProperty(Platform, "OS", {
    value: "android",
    configurable: true,
  });
  jest.mocked(isRunningInExpoGo).mockReturnValue(false);
  jest.mocked(requireBackend).mockReturnValue({
    auth: { signInWithOAuth: oauth, exchangeCodeForSession: exchange },
  } as unknown as ReturnType<typeof requireBackend>);
  oauth.mockResolvedValue({
    data: {
      url: "https://example.supabase.co/auth/v1/authorize?provider=google",
    },
    error: null,
  });
  exchange.mockResolvedValue({ error: null });
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({ external: { google: true } }),
  } as Response);
  global.fetch = fetchMock;
});
afterEach(() => {
  global.fetch = originalFetch;
  Object.defineProperty(Platform, "OS", {
    value: originalPlatform,
    configurable: true,
  });
});
describe("Google OAuth", () => {
  test("Expo Go gets an actionable explanation before opening a browser", async () => {
    jest.mocked(isRunningInExpoGo).mockReturnValue(true);
    await expect(signInWithGoogle()).rejects.toThrow("Development-Build");
    expect(oauth).not.toHaveBeenCalled();
  });
  test("disabled Google provider is detected before leaving the app", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ external: { google: false } }),
    } as Response);
    await expect(signInWithGoogle()).rejects.toThrow("noch nicht aktiviert");
    expect(WebBrowser.openAuthSessionAsync).not.toHaveBeenCalled();
  });
  test("native PKCE success uses system browser and one code exchange", async () => {
    jest.mocked(WebBrowser.openAuthSessionAsync).mockResolvedValueOnce({
      type: "success",
      url: "wyldo://auth/callback?code=native-success",
    });
    await expect(signInWithGoogle()).resolves.toBe("signed-in");
    expect(oauth).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: "google",
        options: expect.objectContaining({
          skipBrowserRedirect: true,
          redirectTo: "wyldo://auth/callback",
        }),
      }),
    );
    expect(exchange).toHaveBeenCalledWith("native-success");
  });
  test("cancelling Google leaves the existing session untouched", async () => {
    jest
      .mocked(WebBrowser.openAuthSessionAsync)
      .mockResolvedValueOnce({ type: WebBrowser.WebBrowserResultType.CANCEL });
    await expect(signInWithGoogle()).resolves.toBe("cancelled");
    expect(exchange).not.toHaveBeenCalled();
  });
  test("web delegates same-tab redirection to Supabase", async () => {
    Object.defineProperty(Platform, "OS", { value: "web", configurable: true });
    await expect(signInWithGoogle()).resolves.toBe("redirected");
    expect(oauth).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ skipBrowserRedirect: false }),
      }),
    );
    expect(WebBrowser.openAuthSessionAsync).not.toHaveBeenCalled();
  });
  test("unexpected callback host is rejected", async () => {
    await expect(
      finishOAuthReturn(
        "wyldo://other/callback?code=bad",
        "wyldo://auth/callback",
      ),
    ).rejects.toThrow("unerwartete");
    expect(exchange).not.toHaveBeenCalled();
  });
  test("router and browser exchange the same code exactly once", async () => {
    await Promise.all([
      exchangeAuthCode("duplicate-callback"),
      exchangeAuthCode("duplicate-callback"),
    ]);
    expect(exchange).toHaveBeenCalledTimes(1);
  });
  test("provider denial never creates a session", async () => {
    await expect(
      finishOAuthReturn(
        "wyldo://auth/callback?error=access_denied",
        "wyldo://auth/callback",
      ),
    ).rejects.toThrow("abgebrochen");
    expect(exchange).not.toHaveBeenCalled();
  });
});
