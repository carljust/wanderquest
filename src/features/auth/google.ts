import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { config } from "@/lib/config";
import { requireBackend } from "@/lib/supabase";
import { finishOAuthReturn } from "./callback";
export const googleNativeBuildRequired = () =>
  Platform.OS !== "web" && isRunningInExpoGo();
export const googleRedirect = () =>
  makeRedirectUri({ scheme: "wyldo", path: "auth/callback" });
export async function signInWithGoogle() {
  if (googleNativeBuildRequired())
    throw new Error(
      "Google-Anmeldung benötigt auf dem Smartphone einen Wyldo-Development-Build. Expo Go unterstützt den notwendigen eigenen Rücksprung nicht zuverlässig. Bis dahin kannst du die App im Entwicklungsmodus testen.",
    );
  const client = requireBackend();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(config.supabaseUrl + "/auth/v1/settings", {
      headers: { apikey: config.supabaseKey },
      signal: controller.signal,
    });
    if (!response.ok)
      throw new Error(
        "Die Supabase-Anmeldekonfiguration konnte nicht geladen werden. Prüfe Projekt-URL und öffentlichen Schlüssel.",
      );
    const settings = (await response.json()) as {
      external?: { google?: boolean };
    };
    if (!settings.external?.google)
      throw new Error(
        "Google-Anmeldung ist im Supabase-Projekt noch nicht aktiviert. Aktiviere den Google-Anbieter in den Auth-Einstellungen.",
      );
  } finally {
    clearTimeout(timeout);
  }
  const redirectTo = googleRedirect();
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      skipBrowserRedirect: Platform.OS !== "web",
      queryParams: { prompt: "select_account" },
    },
  });
  if (error) throw error;
  if (Platform.OS === "web") return "redirected" as const;
  if (!data.url)
    throw new Error(
      "Google-Anmeldung ist noch nicht in Supabase eingerichtet.",
    );
  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type === "cancel" || result.type === "dismiss")
    return "cancelled" as const;
  if (result.type !== "success")
    throw new Error(
      "Der Anmeldebrowser konnte nicht geöffnet werden. Bitte erneut versuchen.",
    );
  await finishOAuthReturn(result.url, redirectTo);
  return "signed-in" as const;
}
