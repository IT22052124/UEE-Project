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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

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
}

export default function CommunityScreen() {
  const userId = "66f55789b9c3be6113e48bae"; // Assuming you have the user ID from your context or state
  const communityName = "Dedsec"; // Assuming you're passing the community ID via route params
  const [community, setCommunity] = useState<Community | null>(null); // State to store the community data
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState(false); // State to track if user is a member

  const handleJoinToggle = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/User//users/${userId}/toggle-community`, // Replace with your API endpoint
        { communityId: community?._id } // Include necessary data
      );
      // Update the membership status based on the response
      // Stop loading once data is fetched
      setIsMember(!isMember); // Toggle membership status
      alert(response.data.message); // Optionally show a message
    } catch (error) {
      console.error("Error toggling community membership", error);
    }
  };

  // Fetch community data from API
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/Community/${communityName}`
        ); // Replace with your backend API URL
        console.log(response.data.data);
        setCommunity(response.data.data); // Set the community data
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching community data", error);
        setLoading(false);
      }
    };

    fetchCommunity(); // Call the function to fetch data
  }, [communityName]);

  useEffect(() => {
    const fetchMemberStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/User/users/${userId}/communities`
        );
        console.log(response.data); // Log the full response for debugging

        // Check if communities exist and are in the expected format
        if (Array.isArray(response.data.communities)) {
          // Check if the current community's ID is included in the communities array
          const memberCheck = response.data.communities.some(
            (communityItem: any) => communityItem._id === community?._id
          );
          setIsMember(memberCheck);
        } else {
          console.error("Communities are not in the expected format");
        }

        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error("Error fetching community data", error);
        setLoading(false);
      }
    };

    fetchMemberStatus(); // Call the function to fetch data
  }, [communityName, community]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.searchText}>r/{communityName}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="share-social-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <Image
            source={{
              uri: community.coverPic,
            }}
            style={styles.banner}
          />
          <View style={styles.communityInfo}>
            <Image
              source={{
                uri: community.communityPic,
              }}
              style={styles.avatar}
            />
            <Text style={styles.communityName}>
              r/{community.communityName}
            </Text>
            <Text style={styles.communityStats}>
              {community.members?.length || 0} members •{" "}
              {community.relatedPosts?.length || 0} posts
            </Text>
            <Text style={styles.communityDescription}>
              {community.communityDescription}
            </Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinToggle} // This function will handle join/unjoin action
            >
              <Text style={styles.joinButtonText}>
                {isMember ? "Joined" : "Join"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>About</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sortContainer}>
            <Text style={styles.sortText}>HOT POSTS</Text>
            <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
          </View>

          <View style={styles.post}>
            <View style={styles.postHeader}>
              <Text style={styles.postAuthor}>
                Posted by u/Sane-Ni-Wa-To-Ri • 4d ago
              </Text>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.spoilerTag}>
              <Text style={styles.spoilerTagText}>Spoiler</Text>
            </View>
            <Text style={styles.postTitle}>Discussion Chapter 134</Text>
            <Text style={styles.postFlair}>NEW CHAPTER SPOILERS</Text>
            <View style={styles.postStats}>
              <Ionicons name="arrow-up" size={16} color="#FF4500" />
              <Text style={styles.postStatText}>3.7k</Text>
              <Ionicons name="arrow-down" size={16} color="#FFFFFF" />
              <Ionicons name="chatbubble-outline" size={16} color="#FFFFFF" />
              <Text style={styles.postStatText}>1.3k</Text>
              <TouchableOpacity style={styles.shareButton}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <TouchableOpacity>
            <Ionicons name="home-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="compass-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
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
    backgroundColor: "#1A1A1B",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#1A1A1B",
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
  communityName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  communityStats: {
    color: "#818384",
    fontSize: 12,
    marginTop: 5,
  },
  communityDescription: {
    color: "#D7DADC",
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
    borderBottomWidth: 2,
    borderBottomColor: "#FF4500",
  },
  tabText: {
    color: "#818384",
  },
  activeTabText: {
    color: "#FFFFFF",
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
  },
  postAuthor: {
    color: "#818384",
    fontSize: 12,
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
    color: "#D7DADC",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
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
    backgroundColor: "#1A1A1B",
  },
});
