import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DirectTransferScreen = ({ route, navigation }) => {
  const { campaign, selectedAmount } = route.params; // Get campaign details and selected amount from route params

  const handleUploadImage = () => {
    // Logic for uploading the bank deposit image
    alert('Upload Image functionality to be implemented!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Direct Transfer</Text>
        </View>

        <View style={styles.causeContainer}>
          <Text style={styles.causeTitle}>{campaign.title}</Text>
          <Text style={styles.donationAmount}>Amount: {selectedAmount}</Text>
        </View>

        <Text style={styles.sectionTitle}>Bank Details</Text>
        <View style={styles.bankDetailsContainer}>
          <Text style={styles.bankDetailText}>Account Holder Name: {campaign.bankDetails.accountHolderName}</Text>
          <Text style={styles.bankDetailText}>Bank Name: {campaign.bankDetails.bankName}</Text>
          <Text style={styles.bankDetailText}>Account Number: {campaign.bankDetails.accountNumber}</Text>
          <Text style={styles.bankDetailText}>Branch: {campaign.bankDetails.branch}</Text>
        </View>

        <Text style={styles.sectionTitle}>Instructions for Bank Transfer</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionText}>
            1. Transfer the amount to the above account details.
          </Text>
          <Text style={styles.instructionText}>
            2. Use your name as the reference for the transfer.
          </Text>
          <Text style={styles.instructionText}>
            3. Ensure you retain the receipt for confirmation.
          </Text>
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
          <Text style={styles.uploadButtonText}>Upload Deposit Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  causeContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  causeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  donationAmount: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#007AFF',
  },
  bankDetailsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
  bankDetailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  instructionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DirectTransferScreen;
