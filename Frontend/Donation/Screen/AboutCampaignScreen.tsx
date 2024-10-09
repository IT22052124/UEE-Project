import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DonationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { campaign } = route.params; // Get campaign details from route params

  const [isExpanded, setIsExpanded] = useState(false); // State to toggle description

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={['#F9F9F9', '#F9F9F9']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            accessibilityLabel="Go back"
          >
            <Ionicons name="arrow-back" size={24} color="#4a90e2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
        </LinearGradient>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: campaign.image[0] }} // Use campaign's image
            style={styles.image}
            accessibilityLabel={campaign.title} // Set accessibility label based on campaign title
          />
        </View>

        <Text style={styles.title}>{campaign.title}</Text>

        <Text style={styles.description}>
          {isExpanded ? campaign.description : `${campaign.description.substring(0, 100)}... `}
          <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
            <Text style={styles.moreLink}>{isExpanded ? ' Show Less' : ' More'}</Text>
          </TouchableOpacity>
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${((campaign.amountRaised / campaign.amountRequired) * 100).toFixed(0)}%`,
                },
              ]}
            />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              Rs {campaign.amountRaised}/{campaign.amountRequired}
            </Text>
            <Text style={styles.progressPercentage}>
              {((campaign.amountRaised / campaign.amountRequired) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        {/* Smaller Cards with Icons */}
        <View style={styles.card}>
          <Ionicons name="cash-outline" size={24} color="green" style={styles.cardIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Amount Required</Text>
            <Text style={styles.cardValue}>Rs {campaign.amountRequired}/-</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Ionicons name="trending-up-outline" size={24} color="orange" style={styles.cardIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Amount Raised</Text>
            <Text style={styles.cardValue}>Rs {campaign.amountRaised}/-</Text>
          </View>
        </View>

        {/* Card for Location */}
        <View style={styles.card}>
          <Ionicons name="location-outline" size={24} color="blue" style={styles.cardIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Location</Text>
            <Text style={styles.cardValue}>{campaign.location || 'Not specified'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Ionicons name="business-outline" size={24} color="red" style={styles.cardIcon} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Orgainzation Posted</Text>
            <Text style={styles.cardValue}>{campaign.organization || 'Not specified'}</Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.donateButton}
        accessibilityLabel="Donate Now"
        onPress={() => navigation.navigate('CampaignDonation', { campaign })}
      >
        <Text style={styles.donateButtonText}>Donate Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingBottom: 80, // Make space for the fixed button
  },
  scrollContainer: {
    paddingBottom: 80, // Ensures scrollable area has space for the button
  },
  header: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
  },
  backButton: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4a90e2',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 100,
  },
  imageContainer: {
    margin: 16,
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 2,
    color: '#333333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    marginHorizontal: 16,
    color: '#555555',
  },
  moreLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#333333',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333333',
  },
  card: {
    marginTop: 14,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10, // Smaller padding for smaller card
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row', // Align icon and text side by side
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardContent: {
    flex: 1, // Ensure text takes the rest of the space
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3C3C43',
  },
  cardValue: {
    fontSize: 14,
    color: '#333333',
  },
  donateButton: {
    position: 'absolute', // Fixed positioning
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    elevation: 5,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  donateButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
