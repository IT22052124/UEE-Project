import React, { useState } from "react";
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
import { useFocusEffect } from '@react-navigation/native';

export default function UpdatedPostedJobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchJobs();
    }, [])
  );

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

  const handleUpdateJob = (jobId) => {
    navigation.navigate("UpdateJobScreen", { jobId });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleJobDescription = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity onPress={() => toggleJobDescription(item._id)}>
      <View style={styles.jobItem}>
        <View style={styles.jobContent}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          {expandedJobId === item._id && (
            <Text style={styles.jobDescription}>{item.description}</Text>
          )}
          <View style={styles.jobDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={16} color="#4a5568" />
              <Text style={styles.jobLocation}>{item.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="cash-outline" size={16} color="#4a5568" />
              <Text style={styles.jobSalary}>RS.{item.salary}.00</Text>
            </View>
          </View>
          <View style={styles.skillsContainer}>
            <Ionicons name="construct-outline" size={16} color="#4a5568" />
            <Text style={styles.jobSkills}>{item.skills.join(", ")}</Text>
          </View>
          <View style={styles.createdAtContainer}>
            <Ionicons name="calendar-outline" size={16} color="#4a5568" />
            <Text style={styles.createdAt}>Posted on: {formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleUpdateJob(item._id)}
          >
            <MaterialIcons name="edit" size={24} color="#4299e1" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => confirmDelete(item._id)}
          >
            <MaterialIcons name="delete-outline" size={24} color="#e53e3e" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAddNewJob = () => {
    navigation.navigate("JobPostingScreen");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Posted Jobs</Text>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddNewJob}>
        <Ionicons name="add" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginHorizontal: 20,
  },
  listContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4299e1",
  },
  jobItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobContent: {
    marginRight: 24,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
  },
  jobDescription: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 16,
  },
  jobDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobLocation: {
    fontSize: 14,
    color: "#4a5568",
    marginLeft: 4,
  },
  jobSalary: {
    fontSize: 14,
    color: "#4a5568",
    marginLeft: 4,
  },
  skillsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  jobSkills: {
    fontSize: 14,
    color: "#4a5568",
    marginLeft: 4,
  },
  createdAtContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  createdAt: {
    fontSize: 14,
    color: "#718096",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  updateButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 10,
    backgroundColor: "#4299e1",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});