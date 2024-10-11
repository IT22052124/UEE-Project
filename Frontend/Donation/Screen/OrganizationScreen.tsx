import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function DirectTransferScreen({ route, navigation }) {
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
         
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Organization Details</Text>
            <View style={styles.formContainer}>
              <DetailCard
                icon="business-outline"
                label="Organization name"
                value={campaign.directCash.orgName}
                color="orange"
              />
              <DetailCard
                icon="call-outline"
                label="Telephone Number"
                value={campaign.directCash.phone}
                color="blue"
              />
              <DetailCard
                icon="location-outline"
                label="Address"
                value={campaign.directCash.address}
                color="green"
              />
            </View>
          </View>

          {/* Updated Instructions Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <View style={styles.instructionContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="cash-outline" size={24} color="#4a90e2" style={styles.instructionIcon} />
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionTextBold}>Instructions for Donation:</Text>
                  <Text style={styles.instructionText}>
                    - You can visit the government organization to make a direct donation.
                  </Text>
                  <Text style={styles.instructionText}>
                    - Carry proper identification and reference the donation campaign:{" "}
                    <Text style={styles.highlight}>{campaign.title}</Text>.
                  </Text>
                  <Text style={styles.instructionText}>
                    - Request a receipt or proof of donation from the organization.
                  </Text>
                  <Text style={styles.instructionText}>
                    - For assistance, contact the organization's representative.
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Updated Thank You Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle1}>Thank You!</Text>
            <View style={styles.instructionContainer}>
              <View style={styles.instructionItem}>
                <Ionicons name="heart-outline" size={24} color="green" style={styles.instructionIcon} />
                <View style={styles.instructionTextContainer}>
                  <Text style={styles.instructionTextBold}>Your Support Makes a Difference:</Text>
                  <Text style={styles.instructionText}>
                    - Your donation helps provide essential resources to those in need.
                  </Text>
                  <Text style={styles.instructionText}>
                    - It contributes to community development and better living conditions.
                  </Text>
                  <Text style={styles.instructionText}>
                    - Every contribution counts and plays a vital role in supporting various initiatives.
                  </Text>
                  <Text style={styles.instructionText}>
                    - Your kindness inspires others to join the cause and create a positive impact.
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
    marginBottom: 35,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2980B9',
  },
  sectionTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: 'green',
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
    marginBottom: 14,
  },
  instructionIcon: {
    marginRight: 12,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTextBold: {
    fontWeight: 'bold',
    marginBottom: 15,
  },
  instructionText: {
    marginLeft:-32,
    marginBottom: 10,
    fontSize: 14,
    color: '#444',
  },
  highlight: {
   
    color: '#2980B9',
  },
  transferButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferButtonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
