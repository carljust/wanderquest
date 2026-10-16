import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { type PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "./ui";
import { Scene } from "./artwork";
export function StoryHero({
  title,
  eyebrow,
  children,
  panel = 0,
  height = 370,
  back = false,
  titlePlacement = "bottom",
}: {
  title?: string;
  eyebrow?: string;
  panel?: number;
  height?: number;
  back?: boolean;
  titlePlacement?: "top" | "bottom";
  children?: React.ReactNode;
}) {
  return (
    <View style={{ height, backgroundColor: "#263c26", overflow: "hidden" }}>
      <Scene panel={panel} />
      <LinearGradient
        colors={["#10211055", "transparent", "#11220DEB"]}
        locations={[0, 0.4, 1]}
        style={StyleSheet.absoluteFill}
      />
      {back && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Zurück"
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/")
          }
          style={{
            position: "absolute",
            left: 16,
            top: 14,
            padding: 8,
            zIndex: 2,
          }}
        >
          <Icon name="chevron-back" color="#fff" size={24} />
        </Pressable>
      )}
      <View
        style={{
          position: "absolute",
          left: 22,
          right: 22,
          ...(titlePlacement === "top" ? { top: 57 } : { bottom: 36 }),
          gap: 8,
        }}
      >
        {eyebrow && (
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#F1F1DC",
              letterSpacing: 0.3,
            }}
          >
            {eyebrow}
          </Text>
        )}
        {title && (
          <Text
            style={{
              fontSize: 28,
              lineHeight: 34,
              fontWeight: "700",
              color: "#fff",
              maxWidth: "88%",
            }}
          >
            {title}
          </Text>
        )}
      </View>
      {children}
    </View>
  );
}
export function StoryBody({ children }: PropsWithChildren) {
  return (
    <View
      style={{
        marginTop: -22,
        padding: 20,
        paddingBottom: 30,
        gap: 20,
        backgroundColor: "#F2EEE3",
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
      }}
    >
      {children}
    </View>
  );
}
