import React from "react";
import { Video } from "expo-av";
import { Image, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

export const MediaPreview = ({
  medias,
  mediaTypes,
  modalVisible,
  closeModal,
  currentIndex,
  swipeImage,
}: {
  medias: string[];
  mediaTypes: string[];
  modalVisible: boolean;
  closeModal: () => void;
  currentIndex: number;
  swipeImage: (direction: "left" | "right") => void;
}) => {
  return (
    <Modal visible={modalVisible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <AntDesign name="close" size={30} color="white" />
        </TouchableOpacity>

        {mediaTypes[currentIndex] === "image" ? (
          <Image
            source={{ uri: medias[currentIndex] }}
            style={styles.modalImage}
          />
        ) : (
          <Video
            source={{ uri: medias[currentIndex] }}
            style={styles.modalImage}
            useNativeControls
            resizeMode="contain"
            isLooping
          />
        )}

        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.leftArrow}
            onPress={() => swipeImage("left")}
          >
            <AntDesign name="left" size={30} color="white" />
          </TouchableOpacity>
        )}
        {currentIndex < medias.length - 1 && (
          <TouchableOpacity
            style={styles.rightArrow}
            onPress={() => swipeImage("right")}
          >
            <AntDesign name="right" size={30} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },
  leftArrow: {
    position: "absolute",
    left: 20,
    zIndex: 1,
  },
  rightArrow: {
    position: "absolute",
    right: 20,
    zIndex: 1,
  },
});
