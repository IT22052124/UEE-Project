import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { IPAddress } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UpdatedPostedJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;
      const response = await axios.get(
        `http://${IPAddress}:5000/JobProvider/getJobs`,
        { params: { userId: user } }
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      Alert.alert("Error", "Could not fetch jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (jobId) => {
    Alert.alert("Delete Job", "Are you sure you want to delete this job?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await axios.delete(
              `http://${IPAddress}:5000/JobProvider/deleteJob/${jobId}`
            );
            setJobs(jobs.filter((job) => job._id !== jobId));
            Alert.alert("Success", "Job deleted successfully!");
          } catch (error) {
            console.error("Error deleting job:", error);
            Alert.alert("Error", "Could not delete the job. Please try again.");
          }
        },
      },
    ]);
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobItem}>
      <View style={styles.jobContent}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobDescription}>{item.description}</Text>
        <View style={styles.jobDetails}>
          <Text style={styles.jobLocation}>📍 {item.location}</Text>
          <Text style={styles.jobSalary}>💰 RS.{item.salary}.00</Text>
        </View>
        <Text style={styles.jobSkills}>
          🛠️ Skills: {item.skills.join(", ")}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => confirmDelete(item._id)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4facfe" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Posted Jobs</Text>
      </View>

      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    alignSelf: "center",
    marginTop: 12,
    marginLeft: 10,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4facfe",
  },
  jobItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  jobContent: {
    marginRight: 24, // Make space for the delete button
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  jobDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  jobLocation: {
    fontSize: 14,
    color: "#4facfe",
  },
  jobSalary: {
    fontSize: 14,
    color: "#4facfe",
    marginTop: -30,
    marginRight: -30,
  },
  jobSkills: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    padding: 4,
  },
});
