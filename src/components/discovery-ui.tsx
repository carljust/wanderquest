import { type PropsWithChildren } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Icon, type IconName } from "./ui";
import { Scene } from "./artwork";

export const discovery = {
  background: "#F5F3E9",
  paper: "#FFFCF5",
  green: "#315E38",
  deep: "#0E3528",
  ink: "#233C2D",
  muted: "#647063",
  border: "#E2E3D8",
  accent: "#8DAE49",
  gold: "#E9B44A",
};
export const discoverStyles = StyleSheet.create({
  title: {
    color: discovery.deep,
    fontFamily: "NunitoSans_700Bold",
    fontSize: 25,
    lineHeight: 30,
  },
  body: {
    color: discovery.ink,
    fontFamily: "NunitoSans_400Regular",
    fontSize: 15,
    lineHeight: 21,
  },
  caption: {
    color: discovery.muted,
    fontFamily: "NunitoSans_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
  card: {
    backgroundColor: discovery.paper,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: discovery.border,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(30, 56, 35, 0.07)",
  },
});
export function DiscoveryPanel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[discoverStyles.card, { padding: 15, gap: 10 }, style]}>
      {children}
    </View>
  );
}
export function DiscoveryAction({
  label,
  onPress,
  icon = "chevron-forward",
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
      style={({ pressed }) => ({
        opacity: disabled ? 0.45 : pressed ? 0.75 : 1,
        minHeight: 48,
        borderRadius: 26,
        backgroundColor: secondary ? discovery.paper : discovery.green,
        borderWidth: 1,
        borderColor: secondary ? discovery.border : discovery.green,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 11,
        gap: 8,
      })}
    >
      <Text
        style={{
          fontFamily: "NunitoSans_700Bold",
          fontSize: 15,
          lineHeight: 21,
          flexShrink: 1,
          color: secondary ? discovery.green : "#FFFFFF",
          textAlign: "center",
        }}
      >
        {label}
      </Text>
      <Icon
        name={icon}
        size={20}
        color={secondary ? discovery.green : "#FFFFFF"}
      />
    </Pressable>
  );
}
export function DiscoveryChip({
  label,
  icon,
  active = false,
  onPress,
}: {
  label: string;
  icon: IconName;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label + " filtern"}
      accessibilityState={{ selected: active }}
      aria-pressed={active}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 46,
        flexBasis: "45%",
        flexGrow: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: active ? discovery.green : discovery.border,
        backgroundColor: active ? "#E8EFDA" : discovery.paper,
        flexDirection: "row",
        gap: 7,
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon name={icon} size={18} color={discovery.green} />
      <Text style={[discoverStyles.body, { flex: 1, fontSize: 13 }]}>
        {label}
      </Text>
      <Icon name="chevron-down" size={14} color={discovery.green} />
    </Pressable>
  );
}
export function DiscoveryShortcut({
  title,
  caption,
  icon,
  scene,
  onPress,
  disabled = false,
  label,
}: {
  title: string;
  caption: string;
  icon: IconName;
  scene: number;
  onPress: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        discoverStyles.card,
        { flex: 1, minWidth: 0, opacity: disabled ? 0.45 : pressed ? 0.78 : 1 },
      ]}
    >
      <View style={{ height: 105 }}>
        <Scene panel={scene} />
        <View
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            backgroundColor: discovery.paper,
            borderRadius: 20,
            width: 34,
            height: 34,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon} color={discovery.green} size={20} />
        </View>
      </View>
      <View style={{ padding: 11, gap: 5 }}>
        <Text
          style={{
            fontSize: 17,
            lineHeight: 21,
            color: discovery.deep,
            fontFamily: "NunitoSans_700Bold",
          }}
        >
          {title}
        </Text>
        <Text style={discoverStyles.caption}>{caption}</Text>
      </View>
    </Pressable>
  );
}
