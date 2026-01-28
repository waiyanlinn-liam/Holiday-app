import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    LayoutAnimation,
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOrUpdate = () => {
    if (inputText.trim().length === 0) return;

    let updatedNotes = [...notes];
    if (editingIndex !== null) {
      updatedNotes[editingIndex] = inputText.trim();
      setEditingIndex(null);
    } else {
      updatedNotes.push(inputText.trim());
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    onUpdateNotes(updatedNotes);
    setInputText("");
  };

  const deleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onUpdateNotes(updatedNotes);
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setInputText(notes[index]);
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
                <Ionicons name="trash-bin-outline" size={16} color="#FF3B30" />
              </Pressable>
            </View>
          </GlassCard>
        ))}
      </View>

      {/* --- INPUT AREA --- */}
      <KeyboardAvoidingView>
        <GlassCard
          style={[
            styles.inputCard,
            editingIndex !== null && styles.inputCardEditing,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder={
              editingIndex !== null
                ? "Editing note..."
                : "Tap to add a new plan..."
            }
            placeholderTextColor="rgba(0,0,0,0.3)"
            multiline
            value={inputText}
            onChangeText={setInputText}
          />
          <View style={styles.inputFooter}>
            {editingIndex !== null && (
              <Pressable
                onPress={() => {
                  setEditingIndex(null);
                  setInputText("");
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
            )}
            <Pressable
              onPress={handleAddOrUpdate}
              style={({ pressed }) => [
                styles.addButton,
                {
                  backgroundColor:
                    editingIndex !== null ? "#4a4a4a" : "#007AFF",
                },
                pressed && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
            >
              <Ionicons
                name={editingIndex !== null ? "checkmark-done" : "add-circle"}
                size={20}
                color="#FFF"
              />
              <Text style={styles.addButtonText}>
                {editingIndex !== null ? "Update" : "Add Note"}
              </Text>
            </Pressable>
          </View>
        </GlassCard>
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
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#007AFF",
  },
  listContainer: {
    marginBottom: 16,
  },

  noteContent: {
    flexDirection: "row",
    alignItems: "center",
  },

  noteText: {
    flex: 1,
    fontSize: 15,
    color: "#2C2C2E",
    lineHeight: 20,
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    padding: 2,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },

  // Input Card
  inputCard: {
    padding: 16,
    borderRadius: 24,
    backgroundColor: "#9f9b9b",
  },
  inputCardEditing: {
    borderColor: "#939593",
    borderWidth: 1,
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
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.03)",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },
  cancelBtn: { paddingHorizontal: 16 },
  cancelText: { color: "#8E8E93", fontWeight: "600", fontSize: 14 },
});
