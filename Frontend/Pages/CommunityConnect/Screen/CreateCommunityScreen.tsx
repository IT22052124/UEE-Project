import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator, // Import ActivityIndicator for loader
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../Storage/firebase"; // Firebase configuration
import uuid from "react-native-uuid"; // Optional: For unique IDs
import { IPAddress } from "../../../globals";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CommunityFormScreen({ navigation }) {
  const route = useRoute();
  const isEditing = route.params?.isEditing || false;
  const existingCommunity = route.params?.existingCommunity || null;
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [communityPic, setCommunityPic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state

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
    console.log("Existing community:", existingCommunity);
    if (isEditing && existingCommunity) {
      setCommunityName(existingCommunity.communityName.replace(/^c\//, ""));
      setDescription(existingCommunity.communityDescription);
      setCommunityPic(existingCommunity.communityPic);
      setCoverPic(existingCommunity.coverPic);
    }
  }, [isEditing, existingCommunity]);

  // Validate the community name and update state
  const handleCommunityNameChange = (text) => {
    const filteredText = text.replace(/[^a-zA-Z0-9_]/g, "");
    setCommunityName(filteredText);
  };

  const pickImage = async (setImage) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (imageUri, folderName) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `${folderName}/${uuid.v4()}`;
      const storageRef = ref(storage, fileName);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleCreateOrUpdateCommunity = async () => {
    if (!communityName || !description) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    const nameRegex = /^c\/[a-zA-Z0-9_]+$/; // Regex to enforce format
    const formattedCommunityName = `c/${communityName}`;

    if (!nameRegex.test(formattedCommunityName)) {
      Alert.alert(
        "Error",
        "Community name must start with 'c/' and contain only letters, numbers, and underscores."
      );
      return;
    }

    try {
      setIsLoading(true); // Start loading

      let uploadedCommunityPic = null;
      let uploadedCoverPic = null;

      if (communityPic) {
        uploadedCommunityPic = await uploadImageToFirebase(
          communityPic,
          "community_pics"
        );
      }

      if (coverPic) {
        uploadedCoverPic = await uploadImageToFirebase(coverPic, "cover_pics");
      }

      const requestData = {
        communityName: formattedCommunityName,
        communityDescription: description,
        adminId: await getUserFromAsyncStorage(), // Change to actual admin ID
        communityPic: uploadedCommunityPic,
        coverPic: uploadedCoverPic,
      };

      const apiUrl = `http://${IPAddress}:5000/Community/community${
        isEditing ? `/${existingCommunity._id}` : ""
      }`;

      const method = isEditing ? axios.put : axios.post;

      await method(apiUrl, requestData);

      Alert.alert(
        "Success",
        `Community ${isEditing ? "updated" : "created"} successfully!`
      );

      // Navigate to CommunityScreen with the community name
      navigation.navigate("CommunityScreen", {
        communityName: formattedCommunityName,
      });
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={[styles.container, isDarkMode && styles.darkContainer]}
      >
        {/* Cover Image and Back Button Container */}
        <View style={styles.coverContainer}>
          {coverPic ? (
            <Image source={{ uri: coverPic }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={48} color="white" />
            </View>
          )}
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={isDarkMode ? "#fff" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.coverUploadButton}
            onPress={() => pickImage(setCoverPic)}
          >
            <Ionicons name="camera" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.communityPicContainer}>
            {communityPic ? (
              <Image
                source={{ uri: communityPic }}
                style={styles.communityPic}
              />
            ) : (
              <View
                style={[styles.communityPic, styles.communityPicPlaceholder]}
              >
                <Ionicons name="camera" size={36} color="white" />
              </View>
            )}
            <TouchableOpacity
              style={styles.communityPicUploadButton}
              onPress={() => pickImage(setCommunityPic)}
            >
              <Ionicons name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
              Community Name
            </Text>
            <Text style={styles.communityNameDisplay}>c/{communityName}</Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={communityName} // Show only the community name in the input
              onChangeText={handleCommunityNameChange}
              placeholder="Enter community name "
              placeholderTextColor={isDarkMode ? "#bbb" : "#999"}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDarkMode && styles.darkLabel]}>
              Description
            </Text>
            <TextInput
              style={[styles.input, isDarkMode && styles.darkInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor={isDarkMode ? "#bbb" : "#999"}
              multiline
            />
          </View>

          {/* Create/Update Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateOrUpdateCommunity}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" /> // Show loader
            ) : (
              <Text style={styles.createButtonText}>
                {isEditing ? "Update Community" : "Create Community"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Keeping only dark mode
  },
  darkContainer: {
    backgroundColor: "#1A1A1B",
  },
  coverContainer: {
    position: "relative",
    height: 200,
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#666",
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  coverUploadButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  content: {
    padding: 16,
  },
  communityPicContainer: {
    position: "relative",
    marginBottom: 16,
  },
  communityPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 8,
  },
  communityPicPlaceholder: {
    backgroundColor: "#666",
    justifyContent: "center",
    alignItems: "center",
  },
  communityPicUploadButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  darkLabel: {
    color: "#bbb",
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    padding: 8,
    color: "#000",
  },
  darkInput: {
    borderColor: "#bbb",
  },
  communityNameDisplay: {
    color: "#000",
    fontSize: 16,
    marginBottom: 4,
  },
  createButton: {
    backgroundColor: "#007bff",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
  },
});
