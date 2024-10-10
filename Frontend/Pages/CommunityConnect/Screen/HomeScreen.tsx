import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { IPAddress } from "../../../globals";
import { ParentPost } from "../Components/ParentPost";

export default function HomeScreen({ navigation }) {
  const userId = "66f3dda2bd01bea47d940c63"; // Assuming you have the user ID from your context or state
  const [posts, setPosts] = useState([]);

  // Fetch posts from user-joined groups
  useEffect(() => {
    const fetchPosts = async () => {
      // Replace with your API endpoint
      const response = await fetch(
        `http://${IPAddress}:5000/Post/user/${userId}/communities/posts`
      );
      const data = await response.json();
      setPosts(data.posts); // Assuming the API returns posts in the format { posts: [...] }
    };

    fetchPosts();
  }, []);

  const timeAgo = (date) => {
    // Function to calculate the time ago
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours > 24
      ? `${Math.floor(diffInHours / 24)} days ago`
      : `${diffInHours} hours ago`;
  };

  const handleUpvote = (postId) => {
    // Handle upvoting logic
  };

  const handleDownvote = (postId) => {
    // Handle downvoting logic
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Tab bar at the top */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>My feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollview}>
          {posts.map((post) => (
            <View style={styles.post} key={post._id}>
              <View style={styles.postHeader}>
                <View style={styles.headerLeft}>
                  <Image
                    source={{ uri: post.communityPic }}
                    style={styles.profilePic}
                  />
                  <View style={styles.communityInfo}>
                    <Text style={styles.CommunityName}>
                      {post.communityName}
                    </Text>
                    <Text style={styles.postAuthor}>
                      Posted by {post.author.username} •{" "}
                      {timeAgo(post.createdAt)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="ellipsis-vertical"
                    size={16}
                    color="#FFFFFF"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.postTitle}>{post.postTitle}</Text>
              <Text style={styles.postFlair}>{post.descriptions}</Text>

              {post.medias && post.medias.length > 0 ? (
                <ParentPost post={post} />
              ) : null}

              <View style={styles.postStats}>
                <TouchableOpacity onPress={() => handleUpvote(post._id)}>
                  {post.userVote === "upvoted" ? (
                    <Entypo name="arrow-bold-up" size={24} color="#FF4500" />
                  ) : (
                    <Entypo name="arrow-bold-up" size={24} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
                <Text style={styles.postStatText}>
                  {post.upVotes - post.downVotes}
                </Text>
                <TouchableOpacity onPress={() => handleDownvote(post._id)}>
                  {post.userVote === "downvoted" ? (
                    <Entypo name="arrow-down" size={24} color="#FF4500" />
                  ) : (
                    <Entypo name="arrow-down" size={24} color="#FFFFFF" />
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DetailedPostScreen", {
                      postid: post._id,
                    })
                  }
                >
                  <View style={styles.commentContainer}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color="#FFFFFF"
                    />
                    <Text style={styles.postStatText}>
                      {post.comments.length}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#1E1E1E",
  },
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
  },
  communityInfo: {
    marginLeft: 8, // Optional: Space between the profile picture and community info
  },
  CommunityName: {
    color: "#FFFFFF",
    fontSize: 16, // Increased font size
    fontWeight: "bold", // Optional: Make it bold
  },
  postAuthor: {
    color: "#898989",
    fontSize: 12,
    marginTop: 2, // Optional: Add space between community name and post author
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  post: {
    backgroundColor: "#292929",
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },

  postTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  postFlair: {
    color: "#FF4500",
    fontSize: 12,
    marginVertical: 4,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 8,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  postStatText: {
    color: "#898989",
    fontSize: 14,
    marginHorizontal: 8,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  shareButton: {
    backgroundColor: "#444444",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 16,
  },
  shareButtonText: {
    color: "#FF4500",
    fontSize: 12,
    fontWeight: "bold",
  },
  // Updated styles for tabs near the top
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#333333",
    borderBottomWidth: 1,
    borderBottomColor: "#444444",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF4500",
  },
  tabText: {
    color: "#898989",
  },
  activeTabText: {
    color: "#FF4500",
    fontWeight: "bold",
  },
  scrollview: {
    marginTop: 10,
  },
});
