import { describe, expect, jest, test } from "@jest/globals";
import * as Location from "expo-location";
import { requestForegroundPosition } from "@/services/location";

jest.mock("expo-location", () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  hasServicesEnabledAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  Accuracy: { Balanced: 3 },
}));

describe("future location adapter", () => {
  test("does not access coordinates when permission is denied", async () => {
    jest.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      granted: false,
    } as Location.LocationPermissionResponse);
    expect(await requestForegroundPosition()).toEqual({ status: "denied" });
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  test("handles disabled location services", async () => {
    jest.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      granted: true,
    } as Location.LocationPermissionResponse);
    jest.mocked(Location.hasServicesEnabledAsync).mockResolvedValue(false);
    expect(await requestForegroundPosition()).toEqual({ status: "disabled" });
    expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
  });

  test("returns a foreground position only on explicit request", async () => {
    jest.mocked(Location.requestForegroundPermissionsAsync).mockResolvedValue({
      granted: true,
    } as Location.LocationPermissionResponse);
    jest.mocked(Location.hasServicesEnabledAsync).mockResolvedValue(true);
    jest.mocked(Location.getCurrentPositionAsync).mockResolvedValue({
      coords: { latitude: 48, longitude: 8 },
    } as Location.LocationObject);
    expect(await requestForegroundPosition()).toEqual({
      status: "granted",
      coordinate: { latitude: 48, longitude: 8 },
    });
  });
});
