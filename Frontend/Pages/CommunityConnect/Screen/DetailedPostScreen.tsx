import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Entypo, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { IPAddress } from "../../../globals";
import { ParentPost } from "../Components/ParentPost";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types for comment and post structures
interface Comment {
  id: string;
  username: string;
  profilePic: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

interface Post {
  id: string;
  author: {
    username: string;
    profilePic: string;
  };
  timestamp: string;
  postTitle: string;
  descriptions: string;
  medias: string[];
  mediaTypes: (string | null)[];
  upvotes: number;
  downvotes: number;
  comments: Comment[];
  userVote: "upvoted" | "downvoted" | null;
}

// Format timestamp to display relative time
const formatTimestamp = (dateString: string) => {
  const now = new Date();
  const pastDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - pastDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;
};

// Component for rendering a single comment
const CommentItem: React.FC<{
  comment: Comment;
  postId: string;
  setReload2: Function;
}> = ({ comment, postId, setReload2 }) => {
  const [replyInput, setReplyInput] = useState("");
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplies, setShowReplies] = useState(false); // To toggle reply visibility

  const getUserFromAsyncStorage = async () => {
    try {
      const admin = await AsyncStorage.getItem("user");
      return admin ? JSON.parse(admin)._id || null : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  };
  const handleReply = async () => {
    if (replyInput.trim()) {
      try {
        const userId = await getUserFromAsyncStorage();
        await axios
          .post(
            `http://${IPAddress}:5000/Post/posts/${postId}/comments/${comment._id}/replies`,
            {
              userId: userId,
              reply: replyInput,
            }
          )
          .then((response) => {
            setReplyInput(""); // Clear the input
            setReload2((prev: number) => prev + 1); // Reload the comments
          });
      } catch (error) {
        console.error("Error posting reply", error);
      }
    }
  };

  return (
    <View style={styles.commentContainer}>
      <Image
        source={{ uri: comment.userId?.profilePic }}
        style={styles.commentProfilePic}
      />
      <View style={styles.commentContent}>
        <Text style={styles.commentUsername}>{comment.userId?.username}</Text>
        <Text style={styles.commentText}>{comment.comment}</Text>
        <Text style={styles.commentTimestamp}>
          {formatTimestamp(comment.time)}
        </Text>
        <TouchableOpacity onPress={() => setShowReplyInput(!showReplyInput)}>
          <Text style={styles.replyButton}>Reply</Text>
        </TouchableOpacity>
        {showReplyInput && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              value={replyInput}
              onChangeText={setReplyInput}
              placeholder="Write a reply..."
              placeholderTextColor="#CCCCCC"
            />
            <TouchableOpacity onPress={handleReply} style={styles.replyButton}>
              <Text style={styles.replyButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Collapsible Replies Section */}
        {replies.length > 0 && (
          <View style={styles.repliesContainer}>
            <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
              <Text style={styles.toggleRepliesButton}>
                {showReplies
                  ? "Hide Replies"
                  : `View ${replies.length} Replies`}
              </Text>
            </TouchableOpacity>
            {showReplies &&
              replies.map((reply) => (
                <CommentItem
                  comment={reply}
                  postId={postId}
                  setReload2={setReload2}
                />
              ))}
          </View>
        )}
      </View>
    </View>
  );
};

export const DetailedPostScreen = () => {
  const route = useRoute();
  const [userId, setUserId] = useState("");
  const { postid } = route.params;

  const communityName = route.params?.communityName || null;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [UserVote, setUserVote] = useState("");
  const [reload, setReload] = useState(1);
  const [comments, setComments] = useState([]);
  const [reload2, setReload2] = useState(1);

  const getUserFromAsyncStorage = async () => {
    try {
      const admin = await AsyncStorage.getItem("user");
      return admin ? JSON.parse(admin)._id || null : null;
    } catch (error) {
      console.error("Failed to retrieve user:", error);
      return null;
    }
  };

  // Fetch post details from API
  useEffect(() => {
    const fetchDetails = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUserId(id);
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/Post/posts/${postid}/nocomments`
        );
        setPost(response.data.post);
        const userVote =
          response.data.post.upvotedBy &&
          response.data.post.upvotedBy.includes(id)
            ? "upvoted"
            : response.data.post.downvotedBy &&
              response.data.post.downvotedBy.includes(id)
            ? "downvoted"
            : null;
        setUserVote(userVote);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [postid, reload]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/Post/posts/${postid}/comments`
        );

        setComments(response.data.Comments);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [postid, reload2]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://${IPAddress}:5000/Post/posts/${postid}/comments`,
          {
            userId, // Replace with the actual userId
            comment: newComment,
          }
        );

        if (response.status === 200) {
          setReload2((prev: number) => prev + 1); // Reload the comments
          setNewComment(""); // Reset comment input
        }
      } catch (error) {
        console.error("Error posting comment", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Post not found</Text>
      </View>
    );
  }

  // Prepare data for FlatList rendering
  const postData = [
    { key: "header", post },
    { key: "commentsHeader", comments: `${comments.length} Comments` },
    ...comments.map((comment) => ({ key: comment._id, comment })),
  ];
  const navigation = useNavigation();

  const handleUpvote = async () => {
    const id = await getUserFromAsyncStorage();
    try {
      await axios.put(`http://${IPAddress}:5000/Post/posts/${postid}/upvote`, {
        userId: id,
      });

      setReload(reload + 1);
    } catch (error) {
      console.error("Error upvoting post", error);
    }
  };

  // Handle Downvote
  const handleDownvote = async () => {
    try {
      const id = await getUserFromAsyncStorage();
      await axios.put(
        `http://${IPAddress}:5000/Post/posts/${postid}/downvote`,
        { userId: id }
      );

      setReload(reload + 1);
    } catch (error) {
      console.error("Error downvoting post", error);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.key === "header") {
      return (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.touch}
              onPress={() =>
                navigation.navigate("SearchScreen", {
                  Name: communityName ? communityName : post.author.username,
                })
              }
            >
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor="#777"
                  value={communityName ? communityName : post.author.username}
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
          <View style={styles.header2}>
            <View style={styles.authorInfo}>
              <Image
                source={{ uri: post.author.profilePic }}
                style={styles.profilePic}
              />
              <View style={styles.textContainer}>
                <View style={styles.usernameContainer}>
                  {/* Community Name */}
                  {communityName && (
                    <Text style={styles.CommunityName}>{communityName}</Text>
                  )}

                  {/* Username and Timestamp below Community Name */}
                  <View style={styles.userDetailsContainer}>
                    <Text style={styles.username}>{post.author.username}</Text>
                    <Text style={styles.timestamp}>
                      {formatTimestamp(post.createdAt)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.title}>{post.postTitle}</Text>
            <Text style={styles.description}>{post.descriptions}</Text>
            {post.medias && post.medias.length > 0 ? (
              <ParentPost post={post} />
            ) : null}
            <View style={styles.postStats}>
              {/* Upvote Button */}
              <TouchableOpacity onPress={handleUpvote}>
                <Entypo
                  name="arrow-bold-up"
                  size={32}
                  color={UserVote === "upvoted" ? "#FF4500" : "#808080"} // Shows orange if upvoted, white otherwise
                />
              </TouchableOpacity>

              {/* Vote Score */}
              <Text style={styles.postStatText}>
                {post.upVotes - post.downVotes}
              </Text>

              {/* Downvote Button */}
              <TouchableOpacity onPress={handleDownvote}>
                <Entypo
                  name="arrow-down"
                  size={32}
                  color={UserVote === "downvoted" ? "#FF4500" : "#808080"} // Shows orange if downvoted, white otherwise
                />
              </TouchableOpacity>
            </View>

            {/* <TouchableOpacity style={styles.shareButton}>
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity> */}

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={newComment}
                onChangeText={setNewComment}
                placeholder="Add a comment..."
                placeholderTextColor="#CCCCCC"
                multiline
              />
              <TouchableOpacity
                onPress={handleAddComment}
                style={styles.addCommentButton}
              >
                <Text style={styles.addCommentButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      );
    } else if (item.key === "commentsHeader") {
      return comments.length === 0 ? (
        <Text style={styles.noCommentsText}>No comments available</Text>
      ) : (
        <Text style={styles.commentsHeader}>{item.comments}</Text>
      );
    } else {
      return (
        <CommentItem
          comment={item.comment}
          postId={postid}
          setReload2={setReload2}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <FlatList
          data={postData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key || item.id || item._id}
        />
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FFFFFF",
  },
  touch: {
    width: "100%",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  noCommentsText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  header2: {
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  authorInfo: {
    flexDirection: "row", // Align children horizontally
    alignItems: "center", // Center vertically
    marginVertical: 8,
  },

  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12, // Space between profile pic and text
  },

  textContainer: {
    flex: 1, // Allow text container to take remaining space
  },

  username: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
    color: "#808080", // Space between username and timestamp
  },

  timestamp: {
    fontSize: 14,
    color: "#888",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginTop: 8,
  },
  description: {
    color: "#808080", // Red flair for highlighting
    fontSize: 16,
    marginVertical: 8,
  },
  votesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
  },
  voteButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10,
  },
  postStatText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
    marginHorizontal: 5,
  },
  voteText: {
    marginLeft: 4,
    fontSize: 16,
  },
  commentInputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: "#F0F0F0",
    borderRadius: 20,
    padding: 8,
    marginRight: 8,
    color: "#000",
    height: 40,
    paddingHorizontal: 15,
  },
  addCommentButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: "center",
  },
  addCommentButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  commentsHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    padding: 16,
    backgroundColor: "#FFF",
  },
  commentContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#808080",
    backgroundColor: "#FFF",
  },
  commentProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 8,
  },
  commentUsername: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#000",
  },
  commentText: {
    fontSize: 14,
    marginVertical: 4,
    color: "#808080",
  },
  commentTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  replyButton: {
    color: "#007AFF",
    fontSize: 14,
    marginTop: 5,
  },
  replyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  replyInput: {
    flex: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#000",
  },
  replyButtonText: {
    marginLeft: 10,
    color: "#007AFF",
  },
  repliesContainer: {
    marginTop: 10,

    paddingLeft: 16, // Indent replies for better visual hierarchy
  },

  toggleRepliesButton: {
    color: "#007AFF", // Color for visibility toggle
    marginVertical: 4,
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
    color: "#FFFFFF",
    marginLeft: 10,
  },
  backButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#F0F0F0", // Light background for search
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#000", // Black text
  },
  CommunityName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF4500", // Customize color as per your theme
  },
  userDetailsContainer: {
    flexDirection: "row", // Align username and timestamp horizontally
    alignItems: "center", // Align vertically in the center
    marginTop: 5, // Add spacing between CommunityName and the user details
  },
  usernameContainer: {
    alignItems: "flex-start", // Align community name, username, and timestamp vertically
  },
});

export default DetailedPostScreen;
