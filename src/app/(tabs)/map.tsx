import { router, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import {
  Brand,
  Button,
  Icon,
  LoadingState,
  Notice,
  Screen,
} from "@/components/ui";
import { MissionMap } from "@/features/map/mission-map";
import { useMissions } from "@/features/missions/provider";
import { colors, layout } from "@/theme";

export default function MapScreen() {
  const { missionId } = useLocalSearchParams<{ missionId?: string }>();
  const { missions, loading, error } = useMissions();
  const mission = missionId
    ? missions.find((value) => value.id === missionId)
    : missions[0];
  return (
    <Screen>
      <Brand />
      <View style={{ gap: 8 }}>
        <Text style={layout.eyebrow}>BALD WIRD DER WEG INTERAKTIV</Text>
        <Text style={layout.title}>Dein Abenteuer{"\n"}auf einen Blick.</Text>
        <Text style={layout.body}>
          Hier entsteht deine Missionskarte. Sieh dir schon jetzt an, wie
          Entdeckerpunkte miteinander verbunden werden.
        </Text>
      </View>
      {loading && <LoadingState />}
      {error && <Notice warning>{error}</Notice>}
      {!loading && !error && !mission && (
        <Notice warning>
          Diese Mission wurde nicht gefunden. Wähle eine andere Mission aus der
          Übersicht.
        </Notice>
      )}
      {mission && (
        <>
          <MissionMap mission={mission} />
          <View style={layout.card}>
            <Text style={layout.eyebrow}>AUSGEWÄHLTE MISSION</Text>
            <Text accessibilityRole="header" style={layout.heading}>
              {mission.title}
            </Text>
            <Text style={layout.body}>
              {mission.checkpoints.length} Beispielpunkte · {mission.region}
            </Text>
            <Button
              secondary
              label="Missionsdetails ansehen"
              onPress={() =>
                router.push({
                  pathname: "/mission/[id]",
                  params: { id: mission.id },
                })
              }
            />
          </View>
        </>
      )}
      <View style={layout.card}>
        <View style={layout.row}>
          <Icon name="navigate-outline" />
          <Text style={layout.heading}>Der nächste Schritt</Text>
        </View>
        <Text style={layout.body}>
          Später findest du hier eine interaktive Karte, deinen Standort und
          deinen Missionsfortschritt. Aktuell werden weder Standortdaten
          abgefragt noch aufgezeichnet.
        </Text>
        <View style={[layout.row, { flexWrap: "wrap" }]}>
          <Icon name="checkmark-circle-outline" size={18} color={colors.pine} />
          <Text style={{ color: colors.pine, fontSize: 13 }}>
            Navigation und Kartenbereich vorbereitet
          </Text>
        </View>
      </View>
      <Button
        label="Andere Mission wählen"
        secondary
        onPress={() => router.push("/missions")}
      />
      <Notice warning>
        Schematische Demo, keine echte Wanderkarte. Die Beispielpunkte und ihre
        Verbindung sind frei erfunden und dienen keiner Navigation.
      </Notice>
    </Screen>
  );
}
