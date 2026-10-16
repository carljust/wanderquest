import { router } from "expo-router";
import { Text } from "react-native";
import { Button, Screen } from "@/components/ui";
import { layout } from "@/theme";

export default function NotFoundScreen() {
  return (
    <Screen withHeader>
      <Text style={layout.title}>Kurz vom Weg abgekommen?</Text>
      <Text style={layout.body}>
        Diese Seite gibt es nicht. Dein nächstes Abenteuer wartet auf der
        Startseite.
      </Text>
      <Button label="Zur Startseite" onPress={() => router.replace("/")} />
    </Screen>
  );
}
