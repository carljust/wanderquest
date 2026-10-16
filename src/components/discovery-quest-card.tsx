import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import type { Quest } from "@/domain/quest";
import { Scene } from "./artwork";
import { discovery, discoverStyles } from "./discovery-ui";
import { Icon } from "./ui";
export function DiscoveryQuestCard({
  quest,
  onPress,
}: {
  quest: Quest;
  onPress: () => void;
}) {
  const { width } = useWindowDimensions();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Abenteuer entdecken"
      onPress={onPress}
      style={({ pressed }) => [
        discoverStyles.card,
        { opacity: pressed ? 0.82 : 1 },
      ]}
    >
      <View style={{ height: width < 350 ? 175 : 185 }}>
        <Scene />
        <LinearGradient
          colors={["#10291E00", "#10291E00", "#082418E8"]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            backgroundColor: "#FFF9E8F5",
            borderRadius: 22,
            paddingHorizontal: 11,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          <Icon name="star" size={18} color={discovery.gold} />
          <Text
            style={{
              fontFamily: "NunitoSans_700Bold",
              fontSize: 12,
              color: discovery.deep,
            }}
          >
            Empfohlen
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            left: 15,
            bottom: 14,
            right: 60,
          }}
        >
          <Text
            style={{
              fontFamily: "NunitoSans_700Bold",
              color: "#FFFFFF",
              fontSize: 23,
              lineHeight: 27,
            }}
          >
            {quest.title}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            right: 13,
            bottom: 15,
            width: 42,
            height: 42,
            borderRadius: 23,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: discovery.accent,
          }}
        >
          <Icon name="chevron-forward" size={26} color="#FFFFFF" />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 12,
          gap: 9,
        }}
      >
        {[
          {
            icon: "walk-outline" as const,
            label: quest.fieldReady ? quest.distance : "Strecke in Prüfung",
          },
          { icon: "time-outline" as const, label: quest.duration },
          {
            icon: "people-outline" as const,
            label:
              quest.listing?.minimumAge === undefined
                ? "Altersangabe offen"
                : "Ab " + quest.listing.minimumAge + " Jahren",
          },
          {
            icon: "cellular-outline" as const,
            label: quest.difficulty.replace(/^Rätsel:\s*/i, ""),
          },
        ].map((fact) => (
          <View
            key={fact.icon}
            style={{
              flexBasis: "45%",
              flexGrow: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Icon name={fact.icon} color={discovery.green} size={18} />
            <Text
              style={[
                discoverStyles.caption,
                { flex: 1, color: discovery.ink },
              ]}
            >
              {fact.label}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
