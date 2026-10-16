import { router } from "expo-router";
import { Text, View } from "react-native";
import { PracticeEntry } from "@/components/practice-entry";
import { Button, LoadingState, Notice, Screen } from "@/components/ui";
import { QuestStatus } from "@/components/quest-ui";
import { StoryBody, StoryHero } from "@/components/story-ui";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
import { layout } from "@/theme";
export default function QuestDetails() {
  const q = useQuest();
  const auth = useAuth();
  if (q.loading)
    return (
      <Screen>
        <LoadingState />
      </Screen>
    );
  if (!q.quest)
    return (
      <Screen>
        <Text style={layout.heading}>
          Noch keine Quest für draußen freigegeben.
        </Text>
        <PracticeEntry />
        <Button
          label="Erneut laden"
          onPress={() => void q.refresh().catch(() => undefined)}
        />
      </Screen>
    );
  const quest = q.quest;
  return (
    <Screen fullBleed bottomInset>
      <StoryHero
        title={quest.title}
        eyebrow="EXTERNSTEINE · TEUTOBURGER WALD"
        height={430}
        back
      />
      <StoryBody>
        <QuestStatus />
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 4 }}>
          <Text style={[layout.body, { flex: 1 }]}>{quest.subtitle}</Text>
          <WyldoCompanion
            state="idle"
            reducedMotion={q.preferences.reducedMotion}
            size={90}
          />
        </View>
        <Button
          label={
            q.run
              ? "Abenteuer fortsetzen"
              : auth.practice
                ? "Übungsabenteuer starten"
                : "Abenteuer starten"
          }
          disabled={q.busy || (!auth.practice && !quest.fieldReady)}
          onPress={() =>
            void q
              .start()
              .then(() =>
                router.push(q.run?.finished ? "/quest/finish" : "/quest/play"),
              )
              .catch(() => undefined)
          }
        />
        {!auth.practice && !quest.fieldReady && (
          <>
            <Notice>
              Der Weg wird noch geprüft. Die gesamte Geschichte ist bereits als
              Übung spielbar.
            </Notice>
            <PracticeEntry />
          </>
        )}
        <Text style={layout.heading}>Die Geschichte</Text>
        <Text style={layout.body}>{quest.story}</Text>
        <Text style={layout.heading}>Deine Reise auf einen Blick</Text>
        <View style={layout.card}>
          {[
            ["Strecke", quest.distance],
            ["Dauer", quest.duration],
            ["Schwierigkeit", quest.difficulty],
            ["Startpunkt", quest.start],
          ].map(([label, value]) => (
            <View key={label} style={{ gap: 4 }}>
              <Text style={layout.eyebrow}>{label}</Text>
              <Text style={layout.body}>{value}</Text>
            </View>
          ))}
        </View>
        <Text style={layout.heading}>Das gehört in deinen Rucksack</Text>
        {quest.preparation.map((item) => (
          <Text style={layout.body} key={item}>
            • {item}
          </Text>
        ))}
        <Button
          label={
            q.downloaded
              ? "Quest erneut herunterladen"
              : "Quest-Inhalte herunterladen"
          }
          icon="download-outline"
          secondary
          disabled={q.busy}
          onPress={() => void q.download().catch(() => undefined)}
        />
        <Button
          label="Karte und Stationen ansehen"
          secondary
          icon="map-outline"
          onPress={() => router.push("/map")}
        />
        <Notice warning>
          {quest.routeStatus} Offline-Karten stehen nicht zur Verfügung.
        </Notice>
      </StoryBody>
    </Screen>
  );
}
