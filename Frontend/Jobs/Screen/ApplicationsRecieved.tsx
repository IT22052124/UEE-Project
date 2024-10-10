import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { IPAddress } from "../../globals";
import { useFocusEffect } from "@react-navigation/native";
// Define the structure of a job application
interface JobApplication {
  id: string;
  jobTitle: string;
  applicantName: string;
  resumePdfUrl: string;
  date: string;
  status: "Pending" | "Reviewed";
}

// Sample data (replace this with your actual data source)
const jobApplications: JobApplication[] = [
  {
    id: "1",
    jobTitle: "Software Engineer",
    applicantName: "John Doe",
    resumePdfUrl:
      "https://firebasestorage.googleapis.com/v0/b/frontend-web-e454c.appspot.com/o/jobDocuments%2F66f3dda2bd01bea47d940c63_1728498780064_document.pdf?alt=media&token=7c8c18c9-6112-4006-af15-6547f00e2ab0",
    date: "Mon. July 3rd",
    status: "Reviewed",
  },
  {
    id: "2",
    jobTitle: "Product Manager",
    applicantName: "Jane Smith",
    resumePdfUrl: "https://example.com/janesmith_resume.pdf",
    date: "Tue. July 4th",
    status: "Pending",
  },
  // Add more job applications as needed
];

const ApplicationCard: React.FC<{ application: JobApplication }> = ({
  application,
}) => {
  const handleDownloadPdf = async () => {
    const fileUri = `${FileSystem.documentDirectory}${application.id}_resume.pdf`;

    try {
      const response = await FileSystem.downloadAsync(
        application.resumePdfUrl,
        fileUri
      );

      if (response.status === 200) {
        console.log("File downloaded successfully to:", fileUri);

        await Sharing.shareAsync(fileUri, {
          dialogTitle: "Open Resume PDF",
          UTI: ".pdf",
        });
      } else {
        console.error("Download failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.leftContent}>
          <Text style={styles.jobTitle}>{application.jobTitle}</Text>
          <Text style={styles.applicantName}>{application.applicantName}</Text>
          <Text style={styles.date}>{application.date}</Text>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={handleDownloadPdf}
            style={styles.downloadButton}
          >
            <Ionicons name="download-outline" size={20} color="#fff" />
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
  const [applications, setApplications] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      fetchApplicationsByCompany();
    }, [])
  );

  const fetchApplicationsByCompany = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id; // Get the user's company ID

      console.log(user)
      // Fetch job applications for this company
      const response = await axios.get(
        `http://${IPAddress}:5000/Job/getApplication/${user}` // Assuming this endpoint fetches applications by company ID
      );

      setApplications(response.data); // Set the applications as job details
      console.log(applications);
    } catch (error) {
      console.error("Error fetching applications by company:", error);
      Alert.alert(
        "Error",
        "Could not fetch job applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Applications</Text>
      </View>
      <View style={styles.separator} />
      <FlatList
        data={jobApplications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ApplicationCard application={item} />}
        contentContainerStyle={styles.listContainer}
      />
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
});
