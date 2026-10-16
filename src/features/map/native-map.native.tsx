import MapView, { Marker, Polyline } from "react-native-maps";
import type { Mission } from "@/features/missions/types";
import { colors } from "@/theme";

// Future native map adapter. Not mounted by the demo screens: no real routes yet.
// Expo Go supplies the native module; standalone Android builds need a Maps key.
export function NativeMissionMap({ mission }: { mission: Mission }) {
  const first = mission.checkpoints[0];
  if (!first) return null;
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        ...first.coordinate,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
    >
      <Polyline
        coordinates={mission.checkpoints.map((point) => point.coordinate)}
        strokeColor={colors.orange}
        strokeWidth={4}
      />
      {mission.checkpoints.map((point) => (
        <Marker
          key={point.id}
          coordinate={point.coordinate}
          title={point.title}
          description="Synthetischer Beispielpunkt"
        />
      ))}
    </MapView>
  );
}
