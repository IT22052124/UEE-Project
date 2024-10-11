import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { IPAddress } from "../../../globals";
import { ParentPost } from "../Components/ParentPost";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import ConfirmationModal from "../Components/ConfirmationModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Modal } from "react-native";
import Toast from "react-native-toast-message";

const defaultProfilePic =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"; // Replace with actual default profile pic URL
const defaultCoverPic =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"; // Replace with actual default cover pic URL

interface Admin {
  _id: string;
  username: string;
  email: string;
}

interface Community {
  _id: string;
  communityName: string;
  communityDescription: String;
  admin: Admin;
  communityPic: string;
  coverPic: string;
  members: any[]; // You can replace `any` with a more specific type if you have member structure
  relatedPosts: any[]; // You can replace `any` with a more specific type if you have post structure
  createdAt: string;
  updatedAt: string;
  userVote: "upvoted" | "downvoted" | null;
}

export default function CommunityScreen() {
  const [userId, setUserId] = useState(""); // State to store the user ID
  const route = useRoute();
  const { communityName } = route.params;
  const [community, setCommunity] = useState<Community | null>(null); // State to store the community data
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false); // State to track if user is a member
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isPostDeleteModalVisibal, setIsPostDeleteModalVisibal] =
    useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);
  const [selectedTab, setSelectedTab] = useState<"posts" | "about">("posts");
  const [reload, setReload] = useState(1);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const getUserFromAsyncStorage = async () => {
    try {
      const admin = await AsyncStorage.getItem("user");
      return admin ? JSON.parse(admin)._id || null : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  };

  const handleDeletePress = () => {
    setIsDeleteModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalVisible(false);
    await handleDeleteCommunity(); // Your existing delete community logic
  };

  const handleJoinToggle = async () => {
    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/User/users/${userId}/toggle-community`, // Replace with your API endpoint
        { communityId: community?._id } // Include necessary data
      );

      setReload(reload + 1); // Optionally show a message
    } catch (error) {
      console.error("Error toggling community membership", error);
    }
  };

  const handleDeleteCommunity = async () => {
    try {
      await axios.delete(
        `http://${IPAddress}:5000/Community/community/${community?._id}` // Replace with your API endpoint
      );
      alert("Community deleted successfully!");
      navigation.goBack(); // Navigate back after deletion
    } catch (error) {
      console.error("Error deleting community", error);
    }
  };

  const handleUpdateCommunity = () => {
    // Navigate to the update community screen (you will need to create this screen)
    navigation.navigate("CreateCommunityScreen", {
      existingCommunity: community, // Pass the community data
      isEditing: true, // Indicate that it's in edit mode
    });
  };

  // Fetch community data from API
  useEffect(() => {
    const fetchCommunity = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUserId(id);
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/Community/${encodeURIComponent(
            communityName
          )}`
        );
        const communityData = response.data.data;
        const isUserMember = await communityData.members?.some(
          (member: any) => member._id === userId
        );

        console.log("Community data:", isUserMember);
        const updatedPosts = communityData.relatedPosts.map((post) => {
          const userVote = post.upvotedBy.includes(userId)
            ? "upvoted"
            : post.downvotedBy.includes(userId)
            ? "downvoted"
            : null;
          return { ...post, userVote };
        });
        setCommunity({ ...communityData, relatedPosts: updatedPosts });
        setIsAdmin(communityData.admin._id === userId);
        setIsMember(isUserMember); // Set membership status
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching community data", error);
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [communityName, userId, reload, isFocused]);

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

  // New handlers for upvote and downvote
  const handleUpvote = async (postId: string) => {
    const post = community?.relatedPosts.find((p) => p._id === postId);
    try {
      await axios.put(`http://${IPAddress}:5000/Post/posts/${postId}/upvote`, {
        userId,
      });
      const updatedPosts =
        community?.relatedPosts ||
        [].map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              upVotes: p.upVotes + 1,
              downVotes:
                post.userVote === "downvoted" ? p.downVotes - 1 : p.downVotes,
              userVote: "upvoted",
            };
          }
          return p;
        });
      setCommunity({ ...community!, relatedPosts: updatedPosts });
      setReload(reload + 1);
    } catch (error) {
      console.error("Error upvoting post", error);
    }
  };

  // Handle Downvote
  const handleDownvote = async (postId: string) => {
    const post = community?.relatedPosts.find((p) => p._id === postId);

    try {
      await axios.put(
        `http://${IPAddress}:5000/Post/posts/${postId}/downvote`,
        { userId }
      );
      const updatedPosts =
        community?.relatedPosts ||
        [].map((p) => {
          if (p._id === postId) {
            return {
              ...p,
              downVotes: p.downVotes + 1,
              upVotes: post.userVote === "upvoted" ? p.upVotes - 1 : p.upVotes,
              userVote: "downvoted", // Mark as downvoted
            };
          }
          return p;
        });
      setCommunity({ ...community!, relatedPosts: updatedPosts });
      setReload(reload + 1);
    } catch (error) {
      console.error("Error downvoting post", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4500" />
      </View>
    );
  }

  if (!community) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: "#FFFFFF" }}>Community not found</Text>
      </View>
    );
  }

  const confirmDelete = () => {
    if (postIdToDelete) {
      handleDeletePost(postIdToDelete); // Pass both IDs
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios
        .delete(
          `http://${IPAddress}:5000/Community/communities/${community._id}/posts/${postId}`
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
          setIsPostDeleteModalVisibal(false);
        });
    } catch (error) {
      Alert.alert("Error", "An error occurred while deleting the post.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touch}
            onPress={() =>
              navigation.navigate("SearchScreen", {
                Name: communityName,
              })
            }
          >
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#777"
                value={communityName}
                editable={false} // Disable
              />
              <Ionicons
                name="search"
                size={24}
                color="#000"
                style={styles.searchIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <Image
            source={{
              uri: community.coverPic || defaultCoverPic,
            }}
            style={styles.banner}
          />
          <View style={styles.communityInfo}>
            <Image
              source={{
                uri: community.communityPic || defaultProfilePic,
              }}
              style={styles.avatar}
            />
            <View style={styles.communityRow}>
              <Text style={styles.communityName}>
                {community.communityName}
              </Text>
              {isAdmin && (
                <View style={styles.adminButtons}>
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={handleUpdateCommunity}
                  >
                    <Text style={styles.buttonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeletePress}
                  >
                    <AntDesign name="delete" size={24} color="white" />
                  </TouchableOpacity>
                  <ConfirmationModal
                    isVisible={isDeleteModalVisible}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setIsDeleteModalVisible(false)}
                  />
                </View>
              )}
            </View>
            <Text style={styles.communityStats}>
              {community.members?.length || 0} members •{" "}
              {community.relatedPosts?.length || 0} posts
            </Text>
            <Text style={styles.communityDescription}>
              {community.communityDescription}
            </Text>
            <View style={styles.buttonContainer}>
              {!isAdmin && (
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={handleJoinToggle} // This function will handle join/unjoin action
                >
                  <Text style={styles.joinButtonText}>
                    {isMember ? "Leave Community" : "Join Community"}
                  </Text>
                </TouchableOpacity>
              )}
              {isMember && (
                <TouchableOpacity
                  style={styles.postButton} // Add a new style for the Post button
                  onPress={() =>
                    navigation.navigate("CreatePostScreen", {
                      communityName: community.communityName,
                    })
                  } // Change to your post creation screen
                >
                  <Text style={styles.postButtonText}>Add Post</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "posts" && styles.activeTab]}
              onPress={() => setSelectedTab("posts")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "posts" && styles.activeTabText,
                ]}
              >
                Posts
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === "about" && styles.activeTab]}
              onPress={() => setSelectedTab("about")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "about" && styles.activeTabText,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
          </View>

          {/* <View style={styles.sortContainer}>
            <Text style={styles.sortText}>HOT POSTS</Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
          </View> */}
          {selectedTab === "posts" ? (
            // Render posts
            community.relatedPosts.length === 0 ? (
              <Text style={styles.noPostsMessage}>No posts available</Text>
            ) : (
              community.relatedPosts.map((post) => {
                return (
                  <>
                    <View style={styles.post}>
                      <View style={styles.postHeader}>
                        <View style={styles.headerLeft}>
                          <Image
                            source={{ uri: post.author.profilePic }}
                            style={styles.profilePic}
                          />
                          <Text style={styles.postAuthor}>
                            Posted by {post.author.username} •{" "}
                            {timeAgo(post.createdAt)}
                          </Text>
                        </View>
                        {post.author._id === userId && (
                          <TouchableOpacity
                            onPress={() => {
                              setPostIdToDelete(post._id); // Set the post ID to delete
                              setIsPostDeleteModalVisibal(true); // Show the delete confirmation modal
                            }}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="white"
                            />
                          </TouchableOpacity>
                        )}
                      </View>
                      {community.admin._id === post.author._id && (
                        <View style={styles.spoilerTag}>
                          <Text style={styles.spoilerTagText}>Admin</Text>
                        </View>
                      )}
                      <Text style={styles.postTitle}>{post.postTitle}</Text>
                      <Text style={styles.postFlair}>{post.descriptions}</Text>
                      {post.medias && post.medias.length > 0 ? (
                        <ParentPost post={post} />
                      ) : null}
                      <View style={styles.postStats}>
                        <TouchableOpacity
                          onPress={() => handleUpvote(post._id)}
                        >
                          {post.userVote === "upvoted" ? (
                            <Entypo
                              name="arrow-bold-up"
                              size={32}
                              color="#FF4500"
                            />
                          ) : (
                            <Entypo
                              name="arrow-bold-up"
                              size={32}
                              color="#808080"
                            />
                          )}
                        </TouchableOpacity>
                        <Text style={styles.postStatText}>
                          {post.upVotes - post.downVotes}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleDownvote(post._id)}
                        >
                          {post.userVote === "downvoted" ? (
                            <Entypo
                              name="arrow-down"
                              size={32}
                              color="#FF4500"
                            />
                          ) : (
                            <Entypo
                              name="arrow-down"
                              size={32}
                              color="#808080"
                            />
                          )}
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("DetailedPostScreen", {
                              postid: post._id,
                              communityName: community.communityName,
                            })
                          }
                        >
                          <View style={styles.commentContainer}>
                            <Ionicons
                              name="chatbubble-outline"
                              size={32}
                              color="#808080"
                            />
                            <Text style={styles.postStatText}>
                              {post.comments.length}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                );
              })
            )
          ) : (
            // Render "About" section
            <View style={styles.aboutSection}>
              <Text style={styles.aboutText}>
                Community Name: {community.communityName}
              </Text>
              <Text style={styles.aboutText}>
                Description: {community.communityDescription}
              </Text>
              <Text style={styles.aboutText}>
                Created At: {new Date(community.createdAt).toLocaleDateString()}
              </Text>

              <Text style={styles.membertext}>
                {community.members?.length} MEMBERS
              </Text>
              <TouchableOpacity
                onPress={() =>
                  userId === community.admin._id
                    ? navigation.navigate("ProfileScreen")
                    : navigation.navigate("UserScreen", {
                        userId: community.admin._id,
                      })
                }
              >
                <View key={community.admin._id} style={styles.card}>
                  <Image
                    source={{ uri: community.admin.profilePic }}
                    style={styles.profilePic}
                  />
                  <View style={styles.textContainer}>
                    <View style={styles.userRow}>
                      <Text style={styles.username}>
                        {community.admin.fullName}
                      </Text>
                      <View style={styles.spoilerTag}>
                        <Text style={styles.spoilerTagText}>Admin</Text>
                      </View>
                    </View>
                    <Text style={styles.fullName}>
                      {community.admin.username}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              {community.members
                .filter((member) => member._id !== community.admin._id) // Exclude admin
                .map((member) => (
                  <TouchableOpacity
                    onPress={() =>
                      userId === member._id
                        ? navigation.navigate("ProfileScreen")
                        : navigation.navigate("UserScreen", {
                            userId: member._id,
                          })
                    }
                  >
                    <View key={member._id} style={styles.card}>
                      <Image
                        source={{ uri: member.profilePic }}
                        style={styles.profilePic}
                      />
                      <View style={styles.textContainer}>
                        <Text style={styles.username}>{member.fullName}</Text>
                        <Text style={styles.fullName}>{member.username}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </ScrollView>
      </View>
      <Modal
        visible={isPostDeleteModalVisibal}
        onRequestClose={() => setIsPostDeleteModalVisibal(false)}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Delete Post</Text>
          <Text style={styles.modalMessage}>
            Are you sure you want to delete this Post? This action cannot be
            undone.
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsPostDeleteModalVisibal(false)}
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
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  touch: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "flex-start", // Aligns icons to the left
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBlockColor: "#000",
    borderBottomColor: "#E0E0E0",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchText: {
    color: "#00000",
    marginLeft: 10,
  },
  banner: {
    width: "100%",
    height: 150,
  },
  communityInfo: {
    padding: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: -40,
    borderWidth: 4,
    borderColor: "#1A1A1B",
  },
  communityStats: {
    color: "#777", // Grey text for result details
    fontSize: 15,
    fontWeight: "bold",
  },
  communityDescription: {
    color: "#777", // Grey text for result details
    fontSize: 14,
    marginTop: 10,
  },
  joinButton: {
    backgroundColor: "#FF4500",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 10,
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#343536",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FF4500",
  },
  tabText: {
    color: "#818384",
  },
  activeTabText: {
    color: "#FF4500",
    fontWeight: "bold",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  sortText: {
    color: "#818384",
    marginRight: 5,
  },
  post: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#343536",
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
    color: "#818384",
    fontSize: 13,
    fontWeight: "semibold",
    marginLeft: 10,
  },
  spoilerTag: {
    backgroundColor: "#FF4500",
    borderRadius: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 5,
  },
  spoilerTagText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  postTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2d3748",
    marginTop: 8,
  },
  postFlair: {
    color: "#808080", // Red flair for highlighting
    fontSize: 14,
    marginVertical: 4,
  },
  mediaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  mediaItem: {
    width: "48%",
    aspectRatio: 16 / 9,
    marginBottom: 10,
    marginRight: "2%",
    borderRadius: 15,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  postStatText: {
    color: "#818384",
    fontSize: 12,
    marginHorizontal: 5,
  },
  shareButton: {
    borderWidth: 1,
    borderColor: "#818384",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginLeft: "auto",
  },
  shareButtonText: {
    color: "#818384",
    fontSize: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1A1A1B",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#343536",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  commentContainer: {
    flexDirection: "row", // Align comment icon and text in a row
    alignItems: "center", // Center vertically
    marginLeft: 10, // Push this container to the right
  },
  noPostsMessage: {
    color: "#FFFFFF",
    textAlign: "center",
    marginVertical: 20,
  },

  communityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically centered
    marginVertical: 10, // Add some vertical spacing
    width: "100%", // Ensures the row takes the full width
  },
  communityName: {
    flex: 1, // Community name takes the remaining space
    marginRight: 10,
    color: "#000",
    fontSize: 25,
    fontWeight: "bold",
    // Space between text and buttons
  },
  adminButtons: {
    flexDirection: "row",
    justifyContent: "flex-end", // Align buttons to the right
    width: "40%", // Set width for the button container
  },
  updateButton: {
    backgroundColor: "#007AFF",
    borderRadius: 5,
    padding: 2,
    marginHorizontal: 5,
    alignItems: "center",
    flex: 1, // Update button takes the available space in the container
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    borderRadius: 5,
    padding: 2,
    alignItems: "center",
    flex: 1, // Delete button takes the available space in the container
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0", // Light background for search
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#000", // Black text
  },
  searchIcon: {
    marginLeft: 10,
  },
  aboutSection: {
    padding: 15,
    backgroundColor: "#FFF",
    
  },
  aboutText: {
    color: "#000",
    fontSize: 16,
    marginBottom: 10,
  },
  membertext: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textContainer: {
    marginLeft: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  fullName: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  userRow: {
    flexDirection: "row", // Align items horizontally
    justifyContent: "space-between", // Spread items apart (left and right)
    alignItems: "center", // Vertically center items
    width: "90%", // Ensure full width
  },
  buttonContainer: {
    flexDirection: "row", // Align buttons in a row
    // Space between buttons
    alignItems: "center", // Center the buttons vertically
    // Space around buttons
  },
  postButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
    marginTop: 10,
    marginLeft: 10,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: Add a semi-transparent background
  },
  modalContent: {
    backgroundColor: "#1A1A1B", // Adjust to your preferred modal background color
    padding: 20,
    borderRadius: 10,
    width: "80%", // Adjust the width as needed
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFFFFF",
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
