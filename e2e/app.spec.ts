import { expect, test } from "@playwright/test";
import { dependencies } from "../package.json";

test("Android Expo Go manifest matches the project's SDK", async ({
  request,
}) => {
  const response = await request.get("/", {
    headers: {
      "expo-platform": "android",
      "expo-protocol-version": "0",
      accept: "application/expo+json",
    },
  });
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  const sdkMajor = dependencies.expo.match(/\d+/)?.[0];
  expect(sdkMajor).toBeDefined();
  expect(manifest.extra.expoClient.sdkVersion).toBe(`${sdkMajor}.0.0`);
  expect(manifest.launchAsset.contentType).toBe("application/javascript");
  expect(new URL(manifest.launchAsset.url).searchParams.get("platform")).toBe(
    "android",
  );
});

test("discover, search, bookmark, inspect and preview a mission", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await expect(page.getByText("Mach den Weg", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Missionen entdecken" }).click();
  await expect(page.getByText("Finde deine Mission.")).toBeVisible();
  await page.getByRole("button", { name: "Mittel", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Mission ansehen: Dem Morgen entgegen" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Mission ansehen: Das Flüstern am Spiegelsee",
    }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Alle", exact: true }).click();
  await page.getByLabel("Missionen suchen").fill("Spiegelsee");
  await page
    .getByRole("link", { name: "Mission ansehen: Das Flüstern am Spiegelsee" })
    .click();
  await expect(
    page.getByText("Eine kleine Geschichte für unterwegs"),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Mission merken", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Von Merkliste entfernen" }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("button", { name: "Von Merkliste entfernen" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Kartenvorschau öffnen" }).click();
  await expect(page.getByText("KARTENVORSCHAU · DEMO")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Das Flüstern am Spiegelsee",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Andere Mission wählen" }).click();
  await page.getByLabel("Missionen suchen").fill("");
  await page.getByRole("button", { name: "Gemerkt (1)", exact: true }).click();
  await expect(
    page.getByRole("link", {
      name: "Mission ansehen: Das Flüstern am Spiegelsee",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", {
      name: "Das Flüstern am Spiegelsee nicht mehr merken",
    })
    .click();
  await expect(page.getByText("Platz für neue Abenteuer")).toBeVisible();
  expect(errors).toEqual([]);
});

test("unknown missions and empty searches are recoverable", async ({
  page,
}) => {
  await page.goto("/mission/does-not-exist");
  await expect(page.getByText("Dieses Abenteuer fehlt.")).toBeVisible();
  await page.getByRole("button", { name: "Zu den Missionen" }).click();
  await page.getByLabel("Missionen suchen").fill("xyz-unbekannt");
  await expect(page.getByText("Noch kein passendes Abenteuer")).toBeVisible();
  await page.getByRole("button", { name: "Suche löschen" }).click();
  await expect(
    page.getByRole("link", { name: /Mission ansehen:/ }),
  ).toHaveCount(3);
});
