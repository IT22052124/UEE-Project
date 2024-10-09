import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

// Mock data for job listings
const jobListings = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    address: 'San Francisco, CA',
    recruiter: 'TechCorp Inc.',
    applications: 45,
    logo: 'https://example.com/techcorp-logo.png',
  },
  {
    id: '2',
    title: 'UX Designer',
    address: 'New York, NY',
    recruiter: 'DesignHub',
    applications: 32,
    logo: 'https://example.com/designhub-logo.png',
  },
  {
    id: '3',
    title: 'Data Scientist',
    address: 'Seattle, WA',
    recruiter: 'DataTech Solutions',
    applications: 28,
    logo: 'https://example.com/datatech-logo.png',
  },
  // Add more job listings as needed
]

export default function JobListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredJobs, setFilteredJobs] = useState(jobListings)

  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = jobListings.filter(job =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.recruiter.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredJobs(filtered)
  }

  const renderJobItem = ({ item }) => (
    <TouchableOpacity style={styles.jobItem} onPress={() => {/* Navigate to job details */}}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobRecruiter}>{item.recruiter}</Text>
        <Text style={styles.jobAddress}>{item.address}</Text>
        <Text style={styles.jobApplications}>{item.applications} applications</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search jobs or companies"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
        
      </View>
      <Text style={styles.headerTitle}>Recently Added</Text>

      

      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft:20,
    marginTop:10,
    marginBottom:10
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 1,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    width:'90%'
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  jobItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  jobRecruiter: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  jobAddress: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  jobApplications: {
    fontSize: 14,
    color: '#4a90e2',
  },
})