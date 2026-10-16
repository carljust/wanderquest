import { expect, test, type Page } from "@playwright/test";
import { dependencies } from "../package.json";
import answers from "../content/solutions.private.json";
import quest from "../content/externsteine.v1.json";
const screenshotDirectory =
  process.env.WYLDO_SCREENSHOT_DIR ?? "test-results/screenshots";
async function capture(page: Page, name: string, focus?: string) {
  // Native-style screens scroll in a nested ScrollView, not the document.
  await page.evaluate(() => {
    document.querySelectorAll("*").forEach((element) => {
      if (element.scrollTop) element.scrollTop = 0;
    });
  });
  if (focus)
    await page
      .getByText(focus, { exact: true })
      .evaluate((element) => element.scrollIntoView({ block: "start" }));
  await page.screenshot({
    path: `${screenshotDirectory}/${name}.png`,
    animations: "disabled",
  });
}

test("Android Expo Go manifest targets SDK 57", async ({ request }) => {
  const response = await request.get("/", {
    headers: {
      "expo-platform": "android",
      "expo-protocol-version": "0",
      accept: "application/expo+json",
    },
  });
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.extra.expoClient.sdkVersion).toBe(
    `${dependencies.expo.match(/\d+/)?.[0]}.0.0`,
  );
  expect(new URL(manifest.launchAsset.url).searchParams.get("platform")).toBe(
    "android",
  );
});

test("eight-station practice quest, hints, persistence, mute, finish and profile", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (
      m.type() === "error" &&
      !/Failed to load resource|net::ERR_/.test(m.text())
    )
      errors.push(m.text());
  });
  await page.goto("/");
  await expect(page.getByText("Willkommen draußen.")).toBeVisible();
  await capture(page, "login");
  await page
    .getByRole("button", { name: "Ohne Konto im Entwicklungsmodus testen" })
    .click();
  await expect(
    page.getByText("Entdecke. Erlebe. Beschütze.", { exact: false }),
  ).toBeVisible();
  await capture(page, "home");
  await page
    .getByRole("button", { name: "Abenteuer entdecken", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Quest-Inhalte herunterladen", exact: true })
    .click();
  await expect(
    page
      .getByText(/Questtexte und Bilder sind offline verfügbar/)
      .filter({ visible: true }),
  ).toBeVisible();
  await capture(page, "details");
  await page.getByRole("button", { name: "Zum Startpunkt navigieren" }).click();
  await page.getByRole("button", { name: "Zur Spielansicht" }).click();
  for (const station of quest.stations) {
    await expect(
      page.getByText(station.title, { exact: true }).filter({ visible: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Ankunft simulieren" }).click();
    await expect(
      page.getByRole("button", { name: "Dialog überspringen · zur Aufgabe" }),
    ).toBeVisible();
    if (station.order === 1) await capture(page, "dialogue");
    await page
      .getByRole("button", { name: "Dialog überspringen · zur Aufgabe" })
      .click();
    if (station.order === 1) {
      await page.getByRole("button", { name: "Hinweis 1 anzeigen" }).click();
      await page.getByRole("button", { name: "Hinweis 2 anzeigen" }).click();
      await page.getByLabel("Deine Antwort", { exact: true }).fill("falsch");
      await page.getByRole("button", { name: "Antwort prüfen" }).click();
      await page
        .getByRole("button", { name: "Dialog überspringen · zur Aufgabe" })
        .click();
      await expect(
        page.getByText(station.failure, { exact: true }),
      ).toBeVisible();
    }
    const solution = (answers as Record<string, string[]>)[station.id][0];
    if (station.puzzle.kind === "choice")
      await page
        .getByRole("button", {
          name: station.puzzle.options!.find((o) => o.id === solution)!.label,
          exact: true,
        })
        .click();
    else if (station.puzzle.kind === "order")
      for (const id of solution.split(","))
        await page
          .getByRole("button", {
            name: station.puzzle.options!.find((o) => o.id === id)!.label,
            exact: true,
          })
          .click();
    else await page.getByLabel("Deine Antwort", { exact: true }).fill(solution);
    if (station.order === 4) {
      await page.setViewportSize({ width: 320, height: 640 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBeTruthy();
      await capture(page, "small-quest", "Deine Aufgabe");
      await page.setViewportSize({ width: 390, height: 844 });
      await capture(page, "puzzle", "Deine Aufgabe");
    }
    await page.getByRole("button", { name: "Antwort prüfen" }).click();
    await expect(page.getByText("Gut gemacht.", { exact: true })).toBeVisible();
    await page
      .getByRole("button", { name: "Dialog überspringen · zur Aufgabe" })
      .click();
    if (station.order === 3) {
      await page.reload();
      // Development mode is restored independently of Supabase authentication.
      if (
        await page
          .getByRole("button", {
            name: "Ohne Konto im Entwicklungsmodus testen",
          })
          .isVisible()
      )
        await page
          .getByRole("button", {
            name: "Ohne Konto im Entwicklungsmodus testen",
          })
          .click();
      await page.goto("/quest/play");
      await expect(
        page.getByText("Das Geheimnis des Wassers", { exact: true }),
      ).toBeVisible();
    } else if (station.order < 8)
      await page.getByRole("button", { name: "Zur nächsten Station" }).click();
  }
  await page.getByRole("button", { name: "Zum Kristallfinale" }).click();
  await page.getByRole("button", { name: "Abenteuer abschließen" }).click();
  await expect(page.getByText("Ein Schatz, der bleibt.")).toBeVisible();
  await expect(
    page.getByText("Vorschau im Übungslauf · kein reguläres Abzeichen."),
  ).toBeVisible();
  await capture(page, "finish");
  await page.getByRole("button", { name: "Zum Profil", exact: true }).click();
  await page.getByRole("button", { name: "Fortschritt ansehen" }).click();
  await expect(
    page.getByText("Dein Fortschritt", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Station 8:.*geschafft/ }),
  ).toBeEnabled();
  await capture(page, "progress");
  await page.getByRole("button", { name: "Zurück", exact: true }).click();
  await page.getByRole("switch", { name: "Bewegung reduzieren" }).click();
  await expect(
    page.getByRole("switch", { name: "Bewegung reduzieren" }),
  ).toBeChecked();
  await capture(page, "profile");
  await page.goto("/map");
  await expect(page.getByText("Draußen unterwegs.")).toBeVisible();
  await expect(page.locator(".leaflet-tile-loaded").first()).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByText("Karte wird geladen …")).toHaveCount(0);
  await page.waitForFunction(() =>
    [...document.querySelectorAll<HTMLImageElement>(".leaflet-tile")].every(
      (image) => image.complete && image.naturalWidth > 0,
    ),
  );
  await capture(page, "map");
  expect(errors).toEqual([]);
});

test("small screen forms, validation and protected route", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/quest/play");
  await expect(page.getByText("Willkommen draußen.")).toBeVisible();
  await page
    .getByRole("button", { name: "Neues Konto erstellen", exact: true })
    .click();
  await page.getByLabel("E-Mail-Adresse", { exact: true }).fill("ungueltig");
  await page
    .getByRole("button", { name: "Konto erstellen", exact: true })
    .click();
  await expect(
    page.getByText("Gib eine gültige E-Mail-Adresse ein."),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBeTruthy();
  await capture(page, "small-register");
  await page
    .getByRole("button", { name: "Zur Anmeldung", exact: true })
    .click();
  await page.getByRole("button", { name: "Passwort vergessen?" }).click();
  await expect(
    page.getByRole("button", { name: "Link anfordern", exact: true }),
  ).toBeVisible();
});

test("downloaded practice content plays offline and survives reconnect and reload", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Ohne Konto im Entwicklungsmodus testen" })
    .click();
  await page
    .getByRole("button", { name: "Abenteuer entdecken", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Quest-Inhalte herunterladen", exact: true })
    .click();
  await page.getByRole("button", { name: "Zum Startpunkt navigieren" }).click();
  await page.getByRole("button", { name: "Zur Spielansicht" }).click();
  await context.setOffline(true);
  await expect(
    page.getByText(/Offline · Antworten werden/).filter({ visible: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ankunft simulieren" }).click();
  await page
    .getByRole("button", { name: "Dialog überspringen · zur Aufgabe" })
    .click();
  await page.getByLabel("Deine Antwort", { exact: true }).fill("karte");
  await page.getByRole("button", { name: "Antwort prüfen" }).click();
  await expect(page.getByText("Gut gemacht.", { exact: true })).toBeVisible();
  await context.setOffline(false);
  await page.reload();
  await expect(
    page.getByText("Das erste Steinsiegel", { exact: true }),
  ).toBeVisible();
});
