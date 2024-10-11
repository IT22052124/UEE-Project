import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { IPAddress } from "../../globals";

export default function DonationScreen() {
  const navigation = useNavigation();
  const [emergencyHelpData, setEmergencyHelpData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Add filteredData state
  const [showMoreCategories, setShowMoreCategories] = useState(false);
  const [scrollY] = useState(new Animated.Value(0));
  const [searchQuery, setSearchQuery] = useState(''); // Add searchQuery state

  // Fetch data from backend
  const fetchEmergencyHelpData = async () => {
    try {
      const response = await axios.get(`http://${IPAddress}:5000/Donation/emergency`);
      setEmergencyHelpData(response.data.donations);
      setFilteredData(response.data.donations); // Initially, filteredData is the same as emergencyHelpData
    } catch (error) {
      console.error('Error fetching emergency help data:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchEmergencyHelpData();

    // Set up the interval to fetch data every 10 seconds
    const interval = setInterval(() => {
      fetchEmergencyHelpData();
    }, 10000); // Fetch every 10 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this runs once on mount

  // Handle search query change
  const handleSearch = (text) => {
    setSearchQuery(text);

    // Filter the emergencyHelpData based on the search query
    const filtered = emergencyHelpData.filter((item) =>
      item.title.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredData(filtered); // Update the filteredData state
  };

  const handleCategorySelect = (category) => {
    navigation.navigate('CatergoryScreen', { category });
  };

  const handleCampaignSelect = (campaign) => {
    navigation.navigate('AboutScreen', { campaign });
  };

  // Function to toggle more categories
  const toggleMoreCategories = () => {
    setShowMoreCategories((prev) => !prev);
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [125, 100],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient colors={['#4a90e2', '#63b3ed']} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Hello, Faizal</Text>
              <Text style={styles.subGreeting}>What do you want to donate today?</Text>
            </View>
            <Image source={{ uri: 'https://example.com/profile-pic.jpg' }} style={styles.profilePic} />
          </View>
        </LinearGradient>
      </Animated.View>

      <Animated.ScrollView
        style={styles.container}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#888"
            value={searchQuery} // Bind the searchQuery state to the input
            onChangeText={handleSearch} // Call handleSearch on text change
          />
        </View>

        <Text style={styles.sectionTitle}>Categories</Text>

        <View style={styles.categories}>
          {['All', 'Hunger', 'Medical'].map((category, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelect(category)}>
              <LinearGradient colors={['#63b3ed', '#4299e1']} style={styles.categoryIcon}>
                <Ionicons name={getCategoryIcon(category)} size={24} color="#fff" />
              </LinearGradient>
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}

          {/* See all category */}
          <TouchableOpacity style={styles.categoryItem} onPress={toggleMoreCategories}>
            <View style={styles.categoryIcon}>
              <LinearGradient colors={['#63b3ed', '#4299e1']} style={styles.categoryIcon}>
                <Ionicons name={getCategoryIcon('See all')} size={24} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.categoryText}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Additional categories */}
        {showMoreCategories && (
          <View style={styles.moreCategories}>
            {['Education', 'Poverty', 'Disaster', 'Others'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => handleCategorySelect(category)}>
                <View style={styles.categoryIcon}>
                  <LinearGradient colors={['#63b3ed', '#4299e1']} style={styles.categoryIcon}>
                    <Ionicons name={getCategoryIcon(category)} size={24} color="#fff" />
                  </LinearGradient>
                </View>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Emergency help</Text>
        <View style={styles.emergencyHelp}>
          {filteredData.map((item, index) => (
            <TouchableOpacity key={index} style={styles.emergencyItem} onPress={() => handleCampaignSelect(item)}>
              <Image source={{ uri: item.image[0] }} style={styles.emergencyImage} />
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyTitle}>{item.title}</Text>

                {/* Progress bar and percentage */}
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((item.amountRaised / item.amountRequired) * 100).toFixed(0)}%` }]} />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {((item.amountRaised / item.amountRequired) * 100).toFixed(0)}%
                  </Text>
                </View>

                <Text style={styles.fundRaised}>Fund Required: Rs.{item.amountRequired}/-</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const getCategoryIcon = (category) => {
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
      return 'nuclear-outline';
    case 'See all':
      return 'chevron-forward-outline';
    default:
      return 'help-outline';
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  progressPercentage: {
    position: 'absolute',
    right: 0,
    bottom: -15, // Adjust this to position percentage below the progress bar
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressBarContainer: {
    position: 'relative',
    marginBottom: 10, // Adjust as needed for spacing
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#e6f2ff',
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2d3748',
  },
  categoriesScroll: {
    marginBottom: 20,
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
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#2d3748',
  },
  emergencyHelp: {
    marginBottom: 20,
  },
  emergencyItem: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emergencyImage: {
    marginTop: 2,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  emergencyInfo: {
    flex: 1,
    padding: 12,
  },
  emergencyTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    marginTop: -5,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
    marginBottom: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3CB371',
  },
  fundRaised: {
    fontSize: 13,
    color: '#4a5568',
  },
});