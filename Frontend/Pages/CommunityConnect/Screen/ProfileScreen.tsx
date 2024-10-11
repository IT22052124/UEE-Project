import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import axios from "axios";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { IPAddress } from "../../../globals";
import { useNavigation } from "@react-navigation/native";
import { ParentPost } from "../Components/ParentPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Modal } from "react-native";
import { TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../../../Storage/firebase";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
export default function ProfileScreen() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState([]); // State to store user's profile posts
  const navigation = useNavigation();
  const [userId, setUserId] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isLogOutModalVisible, setIsLogOutModalVisible] = useState(false);
  const [reload, setReload] = useState(1);
  const [updatedDetails, setUpdatedDetails] = useState({
    username: "",
    email: "",
    FullName: "",
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  const isFocused = useIsFocused();

  const getUserFromAsyncStorage = async () => {
    try {
      const admin = await AsyncStorage.getItem("user");
      return admin ? JSON.parse(admin)._id || null : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  };

  // Fetch user details and profile posts when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
        setUserId(id);
        const response = await axios.get(
          `http://${IPAddress}:5000/User/users/${userId}`
        );
        setUserDetails(response.data.user);
        setUpdatedDetails({
          ...updatedDetails,
          email: response.data.user.email,
          FullName: response.data.user.fullName,
          username: response.data.user.username.replace("u/", ""),
        });
        setNewProfilePic(response.data.user.profilePic);
        const postsResponse = await axios.get(
          `http://${IPAddress}:5000/User/users/${userId}/profile-posts`
        );

        setProfilePosts(postsResponse.data.posts);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId, isUpdateModalVisible, isFocused, reload]);

  const handleUpdateDetails = async () => {
    if (
      !updatedDetails.FullName ||
      !updatedDetails.username ||
      !updatedDetails.email ||
      updatedDetails.username === "" ||
      updatedDetails.email === "" ||
      updatedDetails.FullName === ""
    ) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Please fill all the fields",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }

    let profileImageUrl = "";

    // Upload the profile picture if one is selected
    if (newProfilePic && newProfilePic !== userDetails?.profilePic) {
      // Convert the image URI to a blob for Firebase upload
      const response = await fetch(newProfilePic);
      const blob = await response.blob();

      // Create a reference to Firebase storage
      const storageRef = ref(
        storage,
        `profile_pics/${updatedDetails.username}_${Date.now()}.jpg`
      );

      // Upload the file to Firebase
      const uploadTask = await uploadBytesResumable(storageRef, blob);

      // Get the download URL after the image is uploaded
      profileImageUrl = await getDownloadURL(uploadTask.ref);
      console.log("Image uploaded. Download URL:", profileImageUrl);
    }

    try {
      const response = await axios.put(
        `http://${IPAddress}:5000/User/users/${userId}`,
        {
          fullName: updatedDetails.FullName,
          username: "u/" + updatedDetails.username,
          email: updatedDetails.email,
          profilePic: profileImageUrl,
        }
      );
      if (response.data.success) {
        setIsUpdateModalVisible(false);
        Toast.show({
          type: "success",
          position: "top",
          text1: "User details updated successfully",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      Alert.alert("Error", "Failed to update user details");
    }
  };

  const handleResetPassword = async () => {
    if (passwordDetails.newPassword !== passwordDetails.confirmNewPassword) {
      Toast.show({
        type: "error",
        position: "top",
        text1: "Passwords do not match",
        visibilityTime: 2000,
        autoHide: true,
      });
      return;
    }
    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/User/reset-password`,
        {
          userId,
          oldPassword: passwordDetails.oldPassword,
          newPassword: passwordDetails.newPassword,
        }
      );
      if (!response.data.success) {
        Toast.show({
          type: "error",
          position: "top",
          text1: "Old password is incorrect",
          visibilityTime: 2000,
          autoHide: true,
        });
        return;
      }
      if (response.data.success) {
        setIsPasswordModalVisible(false);
        Toast.show({
          type: "success",
          position: "top",
          text1: "Password reset successfully",
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      Alert.alert("Error", "Failed to reset password");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    Toast.show({
      type: "success",
      position: "top",
      text1: "Logged out successfully",
      visibilityTime: 2000,
      autoHide: true,
    });
    navigation.navigate("SignInScreen");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setNewProfilePic(result.assets[0].uri);
    }
  };

  const timeAgo = (dateString: Date) => {
    const now: any = new Date();
    const pastDate: any = new Date(dateString);
    const diffInSeconds = Math.floor((now - pastDate) / 1000); // Time difference in seconds

    if (diffInSeconds < 60) {
      return diffInSeconds === 1
        ? "1 second ago"
        : `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return diffInMinutes === 1
        ? "1 minute ago"
        : `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return "1 day ago";
    }

    return `${diffInDays} days ago`;
  };

  const handleDeletePost = async (postId, userId) => {
    console.log("Deleting post with ID:", postId);
    console.log("User ID:", userId);
    try {
      await axios
        .delete(
          `http://${IPAddress}:5000/User/users/${userId}/profile-posts/${postId}`
        )
        .then((response) => {
          setReload(reload + 1);
          Toast.show({
            type: "success",
            position: "top",
            text1: "Post deleted successfully",
            visibilityTime: 2000,
            autoHide: true,
          });
          setModalVisible(false);
        });
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the post.");
    }
  };

  const confirmDelete = () => {
    if (postIdToDelete) {
      handleDeletePost(postIdToDelete, userId); // Pass both IDs
    }
  };

  const handleUpvote = async (postId: string) => {
    try {
      await axios.put(`http://${IPAddress}:5000/Post/posts/${postId}/upvote`, {
        userId,
      });

      setReload(reload + 1);
    } catch (error) {
      console.error("Error upvoting post", error);
    }
  };

  // Handle Downvote
  const handleDownvote = async (postId: string) => {
    try {
      await axios.put(
        `http://${IPAddress}:5000/Post/posts/${postId}/downvote`,
        { userId }
      );

      setReload(reload + 1);
    } catch (error) {
      console.error("Error downvoting post", error);
    }
  };
  // Function to render each post
  const renderPost = ({ item }) => {
    const userVote = item.upvotedBy.includes(userId)
      ? "upvoted"
      : item.downvotedBy.includes(userId)
      ? "downvoted"
      : null;
    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.postTitle}>{item.postTitle}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setPostIdToDelete(item._id); // Set the post ID to delete
              setModalVisible(true); // Show the delete confirmation modal
            }}
          >
            <Ionicons name="trash-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text style={styles.postTime}>{timeAgo(item.createdAt)}</Text>
        <Text style={styles.postFlair}>{item.descriptions}</Text>
        {item.medias && item.medias.length > 0 ? (
          <ParentPost post={item} />
        ) : null}
        <View style={styles.postStats}>
          <TouchableOpacity onPress={() => handleUpvote(item._id)}>
            {userVote === "upvoted" ? (
              <Entypo name="arrow-bold-up" size={32} color="#FF4500" />
            ) : (
              <Entypo name="arrow-bold-up" size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <Text style={styles.postStatText}>
            {item.upVotes - item.downVotes}
          </Text>
          <TouchableOpacity onPress={() => handleDownvote(item._id)}>
            {userVote === "downvoted" ? (
              <Entypo name="arrow-down" size={32} color="#FF4500" />
            ) : (
              <Entypo name="arrow-down" size={32} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("DetailedPostScreen", {
                postid: item._id,
              })
            }
          >
            <View style={styles.commentContainer}>
              <Ionicons name="chatbubble-outline" size={32} color="#FFFFFF" />
              <Text style={styles.postStatText}>{item.comments.length}</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity> */}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  if (!userDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>User not found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri:
                userDetails.profilePic ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbkECXtEG_6-RV7CSNgNoYUGZE-JCliYm9g&s",
            }}
            style={styles.profileImage}
          />

          {/* Logout Button */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setIsLogOutModalVisible(!isLogOutModalVisible)}
          >
            <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Edit Profile Button */}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{userDetails.fullName}</Text>
          <Text style={styles.location}>
            Username: {userDetails.username || "Unknown"}
          </Text>
          <Text style={styles.email}>Email: {userDetails.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profilePosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userDetails?.following.length}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userDetails?.followers.length || 0}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
        </View>
        <View style={styles.contactIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate(`CreatePostScreen`, {});
            }}
          >
            <Ionicons name="add" size={24} color="#2196F3" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsUpdateModalVisible(true)}
          >
            <Ionicons name="create" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>

        {/* New Section for Profile Posts */}
        <View style={styles.profilePostsContainer}>
          <Text style={styles.profilePostsHeader}>Profile Posts</Text>
          {profilePosts.length === 0 ? (
            <Text style={styles.noPostsMessage}>No posts available</Text>
          ) : (
            <FlatList
              data={profilePosts}
              keyExtractor={(item) => item._id}
              renderItem={renderPost}
            />
          )}
        </View>
      </ScrollView>
      <Modal
        visible={isUpdateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TouchableOpacity
              style={styles.profilePicButton}
              onPress={pickImage}
            >
              <Image
                source={{
                  uri:
                    newProfilePic ||
                    userDetails.profilePic ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbkECXtEG_6-RV7CSNgNoYUGZE-JCliYm9g&s",
                }}
                style={styles.profilePicPreview}
              />
              <Text style={styles.profilePicButtonText}>
                Change Profile Picture
              </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholderTextColor={"#aaa"}
              placeholder="Full Name"
              value={updatedDetails.FullName}
              onChangeText={(text) =>
                setUpdatedDetails({ ...updatedDetails, FullName: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={"#aaa"}
              value={updatedDetails.username}
              onChangeText={(text) =>
                setUpdatedDetails({ ...updatedDetails, username: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={"#aaa"}
              value={updatedDetails.email}
              onChangeText={(text) =>
                setUpdatedDetails({ ...updatedDetails, email: text })
              }
            />

            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleUpdateDetails}
            >
              <Text style={styles.modalButtonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsPasswordModalVisible(true)}
            >
              <Text style={styles.modalButtonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsUpdateModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={isPasswordModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry
              value={passwordDetails.oldPassword}
              onChangeText={(text) =>
                setPasswordDetails({ ...passwordDetails, oldPassword: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry
              value={passwordDetails.newPassword}
              onChangeText={(text) =>
                setPasswordDetails({ ...passwordDetails, newPassword: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={"#aaa"}
              secureTextEntry
              value={passwordDetails.confirmNewPassword}
              onChangeText={(text) =>
                setPasswordDetails({
                  ...passwordDetails,
                  confirmNewPassword: text,
                })
              }
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.modalButtonText}>Reset Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setIsPasswordModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isLogOutModalVisible}
        onRequestClose={() => setIsLogOutModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <Text style={styles.modalTitle2}>Logout</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to logout? This action will end your current
              session.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setIsLogOutModalVisible(!isLogOutModalVisible);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContainer2}>
            <Text style={styles.modalTitle2}>Delete Post</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to Delete? This action cannot be undone
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1B",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE082",
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
  },
  logoutButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 15,
  },
  editButton: {
    position: "absolute",
    top: 40,
    right: 70,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  infoContainer: {
    backgroundColor: "#1A1A1B",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "white",
  },
  location: {
    fontSize: 16,
    marginBottom: 5,
    color: "white",
  },
  email: {
    fontSize: 14,
    marginBottom: 20,
    color: "white",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    marginLeft: 20,
    alignItems: "center",
  },
  statValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "white",
    fontSize: 14,
  },
  followButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  followButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactIcons: {
    flexDirection: "row",
    position: "absolute",
    top: 270,
    right: 20,
  },
  iconButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  errorMessage: {
    color: "#ff0000",
    fontSize: 16,
    margin: 20,
  },
  profilePostsContainer: {
    padding: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  profilePostsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  noPostsMessage: {
    color: "white",
    fontSize: 16,
  },
  post: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF4500",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row", // Aligns profile pic and username horizontally
    alignItems: "center", // Ensures they are centered vertically
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  postAuthor: {
    color: "#D7DADC",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  titleTimeContainer: {
    flexDirection: "row", // Aligns the title and time horizontally
    alignItems: "flex-start", // Align items to the start (top)
  },
  postTitle: {
    color: "white",
    fontSize: 18, // Increased font size for the title
    fontWeight: "bold",
    marginRight: 10, // Space between title and time
  },
  postTime: {
    color: "#888", // Lighter color for the timestamp
    fontSize: 12, // Slightly lower than the title
  },
  postFlair: {
    color: "#FF4500",
    fontSize: 12,
    marginTop: 5,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentContainer: {
    flexDirection: "row", // Align comment icon and text in a row
    alignItems: "center", // Center vertically
    marginLeft: 10, // Push this container to the right
  },
  postStatText: {
    color: "#818384",
    fontSize: 12,
    marginHorizontal: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#1A1A1B",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#2C2C2C",
    color: "white",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  profilePicButton: {
    alignItems: "center",
    marginBottom: 15,
  },
  profilePicPreview: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  profilePicButtonText: {
    color: "#2196F3",
    fontWeight: "bold",
  },
  modalContainer2: {
    backgroundColor: "#1A1A1B",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "80%", // Set a width to control modal size
    elevation: 5, // Optional: Add shadow effect for Android
    shadowColor: "#000", // Optional: Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Optional: Shadow offset
    shadowOpacity: 0.2, // Optional: Shadow opacity
    shadowRadius: 4, // Optional: Shadow blur radius
  },
  modalTitle2: {
    color: "#2196F3",
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
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
