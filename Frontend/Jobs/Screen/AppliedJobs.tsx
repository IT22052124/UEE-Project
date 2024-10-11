import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { IPAddress } from '../../globals';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AppliedJobsScreen({ navigation }) {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchAppliedJobs();
    }, [])
  );

  const fetchAppliedJobs = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem('user');
      const user = JSON.parse(userDetails)?._id;
      const response = await axios.get(`http://${IPAddress}:5000/Job/appliedJobs/${user}`);
      setAppliedJobs(response.data);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      Alert.alert('Error', 'Could not fetch applied jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderJobItem = ({ item }) => (
    <TouchableOpacity
      style={styles.jobItem}
      onPress={() => {
        navigation.navigate('JobDetailsScreen', { item: item.JobID });
      }}
    >
      <Image
        source={
          item.companyLogo
            ? { uri: item.companyLogo }
            : require('./../notAvailabe.jpg')
        }
        style={styles.logo}
      />
      <View style={styles.jobInfo}>
        <Text style={styles.jobTitle}>{item.jobTitle}</Text>
        <Text style={styles.jobRecruiter}>{item.companyName}</Text>
        <View style={styles.statItem}>
          <MaterialIcons name="location-on" size={16} color="#666" />
          <Text style={styles.jobAddress}>{item.JobID.location}</Text>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.statItem}>
            <FontAwesome5 name="calendar-alt" size={14} color="#4a90e2" />
            <Text style={styles.jobApplicationDate}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={[
            styles.statusIndicator,
            item.status === 'Reviewed' ? styles.statusReviewed : styles.statusPending
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'Reviewed' ? 'Reviewed' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Applied Jobs</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loaderText}>Loading applied jobs...</Text>
        </View>
      ) : appliedJobs.length > 0 ? (
        <FlatList
          data={appliedJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noJobsContainer}>
          <FontAwesome5 name="briefcase" size={50} color="#ccc" />
          <Text style={styles.noJobsText}>You haven't applied to any jobs yet.</Text>
          <TouchableOpacity
            style={styles.browseJobsButton}
            onPress={() => navigation.navigate('JobListScreen')}
          >
            <Text style={styles.browseJobsButtonText}>Browse Jobs</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  jobItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  jobAddress: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  jobApplicationDate: {
    fontSize: 14,
    color: '#4a90e2',
    marginLeft: 4,
  },
  statusIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: '#ffd700',
  },
  statusReviewed: {
    backgroundColor: '#4caf50',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4a90e2',
  },
  noJobsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noJobsText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  browseJobsButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  browseJobsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});