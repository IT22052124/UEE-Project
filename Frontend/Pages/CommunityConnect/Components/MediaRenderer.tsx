import React, { useState } from "react";
import {
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Video } from "expo-av";
import { MediaPreview } from "./MediaPreview";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const MARGIN = 2;

export const MediaRenderer = ({
  medias,
  mediaTypes,
}: {
  medias: string[];
  mediaTypes: (string | null)[];
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

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

  const renderMediaLayout = (
    media: string,
    type: string | null,
    style: any,
    index: number
  ) => {
    return (
      <TouchableOpacity
        key={index}
        style={style}
        onPress={() => openModal(index)}
      >
        {type === "image" ? (
          <Image
            source={{ uri: media }}
            resizeMode="cover"
            style={[styles.image]}
          />
        ) : (
          <Video
            source={{ uri: media }}
            style={[styles.image]}
            useNativeControls
            resizeMode="cover"
            isLooping
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderSingleMedia = () =>
    renderMediaLayout(medias[0], mediaTypes[0], styles.singleMedia, 0);

  const renderTwoMedia = () => (
    <View style={styles.row}>
      {medias.map((media, index) =>
        renderMediaLayout(media, mediaTypes[index], styles.halfMedia, index)
      )}
    </View>
  );

  const renderThreeMedia = () => (
    <View style={styles.row}>
      {renderMediaLayout(medias[0], mediaTypes[0], styles.halfMedia, 0)}
      <View style={styles.halfColumn}>
        {medias
          .slice(1)
          .map((media, index) =>
            renderMediaLayout(
              media,
              mediaTypes[index + 1],
              styles.quarterMedia,
              index + 1
            )
          )}
      </View>
    </View>
  );

  const renderFourMedia = () => (
    <View style={styles.row}>
      <View style={styles.halfColumn}>
        {medias
          .slice(0, 2)
          .map((media, index) =>
            renderMediaLayout(
              media,
              mediaTypes[index],
              styles.quarterMedia,
              index
            )
          )}
      </View>
      <View style={styles.halfColumn}>
        {medias
          .slice(2, 4)
          .map((media, index) =>
            renderMediaLayout(
              media,
              mediaTypes[index + 2],
              styles.quarterMedia,
              index + 2
            )
          )}
      </View>
    </View>
  );

  const renderMediaGrid = () => {
    switch (medias.length) {
      case 1:
        return renderSingleMedia();
      case 2:
        return renderTwoMedia();
      case 3:
        return renderThreeMedia();
      case 4:
        return renderFourMedia();
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderMediaGrid()}
      <MediaPreview
        medias={medias}
        mediaTypes={mediaTypes}
        modalVisible={modalVisible}
        closeModal={closeModal}
        currentIndex={currentIndex}
        swipeImage={swipeImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: MARGIN,
    marginTop: MARGIN,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  image: {
    flex: 1,
    borderRadius: 8,
  },
  postImage: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  singleMedia: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.4, // Reduced height
    marginBottom: MARGIN,
  },
  halfMedia: {
    width: "50%",
    height: SCREEN_WIDTH * 0.6, // Reduced height
    marginRight: MARGIN,
    marginBottom: MARGIN,
    padding: 2,
  },
  halfColumn: {
    width: "50%",
  },
  quarterMedia: {
    width: "100%",
    height: (SCREEN_WIDTH * 0.6 - MARGIN) / 2, // Adjusted for proportion
    marginBottom: MARGIN,
    padding: 2,
  },
});
