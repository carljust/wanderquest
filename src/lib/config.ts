export const config = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? "",
  supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  developmentMode:
    __DEV__ && process.env.EXPO_PUBLIC_ENABLE_DEV_MODE !== "false",
};
export const backendConfigured =
  /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(config.supabaseUrl) &&
  Boolean(config.supabaseKey);
