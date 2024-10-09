import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { IPAddress } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompanyProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [jobDetails, setJobDetails] = useState({});

  const logout = () => {
    navigation.navigate("JobProviderSignIn");
  };

  useEffect(() => {
    fetchJobById();
  }, []);

  const fetchJobById = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;
      const response = await axios.get(
        `http://${IPAddress}:5000/JobProvider/job-providers/${user}`
      );
      setJobDetails(response.data);
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      Alert.alert("Error", "Could not fetch job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4299e1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      <View style={styles.separator} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {jobDetails.companyLogo && (
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: jobDetails.companyLogo }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.companyName}>{jobDetails.companyName}</Text>
          <Text style={styles.id}>ID: {jobDetails.ID}</Text>

          <InfoItem icon="email" text={jobDetails.email} />
          <InfoItem icon="phone" text={jobDetails.telephone} />
          <InfoItem icon="location-on" text={jobDetails.address} />

          {jobDetails.website && (
            <TouchableOpacity
              onPress={() => Linking.openURL(jobDetails.website)}
            >
              <InfoItem icon="language" text={jobDetails.website} isWebsite />
            </TouchableOpacity>
          )}

          {jobDetails.description && (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>About Us</Text>
              <Text style={styles.descriptionText}>
                {jobDetails.description}
              </Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoItem = ({ icon, text, isWebsite }) => (
  <View style={styles.infoItem}>
    <MaterialIcons
      name={icon}
      size={20}
      color="#4a4a4a"
      style={styles.icon}
    />
    <Text style={[styles.infoText, isWebsite && styles.website]}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fafc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fafc",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2d3748",
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
    textAlign: "center",
  },
  id: {
    fontSize: 14,
    color: "#718096",
    marginBottom: 20,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#4a5568",
    flex: 1,
  },
  website: {
    color: "#4299e1",
    textDecorationLine: "underline",
  },
  descriptionContainer: {
    marginTop: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2d3748",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#4a5568",
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: "#e53e3e",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});