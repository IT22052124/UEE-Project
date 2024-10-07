import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput,StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';

interface DonationCampaign {
  id: string;
  title: string;
  image: string;
  fundRaised: number;
  category: string; // Add category to donation campaigns
}

export default function CategoryScreen() {
  const [allDonations, setAllDonations] = useState<DonationCampaign[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<DonationCampaign[]>([]);
  const route = useRoute();
  const navigation = useNavigation();

  const { category } = route.params; // Get the selected category from route params
  console.log(category);
  // Fetch all donations from backend
  useEffect(() => {
    axios.get('http://172.20.10.2:5000/Donation')
      .then(response => {
        console.log(response.data.donations)
        setAllDonations(response.data.donations);
      })
      .catch(error => {
        console.error('Error fetching all donations:', error);
      });
  }, []);

  // Filter donations based on the selected category
  useEffect(() => {
    if (category === 'All') {
      setFilteredDonations(allDonations); // Show all donations if 'All' is selected
    } else {
      const filtered = allDonations.filter(donation => donation.category === category);
      setFilteredDonations(filtered);
    }
    console.log(filteredDonations)
  }, [category, allDonations]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category} Campaigns</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Campaigns"
          placeholderTextColor="#8E8E93"
        />
      </View>

      <ScrollView style={styles.campaignList}>
        {filteredDonations.map((campaign) => (
          <View key={campaign.Id} style={styles.campaignCard}>
            <Image source={{ uri: campaign.image }} style={styles.campaignImage} />
            <View style={styles.campaignInfo}>
              <Text style={styles.campaignTitle}>{campaign.title}</Text>
              <View style={styles.progressBar}>
                <View style={styles.progressFill} />
              </View>
              <Text style={styles.fundRaised}>Fund Raised: Rs.{campaign.fundRaised}/-</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    margin: 16,
    marginBottom: 5,
    borderRadius: 10,
    padding: 8,
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
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  campaignImage: {
    width: 100,
    height: 100,
  },
  campaignInfo: {
    flex: 1,
    padding: 12,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E5EA',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    width: '60%', // This should be dynamic based on actual progress
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  fundRaised: {
    fontSize: 14,
    color: '#8E8E93',
  },
});
