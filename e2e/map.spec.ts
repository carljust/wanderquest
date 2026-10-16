import { expect, test } from "@playwright/test";
import { mapHtml, mapPayload } from "../src/features/map/map-html";
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
