import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNbkECXtEG_6-RV7CSNgNoYUGZE-JCliYm9g&s' }}
        style={styles.profileImage}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>Katty White</Text>
        <Text style={styles.location}>New York</Text>
        <Text style={styles.email}>Email: kattywhite@hotmail.com</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>678</Text>
            <Text style={styles.statLabel}>Publications</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>340</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>67k</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.followButton}>
          <Text style={styles.followButtonText}>FOLLOW</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contactIcons}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="call" size={24} color="#2196F3" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="mail" size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE082',
  },
  profileImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  followButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 270,
    right: 20,
  },
  iconButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
});
