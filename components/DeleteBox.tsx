import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ConfirmDeleteModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export const ConfirmDeleteModal = ({
  visible,
  onCancel,
  onConfirm,
  title = "Delete Note?",
  message = "Are you sure you want to remove this plan?",
}: ConfirmDeleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.confirmCard}>
          {/* Icon matches the first snippet's style */}
          <Ionicons
            name="alert-circle"
            size={40}
            color="#FF3B30"
            style={styles.icon}
          />

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.deleteBtn]}
              onPress={onConfirm}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Darkened overlay
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCard: {
    width: "85%", // Standard card width
    padding: 25,
    borderRadius: 20, // Clean, rounded corners
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#3A3A3C",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelBtn: {
    backgroundColor: "#F2F2F7",
  },
  deleteBtn: {
    backgroundColor: "#FF3B30",
  },
  cancelText: {
    color: "#1C1C1E",
    fontWeight: "600",
    fontSize: 16,
  },
  deleteText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
  },
});
