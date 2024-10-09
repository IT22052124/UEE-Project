import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
} from 'react-native'
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'

// Mock data for job details
const jobDetails = {
  id: '1',
  title: 'Senior Software Engineer',
  companyName: 'TechCorp Inc.',
  logo: 'https://example.com/techcorp-logo.png',
  address: 'San Francisco, CA',
  postedTime: '3 days ago',
  applications: 45,
  salary: '$120,000 - $150,000',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  description: 'We are seeking a talented Senior Software Engineer to join our dynamic team. The ideal candidate will have strong experience in full-stack development, with a focus on React and Node.js. You will be responsible for designing, developing, and maintaining high-performance web applications.\n\nResponsibilities:\n• Develop new features and improve existing ones\n• Collaborate with cross-functional teams\n• Mentor junior developers\n• Participate in code reviews and architectural discussions\n\nRequirements:\n• 5+ years of experience in software development\n• Strong proficiency in React, Node.js, and TypeScript\n• Experience with cloud platforms, preferably AWS\n• Excellent problem-solving and communication skills',
}

export default function JobDetailsScreen({ navigation }) {
  const handleApply = () => {
    // Implement apply logic here
    console.log('Applying for job')
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job opportunity: ${jobDetails.title} at ${jobDetails.companyName}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <View style={styles.companyInfo}>
          <Image source={{ uri: jobDetails.logo }} style={styles.logo} />
          <View style={styles.companyText}>
            <Text style={styles.companyName}>{jobDetails.companyName}</Text>
            <Text style={styles.jobTitle}>{jobDetails.title}</Text>
          </View>
        </View>

        <View style={styles.jobStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="location-on" size={20} color="#666" />
            <Text style={styles.statText}>{jobDetails.address}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.statText}>Posted {jobDetails.postedTime}</Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="users" size={20} color="#666" />
            <Text style={styles.statText}>{jobDetails.applications} applicants</Text>
          </View>
        </View>

        <View style={styles.salaryContainer}>
          <Text style={styles.salaryLabel}>Salary Range</Text>
          <Text style={styles.salaryAmount}>{jobDetails.salary}</Text>
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Required Skills</Text>
          <View style={styles.skillsList}>
            {jobDetails.skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Job Description</Text>
          <Text style={styles.descriptionText}>{jobDetails.description}</Text>
        </View>

        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  shareButton: {
    padding: 8,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  companyText: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: '#666',
  },
  jobStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  salaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  salaryAmount: {
    fontSize: 18,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  skillsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: '#333',
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})