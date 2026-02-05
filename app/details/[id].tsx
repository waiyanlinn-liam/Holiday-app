import { GlassCard } from "@/components/GlassCard";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { NoteInput } from "@/components/NoteInput";
import { ReminderSection } from "@/components/ReminderInput";
import { useHolidayNotes } from "@/hooks/useHolidayNotes";
import { useHolidayReminder } from "@/hooks/useHolidayReminder";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

/**
 * HolidayDetailScreen:
 * A comprehensive view for managing holiday-specific metadata.
 * Features: Local Notification scheduling, persistence via AsyncStorage, and dynamic UI adjustments for keyboard interactions.
 */

export default function HolidayDetailScreen() {
  // --- 1. ROUTING & INITIALIZATION ---
  const { id, name, desc } = useLocalSearchParams();
  const holidayId = decodeURIComponent(id as string);
  const scrollRef = useRef<ScrollView>(null);

  const holidayName = (name as string) || "Holiday";
  const holidayDescription = (desc as string) || "";

  // Parse the holidayId (usually formatted as YYYY-MM-DD|name) for the date display
  const dateString = holidayId.split("|")[0];
  const dateObj = new Date(dateString);
  const isValidDate = !isNaN(dateObj.getTime());

  // --- 2. LOCAL STATE ---
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [reminderBody, setReminderBody] = useState("");
  const [isReminderVisible, setIsReminderVisible] = useState(false);

  // --- 3. CUSTOM HOOKS (Business Logic) ---
  const { notes = [], saveNotes, isSaving } = useHolidayNotes(holidayId);
  const {
    reminderId,
    selectedTime,
    setSelectedTime,
    showPicker,
    setShowPicker,
    scheduleHolidayReminder,
    deleteReminder,
  } = useHolidayReminder(holidayId, holidayName);

  /**
   * DATA RECONCILIATION:
   * Syncs the local state with persisted storage whenever a reminder exists.
   * Cleans hidden characters from time strings to ensure Date object validity.
   */
  useEffect(() => {
    const syncReminderData = async () => {
      const bodyKey = `@reminder_body_${holidayId}`;
      const timeKey = `@reminder_time_${holidayId}`;

      try {
        const values = await AsyncStorage.multiGet([bodyKey, timeKey]);
        const savedBody = values[0][1];
        const savedTimeStr = values[1][1];

        if (savedBody) setReminderBody(savedBody);

        if (savedTimeStr) {
          // Sanitize string (removes zero-width spaces or unexpected whitespace)
          const cleanTime = savedTimeStr.replace(/\s+/g, " ").trim();
          const [time, modifier] = cleanTime.split(" ");
          let [hours, minutes] = time.split(":").map(Number);

          // Convert 12h AM/PM to 24h for Javascript Date synchronization
          if (modifier?.toUpperCase() === "PM" && hours < 12) hours += 12;
          if (modifier?.toUpperCase() === "AM" && hours === 12) hours = 0;

          const newDate = new Date();
          newDate.setHours(hours, minutes, 0, 0);

          if (!isNaN(newDate.getTime())) {
            setSelectedTime(newDate);
          }
        }
      } catch (e) {
        console.error("AsyncStorage Sync Error:", e);
      }
    };

    if (reminderId) {
      syncReminderData();
    }
  }, [holidayId, reminderId]);

  /**
   * KEYBOARD ADAPTABILITY:
   * Dynamically adjusts ScrollView padding to keep inputs visible on mobile.
   */
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setIsKeyboardActive(true);
        setTimeout(
          () => scrollRef.current?.scrollToEnd({ animated: true }),
          100,
        );
      },
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setIsKeyboardActive(false),
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleUpdateNotes = async (newNotesArray: string[]) => {
    await saveNotes(newNotesArray, holidayName, holidayDescription);
  };

  return (
    <View style={styles.mainContainer}>
      {/* HEADER CONFIGURATION */}
      <Stack.Screen
        options={{
          headerTitle: "Back",
          headerTransparent: true,
          headerRight: () => (
            <Pressable
              onPress={() => setIsReminderVisible(true)}
              style={({ pressed }) => [
                styles.navIcon,
                pressed && { opacity: 0.6 },
              ]}
            >
              <Ionicons
                name={reminderId ? "notifications" : "notifications-outline"}
                size={24}
                color={reminderId ? "#007AFF" : "#1A1A1B"}
              />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: "transparent" }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isKeyboardActive ? 350 : 80 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* HERO CARD: Holiday Identity */}
          <GlassCard style={styles.heroCard} hero={true}>
            <View style={styles.heroHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.categoryText}>HOLIDAY INFO</Text>
                <Text style={styles.title}>{holidayName}</Text>
              </View>
              {isValidDate && (
                <View style={styles.dateBadge}>
                  <Text style={styles.dayText}>{dateObj.getDate()}</Text>
                  <Text style={styles.monthText}>
                    {dateObj
                      .toLocaleString("en-US", { month: "short" })
                      .toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.description}>{holidayDescription}</Text>
          </GlassCard>

          {/* NOTE SECTION */}
          <NoteInput
            notes={notes}
            isSaving={isSaving}
            onUpdateNotes={handleUpdateNotes}
          />
        </View>
      </ScrollView>

      {/* UI SHIELD: Prevents text-bleed under the header during scroll */}
      <View style={styles.topFadeContainer} pointerEvents="none">
        <LinearGradient
          colors={["#935dac", "#b956ca", "transparent"]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* REMINDER MANAGEMENT MODAL */}
      <Modal
        visible={isReminderVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsReminderVisible(false)}
          />
          <View style={styles.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ReminderSection
                reminderId={reminderId}
                reminderBody={reminderBody}
                setReminderBody={setReminderBody}
                notes={notes}
                selectedTime={selectedTime}
                showPicker={showPicker}
                setShowPicker={setShowPicker}
                onTimeChange={(_, date) => date && setSelectedTime(date)}
                onSchedule={async () => {
                  await scheduleHolidayReminder(
                    reminderBody,
                    holidayDescription,
                  );
                  setIsReminderVisible(false);
                }}
                onDelete={async () => {
                  await deleteReminder();
                  setReminderBody("");
                  setIsReminderVisible(false);
                }}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "transparent" },
  scrollContent: { paddingTop: 110 },
  content: { paddingHorizontal: 20 },
  topFadeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140,
    zIndex: 10,
  },
  navIcon: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  heroCard: {
    padding: 20,
    borderRadius: 28,
    marginBottom: 24,
    backgroundColor: "rgba(159, 155, 155, 0.8)",
  },
  heroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#428ef8",
    marginBottom: 4,
  },
  title: { fontSize: 24, fontWeight: "800", color: "#1A1A1B" },
  description: { fontSize: 15, color: "#333", lineHeight: 22, marginTop: 10 },
  dateBadge: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    minWidth: 55,
  },
  dayText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#f0f0f6",
    lineHeight: 22,
  },
  monthText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#d3d5d7",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalDismissArea: { flex: 1 },
  modalSheet: {
    backgroundColor: "rgb(215, 210, 210)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 20,
    maxHeight: "90%",
  },
});
