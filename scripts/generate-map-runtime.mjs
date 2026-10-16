import { readFileSync, writeFileSync } from "node:fs";
import { format } from "prettier";
const { version } = JSON.parse(
  readFileSync("node_modules/leaflet/package.json", "utf8"),
);
const js = readFileSync(
  "node_modules/leaflet/dist/leaflet.js",
  "utf8",
).replaceAll("</script", "<\\/script");
const css = readFileSync(
  "node_modules/leaflet/dist/leaflet.css",
  "utf8",
).replace(/url\(images\/[^)]+\)/g, "none");
writeFileSync(
  "src/features/map/leaflet-runtime.generated.ts",
  await format(
    "// Generated from Leaflet " +
      version +
      "; BSD-2-Clause, see assets/licenses/leaflet.txt.\n// npm run map:generate regenerates this native-only, CDN-free runtime.\nexport const leafletJavaScript = " +
      JSON.stringify(js) +
      ";\nexport const leafletStyle = " +
      JSON.stringify(css) +
      ";\n",
    { parser: "typescript" },
  ),
);
