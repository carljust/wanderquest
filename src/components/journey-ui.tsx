import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient as SurfaceGradient } from "expo-linear-gradient";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import {
  AdventurePanel,
  BackWoodButton,
  adventure,
  gameStyles,
  TopQuest,
} from "./adventure-ui";
import { Scene } from "./artwork";
import { Icon, type IconName } from "./ui";
import { relativeBearing, unwrapRotation } from "@/domain/navigation";
export type NavigationMode = "map" | "direction";
export function NavigationModeSwitch({
  mode,
  onChange,
}: {
  mode: NavigationMode;
  onChange: (mode: NavigationMode) => void;
}) {
  return (
    <View
      accessibilityRole="tablist"
      style={{
        flexDirection: "row",
        padding: 4,
        borderRadius: 32,
        borderWidth: 1.5,
        borderColor: adventure.goldEdge,
        backgroundColor: "#21332CCC",
      }}
    >
      {(
        [
          { value: "map", label: "Karte", icon: "map-outline" },
          { value: "direction", label: "Richtung", icon: "navigate" },
        ] as const
      ).map((item) => (
        <Pressable
          key={item.value}
          accessibilityRole="tab"
          accessibilityLabel={item.label}
          accessibilityState={{ selected: mode === item.value }}
          aria-selected={mode === item.value}
          onPress={() => onChange(item.value)}
          style={{ flex: 1 }}
        >
          <SurfaceGradient
            colors={
              mode === item.value
                ? ["#FFF2CA", "#EDC667"]
                : ["#263D3400", "#263D3400"]
            }
            style={{
              minHeight: 50,
              borderRadius: 28,
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={item.icon}
              size={22}
              color={mode === item.value ? adventure.ink : adventure.cream}
            />
            <Text
              style={{
                fontSize: 18,
                fontFamily: "NunitoSans_700Bold",
                color: mode === item.value ? adventure.ink : adventure.cream,
              }}
            >
              {item.label}
            </Text>
          </SurfaceGradient>
        </Pressable>
      ))}
    </View>
  );
}
export function JourneyHeader({
  title,
  step = 0,
  station = 1,
  compact = false,
}: {
  title: string;
  step?: number;
  station?: number;
  compact?: boolean;
}) {
  const steps: { icon: IconName; label: string }[] = [
    {
      icon: "location",
      label: station === 1 ? "Startpunkt erreichen" : "Station erreichen",
    },
    { icon: "search", label: "Hinweise finden" },
    { icon: "diamond-outline", label: "Rätsel lösen" },
    { icon: "briefcase", label: "Schatz entdecken" },
  ];
  return (
    <AdventurePanel style={{ padding: 10, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <BackWoodButton />
        <View
          style={{
            width: 40,
            height: 52,
            borderRadius: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: adventure.gold,
          }}
        >
          <Scene />
        </View>
        <View style={{ flex: 1, gap: 5 }}>
          {!compact && <TopQuest />}
          <Text
            numberOfLines={2}
            style={[gameStyles.heading, { fontSize: 18, lineHeight: 22 }]}
          >
            {title}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            position: "absolute",
            top: 14,
            left: 25,
            right: 25,
            height: 2,
            backgroundColor: "#9B916E",
          }}
        />
        {steps.map((item, index) => (
          <View
            key={item.label}
            style={{ flex: 1, alignItems: "center", gap: 6 }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 20,
                backgroundColor: index === step ? "#735821" : "#19342E",
                borderWidth: 2,
                borderColor: index <= step ? adventure.gold : "#AFA68B",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                name={index < step ? "checkmark" : item.icon}
                size={16}
                color={index <= step ? adventure.gold : adventure.cream}
              />
            </View>
            <Text
              style={{
                color: index === step ? adventure.gold : adventure.cream,
                fontSize: 10,
                textAlign: "center",
                lineHeight: 13,
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </AdventurePanel>
  );
}
export function DirectionCompass({
  bearing,
  heading = 0,
  size = 280,
  reducedMotion = false,
  arrived = false,
}: {
  bearing?: number;
  heading?: number;
  size?: number;
  reducedMotion?: boolean;
  arrived?: boolean;
}) {
  const [rotation] = useState(() => new Animated.Value(0));
  const previous = useRef(0);
  useEffect(() => {
    const next = bearing === undefined ? 0 : relativeBearing(bearing, heading);
    previous.current = unwrapRotation(previous.current, next);
    if (reducedMotion) rotation.setValue(previous.current);
    else
      Animated.timing(rotation, {
        toValue: previous.current,
        duration: 220,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    return () => rotation.stopAnimation();
  }, [bearing, heading, reducedMotion, rotation]);
  return (
    <View
      accessibilityLabel={
        arrived
          ? "Zielradius erreicht"
          : bearing === undefined
            ? "Kompass: keine gültige Peilung"
            : `Zielpeilung ${Math.round(bearing)} Grad`
      }
      style={{ width: size, height: size, alignSelf: "center" }}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            backgroundColor: "#122A2566",
            borderWidth: 2,
            borderColor: adventure.gold,
          },
        ]}
      />
      <Svg
        viewBox="0 0 300 300"
        width="100%"
        height="100%"
        style={{ transform: [{ rotate: `${-heading}deg` }] }}
      >
        <Circle
          cx="150"
          cy="150"
          r="143"
          stroke="#E6D7AA"
          strokeWidth="1"
          fill="none"
        />
        {Array.from({ length: 36 }, (_, i) => (
          <Line
            key={i}
            x1="150"
            y1="8"
            x2="150"
            y2={i % 3 === 0 ? 21 : 15}
            stroke={adventure.gold}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            transform={`rotate(${i * 10} 150 150)`}
          />
        ))}
        {[
          ["N", 150, 42],
          ["O", 266, 157],
          ["S", 150, 278],
          ["W", 34, 157],
        ].map(([letter, x, y]) => (
          <SvgText
            key={letter}
            x={x}
            y={y}
            textAnchor="middle"
            fill={adventure.cream}
            fontWeight="700"
            fontSize="23"
          >
            {letter}
          </SvgText>
        ))}
      </Svg>
      {bearing !== undefined && !arrived ? (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [
                {
                  rotate: rotation.interpolate({
                    inputRange: [-360, 360],
                    outputRange: ["-360deg", "360deg"],
                    extrapolate: "extend",
                  }),
                },
              ],
            },
          ]}
        >
          <Svg viewBox="0 0 300 300" width="100%" height="100%">
            <Defs>
              <LinearGradient id="arrowGold" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#FFF5BE" />
                <Stop offset="0.45" stopColor="#FFE175" />
                <Stop offset="1" stopColor="#DB8F17" />
              </LinearGradient>
            </Defs>
            <Circle cx="150" cy="160" r="85" fill="#FFD557" opacity="0.06" />
            <Path
              d="M150 75 L209 224 L150 190 L91 224 Z"
              fill="url(#arrowGold)"
              stroke="#FFF1B6"
              strokeWidth="3"
            />
            <Path d="M150 75 L150 190 L91 224 Z" fill="#FFC937" opacity="0.6" />
            <Path
              d="M150 76 L150 190 L209 224"
              stroke="#FFF4B0"
              strokeWidth="2"
              fill="none"
            />
          </Svg>
        </Animated.View>
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <Icon
            name={arrived ? "checkmark-circle" : "compass-outline"}
            size={72}
            color={adventure.gold}
          />
        </View>
      )}
    </View>
  );
}
