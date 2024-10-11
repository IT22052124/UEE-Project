import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { IPAddress } from "../../globals";
import { useFocusEffect } from "@react-navigation/native";

const getFormattedDate = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface JobApplication {
  id: string;
  jobTitle: string;
  firstname: string;
  lastName: string;
  createdAt: String;
  resume: string;
  date: string;
  status: "Pending" | "Reviewed";
}

const ApplicationCard: React.FC<{ 
  application: JobApplication, 
  onStatusChange: (id: string, newStatus: string) => void 
}> = ({ application, onStatusChange }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    const fileUri = `${FileSystem.documentDirectory}${application._id}_resume.pdf`;

    try {
      const response = await FileSystem.downloadAsync(
        application.resume,
        fileUri
      );

      if (response.status === 200) {
        console.log("File downloaded successfully to:", fileUri);

        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Open Resume PDF",
          UTI: ".pdf",
        });

        await updateApplicationStatus(application._id, "Reviewed");
        onStatusChange(application._id, "Reviewed");
      } else {
        console.error("Download failed with status:", response.status);
        Alert.alert("Error", "Failed to download the resume. Please try again.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
      Alert.alert("Error", "An error occurred while downloading the resume.");
    } finally {
      setIsDownloading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await axios.patch(
        `http://${IPAddress}:5000/Job/updateStatus/${applicationId}`,
        { status: newStatus }
      );

      if (response.status === 200) {
        console.log(
          `Status updated to ${newStatus} for application ID: ${applicationId}`
        );
      } else {
        console.error(
          `Failed to update status. Status code: ${response.status}`
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.jobTitle}>{application.jobTitle}</Text>
          <Text style={styles.applicantName}>
            {application.firstname} {application.lastName}
          </Text>
          <Text style={styles.date}>
            {getFormattedDate(application.createdAt)}
          </Text>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={handleDownloadPdf}
            style={styles.downloadButton}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="download-outline" size={20} color="#fff" />
            )}
          </TouchableOpacity>
          <View
            style={[
              styles.statusButton,
              {
                backgroundColor:
                  application.status === "Reviewed" ? "#e0e7ff" : "#fff0e6",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    application.status === "Reviewed" ? "#4338ca" : "#ff8c00",
                },
              ]}
            >
              {application.status}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function JobApplicationsScreen() {
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  const fetchApplicationsByCompany = useCallback(async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;

      const response = await axios.get(
        `http://${IPAddress}:5000/Job/getApplication/${user}`
      );

      setApplications(response.data);
    } catch (error) {
      console.error("Error fetching applications by company:", error);
      Alert.alert(
        "Error",
        "Could not fetch job applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchApplicationsByCompany();
    }, [fetchApplicationsByCompany])
  );

  const handleStatusChange = useCallback((id: string, newStatus: string) => {
    setApplications((prevApplications) =>
      prevApplications.map((app) =>
        app._id === id ? { ...app, status: newStatus } : app
      )
    );
  }, []);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="document-text-outline" size={64} color="#a0aec0" />
      <Text style={styles.emptyStateText}>No recent applications</Text>
      <Text style={styles.emptyStateSubtext}>
        When you receive new applications, they'll appear here.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Applications</Text>
      </View>
      <View style={styles.separator} />
      {applications.length > 0 ? (
        <FlatList
          data={applications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ApplicationCard 
              application={item} 
              onStatusChange={handleStatusChange}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  leftContent: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 4,
  },
  applicantName: {
    fontSize: 16,
    color: "#4a5568",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#718096",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  downloadButton: {
    backgroundColor: "#4299e1",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a5568',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});