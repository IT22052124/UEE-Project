import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { IPAddress } from "../../globals";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JobNotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;
      const response = await axios.get(
        `http://${IPAddress}:5000/Job/notifications/${user}`
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Could not fetch notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;
      await axios.post(
        `http://${IPAddress}:5000/Job/notifications/${user}/${notificationId}`
      );
      setNotifications(notifications.filter((n) => n._id !== notificationId));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      Alert.alert(
        "Error",
        "Could not mark notification as read. Please try again."
      );
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => {
        markAsRead(item._id);
        navigation.navigate("JobDetailsScreen", { item: item.jobId });
      }}
    >
      <View style={styles.notificationContent}>
        <Ionicons
          name="briefcase-outline"
          size={24}
          color="#4a90e2"
          style={styles.icon}
        />
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>New Job Posted</Text>
          <Text style={styles.jobTitle}>{item.jobId?.title}</Text>
          <Text style={styles.companyName}>
            {item.jobId?.postedBy?.companyName}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Notifications</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loaderText}>Loading notifications...</Text>
        </View>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={50} color="#ccc" />
          <Text style={styles.emptyText}>No new notifications</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#f8f9fa",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 16,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 14,
    color: "#4a90e2",
    marginBottom: 2,
  },
  companyName: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4a90e2",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: "#999",
  },
});
