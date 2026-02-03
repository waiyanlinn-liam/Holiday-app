import { GlassCard } from "@/components/GlassCard";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { NoteInput } from "@/components/NoteInput";
import { ReminderSection } from "@/components/Reminder";
import { useHolidayNotes } from "@/hooks/useHolidayNotes";
import { useHolidayReminder } from "@/hooks/useHolidayReminder";

export default function HolidayDetailScreen() {
  const { id, name, desc } = useLocalSearchParams();
  const holidayId = decodeURIComponent(id as string);

  // Ensure these are strings to avoid type errors in the hooks
  const holidayName = (name as string) || "Holiday";
  const holidayDescription = (desc as string) || "";

  // 1. Hook logic (Using the updated hooks)
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

  // Modal & Body State
  const [isReminderVisible, setIsReminderVisible] = useState(false);
  const [reminderBody, setReminderBody] = useState("");

  // Load existing reminder text on mount
  useEffect(() => {
    const loadReminderBody = async () => {
      const savedBody = await AsyncStorage.getItem(
        `@reminder_body_${holidayId}`,
      );
      if (savedBody) setReminderBody(savedBody);
    };
    loadReminderBody();
  }, [holidayId]);

  // 2. Updated: Save both body and holiday description for the List screen
  const handleSchedule = async () => {
    await scheduleHolidayReminder(reminderBody, holidayDescription);
    setIsReminderVisible(false);
  };

  const handleDelete = async () => {
    await deleteReminder();
    // The hook's deleteReminder now handles multiRemove of all keys
    setReminderBody("");
    setIsReminderVisible(false);
  };

  // 3. Updated: Pass metadata when updating notes
  const handleUpdateNotes = async (newNotesArray: string[]) => {
    await saveNotes(newNotesArray, holidayName, holidayDescription);
  };

  return (
    <View style={styles.mainContainer}>
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

      <View style={styles.content}>
        {/* --- TOP HERO SECTION --- */}
        <GlassCard style={styles.heroCard} hero={true}>
          <Text style={styles.categoryText}>HOLIDAY INFO</Text>
          <Text style={styles.title}>{holidayName}</Text>
          <Text style={styles.description}>{holidayDescription}</Text>
        </GlassCard>

        {/* NOTES SECTION */}
        <NoteInput
          notes={notes}
          isSaving={isSaving}
          onUpdateNotes={handleUpdateNotes} // Now using our metadata-aware handler
        />
      </View>

      <Modal
        visible={isReminderVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsReminderVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalDismissArea}
            onPress={() => setIsReminderVisible(false)}
          />

          {/* Use KeyboardAvoidingView to push the sheet up */}
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%" }}
          >
            <View style={styles.modalSheet}>
              <View style={styles.modalIndicator} />

              <View style={styles.modalHeader}>
                <Text style={styles.modalSheetTitle}>Reminder Settings</Text>
                <Pressable onPress={() => setIsReminderVisible(false)}>
                  <Ionicons name="close-circle" size={28} color="#646465" />
                </Pressable>
              </View>

              {/* ScrollView ensures content is reachable even on small screens with keyboard open */}
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View>
                    <ReminderSection
                      reminderId={reminderId}
                      reminderBody={reminderBody}
                      setReminderBody={setReminderBody}
                      notes={notes}
                      selectedTime={selectedTime}
                      showPicker={showPicker}
                      setShowPicker={setShowPicker}
                      onTimeChange={(_, date) => date && setSelectedTime(date)}
                      onSchedule={handleSchedule}
                      onDelete={handleDelete}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "transparent" },
  content: { padding: 20, paddingTop: 110, paddingBottom: 60 },

  // Hero Card
  heroCard: {
    padding: 16,
    borderRadius: 24,
    marginBottom: 24,
    backgroundColor: "#9f9b9b",
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#428ef8",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#1A1A1B", marginBottom: 8 },
  description: { fontSize: 14, color: "#4A4A4A", lineHeight: 24 },

  // Navigation
  navIcon: {
    marginRight: 16,
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalDismissArea: {
    flex: 1,
  },
  modalSheet: {
    backgroundColor: "rgb(215, 210, 210)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    maxHeight: Platform.OS === "ios" ? "80%" : "90%",
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalSheetTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1C1C1E",
  },
});
