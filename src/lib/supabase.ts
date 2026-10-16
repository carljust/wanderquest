import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { backendConfigured, config } from "./config";
import { sessionStorage } from "@/features/auth/session-storage";

export const supabase = backendConfigured
  ? createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        storage: sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        flowType: "pkce",
      },
    })
  : null;

export function requireBackend() {
  if (!supabase)
    throw new Error(
      "Supabase ist noch nicht eingerichtet. Projekt-URL und öffentlichen Publishable-Key eintragen und Expo neu starten.",
    );
  return supabase;
}
export function friendlyError(error: unknown) {
  const message =
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
      ? error.message
      : "Etwas ist schiefgegangen. Bitte erneut versuchen.";
  if (/provider.*(not enabled|disabled)|unsupported provider/i.test(message))
    return "Google-Anmeldung ist im Supabase-Projekt noch nicht aktiviert.";
  if (/invalid login credentials/i.test(message))
    return "E-Mail oder Passwort stimmen nicht.";
  if (/email not confirmed/i.test(message))
    return "Bestätige zuerst den Link in deiner E-Mail.";
  if (/network|fetch|timeout|offline/i.test(message))
    return "Keine Verbindung. Prüfe dein Netz und versuche es erneut.";
  if (/rate limit/i.test(message))
    return "Zu viele Versuche. Bitte warte einen Moment.";
  return message;
}
