import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { Landscape } from "@/components/landscape";
import {
  Brand,
  Button,
  Icon,
  LoadingState,
  Notice,
  Screen,
} from "@/components/ui";
import { MissionCard } from "@/features/missions/mission-card";
import { useMissions } from "@/features/missions/provider";
import { colors, layout } from "@/theme";

const discoverySteps = [
  ["compass-outline", "Entdecken"],
  ["footsteps-outline", "Losziehen"],
  ["sparkles-outline", "Mehr erleben"],
] as const;

export default function HomeScreen() {
  const { missions, loading, error, storageError } = useMissions();
  return (
    <Screen>
      <Brand />
      <View style={{ gap: 8 }}>
        <Text style={layout.eyebrow}>WENIGER ALLTAG. MEHR DRAUSSEN.</Text>
        <Text style={layout.title}>Mach den Weg{"\n"}zum Abenteuer.</Text>
        <Text style={layout.body}>
          Entdecke kleine Geschichten und neue Perspektiven. Dein nächstes
          Abenteuer beginnt vor der Tür.
        </Text>
      </View>
      <View style={styles.hero}>
        <View style={styles.heroArt}>
          <Landscape />
          <LinearGradient
            colors={["#183D32", "#183D3200"]}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
        </View>
        <LinearGradient
          colors={["#183D32", "#183D32F0", "#183D3200"]}
          style={styles.heroContent}
        >
          <View style={styles.heroBadge}>
            <Icon name="sparkles-outline" color="#F1D9AF" size={15} />
            <Text style={styles.badgeText}>DEINE AUSZEIT WARTET</Text>
          </View>
          <Text style={styles.heroTitle}>
            Raus aus dem Kopf.{"\n"}Rein ins Grüne.
          </Text>
          <Text style={styles.heroBody}>
            Wähle eine Mission.{"\n"}Entdecke deinen eigenen Weg.
          </Text>
          <Button
            label="Missionen entdecken"
            onPress={() => router.push("/missions")}
          />
        </LinearGradient>
        <View style={styles.heroFooter}>
          <Icon name="leaf-outline" color="white" size={14} />
          <Text style={styles.heroFooterText}>
            KLEINE SCHRITTE. GROSSE ENTDECKUNGEN.
          </Text>
        </View>
      </View>
      <View style={styles.steps}>
        {discoverySteps.map(([icon, text], index) => (
          <View key={text} style={styles.step}>
            <Icon name={icon} size={23} />
            <Text style={styles.stepNumber}>0{index + 1}</Text>
            <Text style={styles.stepText}>{text}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 5 }}>
        <Text style={layout.eyebrow}>FÜR DEINEN ERSTEN SCHRITT</Text>
        <Text style={layout.heading}>Ein Wald voller Geschichten</Text>
      </View>
      {loading && <LoadingState />}
      {error && <Notice warning>{error}</Notice>}
      {missions[0] && <MissionCard mission={missions[0]} />}
      {storageError && <Notice warning>{storageError}</Notice>}
      <Notice>
        WanderQuest wächst mit dir. Diese erste Version enthält ausschließlich
        erfundene Beispielmissionen. Es gibt noch keine spielbaren Aufgaben oder
        echten Wanderrouten.
      </Notice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    minHeight: 440,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: colors.forest,
  },
  heroArt: { position: "absolute", bottom: 0, left: 0, right: 0, height: 270 },
  heroContent: { padding: 25, paddingBottom: 65, gap: 17 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 7 },
  badgeText: {
    color: "#F1D9AF",
    letterSpacing: 1.2,
    fontSize: 10,
    fontWeight: "700",
  },
  heroTitle: {
    fontSize: 31,
    lineHeight: 37,
    color: "#FFFFFF",
    fontWeight: "800",
    letterSpacing: -0.9,
  },
  heroBody: { fontSize: 15, lineHeight: 22, color: "#D4E0D0" },
  heroFooter: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: "auto",
    backgroundColor: "#183D32CF",
  },
  heroFooterText: {
    fontSize: 9,
    letterSpacing: 0.7,
    color: "white",
    fontWeight: "700",
    flexShrink: 1,
  },
  steps: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  step: { alignItems: "center", flex: 1, gap: 8 },
  stepNumber: { fontSize: 10, letterSpacing: 1.5, color: colors.muted },
  stepText: { fontSize: 12, fontWeight: "700", color: colors.forest },
});
