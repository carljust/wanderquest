import type { ImageSourcePropType } from "react-native";
export type LayerRig = {
  body: ImageSourcePropType;
  head: ImageSourcePropType;
  eyesOpen: ImageSourcePropType;
  eyesClosed: ImageSourcePropType;
  mouthRest: ImageSourcePropType;
  mouthTalk: ImageSourcePropType;
};
// Insert ONLY the approved Wyldo artwork. Every transparent layer must share
// the same canvas; head contains no eyes/mouth, body contains no second head.
// A flat PNG may use portrait, with whole-image motion only.
export const companionAssets: {
  portrait: ImageSourcePropType | null;
  rig: LayerRig | null;
  supportsWave: boolean;
} = {
  portrait: null,
  rig: null,
  supportsWave: false,
};
