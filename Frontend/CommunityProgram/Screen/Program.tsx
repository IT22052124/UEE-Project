import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Axios for API calls

const ProgramItem = ({ name, type, description, location, isExpanded, onToggle }) => (
  <View style={styles.programItem}>
    <TouchableOpacity onPress={onToggle} style={styles.programHeader}>
      <Text style={styles.programName}>{name}</Text>
      <View style={styles.programTypeContainer}>
        <Text style={styles.programType}>{type}</Text>
      </View>
      <Ionicons name={isExpanded ? 'chevron-up' : 'chevron-down'} size={24} color="#6b7280" />
    </TouchableOpacity>
    {isExpanded && (
      <View style={styles.programDetails}>
        <Text style={styles.programDescription}>{description}</Text>
        <Text style={styles.programLocation}>{location}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.locationButton}>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enrollButton}>
            <Text style={styles.buttonText}>Enroll</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

export default function CommunityProgramsScreen() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [notEnrolledPrograms, setNotEnrolledPrograms] = useState([]);

  useEffect(() => {
    const fetchNotEnrolledPrograms = async () => {
      try {
        // Replace with your actual backend URL and logged-in user's email
        const response = await axios.get('http://localhost:5000/Program/not-enrolled-programs/user@example.com');
        setNotEnrolledPrograms(response.data);
      } catch (error) {
        console.error('Error fetching not enrolled programs:', error);
      }
    };

    fetchNotEnrolledPrograms();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Unenrolled Community Programs</Text>
          <TouchableOpacity style={styles.enrolledButton}>
            <Text style={styles.enrolledButtonText}>Enrolled</Text>
          </TouchableOpacity>
        </View>
        {notEnrolledPrograms.map((program, index) => (
          <ProgramItem
            key={index}
            {...program}
            isExpanded={expandedProgram === index}
            onToggle={() => setExpandedProgram(expandedProgram === index ? null : index)}
          />
        ))}
      </ScrollView>
      <View style={styles.bottomNav}>
        {['cash-outline', 'sync-outline', 'people-outline', 'briefcase-outline', 'settings-outline'].map((icon, index) => (
          <View key={index} style={styles.navItem}>
            <Ionicons name={icon} size={24} color={index === 2 ? '#3b82f6' : '#6b7280'} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  enrolledButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  enrolledButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  programItem: {
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  programName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  programTypeContainer: {
    backgroundColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  programType: {
    fontSize: 14,
    color: '#3b82f6',
  },
  programDetails: {
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  programDescription: {
    marginBottom: 8,
    color: '#4b5563',
  },
  programLocation: {
    marginBottom: 8,
    color: '#6b7280',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  enrollButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  navItem: {
    alignItems: 'center',
  },
});
