import React, { useState } from "react";
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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Storage/firebase"; // Firebase configuration
import uuid from "react-native-uuid"; // Optional: For unique IDs

export default function CreateCommunityScreen() {
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [communityPic, setCommunityPic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);

  const pickImage = async (setImage: Function) => {
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

  const uploadImageToFirebase = async (imageUri: any, folderName: any) => {
    try {
      // Fetch the file from the local file URI
      const response = await fetch(imageUri);

      // Convert it to a blob
      const blob = await response.blob();

      // Create a reference to the Firebase Storage
      const fileName = `${folderName}/${uuid.v4()}`; // Use react-native-uuid to generate a unique filename
      const storageRef = ref(storage, fileName);

      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, blob);

      // Get the download URL for the uploaded image
      const downloadURL = await getDownloadURL(storageRef);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleCreateCommunity = async () => {
    if (!communityName || !description) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
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

      console.log({
        communityName,
        communityDescription: description, // Change to actual admin ID
        communityPic: uploadedCommunityPic,
        coverPic: uploadedCoverPic,
      });
      axios
        .post("http://192.168.28.3:5000/Community/community", {
          communityName,
          communityDescription: description,
          adminId: "66f3dda2bd01bea47d940c63", // Change to actual admin ID
          communityPic: uploadedCommunityPic,
          coverPic: uploadedCoverPic,
        })
        .then((response) => {
          console.log(response);
          Alert.alert("Success", "Community created successfully!");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Error", "Failed to create community.");
        });
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Cover Image Picker */}
        <View style={styles.coverContainer}>
          {coverPic ? (
            <Image source={{ uri: coverPic }} style={styles.coverImage} />
          ) : (
            <View style={styles.coverPlaceholder}>
              <Ionicons name="image-outline" size={48} color="white" />
            </View>
          )}
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
                <Ionicons name="camera" size={36} color="#666" />
              </View>
            )}
            <TouchableOpacity
              style={styles.communityPicUploadButton}
              onPress={() => pickImage(setCommunityPic)}
            >
              <Ionicons name="camera" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Community Name</Text>
            <TextInput
              style={styles.input}
              value={communityName}
              onChangeText={setCommunityName}
              placeholder="Enter community name"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description"
              placeholderTextColor="#999"
              multiline
            />
          </View>

          {/* Create Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateCommunity}
          >
            <Text style={styles.createButtonText}>Create Community</Text>
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
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  coverContainer: {
    height: 150,
    backgroundColor: "#FF5700",
    justifyContent: "center",
    alignItems: "center",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  coverPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  coverUploadButton: {
    position: "absolute",
    bottom: 100,
    right: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    zIndex: 10, // Ensure it is on top
  },
  content: {
    marginTop: -50,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  communityPicContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  communityPic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
  },
  communityPicPlaceholder: {
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  communityPicUploadButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: "#FF4500",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
