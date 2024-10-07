import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function DonationScreen() {
  const navigation = useNavigation(); // Initialize navigation
  const [emergencyHelpData, setEmergencyHelpData] = useState([]);
  const [showMoreCategories, setShowMoreCategories] = useState(false); // State to track if "See all" is clicked

  // Fetch data from backend
  useEffect(() => {
    axios
      .get('http://172.20.10.2:5000/Donation/emergency')
      .then((response) => {
        setEmergencyHelpData(response.data.donations);
      })
      .catch((error) => {
        console.error('Error fetching emergency help data:', error);
      });
  }, []);

  // Function to handle category selection
  const handleCategorySelect = (category) => {
    navigation.navigate('CatergoryScreen', { category }); // Navigate to CategoryScreen
  };

  // Function to toggle more categories
  const toggleMoreCategories = () => {
    setShowMoreCategories((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, Faizal</Text>
            <Text style={styles.subGreeting}>What do you want to donate today?</Text>
          </View>
          <Image source={{ uri: 'https://example.com/profile-pic.jpg' }} style={styles.profilePic} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#888" />
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categories}>
          {['All', 'Hunger', 'Medical'].map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelect(category)}>
              <View style={styles.categoryIcon}>
                <Ionicons name={getCategoryIcon(category)} size={24} color="#007AFF" />
              </View>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}

          {/* See all category */}
          <TouchableOpacity style={styles.categoryItem} onPress={toggleMoreCategories}>
            <View style={styles.categoryIcon}>
              <Ionicons name={getCategoryIcon('See all')} size={24} color="#007AFF" />
            </View>
            <Text style={styles.categoryText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Additional categories */}
        {showMoreCategories && (
          <View style={styles.moreCategories}>
            {['Education', 'Poverty', 'Disaster','Others'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelect(category)}>
                <View style={styles.categoryIcon}>
                  <Ionicons name={getCategoryIcon(category)} size={24} color="#007AFF" />
                </View>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Emergency help</Text>
        <View style={styles.emergencyHelp}>
          {emergencyHelpData.map((item, index) => (
            <View key={index} style={styles.emergencyItem}>
              <Image source={{ uri: item.image }} style={styles.emergencyImage} />
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyTitle}>{item.title}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
                </View>
                <Text style={styles.fundRaised}>Fund Raised: Rs.{item.amountRaised}/-</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Function to return icons for categories
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'All':
      return 'grid-outline';
    case 'Hunger':
      return 'restaurant-outline';
    case 'Poverty':
      return 'shirt-outline';
    case 'Education':
      return 'book-outline';
    case 'Medical':
      return 'medkit-outline';
    case 'Disaster':
      return 'leaf-outline';
      case 'Others':
      return 'leaf-outline';
    case 'See all':
      return 'chevron-forward-outline';
    default:
      return 'help-outline';
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moreCategories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#E8F0FE',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 12,
  },
  emergencyHelp: {
    gap: 15,
  },
  emergencyItem: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    overflow: 'hidden',
  },
  emergencyImage: {
    width: 100,
    height: 100,
  },
  emergencyInfo: {
    flex: 1,
    padding: 10,
  },
  emergencyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  progressBar: {
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 2.5,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2.5,
  },
  fundRaised: {
    fontSize: 12,
    color: '#666',
  },
});
