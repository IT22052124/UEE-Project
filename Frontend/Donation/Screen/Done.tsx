import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print'; // Import Print
import * as Sharing from 'expo-sharing'; // Import Sharing

interface PaymentSuccessProps {
  refNumber: string;
  date: string;
  time: string;
  cardLastFour: string;
  amount: string;
  onDone: () => void;
  onShare: () => void;
}

export default function PaymentSuccessScreen({ route }) {
  const { campaign, value,  cards} = route.params;
  const navigation = useNavigation();

  // Generate reference number
  function generateRefNumber(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let refNumber = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      refNumber += characters[randomIndex];
    }
    return refNumber;
  }

  // Get current date and time
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  const hours = currentDate.getHours().toString().padStart(2, '0');
  const minutes = currentDate.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const referenceNumber = generateRefNumber(8); // Generate a reference number of length 8
  console.log(referenceNumber);

  // Function to create PDF
  const createPDF = async () => {
    const html = `
   <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Receipt</title>
    
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');
        
        body {
            font-family: 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #003366;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
        }
        .campaign-title {
            font-size: 20px;
            color: #003366;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 700;
        }
        .details {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .details p {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            font-size: 14px;
        }
        .details strong {
            color: #003366;
        }
        .thank-you {
            text-align: center;
            font-size: 18px;
            color: #003366;
            margin-top: 20px;
            font-weight: 700;
        }
        .footer {
            background-color: #f0f0f0;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            color: #666;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 10px;
        }
        .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 100px;
            color: rgba(0, 51, 102, 0.05);
            pointer-events: none;
            z-index: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
        
           
            <h1>Donation Receipt</h1>
        </div>
        <div class="content">
            <div class="watermark">RECEIPT</div>
            <div class="campaign-title">${campaign.title}</div>
            <div class="details">
                <p><strong>Reference Number:</strong> <span>${referenceNumber}</span></p>
                <p><strong>Date:</strong> <span>${formattedDate}</span></p>
                <p><strong>Time:</strong> <span>${formattedTime}</span></p>
                <p><strong>Card:</strong> <span>**** **** **** ${cards[0].cardNumber.slice(8)}</span></p>
                <p><strong>Amount:</strong> <span>Rs. ${value}</span></p>
            </div>
            <div class="thank-you">
                Thank you for your generous contribution!
            </div>
        </div>
        <div class="footer">
            This is an official receipt. No signature is required.
        </div>
    </div>
</body>
</html>
    `;

    // Create the PDF
    const { uri } = await Print.printToFileAsync({
      html,
      width:  600, // Width in mm
      height: 600, // Height in mm
      // Set orientation if needed
    });
    await Sharing.shareAsync(uri);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LinearGradient colors={['#F9F9F9', '#F9F9F9']} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityLabel="Go back">
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={80} color="white" />
          </View>

          <Text style={styles.successText}>Payment Success!</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ref number</Text>
              <Text style={styles.detailValue}>{referenceNumber}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formattedDate}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{formattedTime}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Card</Text>
              <View style={styles.cardInfo}>
                <View style={styles.visaLogo}>
                  <Text style={styles.visaText}>VISA</Text>
                </View>
                <Text style={styles.detailValue}>******</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount (Rs)</Text>
              <Text style={styles.detailValue}>{value}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={createPDF}>
            <Ionicons name="share-outline" size={20} color="#4CAF50" />
            <Text style={styles.shareButtonText}>Share Receipt</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.doneButton} onPress={() => navigation.navigate("DonationHomepage")}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'space-between', // Add space between content and done button
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
    borderColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 100,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#757575',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visaLogo: {
    backgroundColor: '#1A1F71',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  shareButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  doneButton: {
    position: 'absolute', // Position fixed at the bottom
    bottom: 20,
    left: 24,
    right: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
