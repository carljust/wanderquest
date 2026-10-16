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
  return (
    <AtlasImage
      source={artwork.fox}
      index={pose}
      style={{ width: size, height: size }}
      label="Wyldo mit grünem Schal, Rucksack und Kompass"
      contain
    />
  );
}
