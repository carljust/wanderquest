import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";
import {
  AdventureButton,
  AdventurePanel,
  AdventureScreen,
  adventure,
  gameStyles,
} from "@/components/adventure-ui";
import {
  DirectionCompass,
  JourneyHeader,
  NavigationModeSwitch,
  type NavigationMode,
} from "@/components/journey-ui";
import { WyldoMessage } from "@/components/wyldo-message";
import { useQuest } from "@/features/quest/provider";
import { useLocation } from "@/features/map/use-location";
import { useHeading } from "@/features/map/use-heading";
import { QuestMap } from "@/features/map/quest-map";
import { activeStation } from "@/domain/engine";
import {
  navigationReading,
  simulationFix,
  simulationTarget,
  verifiedTarget,
} from "@/domain/navigation";
export default function Navigate() {
  const q = useQuest();
  const params = useLocalSearchParams<{ mode?: string }>();
  const [mode, setMode] = useState<NavigationMode>(
    params.mode === "map" ? "map" : "direction",
  );
  const [simDistance, setSimDistance] = useState(420);
  const [simHeading, setSimHeading] = useState(0);
  const [controls, setControls] = useState(false);
  const [tip, setTip] = useState(false);
  const { width, height } = useWindowDimensions();
  const compact = height < 700;
  const station =
    q.quest && q.run ? activeStation(q.quest, q.run) : q.quest?.stations[0];
  const practice = q.run?.mode === "practice";
  const gps = useLocation(!practice);
  const compass = useHeading(!practice && gps.watching && mode === "direction");
  const target = practice ? simulationTarget : verifiedTarget(q.quest, station);
  const reading = navigationReading(
    target,
    practice ? simulationFix(simDistance) : gps.fix,
    station?.radius,
  );
  const unlocked = Boolean(station && q.run?.unlocked.includes(station.id));
  if (!q.quest || !q.run)
    return (
      <AdventureScreen>
        <AdventurePanel paper>
          <Text style={gameStyles.paperTitle}>
            Wähle zuerst dein Abenteuer.
          </Text>
          <AdventureButton
            label="Zu den Quest-Details"
            onPress={() => router.replace("/quest/details")}
          />
        </AdventurePanel>
      </AdventureScreen>
    );
  if (!station)
    return (
      <AdventureScreen>
        <AdventurePanel paper>
          <Text style={gameStyles.paperTitle}>
            Alle Kapitel sind geschafft!
          </Text>
          <AdventureButton
            label="Zum Kristallfinale"
            onPress={() => router.replace("/quest/finish")}
          />
        </AdventurePanel>
      </AdventureScreen>
    );
  const distanceDisplay = (
    <View style={{ alignItems: "center", gap: 3 }}>
      <Text
        style={{
          color: adventure.gold,
          fontSize: 46,
          lineHeight: 55,
          fontWeight: "800",
        }}
      >
        {reading.distance === undefined
          ? "—"
          : `${Math.round(reading.distance)} m`}
      </Text>
      <Text style={gameStyles.body}>
        {practice
          ? "Simulierte Entfernung"
          : "Luftlinie zum Ziel · keine Abbiegehinweise"}
      </Text>
      {mode === "direction" && (
        <Text style={{ color: adventure.cream, fontSize: 12 }}>
          {practice
            ? `Virtuelle Geräteausrichtung: ${simHeading}°`
            : compass.northUp
              ? "Norden oben · kein verlässlicher Gerätekompass"
              : "Pfeil relativ zu deiner Geräteausrichtung"}
        </Text>
      )}
    </View>
  );
  return (
    <AdventureScreen
      footer={
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1 }}>
            <AdventureButton
              label={mode === "map" ? "Richtungsmodus" : "Kartenmodus"}
              shortLabel={
                width < 480
                  ? mode === "map"
                    ? "Richtung"
                    : "Karte"
                  : undefined
              }
              variant="glass"
              compact={width < 480}
              icon={mode === "map" ? "navigate" : "map-outline"}
              onPress={() => setMode(mode === "map" ? "direction" : "map")}
            />
          </View>
          <View style={{ flex: 1 }}>
            <AdventureButton
              label="Quest pausieren"
              variant="rust"
              compact={width < 480}
              icon="pause"
              onPress={() => {
                gps.disable();
                router.replace("/");
              }}
            />
          </View>
        </View>
      }
    >
      <JourneyHeader
        title={q.quest.title}
        compact={compact}
        station={station.order}
        step={unlocked ? 1 : 0}
      />
      <NavigationModeSwitch mode={mode} onChange={setMode} />
      {practice && (
        <Text style={[gameStyles.label, { textAlign: "center" }]}>
          GPS-SIMULATION · Ziel und Entfernung sind virtuell
        </Text>
      )}
      {practice && mode === "map" && (
        <Text style={[gameStyles.body, { fontSize: 12, lineHeight: 17 }]}>
          Reale Orientierungskarte. Das virtuelle Simulationsziel wird hier
          nicht eingezeichnet; die Questroute ist noch nicht freigegeben.
        </Text>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Text
          style={[
            gameStyles.heading,
            { textAlign: "center", fontSize: 20, flex: 1 },
          ]}
        >
          {station.order === 1 ? "Zum Startpunkt" : station.title}
        </Text>
        {mode === "map" && (
          <Text
            style={[
              gameStyles.heading,
              { color: adventure.gold, fontSize: 23 },
            ]}
          >
            {reading.distance === undefined
              ? "—"
              : `${Math.round(reading.distance)} m`}
          </Text>
        )}
      </View>
      {mode === "map" && (
        <Text style={[gameStyles.body, { fontSize: 12, textAlign: "center" }]}>
          {practice
            ? "Virtuelle Entfernung · keine reale Wegstrecke"
            : "Luftlinie zum Ziel · auf den Wegen bleiben"}
        </Text>
      )}
      {compact && mode === "direction" && distanceDisplay}
      {mode === "map" ? (
        <QuestMap
          quest={q.quest}
          fix={practice ? undefined : gps.fix}
          targetStationId={practice ? undefined : station.id}
        />
      ) : (
        <DirectionCompass
          bearing={reading.bearing}
          heading={practice ? simHeading : compass.heading}
          arrived={reading.state === "arrived"}
          reducedMotion={q.preferences.reducedMotion}
          size={Math.min(240, width - 60, Math.max(180, height * 0.29))}
        />
      )}
      {!compact && mode === "direction" && distanceDisplay}
      {Boolean(gps.error || compass.error || q.error) && (
        <AdventurePanel paper>
          <Text style={gameStyles.paperBody}>
            {gps.error || compass.error || q.error}
          </Text>
        </AdventurePanel>
      )}
      <AdventurePanel style={{ padding: 12 }}>
        <Text style={gameStyles.body}>
          {unlocked ? "Station freigeschaltet." : reading.message}
        </Text>
        <Text style={[gameStyles.body, { fontSize: 13 }]}>
          Die Peilung ist kein Wanderweg. Bleibe auf freigegebenen Wegen.
        </Text>
      </AdventurePanel>
      <AdventureButton
        label={tip ? "Wyldos Tipp schließen" : "Wyldos Tipp"}
        variant="glass"
        onPress={() => setTip(!tip)}
      />
      {tip && (
        <WyldoMessage reducedMotion={q.preferences.reducedMotion}>
          {unlocked
            ? "Diese Station bleibt freigeschaltet. Öffne ihre Aufgabe, wenn du bereit bist."
            : reading.state === "arrived"
              ? "Zielradius erkannt! Öffne die Spielansicht, um die Station freizuschalten. Es wird keine Aufgabe automatisch gelöst."
              : reading.message}
        </WyldoMessage>
      )}
      {practice ? (
        <>
          <AdventureButton
            label={controls ? "Simulation verbergen" : "Simulation anpassen"}
            variant="glass"
            icon="flask-outline"
            onPress={() => setControls(!controls)}
          />
          {controls && (
            <AdventurePanel>
              <AdventureButton
                label="100 m näher simulieren"
                variant="gold"
                onPress={() =>
                  setSimDistance((distance) => Math.max(0, distance - 100))
                }
              />
              <AdventureButton
                label="Gerät um 45° drehen (Simulation)"
                variant="glass"
                onPress={() => setSimHeading((value) => (value + 45) % 360)}
              />
              <AdventureButton
                label="Zielposition simulieren"
                icon="location"
                onPress={() => setSimDistance(0)}
              />
            </AdventurePanel>
          )}
        </>
      ) : (
        <AdventureButton
          label={gps.busy ? "Standort wird gesucht …" : "Standort freigeben"}
          icon="locate"
          disabled={gps.busy || !target}
          onPress={() => void gps.enable()}
        />
      )}
      {gps.fix && !practice && (
        <Text style={gameStyles.body}>
          GPS ±
          {Number.isFinite(gps.fix.accuracy)
            ? Math.round(gps.fix.accuracy)
            : "?"}{" "}
          m{gps.stale ? " · veraltet" : ""}
        </Text>
      )}
      <AdventureButton
        label="Zur Spielansicht"
        disabled={q.busy}
        onPress={() => router.push("/quest/play")}
      />
    </AdventureScreen>
  );
}
