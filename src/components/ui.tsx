import Ionicons from "@expo/vector-icons/Ionicons";
import { type ComponentProps, type PropsWithChildren } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, layout } from "@/theme";

export type IconName = ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  color = colors.forest,
  size = 22,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return <Ionicons name={name} color={color} size={size} aria-hidden />;
}

export function Screen({
  children,
  withHeader = false,
}: PropsWithChildren<{ withHeader?: boolean }>) {
  return (
    <SafeAreaView
      style={layout.screen}
      edges={
        withHeader ? ["left", "right", "bottom"] : ["top", "left", "right"]
      }
    >
      <ScrollView contentContainerStyle={layout.content}>{children}</ScrollView>
    </SafeAreaView>
  );
}

export function Brand() {
  return (
    <View style={[layout.row, { justifyContent: "space-between" }]}>
      <View style={layout.row} accessibilityLabel="WanderQuest">
        <View style={styles.logo}>
          <Icon name="trail-sign-outline" color={colors.background} size={27} />
        </View>
        <Text style={styles.brand}>
          Wander<Text style={{ color: colors.orange }}>Quest</Text>
        </Text>
      </View>
      <View style={styles.compass}>
        <Icon name="compass-outline" size={25} />
      </View>
    </View>
  );
}

export function Button({
  label,
  onPress,
  icon = "arrow-forward",
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  icon?: IconName;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        { opacity: disabled ? 0.5 : pressed ? 0.75 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.forest }]}>
        {label}
      </Text>
      <Icon
        name={icon}
        size={19}
        color={secondary ? colors.forest : colors.surface}
      />
    </Pressable>
  );
}

export function Notice({
  children,
  warning = false,
}: PropsWithChildren<{ warning?: boolean }>) {
  return (
    <View style={[styles.notice, warning && { backgroundColor: colors.sand }]}>
      <Icon
        name={warning ? "information-circle-outline" : "leaf-outline"}
        size={20}
      />
      <Text style={styles.noticeText}>{children}</Text>
    </View>
  );
}

export function LoadingState() {
  return (
    <View style={layout.card}>
      <ActivityIndicator color={colors.forest} />
      <Text style={layout.body}>Abenteuer werden geladen …</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    fontSize: 23,
    fontWeight: "800",
    letterSpacing: -1,
    color: colors.forest,
  },
  compass: {
    width: 44,
    height: 44,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    minHeight: 52,
    borderRadius: 15,
    backgroundColor: colors.orange,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  secondary: { backgroundColor: colors.moss },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: "700" },
  notice: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.moss,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  noticeText: { color: colors.forest, fontSize: 13, lineHeight: 20, flex: 1 },
});
