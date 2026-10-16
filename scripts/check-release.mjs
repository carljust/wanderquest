import { readFileSync, readdirSync } from "node:fs";
import assert from "node:assert/strict";
const directory = "dist/web/_expo/static/js/web";
const bundles = readdirSync(directory)
  .filter((f) => f.endsWith(".js"))
  .map((f) => readFileSync(directory + "/" + f, "utf8"))
  .join("\n");
for (const marker of [
  "gemeinsam,kommen,wir,weiter",
  "Wyldo zieht vorsichtig",
  "e3000000-0000-4000-8000-000000000001",
])
  assert.ok(
    !bundles.includes(marker),
    "Development quest or answers leaked into release Web bundle: " + marker,
  );
console.log(
  "PASS: development quest and answer fixture absent from production Web JavaScript.",
);
