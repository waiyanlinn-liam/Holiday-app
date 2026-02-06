import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { GlassCard } from "./GlassCard";

const { width } = Dimensions.get("window");

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
  title = "Remove Reminder?",
  message = "This action cannot be undone.",
}: ConfirmDeleteModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <GlassCard style={styles.confirmCard}>
          <View style={styles.content}>
            {/* Reduced size and margin here */}
            <View style={styles.iconCircle}>
              <Ionicons name="trash-outline" size={28} color="#ff4444" />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.btn, styles.cancelBtn]}
                onPress={onCancel}
              >
                <Text style={styles.cancelText}>Back</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={onConfirm}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  confirmCard: {
    width: width * 0.8, // Slightly narrower
    maxWidth: 320,
    borderRadius: 24, // Smoother corners for compact look
    padding: 20, // Reduced from 24
    backgroundColor: "#908e8e",
    overflow: "hidden",
  },
  content: {
    alignItems: "center",
  },
  iconCircle: {
    width: 50, // Reduced from 64
    height: 50, // Reduced from 64
    borderRadius: 25,
    backgroundColor: "#fff0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12, // Reduced from 20
  },
  title: {
    fontSize: 19, // Slightly smaller
    fontWeight: "800",
    color: "#1C1C1E",
    marginBottom: 6, // Reduced from 10
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: "#444446",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20, // Reduced from 28
    paddingHorizontal: 5,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  btn: {
    flex: 1,
    paddingVertical: 12, // Reduced from 15
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
    fontWeight: "700",
    fontSize: 15,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});
