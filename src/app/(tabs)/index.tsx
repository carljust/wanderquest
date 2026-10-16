import { router } from "expo-router";
import { Text, View } from "react-native";
import { Brand, Button, LoadingState, Notice, Screen } from "@/components/ui";
import { ProgressStrip, QuestCover, QuestStatus } from "@/components/quest-ui";
import { useQuest } from "@/features/quest/provider";
import { colors, layout } from "@/theme";
export default function Home() {
  const q = useQuest();
  return (
    <Screen>
      <Brand />
      <QuestStatus />
      <View style={{ gap: 10 }}>
        <Text style={layout.eyebrow}>DRAUSSEN WARTET EINE GESCHICHTE</Text>
        <Text style={layout.title}>Geh los.{"\n"}Entdecke mehr.</Text>
        <Text style={layout.body}>
          Mit Wyldo werden Wege zu Abenteuern. Schritt für Schritt, in deinem
          Tempo.
        </Text>
      </View>
      {q.loading ? (
        <LoadingState />
      ) : q.quest ? (
        <>
          {q.run && (
            <>
              <ProgressStrip />
              <Button
                label={
                  q.run.finished
                    ? "Deinen Schatz ansehen"
                    : "Abenteuer fortsetzen"
                }
                onPress={() =>
                  router.push(q.run?.finished ? "/quest/finish" : "/quest/play")
                }
              />
            </>
          )}
          <QuestCover assetId="station-1" />
          <View style={{ gap: 10 }}>
            <Text style={layout.eyebrow}>DEIN NÄCHSTES ABENTEUER</Text>
            <Text style={layout.heading}>{q.quest.title}</Text>
            <Text style={layout.body}>{q.quest.subtitle}</Text>
            <Text style={{ color: colors.pine, fontSize: 13 }}>
              8 Stationen · 4 Steinsiegel · {q.quest.region}
            </Text>
          </View>
          <Button
            label="Abenteuer entdecken"
            onPress={() => router.push("/quest/details")}
          />
        </>
      ) : (
        <View style={layout.card}>
          <Text style={layout.heading}>Neue Wege entstehen.</Text>
          <Text style={layout.body}>
            Hier erscheint die erste Quest, sobald ihre Inhalte und Route
            veröffentlicht sind.
          </Text>
          <Button
            label="Quests erneut laden"
            secondary
            disabled={q.busy}
            onPress={() => void q.refresh().catch(() => undefined)}
          />
        </View>
      )}
      <Notice>
        Alle Siegel sind digital. Bleibe auf freigegebenen Wegen und lass die
        Natur an ihrem Platz.
      </Notice>
    </Screen>
  );
}
