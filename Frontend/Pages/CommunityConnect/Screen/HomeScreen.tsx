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
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { IPAddress } from "../../../globals";
import { ParentPost } from "../Components/ParentPost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import RNPickerSelect from "react-native-picker-select";

export default function HomeScreen() {
  const [userId, setUserId] = useState(""); // Replace with actual user ID
  const [posts, setPosts] = useState([]);
  const [communityPost, setCommunityPost] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // Track the active tab
  const [sortOption, setSortOption] = useState("hot"); // "hot" or "popular"
  const navigation = useNavigation();
  const [reload, setReload] = useState(1);

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
    const fetchPosts = async () => {
      try {
        const Id = await getUserFromAsyncStorage();
        if (Id) {
          setUserId(Id);

          // Fetch community posts
          const communityResponse = await axios.get(
            `http://${IPAddress}:5000/Post/user/${Id}/communities/posts`
          );

          if (communityResponse.status === 200) {
            setCommunityPost(communityResponse.data.posts);
          }

          // Fetch user following posts
          const userResponse = await axios.get(
            `http://${IPAddress}:5000/User/users/${Id}/following-posts`
          );

          if (userResponse.status === 200) {
            setUserPost(userResponse.data.posts);
          }

          // Combine community and user posts only for "Hot" in "All" tab
          if (activeTab === "all" && sortOption === "hot") {
            setPosts([
              ...communityResponse.data.posts,
              ...userResponse.data.posts,
            ]);
          }
        } else {
          console.error("User ID not found.");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [activeTab, sortOption, reload]); // Refetch when activeTab or sortOption changes

  const timeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    return diffInHours > 24
      ? `${Math.floor(diffInHours / 24)} days ago`
      : `${diffInHours} hours ago`;
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

  const sortPosts = (postsToSort) => {
    if (sortOption === "hot") {
      return postsToSort.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortOption === "popular") {
      return postsToSort.sort(
        (a, b) => b.upVotes - b.downVotes - (a.upVotes - a.downVotes)
      );
    }
    return postsToSort;
  };

  const renderPosts = () => {
    let postsToRender = [];

    if (activeTab === "all") {
      postsToRender = [...communityPost, ...userPost]; // Show all posts
    } else if (activeTab === "community") {
      postsToRender = communityPost; // Show only community posts
    } else if (activeTab === "following") {
      postsToRender = userPost; // Show only following posts
    }

    // Sort posts before rendering
    postsToRender = sortPosts(postsToRender);

    return postsToRender.map((post) => {
      const userVote = post.upvotedBy.includes(userId)
        ? "upvoted"
        : post.downvotedBy.includes(userId)
        ? "downvoted"
        : null;

      return (
        <View style={styles.post} key={post._id}>
          <View style={styles.postHeader}>
            <View style={styles.headerLeft}>
              <Image
                source={{
                  uri: post.communityPic
                    ? post.communityPic
                    : post.author.profilePic,
                }}
                style={styles.profilePic}
              />
              <View style={styles.communityInfo}>
                <Text style={styles.CommunityName}>
                  {post.communityName
                    ? post.communityName
                    : post.author.username}
                </Text>
                <Text style={styles.postAuthor}>
                  {post.communityName && `Posted by ${post.author.username} • `}
                  {timeAgo(post.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          <Text style={styles.postTitle}>{post.postTitle}</Text>
          <Text style={styles.postFlair}>{post.descriptions}</Text>

          {post.medias && post.medias.length > 0 ? (
            <ParentPost post={post} />
          ) : null}

          <View style={styles.postStats}>
            <TouchableOpacity onPress={() => handleUpvote(post._id)}>
              {userVote === "upvoted" ? (
                <Entypo name="arrow-bold-up" size={24} color="#FF4500" />
              ) : (
                <Entypo name="arrow-bold-up" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
            <Text style={styles.postStatText}>
              {post.upVotes - post.downVotes}
            </Text>
            <TouchableOpacity onPress={() => handleDownvote(post._id)}>
              {userVote === "downvoted" ? (
                <Entypo name="arrow-down" size={24} color="#FF4500" />
              ) : (
                <Entypo name="arrow-down" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("DetailedPostScreen", {
                  postid: post._id,
                  communityName: post.communityName ? post.communityName : null,
                })
              }
            >
              <View style={styles.commentContainer}>
                <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
                <Text style={styles.postStatText}>{post.comments.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={() => navigation.navigate("SearchScreen")}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tab bar at the top */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "all" && styles.activeTab]}
            onPress={() => setActiveTab("all")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "community" && styles.activeTab]}
            onPress={() => setActiveTab("community")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "community" && styles.activeTabText,
              ]}
            >
              Community
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "following" && styles.activeTab]}
            onPress={() => setActiveTab("following")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "following" && styles.activeTabText,
              ]}
            >
              Following
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort options */}
        <TouchableWithoutFeedback>
          <View style={styles.sortContainer}>
            <RNPickerSelect
              onValueChange={(value) => setSortOption(value)}
              items={[
                { label: "Hot", value: "hot" },
                { label: "Popular", value: "popular" },
              ]}
              style={pickerSelectStyles}
              value={sortOption} // Set current value
              useNativeAndroidPickerStyle={false} // Ensures consistent styling across platforms
            />
          </View>
        </TouchableWithoutFeedback>

        {/* Post feed */}
        <ScrollView>
          {!loading ? (
            renderPosts()
          ) : (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#FF4500" />
            </View>
          )}
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
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
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
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  sortText: {
    color: "#818384",
    marginRight: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    color: "#FFFFFF",
    backgroundColor: "#333333",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  inputAndroid: {
    color: "#FFFFFF",
    backgroundColor: "#333333",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});
