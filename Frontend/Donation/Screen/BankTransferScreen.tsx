import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function BankTransferScreen({ route, navigation }) {
  const { campaign, value } = route.params;
  const [depositImage, setDepositImage] = useState('');

  const handleTransfer = () => {
    navigation.goBack();
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setDepositImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <LinearGradient colors={['#F9F9F9', '#F9F9F9']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#4a90e2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Donate</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.causeContainer}>
            <Text style={styles.causeTitle}>{campaign.title}</Text>
            <Text style={styles.donationAmount}>Amount (Rs): {value}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank Details</Text>
            <View style={styles.formContainer}>
              <DetailCard
                icon="person-outline"
                label="Account Holder"
                value={campaign.bankDetails.accountHolderName}
                color="green"
              />
              <DetailCard
                icon="card-outline"
                label="Account Number"
                value={campaign.bankDetails.accountNumber}
                color="blue"
              />
              <DetailCard
                icon="business-outline"
                label="Bank Name"
                value={campaign.bankDetails.bankName}
                color="red"
              />
              <DetailCard
                icon="location-outline"
                label="Branch"
                value={campaign.bankDetails.bankBranch}
                color="green"
              />
            </View>
          </View>

          {/* Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Complete the Transfer</Text>
            <View style={styles.instructionContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="cash-outline" size={24} color="green" style={styles.instructionIcon} />
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionTextBold}>Step-by-Step Instructions:</Text>
                  <Text style={styles.instructionText}>
                    1. Transfer the selected amount to the provided account details.
                  </Text>
                  <Text style={styles.instructionText}>
                    2. Include your name in the transfer details for identification.
                  </Text>
                  <Text style={styles.instructionText}>
                    3. Once the funds are received, they will be allocated to the specified cause.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Thank You Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thank You for Your Support!</Text>
            <View style={styles.instructionContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="heart-outline" size={24} color="green" style={styles.instructionIcon} />
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionTextBold}>Your Donation Makes an Impact:</Text>
                  <Text style={styles.instructionText}>
                    - Your contribution provides essential resources to those in need.
                  </Text>
                  <Text style={styles.instructionText}>
                    - You are helping to improve living conditions and uplift communities.
                  </Text>
                  <Text style={styles.instructionText}>
                    - Every bit counts! Your generosity will inspire others to give.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
            <Text style={styles.transferButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailCard = ({ icon, label, value, color }) => (
  <View style={styles.detailCard}>
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={color} />
    </View>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
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
  content: {
    padding: 16,
  },
  causeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  causeTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8,
  },
  donationAmount: {
    fontSize: 18,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2980B9',
    textAlign: 'center',
  },
  formContainer: {
    gap: 12,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  instructionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionIcon: {
    marginRight: 8,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  instructionTextBold: {
    fontWeight: '600',
    marginBottom: 8,
  },
  transferButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  transferButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
