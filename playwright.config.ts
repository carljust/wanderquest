import { defineConfig, devices } from "@playwright/test";

// Browsers do not inherit the cloud's HTTPS proxy automatically. TLS validation
// stays enabled; no proxy credentials are written to disk or test output.
const proxyAddress = process.env.HTTPS_PROXY ?? process.env.https_proxy;
const proxyUrl = proxyAddress ? new URL(proxyAddress) : undefined;
const proxy = proxyUrl
  ? {
      server: proxyUrl.origin,
      bypass: "127.0.0.1,localhost",
      ...(proxyUrl.username
        ? {
            username: decodeURIComponent(proxyUrl.username),
            password: decodeURIComponent(proxyUrl.password),
          }
        : {}),
    }
  : undefined;
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    ...devices["iPhone 13"],
    browserName: "chromium",
    baseURL: "http://127.0.0.1:8081",
    launchOptions: {
      ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
        ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
        : {}),
      ...(proxy ? { proxy } : {}),
    },
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
