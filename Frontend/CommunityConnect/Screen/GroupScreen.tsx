import React from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function GroupScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.searchText}>r/Poverty</Text>
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
              uri: "https://firebasestorage.googleapis.com/v0/b/frontend-web-e454c.appspot.com/o/images%2FIMG_20210519_200116.jpg?alt=media&token=432d1910-5635-4aa9-b818-c8830a5e76b4",
            }}
            style={styles.banner}
          />
          <View style={styles.communityInfo}>
            <Image
              source={{
                uri: "https://firebasestorage.googleapis.com/v0/b/frontend-web-e454c.appspot.com/o/images%2FIMG_20210519_200116.jpg?alt=media&token=432d1910-5635-4aa9-b818-c8830a5e76b4",
              }}
              style={styles.avatar}
            />
            <Text style={styles.communityName}>r/Poverty</Text>
            <Text style={styles.communityStats}>
              86,553 • 1,501 paths particles
            </Text>
            <Text style={styles.communityDescription}>
              MANGA SPOILERS SUBREDDIT! {"\n"}
              Shingeki no Kyojin / Attack on Titan healthy-ish fan community!
              {"\n"}
              With memes, shitposts, arts, news, discussions{"\n"}
              for true titans, I mean humans. Definitely humans!
            </Text>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinButtonText}>Joined</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Posts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Rooms</Text>
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
});
