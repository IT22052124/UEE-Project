import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Define the structure of a job application
interface JobApplication {
  id: string;
  jobTitle: string;
  applicantName: string;
  resumePdfUrl: string;
}

// Sample data (replace this with your actual data source)
const jobApplications: JobApplication[] = [
  {
    id: '1',
    jobTitle: 'Software Engineer',
    applicantName: 'John Doe',
    resumePdfUrl: 'https://example.com/johndoe_resume.pdf',
  },
  {
    id: '2',
    jobTitle: 'Product Manager',
    applicantName: 'Jane Smith',
    resumePdfUrl: 'https://example.com/janesmith_resume.pdf',
  },
  // Add more job applications as needed
];

const ApplicationCard: React.FC<{ application: JobApplication }> = ({ application }) => {
  const handleOpenPdf = async () => {
    const supported = await Linking.canOpenURL(application.resumePdfUrl);
    if (supported) {
      await Linking.openURL(application.resumePdfUrl);
    } else {
      console.log("Don't know how to open this URL: " + application.resumePdfUrl);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.jobTitle}>{application.jobTitle}</Text>
      <Text style={styles.applicantName}>{application.applicantName}</Text>
      <TouchableOpacity onPress={handleOpenPdf} style={styles.pdfButton}>
        <Text style={styles.pdfButtonText}>Open Resume PDF</Text>
      </TouchableOpacity>
    </View>
  );
};

export default function JobApplicationsScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>Job Applications</Text>
      <FlatList
        data={jobApplications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ApplicationCard application={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 16,
    marginBottom: 12,
  },
  pdfButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  pdfButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});