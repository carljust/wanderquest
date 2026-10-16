import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Button, Notice } from "@/components/ui";
import "leaflet/dist/leaflet.css";
import "./quest-map.css";
import { mapPayload, type QuestMapProps } from "./map-model";
import { questPinSvg } from "./quest-pin";

// Native resolves quest-map.native. No tile download or speculative route.
export function QuestMap(props: QuestMapProps) {
  const [attempt, setAttempt] = useState(0);
  return (
    <View style={{ gap: 12 }}>
      <WebMap key={attempt} {...props} />
      <Button
        label="Karte neu laden"
        secondary
        icon="refresh-outline"
        onPress={() => setAttempt((value) => value + 1)}
      />
    </View>
  );
}
function WebMap({ quest, fix, targetStationId }: QuestMapProps) {
  const container = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<import("leaflet").Map | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    let instance: import("leaflet").Map | undefined;
    const timeout = setTimeout(() => {
      if (alive) {
        setLoading(false);
        setError(
          "Die Grundkarte ist nicht erreichbar. Prüfe deine Verbindung. Gespeicherte Questtexte und GPS bleiben verfügbar.",
        );
      }
    }, 8000);
    void import("leaflet")
      .then((L) => {
        if (!alive || !container.current) return;
        instance = L.map(container.current).setView([51.869, 8.917], 15); // Regional orientation only, not a station.
        const tiles = L.tileLayer(
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
          },
        );
        tiles.on("tileerror", () => {
          if (alive) {
            setLoading(false);
            setError(
              "Kartenkacheln sind nicht erreichbar. Stationstexte und GPS funktionieren mit heruntergeladenen Questdaten weiter.",
            );
          }
        });
        tiles.on("load", () => {
          clearTimeout(timeout);
          if (alive) setLoading(false);
        });
        tiles.addTo(instance);
        const data = mapPayload(quest, undefined, targetStationId);
        for (const point of data.references) {
          const label = document.createElement("span");
          label.textContent =
            point.name + " · OSM-Orientierungspunkt, keine Queststation";
          L.circleMarker([point.point.latitude, point.point.longitude], {
            radius: 7,
            color: "#456341",
            fillColor: "#eeeadd",
            fillOpacity: 1,
          })
            .addTo(instance)
            .bindTooltip(label);
        }
        for (const station of data.stations) {
          const label = document.createElement("span");
          const selected = station.id === data.target?.id;
          label.textContent = `${selected ? "Dein Ziel · " : ""}${station.order}. ${station.title}`;
          L.marker([station.point.latitude, station.point.longitude], {
            icon: L.divIcon({
              html: questPinSvg(station.order, selected),
              className: "wyldo-quest-pin",
              iconSize: [44, 52],
              iconAnchor: [22, 50],
            }),
            title: label.textContent,
          })
            .addTo(instance)
            .bindTooltip(label);
        }
        if (data.route.length > 1)
          L.polyline(
            data.route.map((p) => [p.latitude, p.longitude]),
            { color: "#D2B278", weight: 5 },
          ).addTo(instance);
        if (data.target)
          instance.panTo([
            data.target.point.latitude,
            data.target.point.longitude,
          ]);
        setMap(instance);
      })
      .catch(() => {
        clearTimeout(timeout);
        if (alive) {
          setLoading(false);
          setError(
            "Die Karte konnte nicht geladen werden. Lade die Ansicht erneut.",
          );
        }
      });
    return () => {
      alive = false;
      clearTimeout(timeout);
      instance?.remove();
      setMap(null);
    };
  }, [quest, targetStationId]);
  useEffect(() => {
    const position = mapPayload(null, fix).fix;
    if (!map || !position) return;
    let alive = true;
    let circle: import("leaflet").Circle | undefined;
    let marker: import("leaflet").CircleMarker | undefined;
    void import("leaflet").then((L) => {
      if (alive) {
        circle = L.circle([position.latitude, position.longitude], {
          radius: Math.min(1000, position.accuracy),
          color: "#2A6DD5",
          weight: 1,
        }).addTo(map);
        marker = L.circleMarker([position.latitude, position.longitude], {
          radius: 7,
          color: "#FFFFFF",
          weight: 3,
          fillColor: "#2A6DD5",
          fillOpacity: 1,
        })
          .addTo(map)
          .bindTooltip("Dein Standort");
      }
    });
    return () => {
      alive = false;
      circle?.remove();
      marker?.remove();
    };
  }, [map, fix]);
  return (
    <View style={{ gap: 12 }}>
      <View
        style={{
          height: 340,
          borderRadius: 20,
          overflow: "hidden",
          backgroundColor: "#DBE8D7",
        }}
      >
        <div
          ref={container}
          style={{ width: "100%", height: "100%" }}
          aria-label="Interaktive Karte der Externsteine"
        />
      </View>
      {loading && <Notice>Karte wird geladen …</Notice>}
      {Boolean(error) && <Notice warning>{error}</Notice>}
    </View>
  );
}
