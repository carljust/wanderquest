import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Notice, Screen } from "@/components/ui";
import { QuestCover, QuestStatus } from "@/components/quest-ui";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
import { layout } from "@/theme";
export default function QuestDetails() {
  const q = useQuest();
  const auth = useAuth();
  if (!q.quest)
    return (
      <Screen withHeader>
        <Text style={layout.heading}>Keine Quest geladen.</Text>
        <Button
          label="Erneut laden"
          onPress={() => void q.refresh().catch(() => undefined)}
        />
      </Screen>
    );
  const quest = q.quest;
  return (
    <Screen withHeader>
      <QuestStatus />
      <QuestCover assetId="station-1" />
      <Text style={layout.eyebrow}>{quest.region.toUpperCase()}</Text>
      <Text style={layout.title}>{quest.title}</Text>
      <Text style={layout.body}>{quest.story}</Text>
      {quest.approval !== "approved" && (
        <Notice warning>
          Inhaltsentwurf: Der Abgleich mit der ursprünglichen Quest-Datei und
          dem freigegebenen Design steht aus. Spiele vorerst ausschließlich im
          Entwicklungsmodus.
        </Notice>
      )}
      <View style={layout.card}>
        <Text style={layout.heading}>Gut zu wissen</Text>
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
      <Notice warning>
        {quest.routeStatus} Offline-Karten stehen nicht zur Verfügung.
      </Notice>
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
      <Button
        label="Karte und Stationen ansehen"
        secondary
        icon="map-outline"
        onPress={() => router.push("/map")}
      />
    </Screen>
  );
}
