import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { discovery, discoverStyles } from "./discovery-ui";
import { Icon } from "./ui";
import { PlayerProgress } from "./player-progress";
export function DiscoveryHero({
  search,
  onSearch,
  onFilters,
  onSettings,
  reducedMotion,
  practiceXp,
}: {
  search: string;
  onSearch: (text: string) => void;
  onFilters: () => void;
  onSettings: () => void;
  reducedMotion: boolean;
  practiceXp?: number;
}) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        height: Math.min(317, Math.max(292, width * 0.68 + 32)) + insets.top,
        zIndex: 2,
      }}
    >
      <Image
        source={require("../../assets/design/discover-landscape.png")}
        resizeMode="cover"
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
      />
      <LinearGradient
        colors={["#F6F5E022", "#F6F5E000", "#173D1F33"]}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={{
          paddingTop: insets.top + 14,
          alignItems: "center",
          paddingHorizontal: 25,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
          <Icon name="leaf" size={26} color={discovery.green} />
          <Text
            accessibilityRole="header"
            style={{
              fontSize: width < 350 ? 48 : 54,
              lineHeight: width < 350 ? 56 : 62,
              fontFamily: "NunitoSans_700Bold",
              color: "#07432F",
              letterSpacing: -2,
            }}
          >
            Wyldo
          </Text>
        </View>
        <Text
          style={{
            fontFamily: "NunitoSans_700Bold",
            color: "#153D2D",
            fontSize: 14,
            lineHeight: 18,
            textAlign: "center",
          }}
        >
          Draußen wird zum Abenteuer.
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Einstellungen öffnen"
        onPress={onSettings}
        style={{
          position: "absolute",
          top: insets.top + 16,
          right: 14,
          width: 44,
          height: 44,
          borderRadius: 24,
          backgroundColor: "#FFFCF5D9",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name="settings-outline" color={discovery.green} size={21} />
      </Pressable>
      <View
        testID="discovery-player-hud"
        style={{
          position: "absolute",
          top: insets.top + 112,
          left: 17,
          width: 141,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#D4BE81",
          paddingHorizontal: 10,
          paddingVertical: 6,
          backgroundColor: "#FFFCF5F0",
        }}
      >
        <PlayerProgress
          xp={practiceXp}
          practice={practiceXp !== undefined}
          light
        />
      </View>
      <View
        testID="discovery-greeting"
        style={{
          position: "absolute",
          left: 17,
          bottom: 44,
          maxWidth: "53%",
          backgroundColor: "#FFFCF5E8",
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Text
          style={{
            fontFamily: "NunitoSans_700Bold",
            fontSize: 16,
            lineHeight: 21,
            color: discovery.deep,
          }}
        >
          Hallo Abenteurer!
        </Text>
        <Text style={[discoverStyles.caption, { color: discovery.green }]}>
          Kleine Schritte. Große Abenteuer.
        </Text>
      </View>
      <View
        pointerEvents="none"
        style={{ position: "absolute", right: 10, bottom: 8 }}
      >
        <WyldoCompanion
          state="wave"
          size={width < 350 ? 125 : 140}
          reducedMotion={reducedMotion}
        />
      </View>
      <View
        style={[
          discoverStyles.card,
          {
            position: "absolute",
            bottom: -27,
            left: 16,
            right: 16,
            minHeight: 56,
            borderRadius: 32,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            gap: 9,
            borderWidth: 3,
            borderColor: "#FFFFFF",
          },
        ]}
      >
        <Icon name="search-outline" size={24} color={discovery.muted} />
        <TextInput
          accessibilityLabel="Quests suchen"
          placeholder="Quests oder Orte suchen"
          placeholderTextColor="#777D72"
          value={search}
          onChangeText={onSearch}
          returnKeyType="search"
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 48,
            color: discovery.ink,
            fontSize: 16,
            fontFamily: "NunitoSans_400Regular",
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Questfilter öffnen"
          onPress={onFilters}
          style={{
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="options-outline" size={22} color={discovery.green} />
        </Pressable>
      </View>
    </View>
  );
}
