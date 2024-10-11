import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity,ActivityIndicator, StyleSheet, SafeAreaView, ScrollView, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message'; // Import Toast
import LottieView from 'lottie-react-native';
import {IPAddress} from "../../globals"
const { width } = Dimensions.get('window');

export default function AddCardScreen({ route }) {
  const { campaign, value } = route.params; 
  const navigation = useNavigation();
  const [cards, setCards] = useState([{ accountName: '', cardNumber: '', expiryDate: '', cvc: '' }]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false); // Loading state

  const updateCard = (index: number, field: keyof typeof cards[0], value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
    validateForm(updatedCards[index]);
};

const validateForm = (card: typeof cards[0]) => {
    const isValid =
        card.accountName.trim() !== '' &&
        card.cardNumber.length === 12 &&
        /^\d{2}\/\d{2}$/.test(card.expiryDate) && // Check if the format is MM/YY
        card.cvc.length === 3;

    setIsFormValid(isValid);
};

const handleDonate = async () => {
  if (!isFormValid) return; // Do not proceed if form is not valid

  setLoading(true); // Set loading to true

  try {
    // Assuming you have the donation ID and selectedAmount from your props or state
    const id = campaign.Id; // Replace this with the actual donation ID
    const sanitizedAmount = parseFloat(value.replace(/[^0-9.]/g, ''));

    // Check if sanitizedAmount is a valid number
    if (isNaN(sanitizedAmount)) {
      throw new Error("Invalid amount. Please enter a numeric value.");
    }

 // Use the selected amount from your props

    // Update the donation amount using Axios PUT request
    const response = await axios.put(`http://${IPAddress}:5000/Donation/update/amount/${id}`, {
      amountRaised: sanitizedAmount, // Assuming the field to update is named 'amountRaised'
    });

    console.log('Donation amount updated successfully:', response.data);
   
    // Navigate to DoneScreen after successful update
    setTimeout(() => {
      Toast.show({
        type: 'success', // You can change this to 'error', 'info', etc.
        text1: 'Payment is successfull!',
        text2: 'Thank you for the Donation 👋'
      }) 
      setLoading(false); // Stop loading before navigating
      navigation.navigate("DoneScreen", { campaign, value,cards });
    }, 4000); 
   // 4-second delay

  } catch (error) {
    console.error('Error updating donation amount:', error.response ? error.response.data : error.message);
  } finally {
    // You can stop loading here if needed
  }
};



  const formattedCardNumber = cards[activeCardIndex].cardNumber
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  React.useEffect(() => {
    fadeIn();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? ( // Show loader when loading
        <View style={styles.loaderContainer}>
         <LottieView
      source={require('../../assets/loading.json')} // Lottie animation file path
      autoPlay
      loop
      style={{ width: 200, height: 200 }}

    />
          <Text style={styles.loadingText}>Payement on process...</Text>
        </View>
      ) : (
        <>
          <ScrollView style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient colors={['#F9F9F9', '#F9F9F9']} style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="#4a90e2" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Add Card</Text>
            </LinearGradient>
  
            <LinearGradient colors={['#4a69bd', '#4a69bd']} style={styles.cardPreview}>
              <View style={styles.cardChip} />
              <Text style={styles.cardTitle}>CARD/BANK</Text>
              <Text style={styles.cardNumber}>{formattedCardNumber || '•••• •••• •••• ••••'}</Text>
              <View style={styles.cardBottom}>
                <Text style={styles.cardHolder}>{cards[activeCardIndex].accountName || 'CARD HOLDER'}</Text>
                <Text style={styles.cardExpiry}>{cards[activeCardIndex].expiryDate || 'MM/YY'}</Text>
              </View>
            </LinearGradient>
  
            <View style={styles.form}>
              <Text style={styles.formTitle}>Card Details</Text>
  
              <View style={styles.inputCard}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Account Name"
                  placeholderTextColor="#999"
                  value={cards[activeCardIndex].accountName}
                  onChangeText={(text) => updateCard(activeCardIndex, 'accountName', text)}
                />
              </View>
  
              <View style={styles.inputCard}>
                <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Card Number"
                  placeholderTextColor="#999"
                  value={cards[activeCardIndex].cardNumber}
                  onChangeText={(text) => {
                    const filteredText = text.replace(/\D/g, '').slice(0, 12); // Allow only numbers and limit to 12 digits
                    updateCard(activeCardIndex, 'cardNumber', filteredText);
                  }}
                  keyboardType="numeric"
                />
              </View>
  
              <View style={styles.row}>
                <View style={[styles.inputCard, styles.halfWidth]}>
                  <Ionicons name="calendar-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor="#999"
                    value={cards[activeCardIndex].expiryDate}
                    onChangeText={(text) => {
                      const filteredText = text.replace(/[^0-9\/]/g, '').slice(0, 5); // Allow only numbers and '/' and limit to 5 characters
                      updateCard(activeCardIndex, 'expiryDate', filteredText);
                    }}
                  />
                </View>
  
                <View style={[styles.inputCard, styles.halfWidth]}>
                  <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="CVC"
                    placeholderTextColor="#999"
                    value={cards[activeCardIndex].cvc}
                    onChangeText={(text) => {
                      const filteredText = text.replace(/\D/g, '').slice(0, 3); // Allow only numbers and limit to 3 digits
                      updateCard(activeCardIndex, 'cvc', filteredText);
                    }}
                    keyboardType="numeric"
                  />
                </View>
              </View>
  
              <TouchableOpacity style={styles.checkboxContainer} onPress={() => setIsSaved(!isSaved)}>
                <View style={[styles.checkbox, isSaved && styles.checkboxChecked]}>
                  {isSaved && (
                    <Svg width="12" height="9" viewBox="0 0 12 9">
                      <Path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </Svg>
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Save Card for Later</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
  
          <TouchableOpacity
            style={[styles.addButton, !isFormValid && styles.disabledButton]}
            onPress={handleDonate}
            disabled={!isFormValid || loading}
          >
            <Text style={styles.addButtonText}>Donate Now</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  )}
  

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  container: {
    flex: 1,
    padding:10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20, // Space between the animation and the text
    fontSize: 18, // Font size of the text
    color: '#4a90e2', // Color of the text
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
  cardPreview: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    height: 200,
    justifyContent: 'space-between',
  },
  cardChip: {
    width: 50,
    height: 40,
    backgroundColor: '#f0a500',
    borderRadius: 8,
  },
  cardTitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginBottom: 10,
  },
  cardNumber: {
    color: 'white',
    fontSize: 22,
    letterSpacing: 2,
    marginBottom: 20,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolder: {
    color: 'white',
    fontSize: 14,
  },
  cardExpiry: {
    color: 'white',
    fontSize: 14,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#666',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a90e2',
    borderColor: '#4a90e2',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#4a90e2',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginTop: 20,
    marginHorizontal: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
