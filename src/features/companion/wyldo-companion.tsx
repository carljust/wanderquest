import { useEffect, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { CompanionState } from "@/domain/quest";
import { companionAssets } from "./assets";
import { colors } from "@/theme";
import { Icon } from "@/components/ui";

export function WyldoCompanion({
  state = "idle",
  reducedMotion = false,
  mouthPulse = 0,
}: {
  state?: CompanionState;
  reducedMotion?: boolean;
  mouthPulse?: number;
}) {
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduced);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduced,
    );
    return () => listener.remove();
  }, []);
  const reduce = reducedMotion || systemReduced;
  const [motion] = useState(() => new Animated.Value(0));
  const [blink, setBlink] = useState(false);
  const mouth = state === "talk" && !reduce && mouthPulse % 2 === 1;
  useEffect(() => {
    motion.setValue(0);
    if (reduce) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(motion, {
          toValue: 1,
          duration: state === "celebrate" ? 450 : 1800,
          useNativeDriver: true,
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: state === "celebrate" ? 450 : 1800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [motion, state, reduce]);
  useEffect(() => {
    if (reduce || !companionAssets.rig) return;
    let close: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      setBlink(true);
      close = setTimeout(() => setBlink(false), 140);
    }, 3800);
    return () => {
      clearInterval(timer);
      clearTimeout(close);
      setBlink(false);
    };
  }, [reduce]);
  const rig = companionAssets.rig;
  return (
    <View style={styles.frame} accessibilityLabel={`Wyldo, Zustand ${state}`}>
      <Animated.View
        style={{
          width: 158,
          height: 164,
          transform: [
            {
              translateY: motion.interpolate({
                inputRange: [0, 1],
                outputRange: [0, state === "celebrate" ? -9 : -3],
              }),
            },
            {
              rotate: motion.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", state === "think" ? "4deg" : "1deg"],
              }),
            },
          ],
        }}
      >
        {rig ? (
          <>
            <Image source={rig.body} style={styles.layer} />
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  transform: [
                    {
                      rotate: motion.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          "0deg",
                          state === "think" ? "4deg" : "1deg",
                        ],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Image source={rig.head} style={styles.layer} />
              <Image
                source={blink ? rig.eyesClosed : rig.eyesOpen}
                style={styles.layer}
              />
              <Image
                source={mouth ? rig.mouthTalk : rig.mouthRest}
                style={styles.layer}
              />
            </Animated.View>
          </>
        ) : companionAssets.portrait ? (
          <Image source={companionAssets.portrait} style={styles.layer} />
        ) : (
          <View style={styles.missing}>
            <Icon name="compass-outline" size={42} color={colors.pine} />
            <Text style={styles.label}>Wyldo</Text>
            <Text style={styles.caption}>Figur noch nicht hinterlegt</Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
}
const styles = StyleSheet.create({
  frame: { alignItems: "center", justifyContent: "center", minHeight: 174 },
  layer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  missing: {
    flex: 1,
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 70,
    backgroundColor: colors.moss,
  },
  label: { fontSize: 21, color: colors.forest, fontWeight: "800" },
  caption: { color: colors.muted, fontSize: 10 },
});
