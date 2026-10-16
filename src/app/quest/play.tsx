import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { Button, Notice, Screen } from "@/components/ui";
import {
  ProgressStrip,
  QuestCover,
  QuestStatus,
  styles,
} from "@/components/quest-ui";
import { activeStation } from "@/domain/engine";
import { useQuest } from "@/features/quest/provider";
import { useDialogue } from "@/features/dialogue/use-dialogue";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { useLocation } from "@/features/map/use-location";
import { layout } from "@/theme";
export default function Play() {
  const q = useQuest();
  const gps = useLocation();
  const { station: requested } = useLocalSearchParams<{ station?: string }>();
  const [selected, setSelected] = useState<string>();
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [reaction, setReaction] = useState<
    "correct" | "incorrect" | "pending"
  >();
  const d = useDialogue(q.preferences.muted);
  const current = q.quest && q.run ? activeStation(q.quest, q.run) : undefined;
  const station =
    q.quest?.stations.find((s) => s.id === (selected ?? requested)) ??
    current ??
    q.quest?.stations.at(-1);
  const unlocked = Boolean(station && q.run?.unlocked.includes(station.id));
  const completed = Boolean(station && q.run?.completed.includes(station.id));
  const pending = Boolean(station && q.run?.pending.includes(station.id));
  if (!q.quest || !q.run || !station)
    return (
      <Screen withHeader>
        <Text style={layout.heading}>Dein Abenteuer wartet.</Text>
        <Button
          label="Zu den Quest-Details"
          onPress={() => router.replace("/quest/details")}
        />
      </Screen>
    );
  const puzzle = station.puzzle;
  const success = reaction === "correct" || completed;
  const next = q.quest.stations.find(
    (s) => !q.run!.completed.includes(s.id) && !q.run!.pending.includes(s.id),
  );
  async function submit() {
    if (!station) return;
    try {
      setSelected(station.id);
      const { status: result, feedback } = await q.answer(
        station,
        puzzle.kind === "order" ? order.join(",") : answer,
      );
      setSelected(station.id);
      setReaction(result);
      d.react(
        result === "correct"
          ? "celebrate"
          : result === "incorrect"
            ? "think"
            : "idle",
      );
      if (result !== "pending")
        void d.play({
          speaker: "Wyldo",
          text: feedback,
          mood: result === "correct" ? "celebrate" : "think",
        });
    } catch {
      /* central error with retry */
    }
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Screen withHeader>
        <QuestStatus />
        <ProgressStrip />
        <Text style={layout.eyebrow}>KAPITEL {station.order} VON 8</Text>
        <Text style={layout.title}>{station.title}</Text>
        {!unlocked ? (
          <>
            <QuestCover assetId={station.imageAsset} compact />
            <Text style={layout.body}>
              {q.run.mode === "practice"
                ? "Im Entwicklungsmodus erreichst du den nächsten Ort mit einem Fingertipp."
                : "Erreiche den geprüften Stationsort auf dem freigegebenen Weg."}
            </Text>
            {q.run.mode === "field" && (
              <>
                <Button
                  label="GPS aktivieren"
                  secondary
                  onPress={() => void gps.enable()}
                />
                {Boolean(gps.error) && <Notice warning>{gps.error}</Notice>}
                {gps.fix && (
                  <Text style={layout.body}>
                    GPS ±{Math.round(gps.fix.accuracy)} m
                  </Text>
                )}
              </>
            )}
            <Button
              label={
                q.run.mode === "practice"
                  ? "Ankunft simulieren"
                  : "Station freischalten"
              }
              disabled={q.busy}
              onPress={() =>
                void q
                  .open(station, gps.fix)
                  .then(() => d.play(station.dialogues[0]))
                  .catch(() => undefined)
              }
            />
          </>
        ) : (
          <>
            <View style={layout.card}>
              <WyldoCompanion
                state={d.state}
                mouthPulse={d.mouthPulse}
                reducedMotion={q.preferences.reducedMotion}
              />
              <Text style={layout.eyebrow}>
                {d.dialogue?.speaker ?? station.dialogues[0].speaker}
              </Text>
              <Text style={layout.body}>
                {d.dialogue?.text ?? station.intro}
              </Text>
              {Boolean(d.audioError) && <Notice warning>{d.audioError}</Notice>}
              <Button
                label={
                  q.preferences.muted ? "Ton einschalten" : "Stummschalten"
                }
                secondary
                icon={
                  q.preferences.muted
                    ? "volume-mute-outline"
                    : "volume-high-outline"
                }
                onPress={() =>
                  void q
                    .setPreferences({
                      ...q.preferences,
                      muted: !q.preferences.muted,
                    })
                    .catch(() => undefined)
                }
              />
              {d.dialogue ? (
                <Button
                  label="Dialog überspringen · zur Aufgabe"
                  secondary
                  onPress={d.skip}
                />
              ) : (
                <Button
                  label="Dialog wiederholen"
                  secondary
                  icon="refresh-outline"
                  onPress={() =>
                    void d.play(
                      station.dialogues[0],
                      station.dialogues[0].audioAsset
                        ? (q.assetUris[station.dialogues[0].audioAsset] ??
                            q.quest?.assets.find(
                              (a) => a.id === station.dialogues[0].audioAsset,
                            )?.url ??
                            undefined)
                        : undefined,
                    )
                  }
                />
              )}
            </View>
            {!d.dialogue && !success && !pending && (
              <View style={layout.card}>
                <Text style={layout.heading}>Deine Aufgabe</Text>
                <Text style={layout.body}>{puzzle.prompt}</Text>
                {puzzle.transcript && (
                  <>
                    <Notice>{puzzle.transcript}</Notice>
                    <Button
                      label="Botschaft vorlesen"
                      secondary
                      icon="volume-high-outline"
                      disabled={q.preferences.muted}
                      onPress={() =>
                        void d.play({
                          speaker: "Runa",
                          text: puzzle.transcript!,
                          mood: "talk",
                        })
                      }
                    />
                    {q.preferences.muted && (
                      <Text style={layout.body}>
                        Zum Vorlesen den Ton einschalten. Lesen zählt genauso.
                      </Text>
                    )}
                  </>
                )}
                {puzzle.kind === "choice" ? (
                  puzzle.options?.map((option) => (
                    <Button
                      key={option.id}
                      label={option.label}
                      secondary={answer !== option.id}
                      icon={
                        answer === option.id
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      onPress={() => setAnswer(option.id)}
                    />
                  ))
                ) : puzzle.kind === "order" ? (
                  <>
                    <Text style={layout.body}>
                      Deine Reihenfolge:{" "}
                      {order
                        .map(
                          (id) =>
                            puzzle.options?.find((o) => o.id === id)?.label,
                        )
                        .join(" → ") || "Noch keine Wörter gewählt"}
                    </Text>
                    {puzzle.options?.map((option) => (
                      <Button
                        key={option.id}
                        label={option.label}
                        secondary
                        disabled={order.includes(option.id)}
                        onPress={() => setOrder([...order, option.id])}
                      />
                    ))}
                    <Button
                      label="Reihenfolge löschen"
                      secondary
                      icon="refresh-outline"
                      onPress={() => setOrder([])}
                    />
                  </>
                ) : (
                  <TextInput
                    style={styles.input}
                    accessibilityLabel="Deine Antwort"
                    placeholder={
                      puzzle.kind === "code"
                        ? "Vierstelliger Code"
                        : "Deine Antwort"
                    }
                    value={answer}
                    onChangeText={setAnswer}
                    keyboardType={
                      puzzle.kind === "code" ? "number-pad" : "default"
                    }
                    autoCorrect={false}
                    maxLength={150}
                    onSubmitEditing={() => void submit()}
                  />
                )}
                <Button
                  label="Antwort prüfen"
                  disabled={
                    q.busy ||
                    (puzzle.kind === "order"
                      ? order.length !== puzzle.options?.length
                      : !answer.trim())
                  }
                  onPress={() => void submit()}
                />
                <Button
                  label={`Hinweis ${Math.min((q.run.hints[station.id] ?? 0) + 1, puzzle.hints.length)} anzeigen`}
                  secondary
                  icon="bulb-outline"
                  disabled={
                    q.busy ||
                    (q.run.hints[station.id] ?? 0) >= puzzle.hints.length
                  }
                  onPress={() =>
                    void q
                      .hint(station)
                      .then(() => d.react("think"))
                      .catch(() => undefined)
                  }
                />
                {puzzle.hints
                  .slice(0, q.run.hints[station.id] ?? 0)
                  .map((hint, i) => (
                    <Notice key={hint}>
                      Hinweis {i + 1}: {hint}
                    </Notice>
                  ))}
                {reaction === "incorrect" && (
                  <Notice warning>{station.failure}</Notice>
                )}
              </View>
            )}
            {(success || pending || reaction === "pending") && (
              <View style={layout.card}>
                <Text style={layout.heading}>
                  {success ? "Gut gemacht." : "Antwort vorgemerkt."}
                </Text>
                <Text style={layout.body}>
                  {success
                    ? station.success
                    : "Die Lösung wird nach erneuter Verbindung geprüft. Weitere Schritte sind bis dahin vorläufig; reguläre Siegel und Abzeichen bleiben ausstehend."}
                </Text>
                {success && <Text style={layout.body}>{station.bridge}</Text>}
                {next ? (
                  <Button
                    label="Zur nächsten Station"
                    disabled={q.busy}
                    onPress={() => {
                      d.skip();
                      setAnswer("");
                      setOrder([]);
                      setReaction(undefined);
                      setSelected(next.id);
                      router.setParams({ station: undefined });
                    }}
                  />
                ) : (
                  <Button
                    label="Zum Kristallfinale"
                    onPress={() => {
                      d.skip();
                      router.push("/quest/finish");
                    }}
                  />
                )}
              </View>
            )}
          </>
        )}
        <Button
          label="Zur Karte"
          secondary
          icon="map-outline"
          onPress={() => {
            d.skip();
            router.push("/map");
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
