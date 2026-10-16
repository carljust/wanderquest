import { authRedirect } from "./provider";
import { requireBackend } from "@/lib/supabase";
export type AuthAction = "login" | "register" | "reset";
export async function submitAuth(
  mode: AuthAction,
  email: string,
  password: string,
  confirmation: string,
) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    throw new Error("Gib eine gültige E-Mail-Adresse ein.");
  if (
    mode === "register" &&
    (password.length < 12 || password !== confirmation)
  )
    throw new Error(
      "Verwende mindestens 12 Zeichen und bestätige dasselbe Passwort.",
    );
  const client = requireBackend();
  if (mode === "reset") {
    const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: authRedirect() + "?next=reset",
    });
    if (error) throw error;
    return "Wenn ein Konto existiert, erhältst du eine E-Mail mit einem Link zum Zurücksetzen.";
  }
  if (mode === "register") {
    const { error, data } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: { emailRedirectTo: authRedirect() },
    });
    if (error) throw error;
    return data.session
      ? "Dein Konto ist bereit."
      : "Prüfe deine E-Mails und bestätige dein Konto.";
  }
  const { error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return "";
}
