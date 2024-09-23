import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CreatePostScreen() {
  const [community, setCommunity] = useState("");
  const [postType, setPostType] = useState("Text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [spoiler, setSpoiler] = useState(false);

  const postTypes = [
    { icon: "text", label: "Text" },
    { icon: "link", label: "Link" },
    { icon: "image", label: "Image" },
    { icon: "videocam", label: "Video" },
    { icon: "bar-chart", label: "Poll" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create a post</Text>
          <TouchableOpacity>
            <Ionicons name="document-text-outline" size={24} color="#FF4500" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <TouchableOpacity style={styles.communitySelector}>
            <Ionicons name="people-outline" size={20} color="#898989" />
            <Text style={styles.communitySelectorText}>
              {community || "Choose a community"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#898989" />
          </TouchableOpacity>

          <View style={styles.postTypeContainer}>
            {postTypes.map((type) => (
              <TouchableOpacity
                key={type.label}
                style={[
                  styles.postTypeButton,
                  postType === type.label && styles.activePostType,
                ]}
                onPress={() => setPostType(type.label)}
              >
                <Ionicons
                  name={type.icon as any}
                  size={24}
                  color={postType === type.label ? "#FF4500" : "#898989"}
                />
                <Text
                  style={[
                    styles.postTypeLabel,
                    postType === type.label && styles.activePostTypeLabel,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.titleInput}
            placeholder="An interesting title"
            value={title}
            onChangeText={setTitle}
          />

          <TextInput
            style={styles.contentInput}
            placeholder="Your text post (optional)"
            value={content}
            onChangeText={setContent}
            multiline
          />

          <View style={styles.tagsContainer}>
            <Text style={styles.tagsLabel}>Mark as:</Text>
            <TouchableOpacity
              style={[styles.tagButton, nsfw && styles.activeTag]}
              onPress={() => setNsfw(!nsfw)}
            >
              <Text style={[styles.tagText, nsfw && styles.activeTagText]}>
                NSFW
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tagButton, spoiler && styles.activeTag]}
              onPress={() => setSpoiler(!spoiler)}
            >
              <Text style={[styles.tagText, spoiler && styles.activeTagText]}>
                SPOILER
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save draft</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.postButton}>
              <Text style={styles.postButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.bottomNav}>
          <Ionicons name="home-outline" size={24} color="#898989" />
          <Ionicons name="search-outline" size={24} color="#898989" />
          <Ionicons name="add-circle" size={24} color="#FF4500" />
          <Ionicons name="chatbubble-outline" size={24} color="#898989" />
          <Ionicons name="notifications-outline" size={24} color="#898989" />
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
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  communitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
  },
  communitySelectorText: {
    flex: 1,
    marginLeft: 8,
    color: "#898989",
  },
  postTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  postTypeButton: {
    alignItems: "center",
  },
  activePostType: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF4500",
  },
  postTypeLabel: {
    fontSize: 12,
    color: "#898989",
    marginTop: 4,
  },
  activePostTypeLabel: {
    color: "#FF4500",
  },
  titleInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "bold",
  },
  contentInput: {
    height: 150,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 8,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  tagsLabel: {
    marginRight: 8,
    color: "#898989",
  },
  tagButton: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeTag: {
    backgroundColor: "#FF4500",
    borderColor: "#FF4500",
  },
  tagText: {
    color: "#898989",
    fontSize: 12,
  },
  activeTagText: {
    color: "#FFFFFF",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#F6F7F8",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#898989",
  },
  postButton: {
    flex: 1,
    backgroundColor: "#FF4500",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    paddingVertical: 10,
  },
});
