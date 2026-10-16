import { requireBackend } from "@/lib/supabase";
const exchanges = new Map<string, Promise<void>>();
// Router and the native browser can report the same redirect. Consume each PKCE
// code once; never log or persist authorization codes or OAuth provider tokens.
export function exchangeAuthCode(code: string) {
  if (!code || code.length > 4096)
    return Promise.reject(
      new Error("Der Anmeldelink ist ungültig. Bitte erneut anmelden."),
    );
  const existing = exchanges.get(code);
  if (existing) return existing;
  const pending = (async () => {
    const { error } = await requireBackend().auth.exchangeCodeForSession(code);
    if (error) throw error;
  })();
  exchanges.set(code, pending);
  void pending.catch(() => exchanges.delete(code));
  if (exchanges.size > 16) exchanges.delete(exchanges.keys().next().value!);
  return pending;
}
export async function finishOAuthReturn(returned: string, expected: string) {
  const actual = new URL(returned);
  const target = new URL(expected);
  if (
    actual.protocol !== target.protocol ||
    actual.host !== target.host ||
    actual.pathname !== target.pathname
  )
    throw new Error(
      "Die Anmeldung hat eine unerwartete Rücksprungadresse geliefert. Bitte erneut anmelden.",
    );
  if (actual.searchParams.get("error"))
    throw new Error(
      actual.searchParams.get("error") === "access_denied"
        ? "Google-Anmeldung abgebrochen."
        : "Google-Anmeldung fehlgeschlagen. Bitte erneut versuchen.",
    );
  const code = actual.searchParams.get("code");
  if (!code)
    throw new Error("Der Google-Anmeldelink enthält keinen Bestätigungscode.");
  await exchangeAuthCode(code);
}
