import React from "react";
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
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity>
            <Ionicons name="search" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
        >
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>My feed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Cust</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortText}>BEST POSTS</Text>
          <TouchableOpacity>
            <Text style={styles.sortText}>VIEW</Text>
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="medical" size={24} color="#FF4500" />
              <View style={styles.cardHeaderText}>
                <Text style={styles.cardTitle}>REDDIT UPDATES</Text>
                <Text style={styles.cardSubtitle}>
                  Be like Snoo wear a mask, save lives! Visit r/Coronavirus to
                  talk about COVID-19.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.post}>
            <Image
              source={{ uri: "https://v0.dev/placeholder.svg" }}
              style={styles.avatar}
            />
            <View style={styles.postContent}>
              <Text style={styles.postMeta}>
                r/AskReddit • Posted by u/TheAndyman03 • 19h ago
              </Text>
              <Text style={styles.postTitle}>
                What TV show can you always go back to and have a good time, no
                matter how much you've watched the show?
              </Text>
              <View style={styles.postStats}>
                <Ionicons name="arrow-up" size={16} color="#898989" />
                <Text style={styles.postStatText}>34.5k</Text>
                <Ionicons name="chatbubble-outline" size={16} color="#898989" />
                <Text style={styles.postStatText}>2.2k</Text>
              </View>
            </View>
          </View>
        </ScrollView>
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
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  sortText: {
    color: "#898989",
    fontSize: 12,
  },
  card: {
    backgroundColor: "#FF4500",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
  },
  cardHeaderText: {
    marginLeft: 16,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardSubtitle: {
    color: "#fff",
    marginTop: 4,
  },
  post: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  postContent: {
    flex: 1,
  },
  postMeta: {
    color: "#898989",
    fontSize: 12,
  },
  postTitle: {
    fontSize: 16,
    marginTop: 4,
  },
  postStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  postStatText: {
    color: "#898989",
    fontSize: 12,
    marginLeft: 4,
    marginRight: 16,
  },
});
