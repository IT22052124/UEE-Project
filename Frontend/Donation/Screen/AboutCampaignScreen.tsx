import React from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function DonationDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { campaign } = route.params; // Get campaign details from route params

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
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
          {campaign.description} {/* Ensure your campaign has a description field */}
          <Text style={styles.moreLink}>More</Text>
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${(campaign.fundRaised / campaign.amountRequired) * 100}%` }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressText}>
              {campaign.fundRaised}/{campaign.amountRequired}
            </Text>
            <Text style={styles.progressPercentage}>
              {((campaign.fundRaised / campaign.amountRequired) * 100).toFixed(0)}%
            </Text>
          </View>
        </View>

        <View style={styles.amountInfo}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount Required :</Text>
            <Text style={styles.amountValue}>Rs {campaign.amountRequired}/-</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount Raised :</Text>
            <Text style={styles.amountValue}>Rs {campaign.fundRaised}/-</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.donateButton}
          accessibilityLabel="Donate Now"
          onPress={() => navigation.navigate('CampaignDonation', { campaign })}
        >
          <Text style={styles.donateButtonText}>Donate Now</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  header: {
    paddingVertical: 15, // Reduced padding vertically to decrease header height

    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5, // Adds shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, // Adds shadow for iOS
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
    fontSize: 26,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
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
    backgroundColor: '#007AFF',
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
  amountInfo: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: '#3C3C43',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  donateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginHorizontal: 16,
    marginBottom: 32,
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
