import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  AdventureButton,
  AdventurePanel,
  AdventureScreen,
  adventure,
  gameStyles,
  TopQuest,
  WoodButton,
  XpMeter,
} from "@/components/adventure-ui";
import { artwork, AtlasImage, Scene } from "@/components/artwork";
import { Icon, LoadingState } from "@/components/ui";
import { PracticeEntry } from "@/components/practice-entry";
import { AdventureStatus } from "@/components/adventure-status";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
import { practiceXp } from "@/domain/rewards";
export default function Home() {
  const q = useQuest();
  const auth = useAuth();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [offlineOnly, setOfflineOnly] = useState(false);
  const quest = q.quest;
  const visible =
    quest &&
    quest.title
      .toLocaleLowerCase("de-DE")
      .includes(search.trim().toLocaleLowerCase("de-DE")) &&
    (!savedOnly || q.savedQuestIds.includes(quest.id)) &&
    (!offlineOnly || q.downloaded);
  const xp = auth.practice
    ? practiceXp(q.run?.completed.length ?? 0, q.run?.finished ?? false)
    : 0;
  return (
    <AdventureScreen bottomInset={false}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        {auth.practice ? (
          <XpMeter xp={xp} practice />
        ) : (
          <Icon name="leaf" color={adventure.gold} size={32} />
        )}
        <AtlasImage
          source={artwork.game}
          index={0}
          style={{ flex: 1, maxWidth: 150, height: 75 }}
          label="Wyldo"
        />
        <WoodButton
          label="Einstellungen öffnen"
          icon="settings-outline"
          onPress={() => router.push("/profile")}
        />
      </View>
      <View style={{ height: 195 }}>
        <AdventurePanel
          paper
          style={{ width: "65%", marginTop: 4, padding: 12, zIndex: 2 }}
        >
          <Text
            style={[gameStyles.paperTitle, { fontSize: 20, lineHeight: 24 }]}
          >
            Hallo Abenteurer!
          </Text>
          <Text
            style={[gameStyles.paperBody, { fontSize: 14, lineHeight: 19 }]}
          >
            Entdecke die Natur, löse spannende Quests und sammle unvergessliche
            Momente!
          </Text>
        </AdventurePanel>
        <View
          pointerEvents="none"
          style={{ position: "absolute", right: -35, bottom: -5 }}
        >
          <WyldoCompanion
            state="wave"
            size={205}
            reducedMotion={q.preferences.reducedMotion}
          />
        </View>
      </View>
      <AdventurePanel
        paper
        style={{
          flexDirection: "row",
          padding: 10,
          alignItems: "center",
          gap: 8,
        }}
      >
        <Icon name="search-outline" size={26} color={adventure.ink} />
        <TextInput
          accessibilityLabel="Quests suchen"
          placeholder="Quests suchen"
          placeholderTextColor="#776648"
          value={search}
          onChangeText={setSearch}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 44,
            fontSize: 16,
            color: adventure.ink,
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Questfilter öffnen"
          accessibilityState={{ expanded: filters }}
          onPress={() => setFilters(!filters)}
          style={{
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon name="options-outline" color={adventure.ink} />
        </Pressable>
      </AdventurePanel>
      {filters && (
        <AdventurePanel paper>
          <AdventureButton
            label={savedOnly ? "Alle Quests anzeigen" : "Nur gemerkte Quests"}
            variant="paper"
            icon="bookmark-outline"
            onPress={() => setSavedOnly(!savedOnly)}
          />
          <AdventureButton
            label={
              offlineOnly
                ? "Auch nicht gespeicherte anzeigen"
                : "Nur offline gespeicherte Quests"
            }
            variant="paper"
            icon="download-outline"
            onPress={() => setOfflineOnly(!offlineOnly)}
          />
        </AdventurePanel>
      )}
      <AdventureStatus />
      {q.run && (
        <AdventurePanel>
          <Text style={gameStyles.heading}>Deine Reise geht weiter.</Text>
          <Text style={gameStyles.body}>
            {q.run.completed.length} von 8 Kapiteln · {q.run.seals.length} von 4
            Steinsiegeln
          </Text>
          <AdventureButton
            label="Abenteuer fortsetzen"
            icon="play"
            onPress={() =>
              router.push(q.run?.finished ? "/quest/finish" : "/quest/navigate")
            }
          />
        </AdventurePanel>
      )}
      <PracticeEntry />
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Icon name="location" color={adventure.gold} size={26} />
        <Text style={[gameStyles.heading, { flex: 1 }]}>
          Dein nächstes Abenteuer
        </Text>
      </View>
      {q.loading ? (
        <LoadingState />
      ) : visible && quest ? (
        <View
          style={{
            minHeight: 270,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: adventure.goldEdge,
            overflow: "hidden",
          }}
        >
          <Scene />
          <LinearGradient
            colors={["#12251222", "#102014D9", "#07150EFA"]}
            style={StyleSheet.absoluteFill}
          />
          <View
            style={{
              padding: 14,
              gap: 9,
              flex: 1,
              justifyContent: "flex-end",
            }}
          >
            <TopQuest />
            <Text style={[gameStyles.title, { fontSize: 25, lineHeight: 29 }]}>
              {quest.title}
            </Text>
            <Text style={gameStyles.body}>{quest.subtitle}</Text>
            <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
              <Text style={gameStyles.label}>8 Kapitel</Text>
              <Text style={gameStyles.label}>4 Steinsiegel</Text>
              <Text style={gameStyles.label}>
                {quest.fieldReady ? quest.distance : "Route in Prüfung"}
              </Text>
            </View>
            <AdventureButton
              label="Abenteuer entdecken"
              icon="chevron-forward"
              onPress={() => router.push("/quest/details")}
            />
          </View>
        </View>
      ) : (
        <AdventurePanel paper>
          <Text style={gameStyles.paperTitle}>
            {quest
              ? "Keine passende Quest gefunden."
              : "Das Abenteuer wird vorbereitet."}
          </Text>
          <Text style={gameStyles.paperBody}>
            {quest
              ? "Passe deine Suche oder Filter an."
              : "Noch keine Outdoor-Route veröffentlicht. Im Entwicklungsmodus kannst du die Schatzsuche bereits erleben."}
          </Text>
          <AdventureButton
            label={
              quest ? "Suche und Filter zurücksetzen" : "Quests erneut laden"
            }
            variant="paper"
            onPress={() => {
              if (quest) {
                setSearch("");
                setSavedOnly(false);
                setOfflineOnly(false);
              } else void q.refresh().catch(() => undefined);
            }}
          />
        </AdventurePanel>
      )}
      <Text
        style={{
          color: adventure.faded,
          fontSize: 12,
          lineHeight: 18,
          textAlign: "center",
        }}
      >
        Entdecke. Erlebe. Beschütze. Alle Siegel sind digital. Bleibe auf
        freigegebenen Wegen.
      </Text>
    </AdventureScreen>
  );
}
