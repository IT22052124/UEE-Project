import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { IPAddress } from "../../globals";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

export default function JobListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newNotifications, setNewNotifications] = useState(0);
  const user = "66f55789b9c3be6113e48bae";

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
      fetchNotifications();
    }, [])
  );

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://${IPAddress}:5000/Job/Jobs`);
      setJobs(response.data);
      setFilteredJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Could not fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://${IPAddress}:5000/Job/notifications/${user}`
      );
      setNotifications(response.data); // First, set the notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
      Alert.alert("Error", "Could not fetch notifications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setNewNotifications(notifications.length); // Update the notification count once notifications are set
  }, [notifications]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.postedBy.companyName.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredJobs(filtered);
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => {
        navigation.navigate("JobDetailsScreen", { item: item });
      }}
    >
      <Image
        source={
          item.postedBy?.companyLogo
            ? { uri: item.postedBy.companyLogo }
            : require("./../notAvailabe.jpg")
        }
        style={styles.logo}
      />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobRecruiter}>{item.postedBy?.companyName}</Text>
        <View style={styles.statItem}>
          <MaterialIcons name="location-on" size={20} color="#666" />
          <Text style={styles.jobAddress}>{item.location}</Text>
        </View>
        <View style={styles.statItem}>
          <FontAwesome5 name="users" size={18} color="#4a90e2" />
          <Text style={styles.jobApplications}>
            {item?.applications} applications
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs or companies"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => navigation.navigate("JobNotificationsScreen")}
        >
          <Ionicons name="notifications" size={24} color="#4a90e2" />
          {newNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {newNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>Recently Added</Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loaderText}>Loading jobs...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
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
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 1,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    flex: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  notificationIcon: {
    marginLeft: 16,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
  },
  jobItem: {
    flexDirection: "row",
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
  logo: {
    width: 70,
    height: 70,
    borderRadius: 5,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobRecruiter: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  jobApplications: {
    fontSize: 14,
    color: "#4a90e2",
    paddingLeft: 5,
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
});
