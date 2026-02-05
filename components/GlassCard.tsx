import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import React, { useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";

interface Props {
  children: any;
  style?: any;
  isInteractive?: boolean;
  hero?: boolean; // visual boost
  onPress?: () => void;
}

export const GlassCard = ({
  children,
  style,
  isInteractive = false,
  hero = false,
  onPress,
}: Props) => {
  const [isPressed, setIsPressed] = useState(false);
  const scale = new Animated.Value(1);

  const onPressIn = () => {
    setIsPressed(true);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    setIsPressed(false);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  // Hero cards are brighter on purpose
  const opacity = hero ? 0.48 : 0.4;

  if (isLiquidGlassAvailable()) {
    return (
      <GlassView
        style={[
          styles.glassBase,
          { backgroundColor: `rgba(255,255,255,${opacity})` },
          style,
        ]}
        glassEffectStyle="clear"
        isInteractive={isInteractive}
      >
        {children}
      </GlassView>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        <BlurView
          intensity={80}
          tint="light"
          style={[styles.glassBase, styles.fallbackBorder, style]}
        >
          <View
            style={[
              styles.fallbackOverlay,
              { backgroundColor: `rgba(255,255,255,${opacity})` },
              isPressed && styles.glowEffect,
            ]}
          >
            {children}
          </View>
        </BlurView>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glassBase: {
    borderRadius: 24,
    overflow: "hidden",
  },
  fallbackBorder: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  fallbackOverlay: {
    padding: 18,
    borderRadius: 16,
  },
  glowEffect: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(221,232,242,0.9)",
    borderWidth: 1.5,
  },
});
