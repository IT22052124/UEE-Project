import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

interface Card {
  accountName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

const AddCardScreen: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { accountName: '', cardNumber: '', expiryDate: '', cvc: '' },
  ]);
  const [activeCardIndex, setActiveCardIndex] = useState(0); // Track the currently active card

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  // Format card number for display
  const formattedCardNumber = cards[activeCardIndex].cardNumber
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Card</Text>
        </View>

        <View style={styles.cardPreview}>
          <Text style={styles.cardTitle}>CARD/BANK</Text>
          <Text style={styles.cardNumber}>{formattedCardNumber || '•••• •••• •••• ••••'}</Text>
          <View style={styles.cardBottom}>
            <Text style={styles.cardHolder}>{cards[activeCardIndex].accountName || 'CARD HOLDER'}</Text>
            <Text style={styles.cardCVC}>{cards[activeCardIndex].cvc || 'CVC'}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Card Details</Text>

          {/* Card Holder Input */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.input}
              value={cards[activeCardIndex].accountName}
              onChangeText={(text) => updateCard(activeCardIndex, 'accountName', text)}
            />
          </View>

          {/* Card Number Input */}
          <View style={styles.inputCard}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cards[activeCardIndex].cardNumber}
              onChangeText={(text) => updateCard(activeCardIndex, 'cardNumber', text)}
              keyboardType="numeric"
            />
          </View>

          {/* Expiry Date and CVC Input */}
          <View style={styles.row}>
            <View style={styles.inputCardHalf}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={cards[activeCardIndex].expiryDate}
                onChangeText={(text) => updateCard(activeCardIndex, 'expiryDate', text)}
              />
            </View>
            <View style={styles.inputCardHalf1}>
              <Text style={styles.label}>CVC</Text>
              <TextInput
                style={styles.input}
                value={cards[activeCardIndex].cvc}
                onChangeText={(text) => updateCard(activeCardIndex, 'cvc', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => {/* Handle save card logic here */}}
          >
            <View style={styles.checkbox}>
              {/* Checkbox for saving the card */}
            </View>
            <Text style={styles.checkboxLabel}>Save Card for Later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => {
        // Add new empty card when button is pressed
        setCards([...cards, { accountName: '', cardNumber: '', expiryDate: '', cvc: '' }]);
        setActiveCardIndex(cards.length); // Switch to the new card
      }}>
        <Text style={styles.addButtonText}>ADD CARD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 20,
    paddingBottom: 80, // Added padding to prevent content from hiding behind the button
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  cardPreview: {
    backgroundColor: '#4a69bd',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    height: 160,
  },
  cardTitle: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  cardNumber: {
    color: 'white',
    fontSize: 20,
    letterSpacing: 2,
    marginBottom: 60,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolder: {
    color: 'white',
    fontSize: 12,
  },
  cardCVC: {
    color: 'white',
    fontSize: 12,
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    paddingTop:5,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputCardHalf: {
    flex: 1,
    marginTop: 1,
    height:60,

    paddingTop:5,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  inputCardHalf1: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginLeft:8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingTop:5,
    marginTop: 1,
    height:60,

  },
  label: {
    fontSize: 14,
    marginTop: 1,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 15,
    fontSize: 16,
    
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#999',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f0a500',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCardScreen;
