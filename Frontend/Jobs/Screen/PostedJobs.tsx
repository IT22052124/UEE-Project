import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import axios from "axios";
import { IPAddress } from "../../globals";
import { Ionicons, MaterialIcons } from "react-native-vector-icons";

const PostedJobsScreen = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const user = "670546e451d26ca2592fc40a";

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://${IPAddress}:5000/JobProvider/getJobs`,
          { params: { userId: user } }
        );
        setJobs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        Alert.alert("Error", "Could not fetch jobs. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const openDeleteModal = (jobId) => {
    setSelectedJobId(jobId);
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://${IPAddress}:5000/JobProvider/deleteJob/${selectedJobId}`
      );
      setJobs(jobs.filter((job) => job._id !== selectedJobId));
      setModalVisible(false);
      Alert.alert("Success", "Job deleted successfully!");
    } catch (error) {
      console.error("Error deleting job:", error);
      Alert.alert("Error", "Could not delete the job. Please try again.");
    }
  };

  const renderJobItem = ({ item }) => (
    <View style={styles.jobItem}>
      <Text style={styles.jobTitle}>{item.title}</Text>
      <Text style={styles.jobDescription}>{item.description}</Text>
      <View style={styles.jobDetails}>
        <Text style={styles.jobLocation}>📍 {item.location}</Text>
        <Text style={styles.jobSalary}>💵 RS.{item.salary}.00</Text>
      </View>
      <Text style={styles.jobSkills}>🛠️ Skills: {item.skills.join(", ")}</Text>

      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => openDeleteModal(item._id)}
      >
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>Posted Jobs 📋</Text>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.ID}
        contentContainerStyle={styles.container}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this job?
            </Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonConfirm]}
                onPress={confirmDelete}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
    alignSelf: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6200ee",
  },
  jobItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    position: "relative",
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  jobDescription: {
    fontSize: 15,
    color: "#555",
    marginBottom: 10,
  },
  jobDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  jobLocation: {
    fontSize: 14,
    color: "#777",
  },
  jobSalary: {
    fontSize: 14,
    color: "#777",
  },
  jobSkills: {
    fontSize: 14,
    color: "#555",
  },
  deleteIcon: {
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "70%",
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonCancel: {
    backgroundColor: "#ccc",
  },
  buttonConfirm: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default PostedJobsScreen;
