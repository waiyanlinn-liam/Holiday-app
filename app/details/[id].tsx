import { GlassCard } from "@/components/GlassCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
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
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

export default function HolidayDetailScreen() {
  const { id, name, desc } = useLocalSearchParams();
  const holidayId = decodeURIComponent(id as string);
  const scrollRef = useRef<ScrollView>(null);

  const holidayName = (name as string) || "Holiday";
  const holidayDescription = (desc as string) || "";

  // 1. EXTRACT DATE: Parse the holidayId (e.g., "2026-02-12")
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

  useEffect(() => {
    const loadReminderBody = async () => {
      const savedBody = await AsyncStorage.getItem(
        `@reminder_body_${holidayId}`,
      );
      if (savedBody) setReminderBody(savedBody);
    };
    loadReminderBody();
  }, [holidayId]);

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
      <MaskedView
        style={{ flex: 1 }}
        maskElement={
          <LinearGradient
            colors={["transparent", "black"]}
            locations={[isKeyboardActive ? 0.1 : 0.1, 0.18]}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: isKeyboardActive ? 350 : 80 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <GlassCard style={styles.heroCard} hero={true}>
              <View style={styles.heroHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.categoryText}>HOLIDAY INFO</Text>
                  <Text style={styles.title}>{holidayName}</Text>
                </View>

                {/* --- DATE BADGE SECTION --- */}
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
      </MaskedView>

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
  mainContainer: { flex: 1 },
  scrollContent: { paddingTop: 110 },
  content: { paddingHorizontal: 20 },
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
