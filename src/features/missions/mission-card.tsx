import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Landscape } from "@/components/landscape";
import { Icon } from "@/components/ui";
import { colors, layout } from "@/theme";
import { useMissions } from "./provider";
import { formatDistance } from "./repository";
import type { Mission } from "./types";

export function MissionCard({ mission }: { mission: Mission }) {
  const { savedIds, toggleSaved, bookmarksReady } = useMissions();
  const saved = savedIds.includes(mission.id);
  return (
    <View style={styles.card}>
      <Link
        href={{ pathname: "/mission/[id]", params: { id: mission.id } }}
        asChild
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Mission ansehen: ${mission.title}`}
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <View style={styles.art}>
            <Landscape variant={mission.artwork} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{mission.difficulty}</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={layout.eyebrow}>
              {mission.region.toLocaleUpperCase("de-DE")}
            </Text>
            <Text style={layout.heading}>{mission.title}</Text>
            <Text style={layout.body}>{mission.subtitle}</Text>
            <View style={[layout.row, { flexWrap: "wrap", marginTop: 4 }]}>
              <Icon name="footsteps-outline" size={16} />
              <Text style={styles.meta}>
                {formatDistance(mission.distanceKm)}
              </Text>
              <Icon name="time-outline" size={16} />
              <Text style={styles.meta}>{mission.durationMinutes} Min.</Text>
              <Text style={styles.meta}>↗ {mission.elevationMeters} m</Text>
            </View>
            <Text style={styles.open}>Abenteuer ansehen →</Text>
          </View>
        </Pressable>
      </Link>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          saved
            ? `${mission.title} nicht mehr merken`
            : `${mission.title} merken`
        }
        accessibilityState={{ selected: saved, disabled: !bookmarksReady }}
        disabled={!bookmarksReady}
        onPress={() => toggleSaved(mission.id)}
        style={styles.bookmark}
        hitSlop={4}
      >
        <Icon name={saved ? "bookmark" : "bookmark-outline"} size={21} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderWidth: 1,
  },
  art: { height: 160, backgroundColor: colors.moss },
  content: { padding: 20, gap: 8 },
  badge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: { color: colors.forest, fontSize: 12, fontWeight: "700" },
  bookmark: {
    position: "absolute",
    right: 12,
    top: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  meta: { color: colors.muted, fontSize: 13, marginRight: 8 },
  open: { color: colors.pine, fontSize: 14, fontWeight: "700", marginTop: 10 },
});
