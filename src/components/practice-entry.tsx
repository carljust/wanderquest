import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "./ui";
import { useAuth } from "@/features/auth/provider";
import { config } from "@/lib/config";
import { layout } from "@/theme";
export function PracticeEntry() {
  const auth = useAuth();
  if (!config.developmentMode || auth.practice) return null;
  return (
    <View style={layout.card}>
      <Text style={layout.eyebrow}>DIE QUEST SCHON JETZT ERLEBEN</Text>
      <Text style={layout.heading}>Dein Übungsabenteuer</Text>
      <Text style={layout.body}>
        Alle acht Stationen als Übung spielen – ohne Anreise und ohne reguläre
        Abzeichen. Dein Kontospielstand bleibt getrennt erhalten.
      </Text>
      <Button
        label="Quest im Übungsmodus öffnen"
        icon="flask-outline"
        onPress={() => {
          auth.enterPractice();
          router.replace("/quest/details");
        }}
      />
    </View>
  );
}
