import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import * as Notifications from "expo-notifications";

import { Stack, useLocalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HolidayDetailScreen() {
  const { id, name, desc } = useLocalSearchParams();
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const holidayId = decodeURIComponent(id as string);
  const storageKey = `@note_${holidayId}`;

  const [reminderId, setReminderId] = useState<string | null>(null);

  const [showPicker, setShowPicker] = useState(false);

  const [selectedTime, setSelectedTime] = useState(new Date());

  const reminderKey = `@reminder_${holidayId}`;

  useEffect(() => {
    const loadNote = async () => {
      try {
        const savedNote = await AsyncStorage.getItem(storageKey);
        if (savedNote !== null) setNote(savedNote);
      } catch (e) {
        console.error("Failed to load note", e);
      }
    };
    loadNote();
    loadData();
  }, [holidayId, reminderId]);

  const loadData = async () => {
    const saved = await AsyncStorage.getItem(reminderKey);

    setReminderId(saved);
  };

  const saveNote = async () => {
    setIsSaving(true);
    try {
      await AsyncStorage.setItem(storageKey, note);
      // Optional: Add a haptic feedback or a small toast here
    } catch (e) {
      console.error("Failed to save note", e);
    } finally {
      setTimeout(() => setIsSaving(false), 500); // Small delay for UX
    }
  };

  const scheduleHolidayReminder = async () => {
    console.log("!!! TRIGGERED: scheduleHolidayReminder started !!!");

    try {
      // 1. Parse the holiday date parts
      const [year, month, day] = holidayId.split("-").map(Number);

      // 2. Create the target Date object
      // Note: month - 1 because JS months are 0-11
      const targetDate = new Date(
        year,
        month - 1,
        day,
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        0,
      );

      const now = new Date();

      // 3. Calculate seconds between NOW and the Holiday
      const secondsUntilHoliday = Math.floor(
        (targetDate.getTime() - now.getTime()) / 1000,
      );

      console.log(
        `Calculating: Target ${targetDate.toISOString()} | Now ${now.toISOString()}`,
      );

      console.log(`Seconds until notification: ${secondsUntilHoliday}`);

      if (secondsUntilHoliday <= 0) {
        Alert.alert(
          "Time Error",
          "The selected time is in the past! Please pick a future time.",
        );
        return;
      }

      // 4. Use TIME_INTERVAL (The one that worked in your test code)
      const newId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🔔 ${name}`,
          body: "Your holiday reminder is here!",
          sound: true,
          priority: "max",
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilHoliday,
        },
      });

      console.log("✅ SUCCESS! Notification scheduled with ID:", newId);
      await AsyncStorage.setItem(reminderKey, newId);
      setReminderId(newId);
      setShowPicker(false);

      Alert.alert("Reminder Set", "Notification scheduled successfully!");
    } catch (e) {
      console.log("❌ FINAL ERROR:", e);
      Alert.alert(
        "Error",
        "Could not schedule. Maybe schedule date is not valid.",
      );
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);

    if (date) setSelectedTime(date);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{ headerTitle: "Holiday Details", headerTransparent: true }}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* --- TOP HERO SECTION --- */}
        <GlassCard style={styles.heroCard} hero={true}>
          <Text style={styles.categoryText}>HOLIDAY INFO</Text>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.description}>{desc}</Text>
        </GlassCard>

        {/* --- NOTES SECTION --- */}
        <View style={styles.noteSection}>
          <Text style={styles.sectionLabel}>YOUR NOTES</Text>
          <GlassCard style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="Add travel plans or traditions..."
              placeholderTextColor="rgba(0,0,0,0.3)"
              multiline
              value={note}
              onChangeText={setNote}
              onBlur={saveNote}
            />
            <Pressable
              onPress={saveNote}
              style={({ pressed }) => [
                styles.saveButton,
                { opacity: pressed || isSaving ? 0.6 : 1 },
              ]}
            >
              <Ionicons
                name={isSaving ? "checkmark-circle" : "save-outline"}
                size={18}
                color={isSaving ? "#28a745" : "#007AFF"}
              />
              <Text style={[styles.saveText, isSaving && { color: "#28a745" }]}>
                {isSaving ? "Saved" : "Save Note"}
              </Text>
            </Pressable>
          </GlassCard>
        </View>

        {/* --- IMPROVED NOTIFICATION LAYOUT --- */}
        <View style={styles.notificationSection}>
          <Text style={styles.sectionLabel}>REMINDER SETTINGS</Text>
          <GlassCard style={styles.reminderCard}>
            <View style={styles.reminderHeader}>
              <View style={styles.timeInfo}>
                <View style={styles.iconCircle}>
                  <Ionicons name="time" size={20} color="#007AFF" />
                </View>
                <View>
                  <Text style={styles.timeSubText}>Notify me at</Text>
                  <Text style={styles.timeMainText}>
                    {selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setShowPicker(true)}
                style={styles.changeTimeBtn}
              >
                <Text style={styles.changeTimeText}>Change</Text>
              </Pressable>
            </View>

            {showPicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                onChange={onTimeChange}
              />
            )}

            <Pressable
              style={({ pressed }) => [
                styles.confirmBtn,
                { backgroundColor: reminderId ? "#E8F2FF" : "#007AFF" },
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={scheduleHolidayReminder}
            >
              <Ionicons
                name={reminderId ? "refresh" : "notifications"}
                size={18}
                color={reminderId ? "#007AFF" : "#FFF"}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.confirmText,
                  { color: reminderId ? "#007AFF" : "#FFF" },
                ]}
              >
                {reminderId ? "UPDATE REMINDER" : "SET REMINDER"}
              </Text>
            </Pressable>

            {reminderId && (
              <Pressable
                onPress={async () => {
                  await Notifications.cancelScheduledNotificationAsync(
                    reminderId,
                  );
                  await AsyncStorage.removeItem(reminderKey);
                  setReminderId(null);
                  Alert.alert("Removed", "Reminder deleted.");
                }}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={14} color="#FF3B30" />
                <Text style={styles.deleteText}>Delete Reminder</Text>
              </Pressable>
            )}
          </GlassCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingTop: 100, paddingBottom: 60 },

  // Hero Card
  heroCard: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#007AFF",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "800", color: "#1A1A1B", marginBottom: 8 },
  description: { fontSize: 16, color: "#4A4A4A", lineHeight: 22 },

  // Sections
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555557",
    marginBottom: 10,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  noteSection: { marginBottom: 30 },
  notificationSection: { marginBottom: 20 },

  // Input Card
  inputCard: { padding: 16, borderRadius: 20 },
  input: {
    fontSize: 16,
    color: "#1A1A1B",
    minHeight: 80,
    textAlignVertical: "top",
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  saveText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#007AFF",
    marginLeft: 6,
  },

  // Reminder Card
  reminderCard: { padding: 20, borderRadius: 24 },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  timeInfo: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timeSubText: { fontSize: 12, color: "#8E8E93", fontWeight: "600" },
  timeMainText: { fontSize: 20, fontWeight: "800", color: "#1A1A1B" },
  changeTimeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  changeTimeText: { fontSize: 13, fontWeight: "700", color: "#666" },

  // Buttons
  confirmBtn: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: { fontSize: 15, fontWeight: "800", letterSpacing: 0.5 },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 4,
  },
});
