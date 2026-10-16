import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { setStatusBarStyle } from "expo-status-bar";
import { Icon, LoadingState } from "@/components/ui";
import { PracticeEntry } from "@/components/practice-entry";
import {
  DiscoveryAction,
  DiscoveryChip,
  DiscoveryPanel,
  DiscoveryShortcut,
  discovery,
  discoverStyles,
} from "@/components/discovery-ui";
import { DiscoveryHero } from "@/components/discovery-hero";
import { DiscoveryQuestCard } from "@/components/discovery-quest-card";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
import { practiceXp, levelProgress } from "@/domain/rewards";
import { DiscoveryFilterSheet } from "@/features/discovery/filter-sheet";
import {
  defaultDiscoveryFilters,
  matchesDiscoveryFilters,
  type DiscoveryFacet,
} from "@/features/discovery/model";

export default function Home() {
  const q = useQuest();
  const auth = useAuth();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ...defaultDiscoveryFilters });
  const [sheet, setSheet] = useState<DiscoveryFacet | "all" | null>(null);
  const quest = q.quest;
  const visible =
    quest &&
    matchesDiscoveryFilters(
      quest,
      search,
      filters,
      q.savedQuestIds.includes(quest.id),
      q.downloaded,
    );
  const level = levelProgress(
    practiceXp(q.run?.completed.length ?? 0, q.run?.finished ?? false),
  );
  const reset = () => {
    setSearch("");
    setFilters({ ...defaultDiscoveryFilters });
  };
  const openFilters = (facet: DiscoveryFacet | "all") => {
    Keyboard.dismiss();
    setSheet(facet);
  };
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
    }, []),
  );
  return (
    <SafeAreaView
      edges={["left", "right"]}
      style={{ flex: 1, backgroundColor: discovery.background }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          width: "100%",
          maxWidth: 760,
          alignSelf: "center",
          paddingBottom: 22,
        }}
      >
        <DiscoveryHero
          search={search}
          onSearch={setSearch}
          onFilters={() => openFilters("all")}
          onSettings={() => router.push("/profile")}
          reducedMotion={q.preferences.reducedMotion}
          practiceXp={auth.practice ? level.xp : undefined}
        />
        <View
          style={{
            paddingHorizontal: 16,
            paddingTop: 44,
            gap: 14,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            backgroundColor: discovery.background,
          }}
        >
          <View style={{ gap: 3 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 7 }}
            >
              <Icon name="location" size={25} color={discovery.green} />
              <Text
                style={[
                  discoverStyles.title,
                  { flex: 1, fontSize: width < 350 ? 20 : 24 },
                ]}
              >
                Quests entdecken
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Alle Quests auf der Karte anzeigen"
                onPress={() => router.push("/map")}
                style={{
                  minHeight: 44,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Text
                  style={{
                    color: discovery.green,
                    fontFamily: "NunitoSans_700Bold",
                    fontSize: 12,
                  }}
                >
                  Auf Karte
                </Text>
                <Icon
                  name="chevron-forward"
                  size={16}
                  color={discovery.green}
                />
              </Pressable>
            </View>
            <Text style={discoverStyles.caption}>
              {quest?.region ?? "Externsteine · Teutoburger Wald"}
            </Text>
          </View>
          {auth.practice && (
            <View
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <Icon name="flask-outline" size={14} color={discovery.green} />
              <Text style={discoverStyles.caption}>
                Übungsmodus · keine regulären Belohnungen
              </Text>
            </View>
          )}
          {!q.online && (
            <DiscoveryPanel>
              <Text style={discoverStyles.body}>
                Offline · gespeicherte Inhalte bleiben verfügbar. Karten
                benötigen Internet.
              </Text>
            </DiscoveryPanel>
          )}
          {Boolean(q.error) && (
            <DiscoveryPanel>
              <Text style={discoverStyles.body}>{q.error}</Text>
              <DiscoveryAction
                label="Erneut versuchen"
                secondary
                icon="refresh"
                disabled={q.busy}
                onPress={() =>
                  void (q.outbox.length ? q.sync() : q.refresh()).catch(
                    () => undefined,
                  )
                }
              />
            </DiscoveryPanel>
          )}
          <PracticeEntry />
          {q.loading ? (
            <LoadingState />
          ) : visible && quest ? (
            <DiscoveryQuestCard
              quest={quest}
              onPress={() => router.push("/quest/details")}
            />
          ) : (
            <DiscoveryPanel>
              <Text style={discoverStyles.title}>
                {quest
                  ? "Keine passende Quest gefunden."
                  : "Das Abenteuer wird vorbereitet."}
              </Text>
              <Text style={discoverStyles.body}>
                {quest
                  ? "Passe deine Suche oder Filter an. Für diese Quest sind Alter, Dauer und Strecke noch nicht vollständig bestätigt."
                  : "Noch keine Outdoor-Route veröffentlicht. Im Entwicklungsmodus kannst du die Schatzsuche bereits erleben."}
              </Text>
              <DiscoveryAction
                label={
                  quest
                    ? "Suche und Filter zurücksetzen"
                    : "Quests erneut laden"
                }
                secondary
                icon="refresh"
                onPress={() => {
                  if (quest) reset();
                  else void q.refresh().catch(() => undefined);
                }}
              />
            </DiscoveryPanel>
          )}
          {q.run && (
            <DiscoveryPanel>
              <Text style={[discoverStyles.title, { fontSize: 21 }]}>
                Deine Reise geht weiter.
              </Text>
              <Text style={discoverStyles.body}>
                {q.run.completed.length} von 8 Kapiteln · {q.run.seals.length}{" "}
                von 4 Steinsiegeln
              </Text>
              {auth.practice && (
                <Text style={discoverStyles.caption}>
                  Übungslevel {level.level} · {level.current} / {level.next} XP
                </Text>
              )}
              <DiscoveryAction
                label="Abenteuer fortsetzen"
                icon="play"
                onPress={() =>
                  router.push(
                    q.run?.finished ? "/quest/finish" : "/quest/navigate",
                  )
                }
              />
            </DiscoveryPanel>
          )}
          {quest && (
            <>
              <Text
                style={[
                  discoverStyles.body,
                  { fontFamily: "NunitoSans_700Bold" },
                ]}
              >
                Für dein Abenteuer
              </Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <DiscoveryShortcut
                  title="Deine Steinsiegel"
                  caption={
                    (q.run?.seals.length ?? 0) + " von 4 gesammelt · 8 Kapitel"
                  }
                  icon="sparkles-outline"
                  scene={3}
                  label="Kapitel und Steinsiegel ansehen"
                  onPress={() => router.push("/quest/progress")}
                />
                <DiscoveryShortcut
                  title="Offline dabei"
                  caption={
                    q.downloaded
                      ? "Geschichte und Bilder gespeichert"
                      : "Geschichte und Bilder speichern"
                  }
                  icon="download-outline"
                  scene={1}
                  label={
                    q.downloaded
                      ? "Quest erneut herunterladen"
                      : "Quest-Inhalte herunterladen"
                  }
                  disabled={q.busy}
                  onPress={() => void q.download().catch(() => undefined)}
                />
              </View>
            </>
          )}
          {Boolean(q.notice) && (
            <Text style={discoverStyles.body}>{q.notice}</Text>
          )}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            <DiscoveryChip
              label={filters.age === null ? "Alter" : filters.age + "+ Jahre"}
              icon="people"
              active={filters.age !== null}
              onPress={() => openFilters("age")}
            />
            <DiscoveryChip
              label={
                filters.minutes === null
                  ? "Dauer"
                  : "Bis " + filters.minutes + " Min."
              }
              icon="time-outline"
              active={filters.minutes !== null}
              onPress={() => openFilters("minutes")}
            />
            <DiscoveryChip
              label={
                filters.kilometers === null
                  ? "Distanz"
                  : "Bis " + filters.kilometers + " km"
              }
              icon="location"
              active={filters.kilometers !== null}
              onPress={() => openFilters("kilometers")}
            />
            <DiscoveryChip
              label="Schwierigkeit"
              icon="cellular"
              active={filters.difficulty !== null}
              onPress={() => openFilters("difficulty")}
            />
          </View>
          <Text
            style={[
              discoverStyles.caption,
              { textAlign: "center", marginTop: 4 },
            ]}
          >
            Entdecke. Erlebe. Beschütze. Mehr Zeit draußen für das, was zählt.
          </Text>
          <Text
            style={[
              discoverStyles.caption,
              { fontSize: 11, textAlign: "center" },
            ]}
          >
            Alle Siegel sind digital. Bleibe auf freigegebenen Wegen.
          </Text>
        </View>
      </ScrollView>
      {sheet !== null && (
        <DiscoveryFilterSheet
          value={filters}
          facet={sheet}
          difficulty={quest?.difficulty}
          onChange={setFilters}
          onClose={() => setSheet(null)}
        />
      )}
    </SafeAreaView>
  );
}
