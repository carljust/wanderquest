import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { submitAuth } from "@/features/auth/service";
import { requireBackend } from "@/lib/supabase";
jest.mock("@/features/auth/provider", () => ({
  authRedirect: () => "wyldo://auth/callback",
}));
jest.mock("@/lib/supabase", () => ({ requireBackend: jest.fn() }));
const signInWithPassword = jest.fn<() => Promise<{ error: Error | null }>>();
const signUp =
  jest.fn<() => Promise<{ error: Error | null; data: { session: null } }>>();
const resetPasswordForEmail = jest.fn<() => Promise<{ error: Error | null }>>();
beforeEach(() => {
  jest.mocked(requireBackend).mockReturnValue({
    auth: { signInWithPassword, signUp, resetPasswordForEmail },
  } as unknown as ReturnType<typeof requireBackend>);
  signInWithPassword.mockResolvedValue({ error: null });
  signUp.mockResolvedValue({ error: null, data: { session: null } });
  resetPasswordForEmail.mockResolvedValue({ error: null });
});
describe("authentication service contracts", () => {
  test("rejects invalid email before contacting Supabase", async () => {
    await expect(submitAuth("login", "invalid", "abc", "")).rejects.toThrow(
      "E-Mail",
    );
    expect(signInWithPassword).not.toHaveBeenCalled();
  });
  test("registration validates strength and confirmation", async () => {
    await expect(
      submitAuth("register", "user@example.test", "short", "short"),
    ).rejects.toThrow("12");
    await expect(
      submitAuth(
        "register",
        "user@example.test",
        "secure-password",
        "different",
      ),
    ).rejects.toThrow("Passwort");
    expect(signUp).not.toHaveBeenCalled();
  });
  test("login sends trimmed email and returns real API error", async () => {
    signInWithPassword.mockResolvedValue({
      error: new Error("invalid login credentials"),
    });
    await expect(
      submitAuth("login", " user@example.test ", "incorrect", ""),
    ).rejects.toThrow("invalid login");
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "user@example.test",
      password: "incorrect",
    });
  });
  test("registration requests confirmation callback", async () => {
    await expect(
      submitAuth(
        "register",
        "user@example.test",
        "long-password-123",
        "long-password-123",
      ),
    ).resolves.toMatch(/E-Mails/);
    expect(signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        options: { emailRedirectTo: "wyldo://auth/callback" },
      }),
    );
  });
  test("reset uses safe callback and does not disclose account existence", async () => {
    await expect(
      submitAuth("reset", "user@example.test", "", ""),
    ).resolves.toMatch(/Wenn ein Konto existiert/);
    expect(resetPasswordForEmail).toHaveBeenCalledWith("user@example.test", {
      redirectTo: "wyldo://auth/callback?next=reset",
    });
  });
});
