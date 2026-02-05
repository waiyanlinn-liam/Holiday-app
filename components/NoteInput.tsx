import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { GlassCard } from "./GlassCard";

interface NoteInputProps {
  notes: string[];
  isSaving: boolean;
  onUpdateNotes: (newNotes: string[]) => void;
}

export const NoteInput = ({
  notes,
  isSaving,
  onUpdateNotes,
}: NoteInputProps) => {
  const [inputText, setInputText] = useState("");
  const [editText, setEditText] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAdd = () => {
    if (inputText.trim().length === 0) return;
    const updatedNotes = [...notes, inputText.trim()];
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onUpdateNotes(updatedNotes);
    setInputText("");
  };

  // Update existing note (From Modal)
  const handleUpdate = () => {
    if (editText.trim().length === 0 || editingIndex === null) return;
    let updatedNotes = [...notes];
    updatedNotes[editingIndex] = editText.trim();

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onUpdateNotes(updatedNotes);
    setEditingIndex(null);
    setEditText("");
  };

  const deleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onUpdateNotes(updatedNotes);
  };

  const startEdit = (index: number) => {
    setEditText(notes[index]);
    setEditingIndex(index);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>YOUR HOLIDAY PLANS</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{notes.length}</Text>
        </View>
      </View>

      {/* --- LIST OF SAVED NOTES --- */}
      <View style={styles.listContainer}>
        {notes.map((item, index) => (
          <GlassCard key={index} style={{ marginBottom: 8 }}>
            <View style={styles.noteContent}>
              <Text style={styles.noteText}>{item}</Text>
              <View style={styles.actionRow}>
                <Pressable
                  onPress={() => startEdit(index)}
                  style={styles.iconBtn}
                >
                  <Ionicons name="pencil-sharp" size={16} color="#007AFF" />
                </Pressable>
                <Pressable
                  onPress={() => deleteNote(index)}
                  style={styles.iconBtn}
                >
                  <Ionicons
                    name="trash-bin-outline"
                    size={16}
                    color="#FF3B30"
                  />
                </Pressable>
              </View>
            </View>
          </GlassCard>
        ))}
      </View>

      {/* --- INPUT FOR NEW NOTE --- */}
      <GlassCard style={styles.inputCard}>
        <TextInput
          style={styles.input}
          placeholder="Tap to add a new plan..."
          placeholderTextColor="rgba(0,0,0,0.3)"
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <View style={styles.inputFooter}>
          <Pressable
            onPress={handleAdd}
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
            ]}
          >
            <Ionicons name="add-circle" size={20} color="#FFF" />
            <Text style={styles.addButtonText}>Add Note</Text>
          </Pressable>
        </View>
      </GlassCard>

      {/* --- EDIT MODAL --- */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContent}
      >
        <Modal
          visible={editingIndex !== null}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setEditingIndex(null)}
        >
          <View style={styles.modalOverlay}>
            <GlassCard style={styles.editCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Plan</Text>
                <Pressable onPress={() => setEditingIndex(null)}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </Pressable>
              </View>

              <TextInput
                style={[styles.input, styles.editInput]}
                multiline
                autoFocus
                value={editText}
                onChangeText={setEditText}
              />

              <View style={styles.modalFooter}>
                <Pressable
                  onPress={handleUpdate}
                  style={[
                    styles.addButton,
                    {
                      backgroundColor: "#007AFF",
                      width: "100%",
                      justifyContent: "center",
                    },
                  ]}
                >
                  <Text style={styles.addButtonText}>Save Changes</Text>
                </Pressable>
              </View>
            </GlassCard>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 30 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#606063",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  badge: {
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#007AFF" },
  listContainer: { marginBottom: 16 },
  noteContent: { flexDirection: "row", alignItems: "center" },
  noteText: {
    flex: 1,
    fontSize: 15,
    color: "#2C2C2E",
    lineHeight: 20,
    fontWeight: "500",
  },
  actionRow: { flexDirection: "row" },
  iconBtn: { padding: 8, borderRadius: 10 },

  // Input Card
  inputCard: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "rgba(159, 155, 155, 0.15)",
  },
  input: {
    fontSize: 16,
    color: "#1C1C1E",
    minHeight: 50,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: { width: "100%", maxWidth: 400 },
  editCard: { padding: 20, borderRadius: 28, backgroundColor: "#c9c3c3" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "800", color: "#1C1C1E" },
  editInput: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    marginBottom: 20,
  },
  modalFooter: { width: "100%" },
});
