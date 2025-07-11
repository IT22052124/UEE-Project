import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import {IPAddress} from "../../globals"
interface DonationCampaign {
  id: string;
  title: string;
  image: string;
  amountRaised: number;
  amountRequired: number;
  category: string;
}

export default function CategoryScreen() {
  const [allDonations, setAllDonations] = useState<DonationCampaign[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<DonationCampaign[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const route = useRoute();
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));

  const { category } = route.params;

  useEffect(() => {
    axios.get(`http://${IPAddress}:5000/Donation/all`)
      .then(response => {
        setAllDonations(response.data.donations);
      })
      .catch(error => {
        console.error('Error fetching all donations:', error);
      });
  }, []);

  useEffect(() => {
    let filtered = allDonations;

    if (category !== 'All') {
      filtered = filtered.filter(donation => donation.category === category);
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(donation => 
        donation.title.toLowerCase().includes(lowercasedQuery)
      );
    }

    setFilteredDonations(filtered);
  }, [category, searchQuery, allDonations]);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [100, 100],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient colors={['#4a90e2', '#63b3ed']} style={styles.headerGradient}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category} Campaigns</Text>
        </LinearGradient>
      </Animated.View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Campaigns"
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <Animated.ScrollView
        style={styles.campaignList}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {filteredDonations.map((campaign) => {
          const progressPercentage = ((campaign.amountRaised / campaign.amountRequired) * 100).toFixed(0);
          return (
            <TouchableOpacity
              key={campaign.Id}
              style={styles.campaignCard}
              onPress={() => navigation.navigate('AboutScreen', { campaign })}
            >
              <Image source={{ uri: campaign.image[0] }} style={styles.campaignImage} />
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
                </View>
                <Text style={styles.percentageText}>{progressPercentage}% </Text>
                <Text style={styles.fundRaised}>Fund Required: Rs.{campaign.amountRequired}/-</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FAFC',
  },
  header: {
    overflow: 'hidden',
  },
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    marginLeft: 0,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  headerTitle: {
    marginLeft: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 18,
    marginTop: -20,
    borderRadius: 25,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  campaignList: {
    padding: 16,
  },
  campaignCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingTop: 2,
  },
  campaignImage: {
    marginTop: 2,
    width: 110,
    height: 110,
    borderRadius: 15,
  },
  campaignInfo: {
    flex: 1,
    padding: 16,
  },
  campaignTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 8,
    marginTop: -10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3CB371',
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 11,
    color: 'black',
    textAlign: 'right',
    marginBottom: -3,
    fontWeight: 'bold',
  },
  fundRaised: {
    fontSize: 13,
    color: '#4a5568',
    marginBottom: -5,
  },
});
