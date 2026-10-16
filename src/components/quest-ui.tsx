import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { artwork, AtlasImage, Scene } from "./artwork";
import { Button, Icon, Notice } from "./ui";
import { useQuest } from "@/features/quest/provider";
import { useAuth } from "@/features/auth/provider";
import { resolveAsset } from "@/features/offline/assets";
import { colors, layout } from "@/theme";

export function QuestStatus({ quiet = false }: { quiet?: boolean }) {
  const q = useQuest();
  const auth = useAuth();
  return (
    <View style={{ gap: 10 }}>
      {auth.practice && (
        <View style={styles.practice}>
          <Icon name="flask-outline" size={17} />
          <Text style={styles.tag}>
            ENTWICKLUNGSMODUS · keine regulären Abzeichen
          </Text>
        </View>
      )}
      {!q.online && (
        <Notice warning>
          Offline · Antworten werden bis zur Prüfung vorgemerkt. Karten
          benötigen Internet.
        </Notice>
      )}
      {Boolean(q.error) && (
        <>
          <Notice warning>{q.error}</Notice>
          <Button
            label="Erneut versuchen"
            secondary
            disabled={q.busy}
            onPress={() =>
              void (q.outbox.length ? q.sync() : q.refresh()).catch(
                () => undefined,
              )
            }
          />
        </>
      )}
      {!quiet && Boolean(q.notice) && <Notice>{q.notice}</Notice>}
    </View>
  );
}
export function QuestCover({
  assetId,
  compact = false,
}: {
  assetId?: string;
  compact?: boolean;
}) {
  const q = useQuest();
  const [uri, setUri] = useState<{ source: string; uri: string }>();
  const original = assetId
    ? q.assetUris[assetId] || q.quest?.assets.find((a) => a.id === assetId)?.url
    : null;
  useEffect(() => {
    let alive = true;
    let resolved: string | undefined;
    if (original)
      void resolveAsset(original)
        .then((value) => {
          resolved = value;
          if (alive) setUri({ source: original, uri: value });
        })
        .catch(() => undefined);
    return () => {
      alive = false;
      if (resolved?.startsWith("blob:")) URL.revokeObjectURL(resolved);
    };
  }, [original]);
  return (
    <View style={[styles.cover, { minHeight: compact ? 120 : 230 }]}>
      {uri && uri.source === original ? (
        <Image
          source={{ uri: uri.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessibilityLabel="Quest-Illustration"
        />
      ) : (
        <Scene
          panel={
            assetId === "station-4"
              ? 1
              : assetId === "station-5"
                ? 2
                : assetId === "station-8"
                  ? 3
                  : 0
          }
        />
      )}
    </View>
  );
}
export function ProgressStrip() {
  const { run } = useQuest();
  return (
    <View style={layout.card}>
      <View style={[layout.row, { justifyContent: "space-between" }]}>
        <Text style={layout.eyebrow}>DEIN ABENTEUER</Text>
        <Text style={{ color: colors.forest, fontWeight: "700" }}>
          {run?.completed.length ?? 0} / 8 Stationen
        </Text>
      </View>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 8, now: run?.completed.length ?? 0 }}
        style={styles.track}
      >
        <View
          style={[
            styles.fill,
            { width: `${((run?.completed.length ?? 0) / 8) * 100}%` },
          ]}
        />
      </View>
      <View style={{ flexDirection: "row", gap: 4 }}>
        {["Mut", "Neugier", "Zuhören", "Gemeinschaft"].map((seal, index) => (
          <View
            key={seal}
            accessibilityLabel={`Steinsiegel ${seal} · ${run?.seals.includes(seal) ? "gesammelt" : "noch offen"}`}
            style={{ flex: 1, alignItems: "center", gap: 4 }}
          >
            <AtlasImage
              source={artwork.seals}
              index={index}
              contain
              style={{
                width: "100%",
                maxWidth: 68,
                aspectRatio: 1,
                opacity: run?.seals.includes(seal) ? 1 : 0.28,
              }}
            />
            <Text
              style={{
                fontSize: 10,
                color: colors.forest,
                textAlign: "center",
              }}
            >
              {seal}
            </Text>
            <Icon
              name={
                run?.seals.includes(seal)
                  ? "checkmark-circle"
                  : "ellipse-outline"
              }
              size={13}
            />
          </View>
        ))}
      </View>
      {Boolean(run?.pending.length) && (
        <Text style={layout.body}>
          {run?.pending.length} Antwort(en) warten auf Serverprüfung.
        </Text>
      )}
    </View>
  );
}
export const styles = StyleSheet.create({
  practice: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: colors.sand,
    padding: 12,
    borderRadius: 12,
  },
  tag: {
    flex: 1,
    fontSize: 10,
    lineHeight: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    color: colors.forest,
  },
  cover: {
    borderRadius: 24,
    backgroundColor: colors.forest,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    padding: 20,
  },
  circle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: "#426454",
    right: -50,
    top: -70,
  },
  coverText: {
    color: "#EFE4CC",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
  },
  coverCaption: { color: "#B5C4B5", fontSize: 10 },
  track: {
    height: 5,
    backgroundColor: colors.line,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: 5, backgroundColor: colors.forest },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    color: colors.ink,
    backgroundColor: colors.surface,
    minHeight: 54,
  },
  label: { fontSize: 13, fontWeight: "700", color: colors.forest },
});
