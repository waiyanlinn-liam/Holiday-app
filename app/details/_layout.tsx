import React from "react";
import { ImageBackground, Platform, StyleSheet, View } from "react-native";

import { Stack } from "expo-router";

export default function DetailsLayout() {
  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        }}
        style={StyleSheet.absoluteFill}
        blurRadius={18}
      />

      <Stack
        screenOptions={{
          headerTransparent: true,
          headerTintColor: "#1A1A1B",
          headerTitleStyle: { fontWeight: "700" },
          // Force transparency on the stack container
          contentStyle: { backgroundColor: "transparent" },
          // Change animation to fade to hide background "pops"
          animation: Platform.OS === "ios" ? "default" : "fade",
        }}
      >
        <Stack.Screen name="[id]" options={{ headerTitle: "" }} />
      </Stack>
    </View>
  );
}
