import { Text, View } from "react-native";
import { useAuth } from "@/features/auth/provider";
import { useQuest } from "@/features/quest/provider";
import {
  AdventureButton,
  AdventurePanel,
  adventure,
  gameStyles,
} from "./adventure-ui";
import { Icon } from "./ui";
export function AdventureStatus() {
  const q = useQuest(),
    auth = useAuth();
  return (
    <View style={{ gap: 8 }}>
      {auth.practice && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Icon name="flask-outline" size={14} color={adventure.gold} />
          <Text
            style={{
              color: adventure.cream,
              fontSize: 11,
              lineHeight: 16,
              flex: 1,
            }}
          >
            Übungsmodus · keine regulären Belohnungen
          </Text>
        </View>
      )}
      {!q.online && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperBody}>
            Offline · gespeicherte Inhalte bleiben verfügbar. Karten benötigen
            Internet.
          </Text>
        </AdventurePanel>
      )}
      {Boolean(q.error) && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperBody}>{q.error}</Text>
          <AdventureButton
            label="Erneut versuchen"
            variant="paper"
            disabled={q.busy}
            onPress={() =>
              void (q.outbox.length ? q.sync() : q.refresh()).catch(
                () => undefined,
              )
            }
          />
        </AdventurePanel>
      )}
    </View>
  );
}
