import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Import Axios for API calls
import { IPAddress } from '../../globals';
import { useNavigation } from '@react-navigation/native';

const ProgramItem = ({ name, type, description, location, isExpanded, onToggle, onLocationPress }) => (
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
        <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
);

export default function EnrolledProgramsScreen() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [enrolledPrograms, setEnrolledPrograms] = useState([]);  // State to hold enrolled programs
  const navigation = useNavigation(); // Initialize navigation
  const email = 'afhamuzumaki34@gmail.com'; // Replace with actual user's email

  useEffect(() => {
    const fetchEnrolledPrograms = async () => {
      try {
        // Replace with your actual backend URL
        const response = await axios.get(`http://${IPAddress}:5000/Program/enrolled-programs?userEmail=${email}`);
        setEnrolledPrograms(response.data.data); // Adjust based on your API response structure
      } catch (error) {
        console.error('Error fetching enrolled programs:', error);
      }
    };

    fetchEnrolledPrograms();
  }, []);

  const handleLocationPress = (location) => {
    // Navigate to the MapScreen with location as a parameter
    navigation.navigate('Location', { location });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Enrolled Programs</Text>
        </View>
        {enrolledPrograms.map((program, index) => (
          <ProgramItem
            key={index}
            name={program.title} // Ensure you're mapping correct field names
            type={program.label}
            description={program.description}
            location={program.address}
            isExpanded={expandedProgram === index}
            onToggle={() => setExpandedProgram(expandedProgram === index ? null : index)}
            onLocationPress={() => handleLocationPress(program.address)}  // Pass location to handler
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
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
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
  locationButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    alignSelf: 'flex-start',
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
