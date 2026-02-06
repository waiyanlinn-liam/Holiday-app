import { CustomTabBar } from "@/components/TabBar";
import MaskedView from "@react-native-masked-view/masked-view";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { TabList, Tabs, TabSlot, TabTrigger } from "expo-router/ui";
import { useEffect } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Notifications.requestPermissionsAsync();
        if (newStatus !== "granted") {
          //do something if not granted
        }
      }
    };
    checkPermissions();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        }}
        style={StyleSheet.absoluteFill}
        blurRadius={18}
      />

      <Tabs>
        {/* --- THE MASKED AREA --- */}
        <MaskedView
          style={{ flex: 1 }}
          maskElement={
            <LinearGradient
              // Transparent = Hidden, Black = Visible
              colors={["transparent", "black", "black", "transparent"]}
              locations={[0.05, 0.15, 0.82, 0.91]}
              style={StyleSheet.absoluteFill}
            />
          }
        >
          <TabSlot />
        </MaskedView>

        {/* Bottom edge blur mask for the Tab Bar area */}
        <View style={styles.bottomEdgeContainer} pointerEvents="none">
          <MaskedView
            style={StyleSheet.absoluteFill}
            maskElement={
              <LinearGradient
                colors={["transparent", "black"]}
                style={StyleSheet.absoluteFill}
              />
            }
          >
            <BlurView
              intensity={100}
              tint="light"
              style={StyleSheet.absoluteFill}
            />
          </MaskedView>
        </View>

        <TabList style={{ display: "none" }}>
          <TabTrigger name="index" href="/" />
          <TabTrigger name="culture" href="/culture" />
          <TabTrigger name="calendar" href="/calendar" />
          <TabTrigger name="reminder" href="/reminder" />
        </TabList>
        <CustomTabBar />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bottomEdgeContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
});
