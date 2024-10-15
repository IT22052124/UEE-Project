import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { IPAddress } from "../../../globals";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native"; // Import useNavigation
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultPic =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"; // Replace with actual default profile pic URL

type SearchResult = {
  id: string; // Using the community's _id
  type: "community" | "user";
  name: string; // For communityName or fullName for users
  details: string; // For communityDescription or username for users
  icon?: string; // For communityPic or profilePic for users
};

const Tab = ({ title, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.tab, isActive && styles.activeTab]}
    onPress={onPress}
  >
    <Text style={[styles.tabText, isActive && styles.activeTabText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function SearchScreen() {
  const route = useRoute(); // Initialize useRoute
  const Name = route.params?.Name || "";
  const [user, setUser] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState(Name);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); // Initialize useNavigation

  const tabs = ["All", "Communities", "Users"];
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

  useEffect(() => {
    const fetchResults = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUser(id);
      try {
        const [usersResponse, communitiesResponse] = await Promise.all([
          axios.get(`http://${IPAddress}:5000/User/users`),
          axios.get(`http://${IPAddress}:5000/Community/communities`),
        ]);

        const users = usersResponse.data.users.map((user) => ({
          id: user._id,
          type: "user",
          name: user.fullName,
          details: user.username,
          icon: user.profilePic,
        }));

        const communities = communitiesResponse.data.communities.map(
          (community) => ({
            id: community._id,
            type: "community",
            name: community.communityName,
            icon: community.communityPic,
          })
        );

        // Combine results based on the active tab
        if (activeTab === "All") {
          setSearchResults([...users, ...communities]);
        } else if (activeTab === "Users") {
          setSearchResults(users);
        } else {
          setSearchResults(communities);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [activeTab, isFocused]);

  // Filter search results based on searchQuery
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    let results: SearchResult[] = [];

    if (activeTab === "All") {
      results = searchResults.filter(
        (item) =>
          (item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
          (item.details && item.details.toLowerCase().includes(lowercasedQuery))
      );
    } else if (activeTab === "Users") {
      results = searchResults.filter(
        (item) =>
          item.type === "user" &&
          ((item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
            (item.details &&
              item.details.toLowerCase().includes(lowercasedQuery)))
      );
    } else {
      results = searchResults.filter(
        (item) =>
          item.type === "community" &&
          item.name &&
          item.name.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredResults(results);
  }, [searchQuery, searchResults, activeTab]);

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (item.type === "user" && item.id === user) {
          setSearchQuery(item.name); // Navigate to ProfileScreen with userId
          navigation.navigate("ProfileScreen");
        } else if (item.type === "user") {
          setSearchQuery(item.name); // Navigate to ProfileScreen with userId
          navigation.navigate("UserScreen", { userId: item.id });
        } else {
          setSearchQuery(item.name);
          navigation.navigate("CommunityScreen", { communityName: item.name }); // Navigate to CommunityScreen with communityName
        }
      }}
    >
      <View style={styles.avatar}>
        <Image
          source={{ uri: item.icon || defaultPic }}
          style={styles.profilePic}
        />
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        {item.details && (
          <Text style={styles.resultDetails}>@{item.details}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Ionicons
            name="search"
            size={24}
            color="#777"
            style={styles.searchIcon}
          />
        </View>
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <Tab
              key={tab}
              title={tab}
              isActive={activeTab === tab}
              onPress={() => setActiveTab(tab)}
            />
          ))}
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : filteredResults.length === 0 ? (
          <Text style={styles.noResultsText}>No results found</Text>
        ) : (
          <FlatList
            data={filteredResults}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            style={styles.resultList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FFFFFF", // Light background
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF", // Main background
  },
  backButton: {
    marginRight: 10,
  },
  noResultsText: {
    color: "#000", // Black text
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light border
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
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light border for tabs
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF", // Accent color for active tab
  },
  tabText: {
    color: "#777",
  },
  activeTabText: {
    color: "#007AFF", // Accent color for active tab text
  },
  resultList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0", // Light border for results
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0F0", // Light avatar background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: "#000", // Black text for result name
    fontSize: 16,
    fontWeight: "bold",
  },
  resultDetails: {
    color: "#777", // Grey text for result details
    fontSize: 15,
    fontWeight: 'bold',
   
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
