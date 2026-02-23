import { BlurView } from "expo-blur";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import React, { useState } from "react";
import { Animated, Pressable, StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  children: any;
  style?: ViewStyle | ViewStyle[];
  contentStyle?: ViewStyle; // Added to control internal layout
  isInteractive?: boolean;
  hero?: boolean;
  onPress?: () => void;
}

export const CustomGlass = ({
  children,
  style,
  contentStyle,
  isInteractive = false,
  hero = false,
  onPress,
}: Props) => {
  const [isPressed, setIsPressed] = useState(false);
  const [scale] = useState(new Animated.Value(1));

  const onPressIn = () => {
    if (!isInteractive) return;
    setIsPressed(true);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const onPressOut = () => {
    if (!isInteractive) return;
    setIsPressed(false);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

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
        <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
      </GlassView>
    );
  }

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={{ flex: 1 }}
      >
        <BlurView
          intensity={80}
          tint="light"
          style={[styles.glassBase, styles.fallbackBorder, { flex: 1 }]}
        >
          <View
            style={[
              styles.fallbackOverlay,
              { backgroundColor: `rgba(255,255,255,${opacity})` },
              isPressed && styles.glowEffect,
              contentStyle, // Apply internal layout here
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
    flex: 1, // Ensure it fills the card
  },
  glowEffect: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(221,232,242,0.9)",
    borderWidth: 1.5,
  },
});
