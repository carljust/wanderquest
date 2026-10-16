import { router } from "expo-router";
import { Text, View } from "react-native";
import { Button, Notice, Screen } from "@/components/ui";
import { QuestStatus } from "@/components/quest-ui";
import { QuestMap } from "@/features/map/quest-map";
import { useLocation } from "@/features/map/use-location";
import { useQuest } from "@/features/quest/provider";
import { layout } from "@/theme";
export default function MapScreen() {
  const q = useQuest();
  const gps = useLocation();
  return (
    <Screen>
      <Text style={layout.eyebrow}>DEIN WEG INS ABENTEUER</Text>
      <Text style={layout.title}>Draußen unterwegs.</Text>
      <QuestStatus />
      {q.quest ? (
        <>
          <QuestMap quest={q.quest} fix={gps.fix} />
          <Notice warning>
            {q.quest.routeStatus} Die Karte dient bis zur Freigabe nur der
            Orientierung. Es werden keine ungeprüften Stationspunkte oder
            Luftlinien als Wanderweg eingezeichnet.
          </Notice>
          <Text style={layout.body}>
            Karte: online erforderlich. Auf dem Smartphone gelten die
            Bedingungen von Apple Maps bzw. Google Maps; im Browser ©
            OpenStreetMap-Mitwirkende.
          </Text>
        </>
      ) : (
        <Notice>Es ist noch keine veröffentlichte Route verfügbar.</Notice>
      )}
      <Button
        label={
          gps.busy
            ? "Standort wird gesucht …"
            : gps.watching
              ? "Standort erneut bestimmen"
              : "Standort freigeben"
        }
        icon="locate-outline"
        disabled={gps.busy}
        onPress={() => void gps.enable()}
      />
      {Boolean(gps.error) && <Notice warning>{gps.error}</Notice>}
      {gps.fix && (
        <Notice warning={gps.stale}>
          GPS-Genauigkeit: ±{Math.round(gps.fix.accuracy)} m.{" "}
          {gps.stale
            ? "Signal veraltet – bitte erneut bestimmen."
            : "Einmal freigeschaltete Stationen bleiben zugänglich."}
        </Notice>
      )}
      <Text style={layout.heading}>Die acht Kapitel</Text>
      {q.quest?.stations.map((s) => (
        <View key={s.id} style={layout.card}>
          <Text style={layout.eyebrow}>
            STATION {s.order} ·{" "}
            {q.run?.completed.includes(s.id)
              ? "GESCHAFFT"
              : q.run?.unlocked.includes(s.id)
                ? "FREIGESCHALTET"
                : "NOCH OFFEN"}
          </Text>
          <Text style={layout.heading}>{s.title}</Text>
          <Text style={layout.body}>
            {s.point ? s.place : "Standort noch nicht geprüft"}
          </Text>
          {(q.run?.unlocked.includes(s.id) ||
            q.run?.completed.includes(s.id)) && (
            <Button
              label={`Station ${s.order} öffnen`}
              secondary
              onPress={() =>
                router.push({
                  pathname: "/quest/play",
                  params: { station: s.id },
                })
              }
            />
          )}
        </View>
      ))}
    </Screen>
  );
}
