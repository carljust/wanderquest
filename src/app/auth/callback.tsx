import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import { Button, LoadingState, Notice, Screen } from "@/components/ui";
import { friendlyError, requireBackend } from "@/lib/supabase";
import { layout } from "@/theme";
export default function Callback() {
  const { code, next } = useLocalSearchParams<{
    code?: string;
    next?: string;
  }>();
  const [error, setError] = useState("");
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void (async () => {
      const client = requireBackend();
      if (code) {
        const { error } = await client.auth.exchangeCodeForSession(code);
        if (error) throw error;
      }
      const { data } = await client.auth.getSession();
      if (!data.session)
        throw new Error(
          "Dieser Link ist abgelaufen oder wurde auf einem anderen Gerät geöffnet. Fordere ihn in derselben App erneut an.",
        );
      router.replace(next === "reset" ? "/auth/reset" : "/");
    })().catch((e: unknown) => setError(friendlyError(e)));
  }, [code, next]);
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
