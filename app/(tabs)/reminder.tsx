import { GlassCard } from "@/components/GlassCard";
import { ListItem, NoteItem, ReminderItem } from "@/types/reminder"; // Adjust path as needed
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

/**
 * ReminderListScreen:
 * Serves as the central repository for all user-generated content.
 * Efficiently parses AsyncStorage keys to reconstruct complex objects.
 */
export default function ReminderListScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"reminders" | "notes">(
    "reminders",
  );
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  //Data Aggregation Logic:
  //Retrieve all keys. Filter for 'Master Keys' (the primary IDs).Batch-fetch metadata (names, times, bodies) for each ID.
  const fetchData = async () => {
    try {
      setLoading(true);
      const keys = await AsyncStorage.getAllKeys();

      // --- 1. Reminder Reconstruction ---
      // We filter out metadata keys to find only the unique reminder IDs.
      const reminderKeys = keys.filter(
        (k) =>
          k.startsWith("@reminder_") &&
          !["_body", "_time", "_name", "_desc"].some((sub) => k.includes(sub)),
      );

      const reminderData: ReminderItem[] = await Promise.all(
        reminderKeys.map(async (key) => {
          const holidayId = key.replace("@reminder_", "");
          const [body, time, savedName, savedDesc] = await Promise.all([
            AsyncStorage.getItem(`@reminder_body_${holidayId}`),
            AsyncStorage.getItem(`@reminder_time_${holidayId}`),
            AsyncStorage.getItem(`@reminder_name_${holidayId}`),
            AsyncStorage.getItem(`@reminder_desc_${holidayId}`),
          ]);

          return {
            holidayId,
            body: body || "Check your plans!",
            scheduledTime: time || "Scheduled",
            type: "reminder",
            name: savedName || holidayId.replace(/-/g, " "),
            description: savedDesc || body || "No description",
          };
        }),
      );

      // --- 2. Note Reconstruction ---
      const noteKeys = keys.filter(
        (k) =>
          k.startsWith("@note_") &&
          !k.includes("_name") &&
          !k.includes("_desc"),
      );

      const noteData: NoteItem[] = await Promise.all(
        noteKeys.map(async (key) => {
          const holidayId = key.replace("@note_", "");
          const [savedNotes, savedName, savedDesc] = await Promise.all([
            AsyncStorage.getItem(key),
            AsyncStorage.getItem(`@note_name_${holidayId}`),
            AsyncStorage.getItem(`@note_desc_${holidayId}`),
          ]);

          const parsedNotes = savedNotes ? JSON.parse(savedNotes) : [];

          return {
            holidayId,
            items: parsedNotes,
            type: "note",
            name: savedName || holidayId.replace(/-/g, " "),
            description:
              savedDesc || (parsedNotes.length > 0 ? parsedNotes[0] : ""),
          };
        }),
      );

      setReminders(reminderData);
      setNotes(noteData.filter((n) => n.items.length > 0));
    } catch (e) {
      console.error("Data Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigation Lifecycle:
   * useFocusEffect ensures the list refreshes every time the user navigates back
   * to this screen (e.g., after deleting a note in the Details screen).
   */
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  /**
   * Cleanup Logic:
   * Multi-key deletion ensures no 'ghost' data remains in AsyncStorage.
   * For reminders, we also interface with the hardware-level Notification center.
   */
  const deleteItem = async (holidayId: string, type: "reminder" | "note") => {
    try {
      if (type === "reminder") {
        const notifId = await AsyncStorage.getItem(`@reminder_${holidayId}`);
        if (notifId)
          await Notifications.cancelScheduledNotificationAsync(notifId);

        await AsyncStorage.multiRemove([
          `@reminder_${holidayId}`,
          `@reminder_body_${holidayId}`,
          `@reminder_time_${holidayId}`,
          `@reminder_name_${holidayId}`,
          `@reminder_desc_${holidayId}`,
        ]);
      } else {
        await AsyncStorage.multiRemove([
          `@note_${holidayId}`,
          `@note_name_${holidayId}`,
          `@note_desc_${holidayId}`,
        ]);
      }
      fetchData(); // UI Refresh
    } catch (e) {
      console.error("Deletion Error:", e);
    }
  };

  const formatDate = (id: string) => {
    const parts = id.split("-");
    if (parts.length < 3) return "Holiday";
    const date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    );
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    const isNote = item.type === "note";
    const displayDate = formatDate(item.holidayId);

    return (
      <View style={styles.cardWrapper}>
        <GlassCard
          onPress={() =>
            router.push({
              pathname: "/details/[id]",
              params: {
                id: item.holidayId,
                name: item.name,
                desc: item.description,
              },
            })
          }
          style={styles.card}
        >
          <View style={styles.cardContent}>
            {/* LEFT: Date Badge */}
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>{displayDate.split(" ")[0]}</Text>
              <Text style={styles.dayText}>{displayDate.split(" ")[1]}</Text>
            </View>

            {/* MIDDLE: Info + Body Preview */}
            <View style={styles.info}>
              <Text style={styles.holidayTitle} numberOfLines={1}>
                {item.name}
              </Text>

              {isNote ? (
                <View>
                  {/* Re-added the note preview text */}
                  <Text style={styles.previewText} numberOfLines={1}>
                    {(item as NoteItem).items[0]}
                  </Text>
                  <View style={styles.noteBadge}>
                    <Ionicons name="document-text" size={12} color="#5856D6" />
                    <Text style={styles.badgeText}>
                      {(item as NoteItem).items.length} items
                    </Text>
                  </View>
                </View>
              ) : (
                <View>
                  {/* Re-added the reminder body text */}
                  <Text style={styles.previewText} numberOfLines={1}>
                    {(item as ReminderItem).body}
                  </Text>
                  <View style={styles.timeTag}>
                    <Ionicons name="alarm" size={12} color="#FF9500" />
                    <Text style={styles.timeText}>
                      {(item as ReminderItem).scheduledTime}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* RIGHT: Delete Action */}
            <TouchableOpacity
              onPress={() => deleteItem(item.holidayId, item.type)}
              style={styles.deleteBtn}
            >
              <View style={styles.deleteIconBg}>
                <Ionicons name="trash" size={18} color="#FF3B30" />
              </View>
            </TouchableOpacity>
          </View>
        </GlassCard>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.contentWrapper}>
        {/* Segemented Control: For switching between data types */}
        <View style={styles.toggleContainer}>
          {(["reminders", "notes"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={{ marginTop: 50 }}
          />
        ) : (
          <FlatList
            data={activeTab === "reminders" ? reminders : notes}
            keyExtractor={(item) => `${item.type}_${item.holidayId}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nothing scheduled yet</Text>
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  contentWrapper: { flex: 1, paddingTop: 80 },
  screenTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1C1C1E",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  toggleContainer: {
    flexDirection: "row",
    marginHorizontal: 25,
    marginBottom: 25,
    borderRadius: 20,
    padding: 4,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 16 },
  activeTab: {
    backgroundColor: "#f5f2f2",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: { fontWeight: "700", color: "rgb(23, 23, 24)", fontSize: 15 },
  activeTabText: { color: "#000" },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  cardWrapper: { marginBottom: 16 },
  card: { padding: 8, borderRadius: 24 },
  cardContent: { flexDirection: "row", alignItems: "center" },
  dateBadge: {
    width: 60,
    height: 60,
    backgroundColor: "#007AFF",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dateText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "800",
    opacity: 0.8,
    textTransform: "uppercase",
  },
  dayText: { color: "#FFF", fontSize: 22, fontWeight: "900", marginTop: -2 },
  info: { flex: 1, marginLeft: 16, justifyContent: "center" },
  holidayTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1C1C1E",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  previewText: { fontSize: 14, color: "#3A3A3C", opacity: 0.7 },
  timeTag: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  timeText: {
    fontSize: 13,
    color: "#FF9500",
    fontWeight: "700",
    marginLeft: 4,
  },
  noteBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(88, 86, 214, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: {
    fontSize: 12,
    color: "#5856D6",
    fontWeight: "700",
    marginLeft: 4,
  },
  deleteBtn: { padding: 10 },
  deleteIconBg: {
    width: 36,
    height: 36,
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 100,
    color: "#f0f0f7",
    fontSize: 16,
    fontWeight: "500",
  },
});
