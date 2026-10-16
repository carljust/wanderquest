import { expect, test } from "@playwright/test";
import { dependencies } from "../package.json";
import answers from "../content/solutions.private.json";
import quest from "../content/externsteine.v1.json";
const screenshotDirectory =
  process.env.WYLDO_SCREENSHOT_DIR ?? "test-results/screenshots";

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
  await page.screenshot({
    path: `${screenshotDirectory}/login.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Ohne Konto im Entwicklungsmodus testen" })
    .click();
  await expect(page.getByText("Geh los.")).toBeVisible();
  await page.screenshot({
    path: `${screenshotDirectory}/home.png`,
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Abenteuer entdecken", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Quest-Inhalte herunterladen", exact: true })
    .click();
  await expect(
    page
      .getByText(/Vorhandene Texte und Medien gespeichert/)
      .filter({ visible: true }),
  ).toBeVisible();
  await page.screenshot({
    path: `${screenshotDirectory}/details.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Übungsabenteuer starten" }).click();
  for (const station of quest.stations) {
    await expect(page.getByText(station.title, { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Ankunft simulieren" }).click();
    await expect(
      page.getByRole("button", { name: "Dialog überspringen · zur Aufgabe" }),
    ).toBeVisible();
    if (station.order === 1)
      await page.screenshot({
        path: `${screenshotDirectory}/dialogue.png`,
        fullPage: true,
      });
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
    if (station.order === 4)
      await page.screenshot({
        path: `${screenshotDirectory}/puzzle.png`,
        fullPage: true,
      });
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
        page.getByText("Runas leise Botschaft", { exact: true }),
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
  await page.screenshot({
    path: `${screenshotDirectory}/finish.png`,
    fullPage: true,
  });
  await page.getByRole("button", { name: "Zum Profil", exact: true }).click();
  await page.getByRole("switch", { name: "Bewegung reduzieren" }).click();
  await expect(
    page.getByRole("switch", { name: "Bewegung reduzieren" }),
  ).toBeChecked();
  await page.screenshot({
    path: `${screenshotDirectory}/profile.png`,
    fullPage: true,
  });
  await page.goto("/map");
  await expect(page.getByText("Draußen unterwegs.")).toBeVisible();
  await page.screenshot({
    path: `${screenshotDirectory}/map.png`,
    fullPage: true,
  });
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
  await page.screenshot({
    path: `${screenshotDirectory}/small-register.png`,
    fullPage: true,
  });
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
  await page.getByRole("button", { name: "Übungsabenteuer starten" }).click();
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
    page.getByText("Das Siegel des Mutes", { exact: true }),
  ).toBeVisible();
});
