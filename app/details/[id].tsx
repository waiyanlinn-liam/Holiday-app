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
import { ReminderSection } from "@/components/Reminder";
import { useHolidayNotes } from "@/hooks/useHolidayNotes";
import { useHolidayReminder } from "@/hooks/useHolidayReminder";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function HolidayDetailScreen() {
  const { id, name, desc } = useLocalSearchParams();
  const holidayId = decodeURIComponent(id as string);
  const scrollRef = useRef<ScrollView>(null);

  const holidayName = (name as string) || "Holiday";
  const holidayDescription = (desc as string) || "";

  const dateString = holidayId.split("|")[0];
  const dateObj = new Date(dateString);
  const isValidDate = !isNaN(dateObj.getTime());

  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [reminderBody, setReminderBody] = useState("");
  const [isReminderVisible, setIsReminderVisible] = useState(false);

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

  // Keyboard Listeners
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
        removeClippedSubviews={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <GlassCard style={styles.heroCard} hero={true}>
            {/* ... GlassCard Content ... */}
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

          <NoteInput
            notes={notes}
            isSaving={isSaving}
            onUpdateNotes={handleUpdateNotes}
          />
        </View>
      </ScrollView>

      {/* THE "VANISHING" SHIELD */}
      <View style={styles.topFadeContainer} pointerEvents="none">
        <LinearGradient
          // Color 1: The Sky Blue at the very top of the blurred image
          // Color 2: Keeping it solid to create the "Shield"
          // Color 3: Transitioning to transparent
          colors={["#935dac", "#b956ca", "transparent"]}
          // 0.0 to 0.7: Solid Shield (Text is 100% hidden)
          // 0.7 to 1.0: Smooth fade out
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>

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
  // THE MAGIC SECTION
  topFadeContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 140, // Should match scrollContent paddingTop
    zIndex: 10, // Ensures it stays above the ScrollView
  },

  // Navigation
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

  // Badge Styles
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
