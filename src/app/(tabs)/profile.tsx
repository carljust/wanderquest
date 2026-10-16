import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Switch, Text, TextInput, View } from "react-native";
import { Button, Icon, Notice, Screen } from "@/components/ui";
import { ProgressStrip, QuestStatus, styles } from "@/components/quest-ui";
import { useAuth } from "@/features/auth/provider";
import { useQuest } from "@/features/quest/provider";
import { config } from "@/lib/config";
import { friendlyError, requireBackend } from "@/lib/supabase";
import { colors, layout } from "@/theme";
type Award = { id: string; badge: string; awarded_at: string };
export default function Profile() {
  const auth = useAuth();
  const q = useQuest();
  const [name, setName] = useState("");
  const [awards, setAwards] = useState<Award[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [recover, setRecover] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const load = useCallback(async () => {
    if (!auth.session || auth.practice) return;
    setBusy(true);
    setError("");
    try {
      const client = requireBackend();
      const [profile, badges] = await Promise.all([
        client
          .from("profiles")
          .select("display_name")
          .eq("id", auth.session.user.id)
          .single(),
        client
          .from("badge_awards")
          .select("id,badge,awarded_at")
          .order("awarded_at", { ascending: false }),
      ]);
      if (profile.error) throw profile.error;
      if (badges.error) throw badges.error;
      setName(profile.data.display_name);
      setAwards(badges.data);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [auth.session, auth.practice]);
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load]),
  );
  return (
    <Screen>
      <Text style={layout.eyebrow}>DEIN WEG. DEINE GESCHICHTEN.</Text>
      <Text style={layout.title}>Mein Profil</Text>
      <QuestStatus />
      <View style={layout.card}>
        <View style={layout.row}>
          <Icon name="person-circle-outline" size={42} />
          <View style={{ flex: 1 }}>
            <Text style={layout.heading}>
              {auth.practice
                ? "Abenteurer im Übungslauf"
                : name || "Dein Konto"}
            </Text>
            <Text style={layout.body}>
              {auth.practice
                ? "Lokal auf diesem Gerät"
                : auth.session?.user.email}
            </Text>
          </View>
        </View>
        {!auth.practice && (
          <>
            <TextInput
              style={styles.input}
              accessibilityLabel="Anzeigename"
              value={name}
              onChangeText={setName}
              maxLength={60}
            />
            <Button
              label="Anzeigenamen speichern"
              secondary
              disabled={busy || !name.trim()}
              onPress={() => {
                setBusy(true);
                setError("");
                void requireBackend()
                  .from("profiles")
                  .update({ display_name: name.trim() })
                  .eq("id", auth.session!.user.id)
                  .then(({ error }) => {
                    if (error) setError(friendlyError(error));
                    else setNotice("Dein Name wurde gespeichert.");
                    setBusy(false);
                  });
              }}
            />
          </>
        )}
      </View>
      {Boolean(error) && (
        <>
          <Notice warning>{error}</Notice>
          <Button
            label="Profil erneut laden"
            secondary
            onPress={() => void load()}
          />
        </>
      )}
      {Boolean(notice) && <Notice>{notice}</Notice>}
      <Text style={layout.heading}>Deine Erfolge</Text>
      <ProgressStrip />
      {awards.length ? (
        awards.map((a) => (
          <View key={a.id} style={layout.card}>
            <Icon name="ribbon-outline" size={32} color={colors.orange} />
            <Text style={layout.heading}>{a.badge}</Text>
            <Text style={layout.body}>
              Verliehen am {new Date(a.awarded_at).toLocaleDateString("de-DE")}
            </Text>
          </View>
        ))
      ) : (
        <Notice>
          {auth.practice
            ? "Im Entwicklungsmodus werden keine regulären Abzeichen vergeben. Ein abgeschlossener Übungslauf zeigt dir die Belohnung als Vorschau."
            : "Dein erstes Abzeichen wartet am Ende eines vollständig geprüften Abenteuers."}
        </Notice>
      )}
      {q.run?.finished && (
        <Button
          label="Abschluss ansehen"
          secondary
          onPress={() => router.push("/quest/finish")}
        />
      )}
      <Text style={layout.heading}>So passt Wyldo zu dir</Text>
      <View style={layout.card}>
        <View style={[layout.row, { justifyContent: "space-between" }]}>
          <Text style={[layout.body, { flex: 1 }]}>Ton stummschalten</Text>
          <Switch
            accessibilityLabel="Ton stummschalten"
            value={q.preferences.muted}
            onValueChange={(muted) =>
              void q
                .setPreferences({ ...q.preferences, muted })
                .catch(() => undefined)
            }
          />
        </View>
        <View style={[layout.row, { justifyContent: "space-between" }]}>
          <Text style={[layout.body, { flex: 1 }]}>Bewegung reduzieren</Text>
          <Switch
            accessibilityLabel="Bewegung reduzieren"
            value={q.preferences.reducedMotion}
            onValueChange={(reducedMotion) =>
              void q
                .setPreferences({ ...q.preferences, reducedMotion })
                .catch(() => undefined)
            }
          />
        </View>
        <Text style={layout.body}>
          Dialogtexte bleiben immer sichtbar. Deutsche Geräte-Sprachausgabe
          benötigt eine installierte Stimme.
        </Text>
      </View>
      <Text style={layout.heading}>Unterwegs ohne Netz</Text>
      <Text style={layout.body}>
        {q.downloaded
          ? "Vorhandene Quest-Inhalte sind auf diesem Gerät gespeichert."
          : "Lade die Quest vor deinem Ausflug herunter."}{" "}
        Kartenkacheln sind nicht Teil des Downloads.
      </Text>
      <Button
        label="Quest für unterwegs speichern"
        secondary
        disabled={q.busy || !q.quest}
        icon="download-outline"
        onPress={() => void q.download().catch(() => undefined)}
      />
      <Button
        label={`Spielstand synchronisieren (${q.outbox.length})`}
        secondary
        disabled={q.busy}
        icon="sync-outline"
        onPress={() => void q.sync().catch(() => undefined)}
      />
      {!auth.practice && Boolean(q.outbox.length) && (
        <>
          <Button
            label={
              recover
                ? "Unbestätigte Aktionen verwerfen und Serverstand laden"
                : "Synchronisierung hängt? Serverstand wiederherstellen"
            }
            secondary
            disabled={q.busy}
            onPress={() => {
              if (!recover) setRecover(true);
              else
                void q
                  .recover()
                  .then(() => setRecover(false))
                  .catch(() => undefined);
            }}
          />
          {recover && (
            <Button
              label="Wiederherstellung abbrechen"
              secondary
              onPress={() => setRecover(false)}
            />
          )}
        </>
      )}
      <Button
        label={
          privacy
            ? "Datenschutzhinweise schließen"
            : "Datenschutzhinweise lesen"
        }
        secondary
        onPress={() => setPrivacy(!privacy)}
      />
      {privacy && (
        <Notice>
          Wyldo verarbeitet E-Mail und Profil über Supabase. Questfortschritt
          wird kontogetrennt lokal gespeichert und mit deinem Konto
          synchronisiert. GPS wird nur nach Freigabe im Vordergrund genutzt; es
          gibt keine Hintergrundaufzeichnung. Für vorgemerkte GPS-Aktionen liegt
          ein einzelner Standort bis zur Synchronisierung lokal vor.
          Kartenanbieter erhalten notwendige Kartenanfragen. Die App enthält
          weder Werbung noch Tracking-SDK. Vor öffentlicher Veröffentlichung
          sind Verantwortlicher, Datenschutzkontakt und Löschprozess zu
          ergänzen.
        </Notice>
      )}
      {auth.practice ? (
        <>
          <Button
            label={
              confirmReset
                ? "Übungslauf wirklich zurücksetzen"
                : "Übungslauf zurücksetzen"
            }
            secondary
            disabled={q.busy}
            onPress={() => {
              if (!confirmReset) setConfirmReset(true);
              else
                void q
                  .resetPractice()
                  .then(() => {
                    setConfirmReset(false);
                    router.replace("/");
                  })
                  .catch(() => undefined);
            }}
          />
          {confirmReset && (
            <Button
              label="Zurücksetzen abbrechen"
              secondary
              onPress={() => setConfirmReset(false)}
            />
          )}
        </>
      ) : (
        config.developmentMode && (
          <Button
            label="In den Entwicklungsmodus wechseln"
            secondary
            icon="flask-outline"
            onPress={() => {
              auth.enterPractice();
              router.replace("/");
            }}
          />
        )
      )}
      <Button
        label={auth.practice ? "Entwicklungsmodus verlassen" : "Abmelden"}
        secondary
        icon="log-out-outline"
        onPress={() =>
          void auth
            .logout()
            .then(() => router.replace("/auth/login"))
            .catch((e) => setError(friendlyError(e)))
        }
      />
    </Screen>
  );
}
