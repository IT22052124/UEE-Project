import React, { useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const PRESET_AMOUNTS = ['200/-', '500/-', '1000/-', '1500/-'];

export default function DonateScreen({ route }) {
  const navigation = useNavigation();
  const { campaign } = route.params;
  const [selectedAmount, setSelectedAmount] = useState('');
  const { amountRaised, amountRequired } = campaign;

  const [customAmount, setCustomAmount] = useState('');
  const [value, setValue] = useState('');

  const maxDonation = amountRequired - amountRaised;

  const handleAmountSelect = (amount) => {
    if (parseInt(amount) > maxDonation) {
      Alert.alert('Invalid Amount', `You can only donate up to Rs ${maxDonation}/-`);
      return;
    }
    setSelectedAmount(amount);
    setValue(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (text) => {
    setCustomAmount(text);
    setSelectedAmount('');
    setValue(text);
  };

  const handleDonatePress = (paymentMethod) => {
    const donationAmount = selectedAmount || customAmount;

    if (paymentMethod === 'CardPayment') {
      if (!donationAmount || parseInt(donationAmount) <= 0) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Amount',
          text2: 'Please enter a valid donation amount to proceed with card payment.',
        });
        return;
      }

      if (parseInt(donationAmount) > maxDonation) {
        Alert.alert('Invalid Amount', `You can only donate up to Rs ${maxDonation}/-`);
        return;
      }
    }

    // Proceed with the navigation even if the amount is null for other payment methods
    navigation.navigate(paymentMethod, { campaign, value: donationAmount || '0' });
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

        <View style={styles.causeContainer}>
          <Image
            source={{ uri: campaign.image[0] }}
            style={styles.causeImage}
            accessibilityLabel={campaign.title}
          />
          <Text style={styles.causeTitle}>{campaign.title}</Text>
        </View>

        <Text style={styles.sectionTitle}>Amount (Rs)</Text>
        <View style={styles.amountContainer}>
          {PRESET_AMOUNTS.map((amount, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.amountButton,
                selectedAmount === amount && styles.selectedAmountButton,
              ]}
              onPress={() => handleAmountSelect(amount)}
            >
              <Text
                style={[
                  styles.amountButtonText,
                  selectedAmount === amount && styles.selectedAmountButtonText,
                ]}
              >
                {amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.orText}>or</Text>

        <View style={styles.customAmountContainer}>
          <TextInput
            style={styles.customAmountInput}
            placeholder="Enter Price Manually"
            placeholderTextColor="#999"
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.sectionTitle}>Choose Payment</Text>
        <View style={styles.paymentMethodsContainer}>
          <TouchableOpacity
            style={[styles.paymentButton, { backgroundColor: '#4CD964' }]}
            onPress={() => handleDonatePress('CardPayment')}
          >
            <Ionicons name="card-outline" size={24} color="white" style={styles.paymentIcon} />
            <Text style={styles.paymentButtonText}>Card Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButton, { backgroundColor: '#FF9800 ' }]}
            onPress={() => handleDonatePress('BankDeposits')}
          >
            <Ionicons name="business-outline" size={24} color="white" style={styles.paymentIcon} />
            <Text style={styles.paymentButtonText}>Bank Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButton, { backgroundColor: '#007AFF' }]}
            onPress={() => handleDonatePress('DirectTransfer')}
          >
            <Ionicons name="cash-outline" size={24} color="white" style={styles.paymentIcon} />
            <Text style={styles.paymentButtonText}>Organization</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
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
  causeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#FFF',
    borderRadius: 10,
    margin: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  causeImage: {
    width: 110,
    height: 110,
    borderRadius: 8,
    marginRight: 16,
  },
  causeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    marginLeft: 16,
    color: '#007AFF',
  },
  amountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  amountButton: {
    width: '48%',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  selectedAmountButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  amountButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedAmountButtonText: {
    color: '#FFF',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#8E8E93',
    marginVertical: 2,
    marginBottom:15
  },
  customAmountContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
    justifyContent: 'center',
  },
  customAmountInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFF',
    elevation: 2,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  paymentMethodsContainer: {
    paddingHorizontal: 15,
    marginBottom: 24,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  paymentIcon: {
    marginRight: 10,
  },
  paymentButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});
