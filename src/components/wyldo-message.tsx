import { type PropsWithChildren } from "react";
import { Text } from "react-native";
import type { CompanionState } from "@/domain/quest";
import { WyldoCompanion } from "@/features/companion/wyldo-companion";
import { AdventurePanel, gameStyles } from "./adventure-ui";

// Presentation only. Dialog sequencing and audio remain owned by their controllers.
export function WyldoMessage({
  children,
  reducedMotion,
  state = "idle",
}: PropsWithChildren<{
  reducedMotion: boolean;
  state?: CompanionState;
}>) {
  return (
    <AdventurePanel
      paper
      style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
    >
      <WyldoCompanion state={state} size={78} reducedMotion={reducedMotion} />
      <Text style={[gameStyles.paperBody, { flex: 1 }]}>{children}</Text>
    </AdventurePanel>
  );
}
