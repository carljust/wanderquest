import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DiscoveryAction,
  discovery,
  discoverStyles,
} from "@/components/discovery-ui";
import { Icon } from "@/components/ui";
import {
  defaultDiscoveryFilters,
  type DiscoveryFacet,
  type DiscoveryFilters,
} from "./model";

const sections: {
  key: DiscoveryFacet;
  title: string;
  choices: { label: string; value: number | null }[];
}[] = [
  {
    key: "age",
    title: "Alter des jüngsten Kindes",
    choices: [
      { label: "Alle Altersgruppen", value: null },
      { label: "6 Jahre", value: 6 },
      { label: "8 Jahre", value: 8 },
      { label: "10 Jahre", value: 10 },
      { label: "12 Jahre und älter", value: 12 },
    ],
  },
  {
    key: "minutes",
    title: "Dauer",
    choices: [
      { label: "Beliebige Dauer", value: null },
      { label: "Bis 60 Minuten", value: 60 },
      { label: "Bis 90 Minuten", value: 90 },
      { label: "Bis 120 Minuten", value: 120 },
    ],
  },
  {
    key: "kilometers",
    title: "Distanz",
    choices: [
      { label: "Beliebige Distanz", value: null },
      { label: "Bis 2 Kilometer", value: 2 },
      { label: "Bis 4 Kilometer", value: 4 },
      { label: "Bis 6 Kilometer", value: 6 },
    ],
  },
];
function Option({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected }}
      aria-pressed={selected}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 46,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: selected ? discovery.green : discovery.border,
        backgroundColor: selected ? "#E8EFDA" : discovery.paper,
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        padding: 12,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Icon
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={21}
        color={discovery.green}
      />
      <Text style={[discoverStyles.body, { flex: 1 }]}>{label}</Text>
    </Pressable>
  );
}
export function DiscoveryFilterSheet({
  value,
  facet,
  difficulty,
  onChange,
  onClose,
}: {
  value: DiscoveryFilters;
  facet: DiscoveryFacet | "all";
  difficulty?: string;
  onChange: (value: DiscoveryFilters) => void;
  onClose: () => void;
}) {
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#10291E77",
          justifyContent: "flex-end",
        }}
      >
        <SafeAreaView
          edges={["bottom", "left", "right"]}
          style={{
            backgroundColor: discovery.background,
            maxHeight: "88%",
            width: "100%",
            maxWidth: 760,
            alignSelf: "center",
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 18,
              gap: 12,
            }}
          >
            <Text style={[discoverStyles.title, { flex: 1 }]}>
              Dein Abenteuer finden
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Filter schließen"
              onPress={onClose}
              style={{
                width: 44,
                height: 44,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon name="close" color={discovery.green} />
            </Pressable>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingHorizontal: 18,
              paddingBottom: 18,
              gap: 12,
            }}
          >
            {sections
              .filter((section) => facet === "all" || facet === section.key)
              .map((section) => (
                <View key={section.key} style={{ gap: 7 }}>
                  <Text
                    style={[
                      discoverStyles.body,
                      { fontFamily: "NunitoSans_700Bold" },
                    ]}
                  >
                    {section.title}
                  </Text>
                  {section.choices.map((choice) => (
                    <Option
                      key={choice.label}
                      label={choice.label}
                      selected={value[section.key] === choice.value}
                      onPress={() =>
                        onChange({ ...value, [section.key]: choice.value })
                      }
                    />
                  ))}
                </View>
              ))}
            {(facet === "all" || facet === "difficulty") && (
              <View style={{ gap: 7 }}>
                <Text
                  style={[
                    discoverStyles.body,
                    { fontFamily: "NunitoSans_700Bold" },
                  ]}
                >
                  Schwierigkeit
                </Text>
                <Option
                  label="Alle Schwierigkeitsgrade"
                  selected={value.difficulty === null}
                  onPress={() => onChange({ ...value, difficulty: null })}
                />
                {difficulty && (
                  <Option
                    label={difficulty}
                    selected={value.difficulty === difficulty}
                    onPress={() => onChange({ ...value, difficulty })}
                  />
                )}
              </View>
            )}
            <Text style={discoverStyles.caption}>
              Für die Externsteine-Quest sind Altersangabe, Dauer und Strecke
              noch offen. Solche Quests erscheinen nur ohne entsprechende
              Einschränkung.
            </Text>
            <Option
              label="Nur gemerkte Quests"
              selected={value.savedOnly}
              onPress={() =>
                onChange({ ...value, savedOnly: !value.savedOnly })
              }
            />
            <Option
              label="Nur offline gespeicherte Quests"
              selected={value.offlineOnly}
              onPress={() =>
                onChange({ ...value, offlineOnly: !value.offlineOnly })
              }
            />
            <DiscoveryAction
              label="Alle Filter zurücksetzen"
              secondary
              icon="refresh"
              onPress={() => onChange({ ...defaultDiscoveryFilters })}
            />
          </ScrollView>
          <View style={{ padding: 18, paddingTop: 10 }}>
            <DiscoveryAction
              label="Filter anwenden"
              icon="checkmark"
              onPress={onClose}
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
