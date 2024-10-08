import React, { useState } from "react";
import { Image, View, StyleSheet, TouchableOpacity } from "react-native";
import { Video } from "expo-av";
import { MediaPreview } from "./MediaPreview";

// Convert renderMedia to a functional component
export const MediaRenderer = ({
  medias,
  mediaTypes,
}: {
  medias: string[];
  mediaTypes: (string | null)[];
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open the modal and set the current image index
  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalVisible(false);
  };

  const swipeImage = (direction: "left" | "right") => {
    if (direction === "left" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === "right" && currentIndex < medias.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Render the media item (either image or video)
  const renderItem = (
    media: string,
    type: string | null,
    style: any,
    index: number
  ) => {
    return (
      <TouchableOpacity key={index} onPress={() => openModal(index)}>
        {type === "image" ? (
          <Image
            source={{ uri: media }}
            resizeMode="cover"
            style={[styles.mediaItem, style]}
          />
        ) : (
          <Video
            source={{ uri: media }}
            style={[styles.mediaItem, style]}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </TouchableOpacity>
    );
  };

  // Render different layouts based on the number of media items
  const renderMediaLayout = () => {
    if (medias.length === 1) {
      return (
        <View>
          {renderItem(medias[0], mediaTypes[0], styles.singleMedia, 0)}
        </View>
      );
    }

    if (medias.length === 2) {
      return (
        <View style={styles.mediaContainer}>
          {medias.map((media, index) =>
            renderItem(media, mediaTypes[index], styles.twoMedia, index)
          )}
        </View>
      );
    }

    if (medias.length === 3) {
      return (
        <View style={styles.mediaContainer}>
          {renderItem(medias[0], mediaTypes[0], styles.singleMedia, 0)}
          <View style={{ width: "48%" }}>
            {medias
              .slice(1)
              .map((media, index) =>
                renderItem(
                  media,
                  mediaTypes[index + 1],
                  styles.threeMediaRight,
                  index + 1
                )
              )}
          </View>
        </View>
      );
    }

    if (medias.length >= 4) {
      return (
        <View style={styles.mediaContainer}>
          {medias
            .slice(0, 4)
            .map((media, index) =>
              renderItem(media, mediaTypes[index], styles.fourMedia, index)
            )}
        </View>
      );
    }

    return null;
  };

  return (
    <>
      {renderMediaLayout()}
      <MediaPreview
        medias={medias}
        mediaTypes={mediaTypes}
        modalVisible={modalVisible}
        closeModal={closeModal}
        currentIndex={currentIndex}
        swipeImage={swipeImage}
      />
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  mediaContainer: {
    flexDirection: "row", // Keep media items in a row
    flexWrap: "wrap", // Allow items to wrap to the next line
    justifyContent: "space-between", // Ensure space between items
    marginVertical: 10,
  },
  mediaItem: {
    borderRadius: 10,
    marginBottom: 5,
    width: "48%", // Adjust the width for items to fit side by side
    height: 150, // Set height to make items visually balanced
  },
  singleMedia: {
    marginTop: 10,
    width: "100%",
    height: 300,
  },
  twoMedia: {
    width: "48%", // Ensure two items fit side by side
    height: 200,
  },
  threeMediaRight: {
    width: "100%", // Full width for the right item
    height: 150,
  },
  fourMedia: {
    width: "49%", // Two items in a row with slight spacing
    height: 155,
  },
});
