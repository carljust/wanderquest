import MapView, { Circle, Marker, Polyline } from "react-native-maps";
import type { Quest, Fix } from "@/domain/quest";
export function QuestMap({ quest, fix }: { quest: Quest; fix?: Fix }) {
  return (
    <MapView
      style={{ height: 340, borderRadius: 20 }}
      initialRegion={{
        latitude: 51.869,
        longitude: 8.917,
        latitudeDelta: 0.012,
        longitudeDelta: 0.012,
      }}
    >
      {quest.stations
        .filter((s) => s.point && s.coordinateStatus !== "unverified")
        .map((s) => (
          <Marker
            key={s.id}
            coordinate={s.point!}
            title={`${s.order}. ${s.title}`}
          />
        ))}
      {quest.route.length > 1 && (
        <Polyline
          coordinates={quest.route}
          strokeColor="#CB542C"
          strokeWidth={4}
        />
      )}
      {fix && (
        <>
          <Marker coordinate={fix} title="Dein Standort" pinColor="#2A6DD5" />
          <Circle
            center={fix}
            radius={fix.accuracy}
            fillColor="#2A6DD522"
            strokeColor="#2A6DD5"
          />
        </>
      )}
    </MapView>
  );
}
