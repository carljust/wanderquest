import { type PropsWithChildren, useCallback } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, router } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { artwork, AtlasImage } from "./artwork";
import { Icon, type IconName } from "./ui";
import { tokens } from "@/theme/tokens";
import { PlayerProgress } from "./player-progress";

export const adventure = tokens.adventure;
export const gameStyles = StyleSheet.create({
  title: {
    color: adventure.cream,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "400",
    fontFamily: tokens.font.display,
  },
  heading: {
    color: adventure.cream,
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "400",
    fontFamily: tokens.font.display,
  },
  body: {
    color: adventure.cream,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: tokens.font.body,
  },
  paperBody: {
    color: adventure.ink,
    fontSize: 16,
    lineHeight: 23,
    fontFamily: tokens.font.body,
  },
  paperTitle: {
    color: adventure.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "400",
    fontFamily: tokens.font.display,
  },
  label: {
    color: adventure.gold,
    fontFamily: tokens.font.strong,
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.7,
  },
});
export function AdventureScreen({
  children,
  bottomInset = true,
  tabs = false,
  footer,
}: PropsWithChildren<{
  bottomInset?: boolean;
  tabs?: boolean;
  footer?: React.ReactNode;
}>) {
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
    }, []),
  );
  return (
    <View
      style={{ flex: 1, backgroundColor: adventure.forest, overflow: "hidden" }}
    >
      <Image
        source={artwork.forest}
        style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
        resizeMode="cover"
      />
      <LinearGradient
        colors={["#09291922", "#0B2219AA", "#081A13F5"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView
        style={{ flex: 1 }}
        edges={
          bottomInset
            ? ["top", "left", "right", "bottom"]
            : ["top", "left", "right"]
        }
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            padding: 14,
            gap: 12,
            paddingBottom: 32,
            width: "100%",
            maxWidth: 760,
            alignSelf: "center",
          }}
        >
          {children}
        </ScrollView>
        {footer && (
          <View
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              backgroundColor: adventure.forest,
            }}
          >
            {footer}
          </View>
        )}
        {tabs && <AdventureBottomTabs />}
      </SafeAreaView>
    </View>
  );
}
export function AdventureBottomTabs() {
  const items: {
    label: string;
    icon: IconName;
    path: "/" | "/map" | "/missions" | "/profile";
  }[] = [
    { label: "Entdecken", icon: "compass-outline", path: "/" },
    { label: "Karte", icon: "map-outline", path: "/map" },
    { label: "Rucksack", icon: "bag-handle-outline", path: "/missions" },
    { label: "Profil", icon: "person-outline", path: "/profile" },
  ];
  return (
    <View
      style={{
        flexDirection: "row",
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 6,
        backgroundColor: adventure.forest,
        borderTopWidth: 1,
        borderTopColor: adventure.goldEdge,
      }}
    >
      {items.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole="button"
          accessibilityLabel={item.label}
          onPress={() => router.navigate(item.path)}
          style={{
            flex: 1,
            minHeight: 54,
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Icon
            name={item.icon}
            color={item.path === "/" ? adventure.gold : adventure.cream}
            size={26}
          />
          <Text
            style={{
              fontSize: 11,
              color: item.path === "/" ? adventure.gold : adventure.cream,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function AdventurePanel({
  children,
  paper = false,
  style,
}: PropsWithChildren<{ paper?: boolean; style?: StyleProp<ViewStyle> }>) {
  return (
    <LinearGradient
      colors={
        paper ? ["#FFF4DB", "#F7DEAA", "#EACE96"] : ["#162C2BD9", "#0B1D14EB"]
      }
      style={[
        {
          borderRadius: paper ? 23 : 26,
          borderWidth: 1.5,
          borderColor: adventure.goldEdge,
          padding: 17,
          gap: 13,
          overflow: "hidden",
        },
        style,
      ]}
    >
      {paper && (
        <AtlasImage
          source={artwork.game}
          index={3}
          style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
        />
      )}
      {children}
    </LinearGradient>
  );
}
export function AdventureButton({
  label,
  shortLabel,
  onPress,
  variant = "green",
  icon,
  disabled = false,
  compact = false,
}: {
  label: string;
  shortLabel?: string;
  onPress: () => void;
  variant?: "green" | "paper" | "gold" | "rust" | "glass";
  icon?: IconName;
  disabled?: boolean;
  compact?: boolean;
}) {
  const colors: Record<typeof variant, readonly [string, string]> = {
    green: ["#72A529", "#244C16"],
    paper: ["#FFF2CE", "#EAC98D"],
    gold: ["#FFE39A", "#DBA63D"],
    rust: ["#D46C16", "#9D330D"],
    glass: ["#34402B", "#18291A"],
  };
  const dark = variant === "paper" || variant === "gold";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: disabled ? 0.45 : pressed ? 0.78 : 1,
      })}
    >
      <LinearGradient
        colors={colors[variant]}
        style={{
          minHeight: 56,
          paddingHorizontal: compact ? 10 : 17,
          paddingVertical: 13,
          borderRadius: 30,
          borderWidth: 2,
          borderColor: variant === "green" ? "#B5D06E" : adventure.goldEdge,
          flexDirection: "row",
          gap: compact ? 6 : 11,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon && (
          <Icon
            name={icon}
            size={compact ? 20 : 24}
            color={dark ? adventure.ink : adventure.cream}
          />
        )}
        <Text
          style={{
            flexShrink: 1,
            minWidth: 0,
            fontSize: compact ? 14 : 17,
            lineHeight: compact ? 20 : 23,
            fontFamily: tokens.font.strong,
            color: dark ? adventure.ink : adventure.cream,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {shortLabel ?? label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}
export function WoodButton({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: IconName;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    >
      <LinearGradient
        colors={["#83542C", "#422B19"]}
        style={{
          width: 48,
          height: 48,
          borderRadius: 26,
          borderWidth: 2,
          borderColor: adventure.goldEdge,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} color={adventure.cream} size={26} />
      </LinearGradient>
    </Pressable>
  );
}
export const BackWoodButton = () => (
  <WoodButton
    label="Zurück"
    icon="chevron-back"
    onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
  />
);
export function TopQuest() {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        backgroundColor: adventure.gold,
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
      }}
    >
      <Icon name="star" color={adventure.ink} size={15} />
      <Text style={{ color: adventure.ink, fontWeight: "800", fontSize: 11 }}>
        TOP QUEST
      </Text>
    </View>
  );
}
export function XpMeter({
  xp,
  practice = false,
}: {
  xp: number;
  practice?: boolean;
}) {
  return <PlayerProgress xp={xp} practice={practice} />;
}
