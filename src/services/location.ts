import * as Location from "expo-location";

// Not invoked on startup. A future map interaction must explicitly call this adapter.
export async function requestForegroundPosition() {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (!permission.granted) return { status: "denied" as const };
  if (!(await Location.hasServicesEnabledAsync()))
    return { status: "disabled" as const };
  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    status: "granted" as const,
    coordinate: {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    },
  };
}
