import { router } from "expo-router";
import { useState } from "react";
import { Text, TextInput } from "react-native";
import { Button, Notice, Screen } from "@/components/ui";
import { styles } from "@/components/quest-ui";
import { useAuth } from "@/features/auth/provider";
import { friendlyError, requireBackend } from "@/lib/supabase";
import { layout } from "@/theme";
export default function Reset() {
  const auth = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <Screen>
      <Text style={layout.title}>Neues Passwort</Text>
      <Text style={layout.body}>Verwende mindestens 12 Zeichen.</Text>
      {Boolean(error) && <Notice warning>{error}</Notice>}
      <TextInput
        accessibilityLabel="Neues Passwort"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="new-password"
      />
      <TextInput
        accessibilityLabel="Neues Passwort wiederholen"
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry
        autoComplete="new-password"
      />
      <Button
        label={busy ? "Wird gespeichert …" : "Passwort speichern"}
        disabled={busy || !auth.session}
        onPress={() => {
          setBusy(true);
          setError("");
          void (async () => {
            if (password.length < 12 || password !== confirm)
              throw new Error(
                "Mindestens 12 Zeichen verwenden und beide Passwörter identisch eingeben.",
              );
            const { error } = await requireBackend().auth.updateUser({
              password,
            });
            if (error) throw error;
            router.replace("/");
          })()
            .catch((e: unknown) => setError(friendlyError(e)))
            .finally(() => setBusy(false));
        }}
      />
      {!auth.session && (
        <Notice warning>Öffne zuerst den Link aus deiner E-Mail.</Notice>
      )}
      <Button
        label="Zur Anmeldung"
        secondary
        onPress={() => router.replace("/auth/login")}
      />
    </Screen>
  );
}
