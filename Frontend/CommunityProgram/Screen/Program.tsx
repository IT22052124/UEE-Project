import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; 
import { IPAddress } from "../../globals";
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
//import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from '@react-navigation/native';

const ProgramItem = ({ name, type, description, location, startDate, endDate, organizer, isExpanded, onToggle, onEnroll, onLocationPress }) => (
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
        <Text style={styles.programDescription}>
          {description} This is a {type.toLowerCase()} program organized by {organizer}. 
        </Text>
        <Text style={styles.programDate}>
          Start Date: {startDate} | End Date: {endDate}
        </Text>
        <Text style={styles.programLocation}>Location: {location}</Text>
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

 //const userDetails = await AsyncStorage.getItem("user");
     // const email = JSON.parse(userDetails)?.email;
const email = 'afhamuzumaki34@gmail.com'; 

export default function CommunityProgramsScreen() {
  const [expandedProgram, setExpandedProgram] = useState(null);
  const [notEnrolledPrograms, setNotEnrolledPrograms] = useState([]);
  const navigation = useNavigation(); 

  
    const fetchNotEnrolledPrograms = async () => {
      try {
        const response = await axios.get(`http://${IPAddress}:5000/Program/unenrolled-programs?userEmail=${email}`);
        console.log(response.data);
        const programs = response.data.data || [];
        setNotEnrolledPrograms(programs);

        programs.forEach(program => {
          const startDate = new Date(program.startDate);
          const currentDate = new Date();

          if (startDate.toDateString() === currentDate.toDateString()) {
            scheduleNotification(program.title, startDate);
          }
        });
      } catch (error) {
        console.error('Error fetching not enrolled programs:', error);
      }
    };
    
  // useFocusEffect to trigger the data refresh when the page is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotEnrolledPrograms(); // This will run every time the screen is focused
  }, []));

  const handleEnroll = (programId) => {
    Alert.alert(
      'Confirm Enrollment',
      'Are you sure you want to enroll in this program?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Enrollment cancelled'),
          style: 'cancel',
        },
        {
          text: 'Enroll',
          onPress: async () => {
            try {
              const response = await axios.put(`http://${IPAddress}:5000/Program/enroll`, {
                programId,
                userEmail: email,
              });
              console.log(response.data);
              navigation.navigate('EnrolledProgram');
            } catch (error) {
              console.error('Error enrolling in program:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const scheduleNotification = async (title, date) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `New Program Starting: ${title}`,
        body: `A new program "${title}" is starting today! Check it out.`,
      },
      trigger: date,
    });
  };

  const handleLocationPress = (location) => {
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
            name={program.title}
            type={program.label}
            description={program.description}
            location={program.address}
            startDate={new Date(program.startDate).toLocaleDateString()}
            endDate={new Date(program.endDate).toLocaleDateString()}
            organizer={program.organizer}
            isExpanded={expandedProgram === index}
            onToggle={() => setExpandedProgram(expandedProgram === index ? null : index)}
            onEnroll={() => handleEnroll(program._id)}
            onLocationPress={() => handleLocationPress(program.address)}
          />
        ))}
      </ScrollView>
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
