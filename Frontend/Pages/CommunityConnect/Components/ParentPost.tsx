import React, { useState, useEffect } from "react";
import { MediaRenderer } from "./MediaRenderer"; // Import the renderMedia function
import { isImageOrVideo } from "../../../Storage/firebase";
import { Dimensions, StyleSheet, Text } from "react-native";
import { View } from "react-native";
import { ActivityIndicator } from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const MARGIN = 2; // Define margin constant
export const ParentPost = ({ post }) => {
  const [mediaTypes, setMediaTypes] = useState<(string | null)[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMediaTypes = async () => {
      try {
        const types = await Promise.all(
          post.medias.map((media) => isImageOrVideo(media))
        );
        setMediaTypes(types);
      } catch (error) {
        console.error("Error fetching media types:", error);
      } finally {
        setLoading(false);
      }
    };

    if (post.medias.length > 0) {
      fetchMediaTypes();
    } else {
      setMediaTypes([]);
      setLoading(false);
    }
  }, [post.medias]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
        <Text style={styles.loadingText}>Loading media...</Text>
      </View>
    );
  }

  return <MediaRenderer medias={post.medias} mediaTypes={mediaTypes} />;
};

const styles = StyleSheet.create({
  loaderContainer: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.4, // Set the height to 40% of the screen
    justifyContent: "center", // Center the loader vertically
    alignItems: "center", // Center the loader horizontally
    marginBottom: MARGIN,
  },
  loadingText: {
    marginTop: 10, // Space between spinner and text
    color: "#FF4500", // Orange text color to match the spinner
    fontSize: 16,
  },
});
