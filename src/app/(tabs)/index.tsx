import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Text, View, useWindowDimensions } from "react-native";
import { Button, Icon, LoadingState, Notice, Screen } from "@/components/ui";
import { Scene } from "@/components/artwork";
import { StoryBody } from "@/components/story-ui";
import { PracticeEntry } from "@/components/practice-entry";
import { ProgressStrip, QuestCover, QuestStatus } from "@/components/quest-ui";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { useQuest } from "@/features/quest/provider";
import { layout } from "@/theme";
export default function Home() {
  const q = useQuest();
  const { height } = useWindowDimensions();
  return (
    <Screen fullBleed>
      <View
        style={{
          height: Math.max(580, Math.min(730, height - 105)),
          backgroundColor: "#243923",
        }}
      >
        <Scene />
        <LinearGradient
          colors={["#17314766", "transparent", "#152B0BD9"]}
          style={{ position: "absolute", inset: 0 }}
        />
        <View style={{ alignItems: "center", paddingTop: 54, gap: 9 }}>
          <Icon name="leaf" color="#9CCA71" size={31} />
          <Text
            style={{
              fontSize: 57,
              fontWeight: "800",
              letterSpacing: -2,
              color: "#fff",
            }}
          >
            Wyldo
          </Text>
          <Text
            style={{
              fontSize: 15,
              lineHeight: 22,
              color: "#fff",
              textAlign: "center",
            }}
          >
            Entdecke. Erlebe. Beschütze.{"\n"}Naturabenteuer in deiner Region.
          </Text>
        </View>
        <View style={{ position: "absolute", bottom: 56, right: 4 }}>
          <WyldoCompanion
            state={q.run ? "idle" : "wave"}
            reducedMotion={q.preferences.reducedMotion}
            size={270}
          />
        </View>
        <View style={{ position: "absolute", bottom: 32, left: 20, right: 20 }}>
          <Button
            label={q.run ? "Abenteuer fortsetzen" : "Abenteuer entdecken"}
            secondary
            disabled={q.loading}
            onPress={() =>
              router.push(
                q.run
                  ? q.run.finished
                    ? "/quest/finish"
                    : "/quest/play"
                  : "/quest/details",
              )
            }
          />
        </View>
      </View>
      <StoryBody>
        <QuestStatus />
        <PracticeEntry />
        {q.loading ? (
          <LoadingState />
        ) : q.quest ? (
          <>
            <Text style={layout.eyebrow}>DEIN NÄCHSTES ABENTEUER</Text>
            <QuestCover assetId="station-1" />
            <Text style={layout.heading}>{q.quest.title}</Text>
            <Text style={layout.body}>{q.quest.subtitle}</Text>
            <Text style={layout.body}>
              8 Stationen · 4 Steinsiegel · Teutoburger Wald
            </Text>
            <Button
              label="Quest-Details öffnen"
              onPress={() => router.push("/quest/details")}
            />
            {q.run && <ProgressStrip />}
          </>
        ) : (
          <>
            <Text style={layout.heading}>Das Abenteuer wird vorbereitet.</Text>
            <Text style={layout.body}>
              Für draußen ist noch keine Route freigegeben. Im Übungsmodus
              kannst du die Geschichte bereits erleben.
            </Text>
            <Button
              label="Quests erneut laden"
              secondary
              disabled={q.busy}
              onPress={() => void q.refresh().catch(() => undefined)}
            />
          </>
        )}
        <Notice>
          Alle Siegel sind digital. Bleibe auf freigegebenen Wegen und lass die
          Natur an ihrem Platz.
        </Notice>
      </StoryBody>
    </Screen>
  );
}
