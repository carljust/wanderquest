import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, LoadingState } from "@/components/ui";
import { useAuth } from "@/features/auth/provider";
import { adventure } from "@/components/adventure-ui";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  if (auth.loading) return <LoadingState />;
  if (!auth.session && !auth.practice) return <Redirect href="/auth/login" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: adventure.gold,
        tabBarInactiveTintColor: "#DDD9BD",
        tabBarStyle: {
          backgroundColor: adventure.forest,
          borderTopColor: adventure.goldEdge,
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
          tabBarIcon: ({ color }) => (
            <Icon name="compass-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Karte",
          tabBarIcon: ({ color }) => <Icon name="map-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: "Rucksack",
          tabBarIcon: ({ color }) => (
            <Icon name="bag-handle-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Icon name="person-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
