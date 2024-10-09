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
    alert('Transfer Successful!');
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
            <Text style={styles.donationAmount}>Amount(Rs): {value}</Text>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                1. Transfer the selected amount to the account details provided above.
                {'\n'}2. Include your name in the transfer details.
                {'\n'}3. Once after funds are received, it will be given to the specific cause.
              </Text>
            </View>
          </View>

          {/* Thank You Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thank You!</Text>
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Your generous donation will help make a difference in the lives of those in need. 
                {'\n'}1. Every contribution counts, and your support allows us to provide essential resources.
                {'\n'}2. Together, we can create positive change in our community.
                {'\n'}3. Thank you for being a part of this cause!
              </Text>
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
    color: '#007AFF',
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
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
  },
  instructionContainer: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  transferButton: {
    backgroundColor: '#28A745',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
