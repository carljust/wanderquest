import { expect, test } from "@playwright/test";
import { mapHtml, mapPayload } from "../src/features/map/map-html";
import source from "../content/externsteine.v1.json";
import type { Quest } from "../src/domain/quest";
const tile = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
  "base64",
);
test("map tile failure has an actionable retry and recovers", async ({
  page,
}) => {
  let unavailable = true;
  await page.route("https://tile.openstreetmap.org/**", async (route) => {
    if (unavailable) await route.abort("internetdisconnected");
    else await route.fulfill({ contentType: "image/png", body: tile });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ohne Konto im Entwicklungsmodus testen" })
    .click();
  await page.goto("/map");
  await expect(
    page.getByText(/Kartenkacheln sind nicht erreichbar/),
  ).toBeVisible();
  await expect(page.locator(".leaflet-overlay-pane path")).toHaveCount(5);
  unavailable = false;
  await page.getByRole("button", { name: "Karte neu laden" }).click();
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible();
  await expect(
    page.getByText(/Kartenkacheln sind nicht erreichbar/),
  ).toHaveCount(0);
  await expect(page.getByText("Karte wird geladen …")).toHaveCount(0);
});
test("native HTML map loads bundled Leaflet, accepts data and rejects executable labels", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({ contentType: "image/png", body: tile }),
  );
  await page.addInitScript(() => {
    Object.assign(window, {
      bridgeMessages: [] as string[],
      ReactNativeWebView: {
        postMessage: (message: string) => {
          (
            window as unknown as { bridgeMessages: string[] }
          ).bridgeMessages.push(message);
        },
      },
    });
  });
  await page.goto("about:blank");
  await page.setContent(mapHtml());
  await expect
    .poll(() =>
      page.evaluate(() =>
        (window as unknown as { bridgeMessages: string[] }).bridgeMessages.some(
          (message) => JSON.parse(message).type === "tiles-ready",
        ),
      ),
    )
    .toBe(true);
  const data = mapPayload(null);
  expect(data.route).toEqual([]);
  expect(data.stations).toEqual([]);
  expect(data.references).toHaveLength(5);
  const unsafeName = '<img src=x onerror="window.injected=true">';
  const payload = {
    ...data,
    references: [{ ...data.references[0], name: unsafeName }],
  };
  await page.evaluate(
    (message) =>
      window.dispatchEvent(new MessageEvent("message", { data: message })),
    JSON.stringify(payload),
  );
  await expect(page.locator(".leaflet-overlay-pane path")).toHaveCount(1);
  await page.locator(".leaflet-overlay-pane path").hover();
  await expect(page.locator(".leaflet-tooltip")).toContainText(unsafeName);
  await expect(page.locator(".leaflet-tooltip img")).toHaveCount(0);
  expect(
    await page.evaluate(
      () => (window as unknown as { injected?: boolean }).injected,
    ),
  ).toBeUndefined();
  await expect(page.getByRole("link", { name: "OpenStreetMap" })).toBeVisible();
});

test("native map renders an approved synthetic target, track and moving position", async ({
  page,
}) => {
  await page.route("https://tile.openstreetmap.org/**", (route) =>
    route.fulfill({ contentType: "image/png", body: tile }),
  );
  await page.goto("about:blank");
  await page.setContent(mapHtml());
  const draft = source as Quest;
  // Renderer fixture only: these are not Externsteine station coordinates.
  const quest: Quest = {
    ...draft,
    fieldReady: true,
    approval: "approved",
    stations: draft.stations.map((station, index) => ({
      ...station,
      title: `Synthetische Teststation ${index + 1}`,
      coordinateStatus: "field_checked",
      point: { latitude: 0, longitude: index * 0.001 },
    })),
    route: [
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 0.001 },
    ],
  };
  const fix = {
    latitude: 0,
    longitude: 0,
    accuracy: 10,
    timestamp: Date.now(),
  };
  const data = mapPayload(quest, fix, quest.stations[2].id);
  const send = (payload: typeof data) =>
    page.evaluate(
      (message) =>
        window.dispatchEvent(new MessageEvent("message", { data: message })),
      JSON.stringify(payload),
    );
  await send(data);
  await expect(page.locator(".wyldo-quest-pin")).toHaveCount(8);
  const target = page.locator(
    '.wyldo-quest-pin[title="Dein Ziel · 3. Synthetische Teststation 3"]',
  );
  await expect(target.locator("text")).toHaveText("3");
  await expect(target.locator("path")).toHaveAttribute("fill", "#E5B94A");
  await expect(
    page.locator('.leaflet-overlay-pane path[stroke="#d2b278"]'),
  ).toHaveCount(1);
  const position = page.locator(
    '.leaflet-overlay-pane path[fill="#2a73c5"][fill-opacity="1"]',
  );
  const previous = await position.getAttribute("d");
  await send({ ...data, fix: { ...fix, longitude: 0.001 } });
  await expect(position).not.toHaveAttribute("d", previous!);
  await expect(page.locator(".wyldo-quest-pin")).toHaveCount(8);
  await expect(page.getByRole("link", { name: "OpenStreetMap" })).toBeVisible();
});
