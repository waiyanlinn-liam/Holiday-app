import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlassCard } from "./GlassCard";

interface ReminderSectionProps {
  reminderId: string | null;
  reminderBody: string;
  setReminderBody: (text: string) => void;
  notes: string[];
  selectedTime: Date;
  showPicker: boolean;
  setShowPicker: (show: boolean) => void;
  onTimeChange: (event: DateTimePickerEvent, date?: Date) => void;
  onSchedule: () => void;
  onDelete: () => void;
}

export const ReminderSection = ({
  reminderId,
  reminderBody,
  setReminderBody,
  notes,
  selectedTime,
  showPicker,
  setShowPicker,
  onTimeChange,
  onSchedule,
  onDelete,
}: ReminderSectionProps) => {
  return (
    <View style={styles.container}>
      {/* NOTIFICATION BODY SECTION */}
      <Text style={styles.sectionLabel}>NOTIFICATION MESSAGE</Text>
      <GlassCard style={styles.bodyCard}>
        <TextInput
          style={styles.bodyInput}
          placeholder="What should the notification say?"
          placeholderTextColor="#8E8E93"
          multiline
          value={reminderBody}
          onChangeText={setReminderBody}
        />

        {notes.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionTitle}>Use a note as message:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={styles.chipScroll}
            >
              {notes.map((note, index) => (
                <Pressable
                  key={index}
                  onPress={() => setReminderBody(note)}
                  style={styles.noteChip}
                >
                  <Text numberOfLines={1} style={styles.chipText}>
                    {note}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </GlassCard>

      {/* TIME SELECTION */}
      <Text style={styles.sectionLabel}>TIME SETTINGS</Text>
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
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(e, d) => {
              if (Platform.OS === "android") setShowPicker(false);
              onTimeChange(e, d);
            }}
          />
        )}
      </GlassCard>

      {/* ACTION BUTTONS */}
      <View style={styles.footer}>
        <Pressable
          style={({ pressed }) => [
            styles.confirmBtn,
            { backgroundColor: reminderId ? "#E8F2FF" : "#007AFF" },
            { opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onSchedule}
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
          <Pressable onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={14} color="#FF3B30" />
            <Text style={styles.deleteText}>Delete Reminder</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
  },
  reminderCard: { padding: 16, borderRadius: 20, marginBottom: 20 },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeInfo: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timeSubText: {
    fontSize: 11,
    color: "#8E8E93",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  timeMainText: { fontSize: 22, fontWeight: "800", color: "#1A1A1B" },
  changeTimeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
  },
  changeTimeText: { fontSize: 13, fontWeight: "700", color: "#007AFF" },

  // Body Message Styles
  bodyCard: { padding: 16, borderRadius: 20, marginBottom: 24 },
  bodyInput: {
    fontSize: 16,
    color: "#1A1A1B",
    minHeight: 60,
    textAlignVertical: "top",
  },
  suggestionsContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
    paddingTop: 12,
  },
  suggestionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#8E8E93",
    marginBottom: 8,
  },
  chipScroll: { paddingRight: 20 },
  noteChip: {
    backgroundColor: "rgba(0, 122, 255, 0.08)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    maxWidth: 150,
  },
  chipText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "600",
  },

  // Buttons
  footer: { marginTop: 10 },
  confirmBtn: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  confirmText: { fontSize: 16, fontWeight: "800" },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    padding: 10,
  },
  deleteText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
});
