import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Landscape } from "@/components/landscape";
import { Button, Icon, LoadingState, Notice, Screen } from "@/components/ui";
import { useMissions } from "@/features/missions/provider";
import { formatDistance } from "@/features/missions/repository";
import { colors, layout } from "@/theme";

export default function MissionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    missions,
    loading,
    error,
    savedIds,
    toggleSaved,
    bookmarksReady,
    storageError,
  } = useMissions();
  const mission = missions.find((value) => value.id === id);
  if (loading)
    return (
      <Screen withHeader>
        <LoadingState />
      </Screen>
    );
  if (error)
    return (
      <Screen withHeader>
        <Notice warning>{error}</Notice>
      </Screen>
    );
  if (!mission)
    return (
      <Screen withHeader>
        <Text style={layout.title}>Dieses Abenteuer fehlt.</Text>
        <Text style={layout.body}>
          Die Mission wurde nicht gefunden. Entdecke stattdessen unsere
          Beispielmissionen.
        </Text>
        <Button
          label="Zu den Missionen"
          onPress={() => router.replace("/missions")}
        />
      </Screen>
    );
  const saved = savedIds.includes(mission.id);
  return (
    <Screen withHeader>
      <View style={styles.art}>
        <Landscape variant={mission.artwork} />
      </View>
      <View style={{ gap: 10 }}>
        <Text style={layout.eyebrow}>
          {mission.region.toLocaleUpperCase("de-DE")}
        </Text>
        <Text style={layout.title}>{mission.title}</Text>
        <Text style={layout.body}>{mission.subtitle}</Text>
      </View>
      <View style={styles.stats}>
        {[
          [formatDistance(mission.distanceKm), "Strecke"],
          [`${mission.durationMinutes} Min.`, "Dauer"],
          [`${mission.elevationMeters} m`, "Aufstieg"],
        ].map(([value, label]) => (
          <View key={label} style={{ flex: 1, alignItems: "center", gap: 5 }}>
            <Text style={styles.stat}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
      <View style={[layout.row, { flexWrap: "wrap" }]}>
        <View style={styles.tag}>
          <Text style={styles.tagText}>{mission.difficulty}</Text>
        </View>
        {mission.highlights.map((item) => (
          <View style={styles.tag} key={item}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 10 }}>
        <Text style={layout.heading}>Eine kleine Geschichte für unterwegs</Text>
        <Text style={layout.body}>{mission.description}</Text>
      </View>
      <View style={layout.card}>
        <Text style={layout.heading}>Das wartet auf dich</Text>
        {mission.checkpoints.map((point, index) => (
          <View
            key={point.id}
            style={[
              layout.row,
              { alignItems: "flex-start", paddingVertical: 8 },
            ]}
          >
            <View style={styles.number}>
              <Text style={{ color: colors.forest, fontWeight: "700" }}>
                {index + 1}
              </Text>
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.forest,
                }}
              >
                {point.title}
              </Text>
              <Text style={layout.body}>{point.hint}</Text>
            </View>
            <Icon name="ellipse-outline" color={colors.muted} size={16} />
          </View>
        ))}
      </View>
      <Button
        label="Kartenvorschau öffnen"
        icon="map-outline"
        onPress={() =>
          router.push({ pathname: "/map", params: { missionId: mission.id } })
        }
      />
      <Button
        label={saved ? "Von Merkliste entfernen" : "Mission merken"}
        secondary
        icon={saved ? "bookmark" : "bookmark-outline"}
        disabled={!bookmarksReady}
        onPress={() => toggleSaved(mission.id)}
      />
      {storageError && <Notice warning>{storageError}</Notice>}
      <Notice warning>
        Alle Angaben und Orte sind erfunden. Die Vorschau dient keiner realen
        Navigation. Aufgaben, GPS-Fortschritt und Belohnungen folgen in späteren
        Versionen.
      </Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  art: { height: 220, borderRadius: 24, overflow: "hidden" },
  stats: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    flexDirection: "row",
    paddingVertical: 22,
  },
  stat: { fontSize: 20, fontWeight: "800", color: colors.forest },
  statLabel: { fontSize: 12, color: colors.muted },
  tag: {
    backgroundColor: colors.moss,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  tagText: { fontSize: 12, color: colors.forest, fontWeight: "600" },
  number: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.moss,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 2,
  },
});
