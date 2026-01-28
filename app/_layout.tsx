import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // removed shouldShowAlert to fix the warning
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* The Tabs Group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* The Detail Page - "modal" makes it slide up on iOS */}
      <Stack.Screen
        name="details"
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
