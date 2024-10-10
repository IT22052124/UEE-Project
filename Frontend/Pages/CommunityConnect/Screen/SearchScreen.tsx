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
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

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
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation(); // Initialize useNavigation

  const tabs = ["All", "Communities", "Users"];

  useEffect(() => {
    const fetchResults = async () => {
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
  }, [activeTab]);

  // Filter search results based on searchQuery
  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    let results: SearchResult[] = [];

    if (activeTab === "All") {
      results = searchResults.filter(
        (item) =>
          item.name.toLowerCase().includes(lowercasedQuery) ||
          item.details.toLowerCase().includes(lowercasedQuery)
      );
    } else if (activeTab === "Users") {
      results = searchResults.filter(
        (item) =>
          item.type === "user" &&
          (item.name.toLowerCase().includes(lowercasedQuery) ||
            item.details.toLowerCase().includes(lowercasedQuery))
      );
    } else {
      results = searchResults.filter(
        (item) =>
          item.type === "community" &&
          (item.name.toLowerCase().includes(lowercasedQuery) ||
            item.details.toLowerCase().includes(lowercasedQuery))
      );
    }

    setFilteredResults(results);
  }, [searchQuery, searchResults, activeTab]);

  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        if (item.type === "user") {
          navigation.navigate("ProfileScreen", { userId: item.id }); // Navigate to ProfileScreen with userId
        } else {
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
          <Text style={styles.resultDetails}>
            <Ionicons
              name={item.type === "community" ? "people" : "at"}
              size={14}
              color="#777"
            />
            {item.details}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
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
        ) : (
          <FlatList
            data={filteredResults} // Use filteredResults here
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
    backgroundColor: "#1E1E1E",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  profilePic: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#fff",
  },
  searchIcon: {
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#ff3b30",
  },
  tabText: {
    color: "#777",
  },
  activeTabText: {
    color: "#ff3b30",
  },
  resultList: {
    flex: 1,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultDetails: {
    color: "#777",
    fontSize: 14,
  },
  loadingText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
});
