import { Text, View } from "react-native";
import type { Quest } from "@/domain/quest";
import { AdventurePanel, adventure, gameStyles } from "./adventure-ui";
import { Icon, type IconName } from "./ui";

const number = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const countFormat = new Intl.NumberFormat("de-DE");

export function QuestRating({ summary }: { summary?: Quest["ratingSummary"] }) {
  const count = summary?.count;
  const average = summary?.average;
  const empty = count === 0 && average === null;
  const rated =
    typeof count === "number" &&
    Number.isSafeInteger(count) &&
    count > 0 &&
    typeof average === "number" &&
    Number.isFinite(average) &&
    average >= 1 &&
    average <= 5;
  const display = rated ? number.format(average) : "—";
  const stars = rated ? Math.round(average * 2) / 2 : 0;
  const countLabel =
    rated || empty
      ? `${countFormat.format(count!)} ${count === 1 ? "Bewertung" : "Bewertungen"}`
      : "Bewertungen noch nicht verfügbar";
  return (
    <View
      style={{ gap: 5 }}
      accessibilityRole="text"
      accessibilityLabel={
        rated
          ? `${display} von 5 Sternen aus ${countLabel}`
          : empty
            ? "Noch keine Bewertungen, 0 Bewertungen"
            : countLabel
      }
    >
      <Text style={[gameStyles.body, { fontSize: 13 }]}>Bewertungen</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <View
          style={{ flexDirection: "row", gap: 3 }}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          aria-hidden
        >
          {Array.from({ length: 5 }, (_, index) => (
            <Icon
              key={index}
              name={
                stars >= index + 1
                  ? "star"
                  : stars >= index + 0.5
                    ? "star-half"
                    : "star-outline"
              }
              color={adventure.gold}
              size={22}
            />
          ))}
        </View>
        <Text
          style={{
            color: adventure.gold,
            fontSize: 21,
            fontFamily: "NunitoSans_700Bold",
          }}
        >
          {display} / 5
        </Text>
      </View>
      <Text style={[gameStyles.body, { fontSize: 13, lineHeight: 18 }]}>
        {countLabel}
      </Text>
      {empty && (
        <Text style={[gameStyles.body, { fontSize: 13, lineHeight: 18 }]}>
          Noch keine Bewertungen
        </Text>
      )}
    </View>
  );
}

export function QuestOverview({ quest }: { quest: Quest }) {
  const facts: { label: string; value: string; icon: IconName }[] = [
    { label: "Dauer", value: quest.duration, icon: "time-outline" },
    {
      label: "Schwierigkeit",
      value: quest.difficulty,
      icon: "cellular-outline",
    },
  ];
  return (
    <AdventurePanel style={{ padding: 12, gap: 12 }}>
      <View style={{ flexDirection: "row", gap: 12 }}>
        {facts.map(({ label, value, icon }) => (
          <View key={label} style={{ flex: 1, minWidth: 0, gap: 5 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <Icon name={icon} color={adventure.gold} size={18} />
              <Text style={[gameStyles.body, { fontSize: 13 }]}>{label}</Text>
            </View>
            <Text
              style={[
                gameStyles.body,
                { fontFamily: "NunitoSans_700Bold", lineHeight: 21 },
              ]}
            >
              {value}
            </Text>
          </View>
        ))}
      </View>
      <Text style={[gameStyles.body, { fontSize: 13, lineHeight: 18 }]}>
        Strecke: {quest.distance}
      </Text>
      {!quest.fieldReady && (
        <Text style={[gameStyles.body, { fontSize: 12, lineHeight: 17 }]}>
          Outdoor-Dauer und Strecke sind noch nicht bestätigt. Die Schwierigkeit
          beschreibt die Rätsel.
        </Text>
      )}
      <View
        style={{ height: 1, backgroundColor: adventure.goldEdge, opacity: 0.6 }}
      />
      <QuestRating summary={quest.ratingSummary} />
    </AdventurePanel>
  );
}
