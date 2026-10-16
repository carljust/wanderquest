import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Brand, Icon, LoadingState, Notice, Screen } from "@/components/ui";
import { MissionCard } from "@/features/missions/mission-card";
import { useMissions } from "@/features/missions/provider";
import { filterMissions } from "@/features/missions/repository";
import type { MissionFilter } from "@/features/missions/types";
import { colors, layout } from "@/theme";

const filters: MissionFilter[] = ["Alle", "Leicht", "Mittel", "Gemerkt"];

export default function MissionsScreen() {
  const { missions, loading, error, savedIds, storageError } = useMissions();
  const [filter, setFilter] = useState<MissionFilter>("Alle");
  const [query, setQuery] = useState("");
  const visible = filterMissions(missions, filter, query, savedIds);
  return (
    <Screen>
      <Brand />
      <View style={{ gap: 8 }}>
        <Text style={layout.eyebrow}>DER WEG IST DEINE GESCHICHTE</Text>
        <Text style={layout.title}>Finde deine Mission.</Text>
        <Text style={layout.body}>
          Eine kurze Auszeit oder eine neue Aussicht? Such dir dein nächstes
          Beispielabenteuer aus.
        </Text>
      </View>
      <View style={styles.search}>
        <Icon name="search-outline" size={21} />
        <TextInput
          accessibilityLabel="Missionen suchen"
          placeholder="Mission oder Region suchen"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          style={styles.input}
        />
        {query.length > 0 && (
          <Pressable
            onPress={() => setQuery("")}
            accessibilityRole="button"
            accessibilityLabel="Suche löschen"
            style={styles.clear}
          >
            <Icon name="close" size={20} />
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        {filters.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === value }}
            onPress={() => setFilter(value)}
            style={[styles.filter, value === filter && styles.activeFilter]}
          >
            <Text
              style={[
                styles.filterText,
                value === filter && { color: "white" },
              ]}
            >
              {value === "Gemerkt" ? `Gemerkt (${savedIds.length})` : value}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={[layout.row, { justifyContent: "space-between" }]}>
        <Text style={layout.eyebrow}>{visible.length} ABENTEUER FÜR DICH</Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          Synthetische Demos
        </Text>
      </View>
      {loading && <LoadingState />}
      {error && <Notice warning>{error}</Notice>}
      {!loading && !error && visible.length === 0 && (
        <View style={layout.card}>
          <Icon name="compass-outline" size={32} />
          <Text style={layout.heading}>
            {filter === "Gemerkt" && !query
              ? "Platz für neue Abenteuer"
              : "Noch kein passendes Abenteuer"}
          </Text>
          <Text style={layout.body}>
            {filter === "Gemerkt" && !query
              ? "Tippe auf das Lesezeichen einer Mission, um sie hier wiederzufinden."
              : "Probiere einen anderen Suchbegriff oder Filter."}
          </Text>
        </View>
      )}
      {visible.map((mission) => (
        <MissionCard key={mission.id} mission={mission} />
      ))}
      {storageError && <Notice warning>{storageError}</Notice>}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingLeft: 16,
    minHeight: 54,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 16,
    minWidth: 0,
  },
  clear: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  filter: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    minHeight: 44,
  },
  activeFilter: { backgroundColor: colors.forest, borderColor: colors.forest },
  filterText: { fontSize: 13, fontWeight: "600", color: colors.forest },
});
