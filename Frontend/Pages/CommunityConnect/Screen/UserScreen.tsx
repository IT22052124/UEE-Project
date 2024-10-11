import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { IPAddress } from "../../../globals";
import axios from "axios";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { ParentPost } from "../Components/ParentPost";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen({ route }) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState([]); // State to store user's profile posts
  const navigation = useNavigation();
  const [user, setUser] = useState("null");
  const [reload, setReload] = useState(1);

  const userId = route.params?.userId;

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
    const fetchUserDetails = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUser(id);
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/User/users/${userId}`
        );
        setUserDetails(response.data.user);
        setIsFollowing(response.data.user.followers.includes(id));
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
  }, [userId, reload]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleFollow = async () => {
    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/User/users/${user}/toggle-follow`,
        { targetUserId: userDetails._id }
      );
      setIsFollowing((prev) => !prev);
      setReload((prev) => prev + 1);
      console.log(response.data.message);
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  const theme = {
    backgroundColor: isDarkMode ? "#121212" : "#F0F2F5",
    textColor: isDarkMode ? "#E0E0E0" : "#333",
    cardBackground: isDarkMode ? "#1E1E1E" : "#FFF",
    inputBackground: isDarkMode ? "#2C2C2C" : "#F0F2F5",
    buttonBackground: isDarkMode ? "#BB86FC" : "#4ECDC4",
    buttonText: isDarkMode ? "#121212" : "#FFF",
    borderColor: isDarkMode ? "#333" : "#E0E0E0",
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
  const handleUpvote = async (postId: string) => {
    try {
      await axios.put(`http://${IPAddress}:5000/Post/posts/${postId}/upvote`, {
        userId: user,
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
        { userId: user }
      );

      setReload(reload + 1);
    } catch (error) {
      console.error("Error downvoting post", error);
    }
  };

  const renderPost = ({ item }) => {
    const userVote = item.upvotedBy.includes(user)
      ? "upvoted"
      : item.downvotedBy.includes(user)
      ? "downvoted"
      : null;
    return (
      <View style={styles.post}>
        <View style={styles.postHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.postTitle}>{item.postTitle}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={16} color="black" />
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
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.touch}
            onPress={() =>
              navigation.navigate("SearchScreen", {
                Name: userDetails.username,
              })
            }
          >
            <View style={styles.searchBar}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#777"
                value={userDetails.username}
                editable={false} // Disable
              />
              <Ionicons
                name="search"
                size={24}
                color="#777"
                style={styles.searchIcon}
              />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View
            style={[
              styles.profileCard,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <Image
              source={{
                uri:
                  userDetails?.profilePic ||
                  "https://picsum.photos/200/200?random=0",
              }}
              style={styles.profilePic}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.fullName, { color: theme.textColor }]}>
                {userDetails?.fullName}
              </Text>
              <Text
                style={[
                  styles.username,
                  { color: isDarkMode ? "#BBB" : "#666" },
                ]}
              >
                {userDetails.username || "Unknown"}
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.buttonBackground },
                  ]}
                  onPress={toggleFollow} // This now calls the updated function
                >
                  <Text
                    style={[styles.buttonText, { color: theme.buttonText }]}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.buttonBackground },
                  ]}
                >
                  <Text
                    style={[styles.buttonText, { color: theme.buttonText }]}
                  >
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.statsContainer,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.textColor }]}>
                {profilePosts.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDarkMode ? "#BBB" : "#666" },
                ]}
              >
                Posts
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.textColor }]}>
                {userDetails.followers?.length}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDarkMode ? "#BBB" : "#666" },
                ]}
              >
                Followers
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: theme.textColor }]}>
                {profilePosts.following || userDetails?.following?.length || 0}
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDarkMode ? "#BBB" : "#666" },
                ]}
              >
                Following
              </Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
            Posts
          </Text>
          <View style={styles.profilePostsContainer}>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#1E1E1E",
  },
  touch: {
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1A1A1B",
    justifyContent: "flex-start", // Aligns icons to the left
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#272729",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
  },
  searchText: {
    color: "#FFFFFF",
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#fff",
  },
  content: {
    padding: 15,
  },
  profileCard: {
    flexDirection: "row",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    marginLeft: 20,
    justifyContent: "center",
    flex: 1,
  },
  fullName: {
    fontSize: 22,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: "bold",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  postItem: {
    width: "31%",
    marginBottom: 10,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postImage: {
    width: "100%",
    height: 100,
  },
  searchIcon: {
    marginLeft: 10,
  },
  post: {
    padding: 10,
    borderBottomWidth: 2,
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
  profilePostsContainer: {
    padding: 1,
  },
});
