import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import type { Quest, Fix } from "@/domain/quest";
import { Notice } from "@/components/ui";
import "leaflet/dist/leaflet.css";
import "./quest-map.css";

// Native resolves quest-map.native. No tile download or speculative route.
export function QuestMap({ quest, fix }: { quest: Quest; fix?: Fix }) {
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
        for (const station of quest.stations) {
          if (station.point && station.coordinateStatus !== "unverified") {
            const label = document.createElement("span");
            label.textContent = `${station.order}. ${station.title}`;
            L.circleMarker([station.point.latitude, station.point.longitude], {
              radius: 9,
              color: "#183D32",
            })
              .addTo(instance)
              .bindTooltip(label);
          }
        }
        if (quest.route.length > 1)
          L.polyline(
            quest.route.map((p) => [p.latitude, p.longitude]),
            { color: "#CB542C", weight: 4 },
          ).addTo(instance);
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
  }, [quest]);
  useEffect(() => {
    if (!map || !fix) return;
    let alive = true;
    let circle: import("leaflet").Circle | undefined;
    void import("leaflet").then((L) => {
      if (alive && Number.isFinite(fix.accuracy))
        circle = L.circle([fix.latitude, fix.longitude], {
          radius: fix.accuracy,
          color: "#2A6DD5",
        })
          .addTo(map)
          .bindTooltip("Dein Standort");
    });
    return () => {
      alive = false;
      circle?.remove();
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
