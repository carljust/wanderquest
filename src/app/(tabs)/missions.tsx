import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, LoadingState, Screen } from "@/components/ui";
import { ProgressStrip, QuestCover, QuestStatus } from "@/components/quest-ui";
import { useQuest } from "@/features/quest/provider";
import { layout } from "@/theme";
export default function Adventures() {
  const q = useQuest();
  return (
    <Screen>
      <Text style={layout.eyebrow}>DEINE GESCHICHTEN DRAUSSEN</Text>
      <Text style={layout.title}>Abenteuer</Text>
      <QuestStatus />
      {q.loading ? (
        <LoadingState />
      ) : q.quest ? (
        <>
          <QuestCover assetId="station-1" compact />
          <View style={layout.card}>
            <Text style={layout.heading}>{q.quest.title}</Text>
            <Text style={layout.body}>{q.quest.story}</Text>
            <Button
              label="Quest-Details öffnen"
              onPress={() => router.push("/quest/details")}
            />
          </View>
          <ProgressStrip />
          {q.run && (
            <Button
              label="Zum Spielstand"
              secondary
              onPress={() =>
                router.push(q.run?.finished ? "/quest/finish" : "/quest/play")
              }
            />
          )}
        </>
      ) : (
        <Text style={layout.body}>
          Noch keine veröffentlichten Abenteuer verfügbar.
        </Text>
      )}
    </Screen>
  );
}
