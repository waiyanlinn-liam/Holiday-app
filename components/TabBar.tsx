import { BlurView } from "expo-blur";
import { TabTrigger } from "expo-router/ui";
import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TabButton } from "./TabButton";

export function CustomTabBar() {
  const [tabWidth, setTabWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const handlePress = (index: number) => {
    Animated.spring(translateX, {
      toValue: index * tabWidth,
      useNativeDriver: true,
      damping: 15,
    }).start();
  };

  return (
    <View style={styles.tabBarWrapper}>
      <BlurView intensity={90} tint="light" style={styles.blurContainer}>
        {/* Animated Background Bubble */}
        <Animated.View
          style={[
            styles.bubble,
            {
              width: tabWidth - 10,
              transform: [{ translateX: Animated.add(translateX, 5) }],
            },
          ]}
        />

        <View
          style={styles.visualTabList}
          onLayout={(e) => setTabWidth(e.nativeEvent.layout.width / 4)}
        >
          <TabTrigger name="index" asChild>
            <TabButton icon="home" onPress={() => handlePress(0)} />
          </TabTrigger>
          <TabTrigger name="culture" asChild>
            <TabButton icon="happy" onPress={() => handlePress(1)} />
          </TabTrigger>

          <TabTrigger name="calendar" asChild>
            <TabButton icon="calendar" onPress={() => handlePress(2)} />
          </TabTrigger>

          <TabTrigger name="reminder" asChild>
            <TabButton icon="notifications" onPress={() => handlePress(3)} />
          </TabTrigger>
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    width: "90%",
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.4)",
    zIndex: 50,
  },
  blurContainer: { flex: 1 },
  visualTabList: { flex: 1, flexDirection: "row", zIndex: 1 },
  bubble: {
    position: "absolute",
    top: 5,
    bottom: 5,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 0,
  },
});
