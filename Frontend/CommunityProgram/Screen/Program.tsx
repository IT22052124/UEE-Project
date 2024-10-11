import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';  // Axios for API calls
import { IPAddress } from "../../globals";
import { useNavigation } from '@react-navigation/native';

const ProgramItem = ({ name, type, description, location, isExpanded, onToggle, onEnroll, onLocationPress  }) => (
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
        <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
            <Text style={styles.buttonText}>Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.enrollButton} onPress={onEnroll}>
            <Text style={styles.buttonText}>Enroll</Text>
          </TouchableOpacity>
        </View>
      </View>
    )}
  </View>
);

const email = 'afhamuzumaki34@gmail.com'; // You can replace this with dynamic user email

export default function CommunityProgramsScreen() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [notEnrolledPrograms, setNotEnrolledPrograms] = useState([]);
  const navigation = useNavigation(); // Initialize navigation
  useEffect(() => {
    const fetchNotEnrolledPrograms = async () => {
      try {
        const response = await axios.get(`http://${IPAddress}:5000/Program/unenrolled-programs?userEmail=${email}`);
        console.log(response.data);
        setNotEnrolledPrograms(response.data.data || []); // Ensure it's an array
      } catch (error) {
        console.error('Error fetching not enrolled programs:', error);
      }
    };

    fetchNotEnrolledPrograms();
  }, []);

  const handleEnroll = async (programId) => {
    try {
      // Call your API to enroll the user in the program
      const response=await axios.put(`http://${IPAddress}:5000/Program/enroll`, {
        programId,
        userEmail: email, // Assuming email is defined
      });
      console.log(response.data);
      // Redirect to the enrolled community programs screen
      navigation.navigate('EnrolledProgram'); // Change this to your actual route name
    } catch (error) {
      console.error('Error enrolling in program:', error);
      // Optionally handle errors here, e.g., show an alert
    }
  };
  const handleLocationPress = (location) => {
    // Navigate to the MapScreen with location as a parameter
    navigation.navigate('Location', { location });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Programs</Text>
          <TouchableOpacity style={styles.enrolledButton} onPress={() => navigation.navigate('EnrolledProgram')}>
  <Text style={styles.enrolledButtonText}>Enrolled</Text>
</TouchableOpacity>

        </View>
        {notEnrolledPrograms.map((program, index) => (
          <ProgramItem
            key={index}
            name={program.title} // Ensure you're mapping correct field names
            type={program.label}
            description={program.description}
            location={program.address}
            isExpanded={expandedProgram === index}
            onToggle={() => setExpandedProgram(expandedProgram === index ? null : index)}
            onEnroll={() => handleEnroll(program._id)} // Pass the program ID
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth:50,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    left: 60,
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
