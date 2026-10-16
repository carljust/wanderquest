import { Redirect, router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { Brand, Button, Notice, Screen } from "@/components/ui";
import { styles } from "@/components/quest-ui";
import { useAuth } from "@/features/auth/provider";
import { backendConfigured, config } from "@/lib/config";
import { friendlyError } from "@/lib/supabase";
import {
  googleNativeBuildRequired,
  signInWithGoogle,
} from "@/features/auth/google";
import { submitAuth } from "@/features/auth/service";
import { layout } from "@/theme";
export default function Login() {
  const auth = useAuth();
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  if (auth.session || auth.practice) return <Redirect href="/" />;
  async function submit() {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      setNotice(await submitAuth(mode, email, password, confirm));
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen bottomInset>
        <Brand />
        <View style={{ gap: 12, paddingTop: 20 }}>
          <Text style={layout.eyebrow}>DEIN ABENTEUER BEGINNT HIER</Text>
          <Text style={layout.title}>
            {mode === "login"
              ? "Willkommen draußen."
              : mode === "register"
                ? "Bereit für neue Wege?"
                : "Wieder auf Kurs."}
          </Text>
          <Text style={layout.body}>
            {mode === "reset"
              ? "Wir senden dir einen sicheren Link, um ein neues Passwort zu vergeben."
              : "Entdecke Geschichten, die vor deiner Haustür beginnen. Mit Wyldo an deiner Seite."}
          </Text>
        </View>
        {!backendConfigured && (
          <Notice warning>
            Die Live-Anmeldung benötigt noch die Supabase-Konfiguration. Der
            gekennzeichnete Entwicklungsmodus funktioniert bereits ohne Konto.
          </Notice>
        )}
        {Boolean(error || auth.error) && (
          <Notice warning>{error || auth.error}</Notice>
        )}
        {Boolean(notice) && <Notice>{notice}</Notice>}
        {mode !== "reset" && (
          <View style={{ gap: 12 }}>
            <Button
              label={
                googleBusy ? "Google wird geöffnet …" : "Mit Google anmelden"
              }
              icon="logo-google"
              secondary
              disabled={busy}
              onPress={() => {
                setBusy(true);
                setGoogleBusy(true);
                setError("");
                setNotice("");
                void signInWithGoogle()
                  .then((result) => {
                    if (result === "cancelled")
                      setNotice(
                        "Google-Anmeldung abgebrochen. Du kannst es erneut versuchen.",
                      );
                  })
                  .catch((e) => setError(friendlyError(e)))
                  .finally(() => {
                    setBusy(false);
                    setGoogleBusy(false);
                  });
              }}
            />
            {googleNativeBuildRequired() && (
              <Notice>
                Google-Anmeldung ist in der Browser-App und im eigenen
                Wyldo-Development-Build verfügbar. In Expo Go kannst du weiter
                mit E-Mail und Passwort oder im Übungsmodus testen.
              </Notice>
            )}
            <Text style={[layout.eyebrow, { textAlign: "center" }]}>
              ODER MIT E-MAIL UND PASSWORT
            </Text>
          </View>
        )}
        <View style={{ gap: 12 }}>
          <Text style={styles.label}>E-Mail-Adresse</Text>
          <TextInput
            style={styles.input}
            accessibilityLabel="E-Mail-Adresse"
            value={email}
            onChangeText={setEmail}
            autoComplete="email"
            keyboardType="email-address"
            autoCapitalize="none"
            textContentType="emailAddress"
          />
          {mode !== "reset" && (
            <>
              <Text style={styles.label}>Passwort</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Passwort"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete={
                  mode === "register" ? "new-password" : "current-password"
                }
                textContentType={
                  mode === "register" ? "newPassword" : "password"
                }
              />
            </>
          )}
          {mode === "register" && (
            <>
              <Text style={styles.label}>Passwort wiederholen</Text>
              <TextInput
                style={styles.input}
                accessibilityLabel="Passwort wiederholen"
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                autoComplete="new-password"
              />
            </>
          )}
          <Button
            label={
              busy
                ? "Bitte warten …"
                : mode === "login"
                  ? "Anmelden"
                  : mode === "register"
                    ? "Konto erstellen"
                    : "Link anfordern"
            }
            disabled={busy}
            onPress={() => void submit()}
          />
        </View>
        <Button
          label={mode === "login" ? "Neues Konto erstellen" : "Zur Anmeldung"}
          secondary
          onPress={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
            setNotice("");
          }}
        />
        {mode === "login" && (
          <Button
            label="Passwort vergessen?"
            secondary
            icon="key-outline"
            onPress={() => {
              setMode("reset");
              setError("");
            }}
          />
        )}
        {config.developmentMode && (
          <View style={layout.card}>
            <Text style={layout.eyebrow}>ENTWICKLUNGSMODUS</Text>
            <Text style={layout.body}>
              Alle acht Stationen ohne Anreise ausprobieren. Ein Übungslauf
              vergibt keine regulären Abzeichen.
            </Text>
            <Button
              label="Ohne Konto im Entwicklungsmodus testen"
              secondary
              icon="flask-outline"
              onPress={() => {
                auth.enterPractice();
                router.replace("/");
              }}
            />
          </View>
        )}
      </Screen>
    </KeyboardAvoidingView>
  );
}
