import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { Button, LoadingState, Notice, Screen } from "@/components/ui";
import { exchangeAuthCode } from "@/features/auth/callback";
import { friendlyError, requireBackend } from "@/lib/supabase";
import { layout } from "@/theme";
export default function Callback() {
  const {
    code,
    next,
    error: providerError,
  } = useLocalSearchParams<{
    code?: string;
    next?: string;
    error?: string;
  }>();
  const [error, setError] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      if (providerError)
        throw new Error(
          providerError === "access_denied"
            ? "Google-Anmeldung abgebrochen."
            : "Die Anmeldung konnte nicht bestätigt werden.",
        );
      const client = requireBackend();
      if (code) {
        await exchangeAuthCode(code);
      }
      const { data } = await client.auth.getSession();
      if (!data.session)
        throw new Error(
          "Dieser Link ist abgelaufen oder wurde auf einem anderen Gerät geöffnet. Fordere ihn in derselben App erneut an.",
        );
      router.replace(next === "reset" ? "/auth/reset" : "/");
    })().catch((e: unknown) => setError(friendlyError(e)));
  }, [code, next, providerError]);
  return (
    <Screen>
      <Text style={layout.title}>Zurück zu Wyldo</Text>
      {error ? (
        <>
          <Notice warning>{error}</Notice>
          <Button
            label="Zur Anmeldung"
            onPress={() => router.replace("/auth/login")}
          />
        </>
      ) : (
        <LoadingState />
      )}
    </Screen>
  );
}
