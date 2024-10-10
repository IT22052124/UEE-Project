import React, { useState, useEffect } from "react";
import { MediaRenderer } from "./MediaRenderer"; // Import the renderMedia function
import { isImageOrVideo } from "../../../Storage/firebase";
import { Text } from "react-native";

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
    return <Text>Loading media...</Text>;
  }

  return <MediaRenderer medias={post.medias} mediaTypes={mediaTypes} />;
};
