import { useState } from "react";
import {
  Image,
  type ImageSourcePropType,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
export const artwork = {
  scenes:
    require("../../assets/design/quest-scenes.png") as ImageSourcePropType,
  fox: require("../../assets/design/wyldo-poses.png") as ImageSourcePropType,
  seals: require("../../assets/design/stone-seals.png") as ImageSourcePropType,
  forest:
    require("../../assets/design/adventure-forest.png") as ImageSourcePropType,
  game: require("../../assets/design/game-atlas.png") as ImageSourcePropType,
  foxOriginal:
    require("../../assets/design/wyldo-original-poses.png") as ImageSourcePropType,
};
// Render a cell of the supplied/prepared atlas without changing the original file.
export function AtlasImage({
  source,
  index,
  style,
  label,
  contain = false,
}: {
  source: ImageSourcePropType;
  index: number;
  style?: StyleProp<ViewStyle>;
  label?: string;
  contain?: boolean;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const side = contain
    ? Math.min(size.width, size.height)
    : Math.max(size.width, size.height);
  return (
    <View
      accessibilityLabel={label}
      style={[{ overflow: "hidden" }, style]}
      onLayout={(e) => setSize(e.nativeEvent.layout)}
    >
      {side > 0 && (
        <Image
          source={source}
          resizeMode="stretch"
          style={{
            position: "absolute",
            width: side * 2,
            height: side * 2,
            left: -(index % 2) * side + (size.width - side) / 2,
            top: -Math.floor(index / 2) * side + (size.height - side) / 2,
          }}
        />
      )}
    </View>
  );
}
export function Scene({
  panel = 0,
  style,
}: {
  panel?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <AtlasImage
      source={artwork.scenes}
      index={panel}
      style={[StyleSheet.absoluteFill, style]}
      label="Abenteuerillustration"
    />
  );
}
export function FoxPose({
  pose = 0,
  size = 180,
}: {
  pose?: number;
  size?: number;
}) {
  // Midpoints of transparent gaps in the supplied 2048×682 master sheet.
  // Each viewport clips one whole pose; the original pixels stay untouched.
  const bounds = [
    [0, 486],
    [486, 538],
    [1024, 518],
    [1542, 506],
  ][Math.max(0, Math.min(3, pose))];
  const scale = Math.min(size / bounds[1], size / 682);
  return (
    <View
      accessibilityLabel="Wyldo mit grünem Schal, Rucksack und Kompass"
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View
        style={{
          width: bounds[1] * scale,
          height: 682 * scale,
          overflow: "hidden",
        }}
      >
        <Image
          source={artwork.foxOriginal}
          resizeMode="stretch"
          style={{
            position: "absolute",
            width: 2048 * scale,
            height: 682 * scale,
            left: -bounds[0] * scale,
            top: 0,
          }}
        />
      </View>
    </View>
  );
}
