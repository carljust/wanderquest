import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Icon, Notice, Screen } from "@/components/ui";
import { ProgressStrip, QuestStatus } from "@/components/quest-ui";
import { StoryHero, StoryBody } from "@/components/story-ui";
import { useQuest } from "@/features/quest/provider";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { canFinish } from "@/domain/engine";
import { colors, layout } from "@/theme";
export default function Finish() {
  const q = useQuest();
  if (!q.quest || !q.run)
    return (
      <Screen>
        <Text style={layout.heading}>Beginne zuerst dein Abenteuer.</Text>
        <Button label="Zur Startseite" onPress={() => router.replace("/")} />
      </Screen>
    );
  const allowed = canFinish(q.run, q.quest);
  return (
    <Screen fullBleed bottomInset>
      <StoryHero
        panel={3}
        title={q.run.finished ? "Ein Schatz, der bleibt." : "Das letzte Licht."}
        eyebrow="DER SCHATZ DER EXTERNSTEINE"
        height={430}
        titlePlacement="top"
        back
      >
        <View style={{ position: "absolute", right: 0, bottom: 0 }}>
          <WyldoCompanion
            state={allowed ? "celebrate" : "think"}
            reducedMotion={q.preferences.reducedMotion}
            size={190}
          />
        </View>
      </StoryHero>
      <StoryBody>
        <QuestStatus />
        <ProgressStrip />
        {allowed ? (
          <>
            <Text style={layout.body}>{q.quest.ending}</Text>
            {!q.run.finished && (
              <Button
                label="Abenteuer abschließen"
                disabled={q.busy}
                onPress={() => void q.finish().catch(() => undefined)}
              />
            )}
            <View
              style={[
                layout.card,
                { alignItems: "center", paddingVertical: 25 },
              ]}
            >
              <Icon name="ribbon-outline" size={54} color={colors.forest} />
              <Text style={[layout.heading, { textAlign: "center" }]}>
                {q.quest.badge.name}
              </Text>
              <Text style={[layout.body, { textAlign: "center" }]}>
                {q.run.mode === "practice"
                  ? "Vorschau im Übungslauf · kein reguläres Abzeichen."
                  : q.run.awarded
                    ? "Serverseitig bestätigt und deinem Profil einmalig verliehen."
                    : "Wird nach geprüftem Abschluss vom Server verliehen."}
              </Text>
            </View>
          </>
        ) : (
          <Notice warning>
            Für den Abschluss fehlen geprüfte Antworten oder Steinsiegel.
            Synchronisiere den Spielstand und beende alle acht Stationen.
          </Notice>
        )}
        {Boolean(q.outbox.length) && (
          <Button
            label="Jetzt synchronisieren"
            disabled={q.busy}
            onPress={() => void q.sync().catch(() => undefined)}
          />
        )}
        <Button
          label="Zum Profil"
          secondary
          onPress={() => router.replace("/profile")}
        />
        <Button
          label="Zur Startseite"
          secondary
          onPress={() => router.replace("/")}
        />
      </StoryBody>
    </Screen>
  );
}
