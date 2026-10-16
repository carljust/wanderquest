import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import {
  AccessibilityInfo,
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import type { CompanionState } from "@/domain/quest";
import { companionAssets } from "./assets";
import { FoxPose } from "@/components/artwork";

export function WyldoCompanion({
  state = "idle",
  reducedMotion = false,
  mouthPulse = 0,
  size = 180,
}: {
  state?: CompanionState;
  reducedMotion?: boolean;
  mouthPulse?: number;
  size?: number;
}) {
  const [systemReduced, setSystemReduced] = useState(false);
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(setSystemReduced);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setSystemReduced,
    );
    return () => listener.remove();
  }, []);
  const reduce = reducedMotion || systemReduced || !focused;
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
          useNativeDriver: Platform.OS !== "web",
        }),
        Animated.timing(motion, {
          toValue: 0,
          duration: state === "celebrate" ? 450 : 1800,
          useNativeDriver: Platform.OS !== "web",
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
    <View
      style={[styles.frame, { minHeight: size }]}
      accessibilityLabel={`Wyldo, Zustand ${state}`}
    >
      <Animated.View
        style={{
          width: size,
          height: size,
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
          <FoxPose
            pose={
              state === "celebrate"
                ? 3
                : state === "wave"
                  ? 1
                  : state === "talk" || state === "surprise"
                    ? 2
                    : 0
            }
            size={size}
          />
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
});
