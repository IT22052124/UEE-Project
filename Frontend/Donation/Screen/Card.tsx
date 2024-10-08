import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

interface Card {
  accountName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

const { width } = Dimensions.get('window');

const AddCardScreen: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([
    { accountName: '', cardNumber: '', expiryDate: '', cvc: '' },
  ]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const updateCard = (index: number, field: keyof Card, value: string) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
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
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Card</Text>
          </View>

          <LinearGradient
            colors={['#4a69bd', '#4a69bd']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardPreview}
          >
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
                onChangeText={(text) => updateCard(activeCardIndex, 'cardNumber', text)}
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
                  onChangeText={(text) => updateCard(activeCardIndex, 'expiryDate', text)}
                />
              </View>
              <View style={[styles.inputCard1, styles.halfWidth]}>
                <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="CVC"
                  placeholderTextColor="#999"
                  value={cards[activeCardIndex].cvc}
                  onChangeText={(text) => updateCard(activeCardIndex, 'cvc', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setIsSaved(!isSaved)}
            >
              <View style={[styles.checkbox, isSaved && styles.checkboxChecked]}>
                {isSaved && (
                  <Svg width="12" height="9" viewBox="0 0 12 9">
                    <Path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </Svg>
                )}
              </View>
              <Text style={styles.checkboxLabel}>Save Card for Later</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setCards([...cards, { accountName: '', cardNumber: '', expiryDate: '', cvc: '' }]);
          setActiveCardIndex(cards.length);
        }}
      >
        <Text style={styles.addButtonText}>ADD CARD</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    color: 'white',
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  inputCard1: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginLeft:8,
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
    width: (width - 64) / 2 - 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#5f72bd',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#5f72bd',
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
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddCardScreen;