import { Redirect } from "expo-router";
// Preserve old bookmarked URLs during the Wyldo migration.
export default function LegacyMission() {
  return <Redirect href="/quest/details" />;
}
