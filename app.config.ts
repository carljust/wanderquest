import type { ConfigContext, ExpoConfig } from "expo/config";
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Wyldo",
  slug: "wyldo",
  android: {
    ...config.android,
    ...(process.env.GOOGLE_MAPS_ANDROID_API_KEY
      ? {
          config: {
            ...config.android?.config,
            googleMaps: { apiKey: process.env.GOOGLE_MAPS_ANDROID_API_KEY },
          },
        }
      : {}),
  },
});
