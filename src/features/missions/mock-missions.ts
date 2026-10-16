import type { Mission } from "./types";

// All names, stories and coordinates describe synthetic demo adventures, not hiking routes.
export const mockMissions: readonly Mission[] = [
  {
    id: "kiefernlicht",
    title: "Das Geheimnis des Kiefernwalds",
    subtitle: "Folge den Spuren zwischen den Bäumen.",
    region: "Waldtal · Beispielregion",
    description:
      "Ein alter Wegweiser, ein leises Rascheln und ein Licht zwischen den Kiefern: In dieser erfundenen Geschichte entdeckst du den Wald mit neuen Augen. Drei kleine Entdeckungen warten entlang des Beispielpfads auf dich.",
    difficulty: "Leicht",
    distanceKm: 3.4,
    durationMinutes: 65,
    elevationMeters: 85,
    artwork: "forest",
    highlights: ["Wald entdecken", "Für Einsteiger", "3 Entdeckerpunkte"],
    checkpoints: [
      {
        id: "tor",
        title: "Das grüne Tor",
        hint: "Hier beginnt deine Geschichte unter den Kiefern.",
        coordinate: { latitude: 48.123, longitude: 8.123 },
      },
      {
        id: "lichtung",
        title: "Die stille Lichtung",
        hint: "Ein guter Moment, um die Umgebung bewusst wahrzunehmen.",
        coordinate: { latitude: 48.128, longitude: 8.129 },
      },
      {
        id: "wegweiser",
        title: "Der alte Wegweiser",
        hint: "Das letzte Kapitel dieses Beispielabenteuers.",
        coordinate: { latitude: 48.131, longitude: 8.121 },
      },
    ],
  },
  {
    id: "spiegelsee",
    title: "Das Flüstern am Spiegelsee",
    subtitle: "Ein kleiner Ausflug. Viele neue Perspektiven.",
    region: "Seedorf · Beispielregion",
    description:
      "Am erfundenen Spiegelsee erzählt jede Spiegelung eine andere Geschichte. Erkunde in dieser Demo die Uferlandschaft und finde drei Orte zum Innehalten.",
    difficulty: "Leicht",
    distanceKm: 2.6,
    durationMinutes: 45,
    elevationMeters: 25,
    artwork: "lake",
    highlights: ["Am Wasser", "Kleine Auszeit", "3 Entdeckerpunkte"],
    checkpoints: [
      {
        id: "steg",
        title: "Der kleine Steg",
        hint: "Ein Blick über das stille Wasser.",
        coordinate: { latitude: 48.223, longitude: 8.223 },
      },
      {
        id: "schilf",
        title: "Das Schilffenster",
        hint: "Entdecke eine neue Perspektive auf den See.",
        coordinate: { latitude: 48.226, longitude: 8.229 },
      },
      {
        id: "ufer",
        title: "Der Uferstein",
        hint: "Zeit für den letzten Blick zurück.",
        coordinate: { latitude: 48.23, longitude: 8.225 },
      },
    ],
  },
  {
    id: "morgenhoehe",
    title: "Dem Morgen entgegen",
    subtitle: "Neue Aussichten hinter der nächsten Kurve.",
    region: "Morgenhöhe · Beispielregion",
    description:
      "Diese synthetische Höhenmission führt gedanklich über sanfte Hügel zu einer weiten Aussicht. Sie bietet die Grundlage für eine spätere Geschichte mit mehr Höhenmetern.",
    difficulty: "Mittel",
    distanceKm: 6.2,
    durationMinutes: 130,
    elevationMeters: 310,
    artwork: "summit",
    highlights: ["Weite Aussicht", "Höhenmeter sammeln", "3 Entdeckerpunkte"],
    checkpoints: [
      {
        id: "anstieg",
        title: "Der erste Anstieg",
        hint: "Schritt für Schritt in Richtung Horizont.",
        coordinate: { latitude: 48.323, longitude: 8.323 },
      },
      {
        id: "kamm",
        title: "Auf dem Hügelkamm",
        hint: "Die Landschaft öffnet sich.",
        coordinate: { latitude: 48.33, longitude: 8.33 },
      },
      {
        id: "aussicht",
        title: "Der weite Blick",
        hint: "Das Ziel dieser erfundenen Höhenrunde.",
        coordinate: { latitude: 48.335, longitude: 8.325 },
      },
    ],
  },
];
