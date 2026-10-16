import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Button, Icon, Screen } from "@/components/ui";
import { ProgressStrip, QuestStatus } from "@/components/quest-ui";
import { StoryBody, StoryHero } from "@/components/story-ui";
import { useQuest } from "@/features/quest/provider";
import { colors, layout } from "@/theme";

export default function Progress() {
  const q = useQuest();
  return (
    <Screen fullBleed bottomInset>
      <StoryHero
        title="Dein Fortschritt"
        eyebrow="VIER SIEGEL. EIN GEMEINSAMES ABENTEUER."
        panel={1}
        height={220}
        back
      />
      <StoryBody>
        <QuestStatus quiet />
        <ProgressStrip />
        {q.quest ? (
          <View style={[layout.card, { gap: 0, paddingVertical: 8 }]}>
            {q.quest.stations.map((station) => {
              const completed = q.run?.completed.includes(station.id);
              const accessible =
                completed || q.run?.unlocked.includes(station.id);
              return (
                <Pressable
                  key={station.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Station ${station.order}: ${station.title} · ${completed ? "geschafft" : accessible ? "freigeschaltet" : "noch offen"}`}
                  accessibilityState={{ disabled: !accessible }}
                  disabled={!accessible}
                  onPress={() =>
                    router.push({
                      pathname: "/quest/play",
                      params: { station: station.id },
                    })
                  }
                  style={{
                    flexDirection: "row",
                    gap: 12,
                    alignItems: "center",
                    paddingVertical: 14,
                    borderBottomWidth: station.order === 8 ? 0 : 1,
                    borderColor: colors.line,
                  }}
                >
                  <View
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 14,
                      backgroundColor: completed ? colors.forest : colors.line,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: completed ? "#fff" : colors.muted,
                        fontWeight: "600",
                      }}
                    >
                      {station.order}
                    </Text>
                  </View>
                  <Text
                    style={[
                      layout.body,
                      { flex: 1, fontSize: 14, color: colors.ink },
                    ]}
                  >
                    {station.title}
                  </Text>
                  <Icon
                    name={
                      completed
                        ? "checkmark-circle"
                        : accessible
                          ? "chevron-forward"
                          : "lock-closed-outline"
                    }
                    size={18}
                    color={completed ? colors.forest : colors.muted}
                  />
                </Pressable>
              );
            })}
          </View>
        ) : (
          <Text style={layout.body}>
            Beginne eine Quest, um deine Stationen und Siegel zu sehen.
          </Text>
        )}
        <Button
          label="Zur Karte"
          secondary
          icon="map-outline"
          onPress={() => router.push("/map")}
        />
      </StoryBody>
    </Screen>
  );
}
