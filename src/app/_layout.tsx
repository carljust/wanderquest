import Ionicons from "@expo/vector-icons/Ionicons";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { MissionProvider } from "@/features/missions/provider";
import { colors } from "@/theme";

export { ErrorBoundary } from "expo-router";
export const unstable_settings = { anchor: "(tabs)" };

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts(Ionicons.font);
  useEffect(() => {
    if (loaded || error) void SplashScreen.hideAsync();
  }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <MissionProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.forest,
            contentStyle: { backgroundColor: colors.background },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="mission/[id]"
            options={{ title: "Dein Abenteuer", headerBackTitle: "Zurück" }}
          />
          <Stack.Screen
            name="+not-found"
            options={{ title: "Nicht gefunden" }}
          />
        </Stack>
      </MissionProvider>
    </SafeAreaProvider>
  );
}
