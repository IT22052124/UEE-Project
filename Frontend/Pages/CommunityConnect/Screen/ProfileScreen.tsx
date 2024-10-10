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

export default function ProfileScreen({ route }) {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePosts, setProfilePosts] = useState([]); // State to store user's profile posts
  const navigation = useNavigation();
  const userId = route.params?.userId || "66f3dda2bd01bea47d940c63"; // Get userId from route params or use a default

  // Fetch user details and profile posts when component mounts
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/User/users/${userId}`
        );
        setUserDetails(response.data.user);
        // Fetch profile posts after user details are fetched
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
  }, [userId]);

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

  // Function to render each post
  const renderPost = ({ item }) => (
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
          {item.userVote === "upvoted" ? (
            <Entypo name="arrow-bold-up" size={32} color="#FF4500" />
          ) : (
            <Entypo name="arrow-bold-up" size={32} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        <Text style={styles.postStatText}>{item.upVotes - item.downVotes}</Text>
        <TouchableOpacity onPress={() => handleDownvote(item._id)}>
          {item.userVote === "downvoted" ? (
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

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={{
            uri:
              userDetails.profilePic ||
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbkECXtEG_6-RV7CSNgNoYUGZE-JCliYm9g&s",
          }}
          style={styles.profileImage}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{userDetails.fullName}</Text>
          <Text style={styles.location}>
            Username: {userDetails.username || "Unknown"}
          </Text>
          <Text style={styles.email}>Email: {userDetails.email}</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userDetails.publications || 0}
              </Text>
              <Text style={styles.statLabel}>Publications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userDetails.following || 0}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {userDetails.followers || 0}k
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>FOLLOW</Text>
          </TouchableOpacity>
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
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="mail" size={24} color="#2196F3" />
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
  profileImage: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
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
});
