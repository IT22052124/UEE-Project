import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Button,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const DirectTransferScreen = ({ route, navigation }) => {
  const { campaign, selectedAmount } = route.params; // Get campaign details and selected amount from route params
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [branch, setBranch] = useState('');
  const [depositImage, setDepositImage] = useState('');

  const handleTransfer = () => {
    // Logic for processing the transfer can be added here
    alert('Transfer Successful!');
    navigation.goBack(); // Navigate back after transfer
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
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Account Holder Name"
            placeholderTextColor="#999"
            value={accountHolder}
            onChangeText={setAccountHolder}
          />
          <TextInput
            style={styles.input}
            placeholder="Account Number"
            placeholderTextColor="#999"
            value={accountNumber}
            onChangeText={setAccountNumber}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Bank Name"
            placeholderTextColor="#999"
            value={bankName}
            onChangeText={setBankName}
          />
          <TextInput
            style={styles.input}
            placeholder="Branch"
            placeholderTextColor="#999"
            value={branch}
            onChangeText={setBranch}
          />
        </View>

        <Text style={styles.instructionTitle}>Instructions for Bank Transfer:</Text>
        <Text style={styles.instructionText}>
          1. Transfer the selected amount to the account details provided above.
          {'\n'}2. Make sure to include your name in the transfer details.
          {'\n'}3. Upload an image of your bank deposit receipt below.
        </Text>

        <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
          <Text style={styles.uploadButtonText}>Upload Deposit Image</Text>
        </TouchableOpacity>

        {depositImage ? (
          <Image source={{ uri: depositImage }} style={styles.imagePreview} />
        ) : null}

        <TouchableOpacity style={styles.transferButton} onPress={handleTransfer}>
          <Text style={styles.transferButtonText}>Confirm Transfer</Text>
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
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  transferButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  transferButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DirectTransferScreen;
