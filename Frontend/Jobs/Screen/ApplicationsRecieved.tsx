import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';

// Define the structure of a job application
interface JobApplication {
  id: string;
  jobTitle: string;
  applicantName: string;
  resumePdfUrl: string;
  date: string;
  status: 'Pending' | 'Reviewed';
}

// Sample data (replace this with your actual data source)
const jobApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Software Engineer',
    applicantName: 'John Doe',
    resumePdfUrl: 'https://firebasestorage.googleapis.com/v0/b/frontend-web-e454c.appspot.com/o/jobDocuments%2F66f3dda2bd01bea47d940c63_1728498780064_document.pdf?alt=media&token=7c8c18c9-6112-4006-af15-6547f00e2ab0',
    date: 'Mon. July 3rd',
    status: 'Reviewed',
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    applicantName: 'Jane Smith',
    resumePdfUrl: 'https://example.com/janesmith_resume.pdf',
    date: 'Tue. July 4th',
    status: 'Pending',
  },
  // Add more job applications as needed
];

const ApplicationCard: React.FC<{ application: JobApplication }> = ({ application }) => {
  const handleDownloadPdf = async () => {
    const fileUri = `${FileSystem.documentDirectory}${application.id}_resume.pdf`;

    try {
      const response = await FileSystem.downloadAsync(application.resumePdfUrl, fileUri);
      
      if (response.status === 200) {
        console.log("File downloaded successfully to:", fileUri);
        
        await Sharing.shareAsync(fileUri, {
          dialogTitle: 'Open Resume PDF',
          UTI: '.pdf',
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
        <View>
          <Text style={styles.jobTitle}>Job: {application.jobTitle}</Text>
          <Text style={styles.applicantName}>{application.applicantName}</Text>
          <Text style={styles.date}>{application.date}</Text>
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={handleDownloadPdf}
            style={[
              styles.statusButton,
              { backgroundColor: application.status === 'Reviewed' ? '#e0e7ff' : '#fff0e6' }
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: application.status === 'Reviewed' ? '#4338ca' : '#ff8c00' }
              ]}
            >
              {application.status}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function JobApplicationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="#000" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Recent Applications</Text>
          <Text style={styles.headerSubtitle}>Below are your most recent applications</Text>
        </View>
      </View>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTextContainer: {
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  applicantName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});