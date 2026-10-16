import { expect, test, type Page } from "@playwright/test";
const directory =
  process.env.WYLDO_SCREENSHOT_DIR ?? "test-results/screenshots";
async function shot(page: Page, name: string) {
  await page.evaluate(() =>
    document.querySelectorAll("*").forEach((element) => {
      if (element.scrollTop) element.scrollTop = 0;
    }),
  );
  // Wait for RN onLayout and responsive state after scrolling or resizing.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  await page.screenshot({
    path: `${directory}/${name}.png`,
    animations: "disabled",
  });
}
async function practice(page: Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ohne Konto im Entwicklungsmodus testen" })
    .click();
  await expect(
    page.getByText("Hallo Abenteurer!", { exact: true }),
  ).toBeVisible();
}
test("discovery search, filters and bookmarks remain usable on a small screen", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await practice(page);
  await shot(page, "01-discover");
  await page
    .getByLabel("Quests suchen", { exact: true })
    .fill("Nicht vorhandene Quest");
  await expect(
    page.getByText("Keine passende Quest gefunden.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Suche und Filter zurücksetzen" })
    .click();
  await page
    .getByRole("button", { name: "Abenteuer entdecken", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Quest merken", exact: true })
    .last()
    .click();
  await expect(
    page.getByRole("button", { name: "Quest gemerkt", exact: true }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Quest gemerkt", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Dauer", { exact: true })).toBeVisible();
  await expect(page.getByText("Schwierigkeit", { exact: true })).toBeVisible();
  await expect(
    page.getByText("Rätsel: leicht bis mittel", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Noch zu vermessen", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Strecke: Route noch in Prüfung", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText("Noch keine Bewertungen", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("0 Bewertungen", { exact: true })).toBeVisible();
  await shot(page, "02-quest-details");
  await page.setViewportSize({ width: 320, height: 640 });
  await shot(page, "02-quest-details-small");
  await expect(
    page.getByRole("button", { name: "Zum Startpunkt navigieren" }),
  ).toBeInViewport();
  await page.setViewportSize({ width: 360, height: 800 });
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await page.getByRole("button", { name: "Questfilter öffnen" }).click();
  await page
    .getByRole("button", { name: "Nur gemerkte Quests", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Abenteuer entdecken", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Nur offline gespeicherte Quests" })
    .click();
  await expect(
    page.getByText("Keine passende Quest gefunden.", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Suche und Filter zurücksetzen" })
    .click();
  await page.setViewportSize({ width: 320, height: 640 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await shot(page, "01-discover-small");
});
test("direction and map switch, virtual distance and pause preserve the existing quest", async ({
  page,
}) => {
  const errors: string[] = [];
  await page.setViewportSize({ width: 390, height: 844 });
  page.on("pageerror", (error) => errors.push(error.message));
  await practice(page);
  await page
    .getByRole("button", { name: "Abenteuer entdecken", exact: true })
    .click();
  await page.getByRole("button", { name: "Zum Startpunkt navigieren" }).click();
  await expect(
    page.getByRole("tab", { name: "Richtung", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("420 m", { exact: true })).toBeVisible();
  await shot(page, "03-navigation-direction");
  await page.getByRole("tab", { name: "Karte", exact: true }).click();
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByText("Karte wird geladen …")).toHaveCount(0);
  await shot(page, "03-navigation-map");
  await page.getByRole("tab", { name: "Richtung", exact: true }).click();
  await expect(page.getByText("420 m", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Simulation anpassen" }).click();
  await page.getByRole("button", { name: "100 m näher simulieren" }).click();
  await expect(page.getByText("320 m", { exact: true })).toBeVisible();
  await page
    .getByRole("button", { name: "Gerät um 45° drehen (Simulation)" })
    .click();
  await expect(
    page.getByText("Virtuelle Geräteausrichtung: 45°", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Zielposition simulieren" }).click();
  await expect(page.getByText("0 m", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Quest pausieren" }).click();
  await page.reload();
  await page
    .getByRole("button", { name: "Abenteuer fortsetzen", exact: true })
    .click();
  await expect(page.getByText("420 m", { exact: true })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 640 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
  await shot(page, "03-navigation-small");
  await expect(page.getByText("420 m", { exact: true })).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Quest pausieren" }),
  ).toBeInViewport();
  await expect(
    page.getByRole("button", { name: "Kartenmodus" }),
  ).toBeInViewport();
  await page.getByRole("button", { name: "Zur Spielansicht" }).click();
  // Navigation preview must not solve or even silently unlock a story station.
  await expect(
    page.getByRole("button", { name: "Ankunft simulieren" }),
  ).toBeVisible();
  await expect(
    page.getByText("0 / 8 Stationen", { exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
