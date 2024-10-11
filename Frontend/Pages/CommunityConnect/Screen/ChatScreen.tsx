import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { IPAddress } from "../../../globals";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MessageItem = ({ item, SenderID }) => (
  <View
    style={[
      styles.messageContainer,
      item.sender === SenderID ? styles.myMessage : styles.otherMessage,
    ]}
  >
    <View style={styles.messageContent}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  </View>
);

export default function ChatScreen() {
  const route = useRoute();
  const recieverId = route.params?.recieverId || "66f55789b9c3be6113e48bae";
  const [ReceiverDetails, setReceiverDetails] = useState("");
  const [userId, setUserId] = useState("");
  const [messages, setMessages] = useState([
    {
      _id: "",
      text: "",
      sender: "",
      time: "",
    },
  ]);
  const [inputText, setInputText] = useState("");

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
    const fetchUserDetails = async () => {
      const id = await getUserFromAsyncStorage(); // Get the user ID from async storage
      setUserId(id);
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/User/users/${recieverId}`
        );
        setReceiverDetails(response.data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [recieverId]);

  useEffect(() => {
    const fetchMessages = async () => {
      const chatId = [userId, recieverId].sort().join("_");
      try {
        const response = await axios.get(
          `http://${IPAddress}:5000/Message/messages/${chatId}`
        );
        const fetchedMessages = response.data.messages.map((message) => ({
          _id: message._id,
          text: message.text,
          sender: message.sender,
          time:
            message.time ||
            new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }), // Format time
        }));

        setMessages(fetchedMessages);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchMessages();
  }, [userId, recieverId]);

  const sendMessage = async () => {
    if (inputText.trim() === "") return;
    const payload = {
      userId1: userId, // User initiating the chat
      userId2: recieverId, // Other user in the chat
      messageText: inputText,
      senderId: userId, // User sending the message
    };

    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/Message/create-chat`,
        payload
      );
      const newMessage = {
        _id: response.data.message._id,
        text: response.data.message.text,
        sender: response.data.message.sender,
        time: response.data.message.time, // Assuming the response has a 'time' field
      };

      // Update state with the new message
      setMessages([...messages, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Image
              source={{ uri: ReceiverDetails?.profilePic }}
              style={styles.avatar}
            />
            <Text style={styles.headerTitle}>{ReceiverDetails?.fullName}</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <MessageItem item={item} SenderID={userId} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          inverted
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#BBBBBB" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#888888"
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2C2C",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  messageList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  otherMessage: {
    alignSelf: "flex-start",
  },
  messageContent: {
    backgroundColor: "#1C1C1C",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  messageTime: {
    color: "#888888",
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#2C2C2C",
  },
  attachButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#1C1C1C",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    color: "#FFFFFF",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 8,
  },
});
