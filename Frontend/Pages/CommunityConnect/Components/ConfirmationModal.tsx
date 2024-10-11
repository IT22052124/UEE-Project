import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";

export default function ConfirmationModal({ isVisible, onConfirm, onCancel }) {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Delete Community</Text>
        <Text style={styles.modalMessage}>
          Are you sure you want to delete this community? This action cannot be
          undone.
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
            <Text style={styles.confirmButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#1A1A1B",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FF4500",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalMessage: {
    color: "#D7DADC",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#818384",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
