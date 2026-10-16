import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/features/auth/provider";
import { LoadingState } from "@/components/ui";
import { colors } from "@/theme";
export default function QuestLayout() {
  const auth = useAuth();
  if (auth.loading) return <LoadingState />;
  if (!auth.session && !auth.practice) return <Redirect href="/auth/login" />;
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.forest,
        contentStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerBackTitle: "Zurück",
      }}
    >
      <Stack.Screen name="details" options={{ title: "Dein Abenteuer" }} />
      <Stack.Screen name="play" options={{ title: "Auf Schatzsuche" }} />
      <Stack.Screen name="finish" options={{ title: "Dein Schatz" }} />
    </Stack>
  );
}
