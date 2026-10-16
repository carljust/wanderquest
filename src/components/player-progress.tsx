import { Text, View } from "react-native";
import { levelProgress } from "@/domain/rewards";
import { tokens } from "@/theme/tokens";

export function PlayerProgress({
  xp,
  practice = false,
  light = false,
}: {
  xp?: number;
  practice?: boolean;
  light?: boolean;
}) {
  const level = xp === undefined ? undefined : levelProgress(xp);
  const color = light ? tokens.discovery.deep : tokens.adventure.cream;
  return (
    <View
      accessibilityLabel={
        level
          ? `${practice ? "Übungslevel" : "Level"} ${level.level}, ${level.current} von ${level.next} XP`
          : "XP und Level noch nicht verfügbar"
      }
      style={{ gap: 3, minWidth: 84 }}
    >
      <Text style={{ color, fontFamily: tokens.font.strong, fontSize: 12 }}>
        {level ? `${practice ? "Übung · " : ""}Lv. ${level.level}` : "Deine XP"}
      </Text>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={practice ? "Übungs-XP" : "Erfahrungspunkte"}
        accessibilityValue={
          level ? { min: 0, max: level.next, now: level.current } : undefined
        }
        style={{
          height: 6,
          borderRadius: 5,
          backgroundColor: light ? "#D8DDCD" : "#16241E",
          borderWidth: 1,
          borderColor: tokens.adventure.goldEdge,
          overflow: "hidden",
        }}
      >
        {level && (
          <View
            style={{
              width: `${(level.current / level.next) * 100}%`,
              height: "100%",
              backgroundColor: tokens.adventure.gold,
            }}
          />
        )}
      </View>
      <Text style={{ color, fontFamily: tokens.font.body, fontSize: 10 }}>
        {level
          ? `${level.current} / ${level.next} XP${practice ? " · Vorschau" : ""}`
          : "Noch nicht verfügbar"}
      </Text>
    </View>
  );
}
