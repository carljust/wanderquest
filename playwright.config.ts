import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    ...devices["iPhone 13"],
    browserName: "chromium",
    baseURL: "http://127.0.0.1:8081",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx expo start --web --offline --port 8081 --max-workers 2",
    url: "http://127.0.0.1:8081",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: { CI: "1", EXPO_NO_TELEMETRY: "1" },
  },
});
