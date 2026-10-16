import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  AdventureButton,
  AdventurePanel,
  AdventureScreen,
  adventure,
  BackWoodButton,
  gameStyles,
  TopQuest,
  WoodButton,
} from "@/components/adventure-ui";
import { Scene } from "@/components/artwork";
import { PracticeEntry } from "@/components/practice-entry";
import { LoadingState } from "@/components/ui";
import { AdventureStatus } from "@/components/adventure-status";
import { QuestOverview } from "@/components/quest-overview";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
export default function QuestDetails() {
  const q = useQuest();
  const auth = useAuth();
  const [preparation, setPreparation] = useState(false);
  if (q.loading)
    return (
      <AdventureScreen>
        <LoadingState />
      </AdventureScreen>
    );
  const quest = q.quest;
  if (!quest)
    return (
      <AdventureScreen>
        <BackWoodButton />
        <AdventurePanel paper>
          <Text style={gameStyles.paperTitle}>
            Noch keine Quest für draußen freigegeben.
          </Text>
          <PracticeEntry />
          <AdventureButton
            label="Erneut laden"
            onPress={() => void q.refresh().catch(() => undefined)}
          />
        </AdventurePanel>
      </AdventureScreen>
    );
  const saved = q.savedQuestIds.includes(quest.id);
  const reward = 100 * quest.stations.length + 500;
  return (
    <AdventureScreen
      tabs
      footer={
        <AdventureButton
          label={q.run ? "Abenteuer fortsetzen" : "Zum Startpunkt navigieren"}
          icon="navigate"
          disabled={q.busy || (!auth.practice && !quest.fieldReady)}
          onPress={() =>
            void q
              .start()
              .then(() =>
                router.push(
                  q.run?.finished ? "/quest/finish" : "/quest/navigate",
                ),
              )
              .catch(() => undefined)
          }
        />
      }
    >
      <View
        style={{
          height: 320,
          margin: -14,
          marginBottom: 0,
          overflow: "hidden",
        }}
      >
        <Scene />
        <LinearGradient
          colors={["#10231B00", "#0B2119F5"]}
          locations={[0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View style={{ position: "absolute", left: 5, top: 40 }}>
          <WyldoCompanion
            state="wave"
            size={145}
            reducedMotion={q.preferences.reducedMotion}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 16,
          }}
        >
          <BackWoodButton />
          <WoodButton
            label={saved ? "Quest nicht mehr merken" : "Quest merken"}
            icon={saved ? "heart" : "heart-outline"}
            onPress={() => void q.toggleSaved(quest.id).catch(() => undefined)}
          />
        </View>
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 18,
            right: 18,
            gap: 9,
          }}
        >
          <TopQuest />
          <Text style={gameStyles.title}>{quest.title}</Text>
          <Text style={gameStyles.body}>{quest.subtitle}</Text>
        </View>
      </View>
      <AdventureStatus />
      <QuestOverview quest={quest} />
      <AdventurePanel paper>
        <Text style={gameStyles.paperTitle}>Über diese Quest</Text>
        <Text style={gameStyles.paperBody}>{quest.story}</Text>
      </AdventurePanel>
      <AdventurePanel
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
          gap: 10,
          padding: 12,
        }}
      >
        {[
          ["8", "Kapitel"],
          ["4", "Steinsiegel"],
          [`${reward}`, "Übungs-XP · Vorschau"],
        ].map(([value, label]) => (
          <View
            key={label}
            style={{ minWidth: "40%", alignItems: "center", gap: 3 }}
          >
            <Text
              style={{ color: adventure.gold, fontWeight: "800", fontSize: 21 }}
            >
              {value}
            </Text>
            <Text style={[gameStyles.body, { fontSize: 13, lineHeight: 18 }]}>
              {label}
            </Text>
          </View>
        ))}
      </AdventurePanel>
      <Text style={gameStyles.heading}>Dein Abenteuer</Text>
      <AdventureButton
        label="8 Kapitel ansehen"
        variant="glass"
        icon="book-outline"
        onPress={() => router.push("/quest/progress")}
      />
      <AdventureButton
        label="4 Steinsiegel entdecken"
        variant="glass"
        icon="sparkles-outline"
        onPress={() => router.push("/quest/progress")}
      />
      <AdventurePanel
        paper
        style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
      >
        <WyldoCompanion
          state="idle"
          size={78}
          reducedMotion={q.preferences.reducedMotion}
        />
        <Text
          style={[
            gameStyles.paperTitle,
            { flex: 1, fontSize: 21, lineHeight: 27 },
          ]}
        >
          Am Startpunkt beginnt unser Abenteuer!
        </Text>
      </AdventurePanel>
      <AdventureButton
        label="Bitte auf den Wegen bleiben"
        variant="glass"
        icon="warning-outline"
        onPress={() => setPreparation(!preparation)}
      />
      {preparation && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperTitle}>Gut vorbereitet losziehen</Text>
          {quest.preparation.map((text) => (
            <Text key={text} style={gameStyles.paperBody}>
              • {text}
            </Text>
          ))}
          <Text style={gameStyles.paperBody}>{quest.start}</Text>
          <Text style={gameStyles.paperBody}>
            {quest.duration} · {quest.difficulty}
          </Text>
          <Text style={gameStyles.paperBody}>{quest.routeStatus}</Text>
        </AdventurePanel>
      )}
      {!auth.practice && !quest.fieldReady && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperBody}>
            Die Outdoor-Route ist noch nicht freigegeben. Die gesamte Geschichte
            ist im gekennzeichneten Übungsmodus spielbar.
          </Text>
          <PracticeEntry />
        </AdventurePanel>
      )}
      <AdventureButton
        label={saved ? "Quest gemerkt" : "Quest merken"}
        variant="paper"
        icon={saved ? "bookmark" : "bookmark-outline"}
        onPress={() => void q.toggleSaved(quest.id).catch(() => undefined)}
      />
      <AdventureButton
        label={
          q.downloaded
            ? "Quest erneut herunterladen"
            : "Quest-Inhalte herunterladen"
        }
        variant="paper"
        icon="download-outline"
        disabled={q.busy}
        onPress={() => void q.download().catch(() => undefined)}
      />
      {Boolean(q.notice) && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperBody}>{q.notice}</Text>
        </AdventurePanel>
      )}
      <AdventureButton
        label="Karte und Stationen ansehen"
        variant="glass"
        icon="map-outline"
        onPress={() => router.push("/map")}
      />
    </AdventureScreen>
  );
}
