import { Redirect, Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, LoadingState } from "@/components/ui";
import { useAuth } from "@/features/auth/provider";
import { discovery } from "@/components/discovery-ui";
import { useQuest } from "@/features/quest/provider";
import { Text, View } from "react-native";
export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const q = useQuest();
  if (auth.loading) return <LoadingState />;
  if (!auth.session && !auth.practice) return <Redirect href="/auth/login" />;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: discovery.green,
        tabBarInactiveTintColor: "#7A8277",
        tabBarStyle: {
          backgroundColor: discovery.paper,
          borderTopColor: discovery.border,
          height: 76 + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
        },
        tabBarLabel: ({ children, color, focused }) => (
          <View style={{ alignItems: "center", gap: 5 }}>
            <Text
              style={{ fontFamily: "NunitoSans_700Bold", fontSize: 12, color }}
            >
              {children}
            </Text>
            <View
              style={{
                height: 3,
                width: 38,
                borderRadius: 2,
                backgroundColor: discovery.green,
                opacity: focused ? 1 : 0,
              }}
            />
          </View>
        ),
        tabBarBadgeStyle: {
          backgroundColor: "#B66B3C",
          color: "#FFFFFF",
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Entdecken",
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? "compass" : "compass-outline"}
              color={color}
              size={29}
            />
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
          tabBarBadge: q.run?.seals.length || undefined,
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
