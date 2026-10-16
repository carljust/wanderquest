import { View, Text } from "react-native";
import Svg, { Circle, Path, Rect, Text as SvgText } from "react-native-svg";
import { colors } from "@/theme";
import type { Mission } from "@/features/missions/types";

// Schematic, deliberately not a geographic map. The native adapter is prepared separately.
export function MissionMap({ mission }: { mission: Mission }) {
  return (
    <View
      style={{ height: 260, borderRadius: 22, overflow: "hidden" }}
      accessibilityLabel={`Schematische Kartenvorschau für ${mission.title}`}
    >
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 400 260"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <Rect width="400" height="260" fill="#E2E9D8" />
        <Path
          d="M-20 80Q90-40 240 80T440 80M-30 110Q90-10 240 110T440 110M-30 140Q90 20 240 140T440 140M-30 170Q90 50 240 170T440 170M-30 200Q90 80 240 200T440 200M-30 230Q90 110 240 230T440 230"
          stroke="#C4D2B9"
          strokeWidth="1.5"
          fill="none"
        />
        <Path
          d="M300-20Q205 75 305 135T270 280"
          stroke="#AACEC8"
          strokeWidth="32"
          fill="none"
        />
        <Path
          d="M92 199Q104 115 187 132T285 62"
          stroke={colors.orange}
          strokeWidth="4"
          strokeDasharray="8 7"
          fill="none"
        />
        {mission.checkpoints.map((point, index) => {
          const [x, y] = [
            [92, 199],
            [187, 132],
            [285, 62],
          ][index % 3];
          return (
            <Svg key={point.id} x={x - 16} y={y - 16} width="32" height="32">
              <Circle
                cx="16"
                cy="16"
                r="15"
                fill={colors.forest}
                stroke="white"
                strokeWidth="2"
              />
              <SvgText
                x="16"
                y="21"
                textAnchor="middle"
                fill="white"
                fontSize="14"
                fontWeight="bold"
              >
                {index + 1}
              </SvgText>
            </Svg>
          );
        })}
      </Svg>
      <Text
        style={{
          position: "absolute",
          left: 16,
          top: 16,
          backgroundColor: colors.background,
          color: colors.forest,
          padding: 9,
          borderRadius: 10,
          fontWeight: "700",
          fontSize: 11,
        }}
      >
        KARTENVORSCHAU · DEMO
      </Text>
    </View>
  );
}
