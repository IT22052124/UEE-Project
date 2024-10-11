import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { ResizeMode, Video } from "expo-av"; // Import Video component from expo-av
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Storage/firebase";
import { IPAddress } from "../../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export default function CreatePostScreen() {
  const [userId, setUserId] = useState(""); // State to store the user ID
  const route = useRoute();
  const communityName = route.params?.communityName || "Post In Profile";
  const navigator = useNavigation();
  const [community, setCommunity] = useState(communityName);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<any[]>([]); // To store selected media
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [communities, setCommunities] = useState([
    { id: "1", name: "Post In Profile" },
  ]);
  const [loading, setLoading] = useState(false);

  const getUserFromAsyncStorage = async () => {
    try {
      const admin = await AsyncStorage.getItem("user");
      return admin ? JSON.parse(admin)._id || null : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  };
  useEffect(() => {
    const fetchcommunities = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUserId(id);
      if (id) {
        try {
          const response = await axios.get(
            `http://${IPAddress}:5000/User/users/${userId}/communities`
          );

          if (Array.isArray(response.data.communities)) {
            const newCommunities = response.data.communities.map(
              (community: any) => ({
                id: community._id, // Assuming community has an _id property
                name: community.communityName, // Assuming community has a name property
              })
            );

            // Update the state with the new communities
            setCommunities((prevCommunities) => [
              ...prevCommunities,
              ...newCommunities,
            ]);
          }
        } catch (error) {}
      }
    };

    fetchcommunities(); // Call the function to fetch data
  }, [userId]);

  const handleCommunitySelect = (selectedCommunity: string) => {
    setCommunity(selectedCommunity);
    setModalVisible(false); // Close the modal after selecting a community
  };

  // Text formatting functions

  const handleTextChange = (text: string) => {
    setContent(text);
  };

  // Function to pick media
  const pickMedia = async () => {
    if (media.length <= 4) {
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (result.status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });
      if (!pickerResult.canceled && pickerResult.assets) {
        const { mimeType, uri } = pickerResult.assets[0];
        const mediaType = mimeType?.startsWith("image/")
          ? "Image"
          : mimeType?.startsWith("video/")
          ? "Video"
          : "Other";

        if (mediaType === "Other") {
          alert("Please select an image or video only.");
          return; // Exit the function if the type is not valid
        }
        setMedia([...media, { type: mediaType, uri }]);
      }
    } else {
      Alert.alert("Only 4 medias can selected");
    }
  };

  const handlePostSubmit = async () => {
    if (!title || !content || !community) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please fill in all fields",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    setLoading(true);
    const mediaUrls = [];

    try {
      for (const item of media) {
        const response = await fetch(item.uri);
        const blob = await response.blob();

        const mediaRef = ref(
          storage,
          `media/${Date.now()}_${item.uri.split("/").pop()}`
        );
        await uploadBytes(mediaRef, blob);

        const downloadURL = await getDownloadURL(mediaRef);
        mediaUrls.push(downloadURL);
      }

      // Logging the media URLs

      axios
        .post(`http://${IPAddress}:5000/Post/posts`, {
          postTitle: title,
          descriptions: content,
          community,
          author: userId,
          medias: mediaUrls,
        })
        .then((response) => {
          setLoading(false);
          if (community === "Post In Profile") {
            navigator.navigate("ProfileScreen");
          } else {
            navigator.navigate("CommunityScreen", { communityName: community });
          }
        })
        .catch((err) => {
          console.error("Error during post submission:", err);
          alert("Failed to create post. Please try again.");
          setLoading(false);
        });
    } catch (error) {
      console.error("Error during media upload:", error);
      alert("Failed to upload media. Please try again.");
    }
  };

  const handleRemoveMedia = (index: number) => {
    // Create a new array excluding the media at the given index
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigator.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FF4500" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create a post</Text>
        </View>
        {loading ? ( // Show the loader when loading
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#FF4500" />
          </View>
        ) : (
          <>
            <ScrollView style={styles.content}>
              <TouchableOpacity
                style={styles.communitySelector}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons name="people-outline" size={20} color="#898989" />
                <Text style={styles.communitySelectorText}>
                  {community || "Choose a community"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#898989" />
              </TouchableOpacity>

              {/* Modal for selecting community */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Select a community</Text>
                    <FlatList
                      data={communities}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.modalItem}
                          onPress={() => handleCommunitySelect(item.name)}
                        >
                          <Text style={styles.modalItemText}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <TextInput
                style={styles.titleInput}
                placeholder=" An interesting title (Type Here)"
                value={title}
                onChangeText={setTitle}
              />

              {/* Formatting Buttons */}

              <TextInput
                style={[styles.contentInput]}
                placeholder="Your text post (optional)"
                value={content}
                onChangeText={handleTextChange}
                multiline
              />

              {/* Media Selector */}
              <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
                <Ionicons name="images-outline" size={24} color="#898989" />
                <Text style={styles.mediaButtonText}>
                  Add Media ({media.length}/4)
                </Text>
              </TouchableOpacity>

              {/* Display selected media horizontally */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.mediaScrollContainer}
              >
                {media.map((item, index) => (
                  <View key={index} style={styles.mediaPreview}>
                    {item.type === "Image" ? (
                      <Image
                        source={{ uri: item.uri }}
                        style={{ width: 200, height: 200, marginRight: 10 }}
                      />
                    ) : item.type === "Video" ? (
                      <Video
                        source={{ uri: item.uri }}
                        style={{ width: 200, height: 200, marginRight: 10 }}
                        useNativeControls
                        resizeMode={ResizeMode.COVER}
                      />
                    ) : (
                      <Text>Other Media</Text>
                    )}
                    <TouchableOpacity
                      style={styles.removeMediaButton}
                      onPress={() => handleRemoveMedia(index)}
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.postButton}
                onPress={handlePostSubmit}
              >
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",

    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  communitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
  },
  communitySelectorText: {
    flex: 1,
    marginLeft: 8,
    color: "#898989",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    width: "100%",
    alignItems: "center",
  },
  modalItemText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#FF4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "bold",
  },
  contentInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  formattingButtons: {
    flexDirection: "row",
    marginBottom: 16,
  },
  formatButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 4,
    marginRight: 8,
  },
  activeFormatButton: {
    backgroundColor: "#FF4500",
  },
  formatText: {
    fontSize: 16,
  },
  activeFormatText: {
    color: "#FFFFFF",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 16,
  },
  mediaButtonText: {
    marginLeft: 8,
    color: "#898989",
  },
  mediaScrollContainer: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  postButton: {
    backgroundColor: "#FF4500",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  boldText: {
    fontWeight: "bold",
  },
  italicText: {
    fontStyle: "italic",
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  mediaPreview: {
    position: "relative", // Ensure this is positioned relative to its parent
    flexDirection: "row",
    alignItems: "center",
  },
  removeMediaButton: {
    position: "absolute",
    top: 1,
    right: 7,
    // Optional: slightly transparent background
    borderRadius: 50,
    padding: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
