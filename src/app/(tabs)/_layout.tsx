import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/components/ui";
import { colors } from "@/theme";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.forest,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.line,
          height: 68 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Entdecken",
          tabBarIcon: ({ focused }) => (
            <Icon
              name="compass-outline"
              color={focused ? colors.forest : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Missionen",
          tabBarIcon: ({ focused }) => (
            <Icon
              name="trail-sign-outline"
              color={focused ? colors.forest : colors.muted}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Karte",
          tabBarIcon: ({ focused }) => (
            <Icon
              name="map-outline"
              color={focused ? colors.forest : colors.muted}
            />
          ),
        }}
      />
    </Tabs>
  );
}
