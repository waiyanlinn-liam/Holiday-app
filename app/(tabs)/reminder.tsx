import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react"; // Added useCallback
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ReminderItem {
  holidayId: string;
  notificationId: string;
  body: string;
}

export default function ReminderListScreen() {
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();
      console.log("[List Debug] All keys in storage:", keys);

      // Strict filter: must start with @reminder_ and NOT be a body key
      const reminderKeys = keys.filter(
        (key) => key.startsWith("@reminder_") && !key.includes("_body"),
      );

      console.log("[List Debug] Filtered Reminder Keys:", reminderKeys);

      const reminderData: ReminderItem[] = await Promise.all(
        reminderKeys.map(async (key) => {
          const holidayId = key.replace("@reminder_", "");
          const notificationId = await AsyncStorage.getItem(key);
          const body = await AsyncStorage.getItem(
            `@reminder_body_${holidayId}`,
          );

          console.log(
            `[List Debug] Item: ${holidayId} | ID: ${notificationId} | Body: ${body}`,
          );

          return {
            holidayId,
            notificationId: notificationId || "",
            body: body || "No message set",
          };
        }),
      );

      setReminders(reminderData);
    } catch (e) {
      console.error("[List Error]", e);
    } finally {
      setLoading(false);
    }
  };

  // REPLACED useEffect with useFocusEffect
  // This ensures that every time you navigate TO this screen, it re-fetches.
  useFocusEffect(
    useCallback(() => {
      fetchReminders();
    }, []),
  );
  const deleteSingleReminder = async (holidayId: string) => {
    await AsyncStorage.removeItem(`@reminder_${holidayId}`);
    await AsyncStorage.removeItem(`@reminder_body_${holidayId}`);
    fetchReminders(); // Refresh list
  };

  const renderReminder = ({ item }: { item: ReminderItem }) => (
    <GlassCard style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.holidayTitle}>
          {item.holidayId.replace(/-/g, " ")}
        </Text>
        <Text style={styles.bodyText} numberOfLines={2}>
          {item.body}
        </Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={() => deleteSingleReminder(item.holidayId)}
          style={styles.deleteBtn}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </Pressable>
      </View>
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ headerTitle: "All Reminders", headerTransparent: true }}
      />

      {/* Background to match your details layout */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        }}
        style={StyleSheet.absoluteFillObject}
        blurRadius={18}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.holidayId}
          renderItem={renderReminder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="notifications-off-outline"
                size={48}
                color="#8E8E93"
              />
              <Text style={styles.emptyText}>No reminders scheduled yet.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 20, paddingTop: 110 },
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  info: { flex: 1 },
  holidayTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1A1A1B",
    textTransform: "capitalize",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 14,
    color: "#4A4A4A",
  },
  actions: { marginLeft: 12 },
  deleteBtn: {
    padding: 8,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 12,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },
});
