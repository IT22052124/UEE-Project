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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { IPAddress } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock data for the profile
const profile = {
  id: "COMP123456",
  companyName: "TechInnovate Solutions",
  email: "contact@techinnovate.com",
  telephone: "+1 (555) 123-4567",
  address: "123 Tech Park, Silicon Valley, CA 94000",
  website: "https://www.techinnovate.com",
  description:
    "TechInnovate Solutions is a leading software development company specializing in cutting-edge technologies. We provide innovative solutions for businesses of all sizes, focusing on AI, IoT, and cloud computing.",
  logo: "https://example.com/company-logo.png", // Replace with actual logo URL
};

export default function CompanyProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
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
        `http://${IPAddress}:5000/JobProvider/job-providers/${user}` // Send userId and jobId in the URL
      );
      setJobDetails(response.data);
      console.log(jobDetails);
    } catch (error) {
      console.error("Error fetching job by ID:", error);
      Alert.alert("Error", "Could not fetch job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {jobDetails.companyLogo ? (
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: jobDetails?.companyLogo }}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : (
          ""
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.companyName}>{jobDetails.companyName}</Text>
          <Text style={styles.id}>ID: {jobDetails.ID}</Text>

          <View style={styles.infoItem}>
            <MaterialIcons
              name="email"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{jobDetails.email}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{jobDetails.telephone}</Text>
          </View>

          <View style={styles.infoItem}>
            <MaterialIcons
              name="location-on"
              size={20}
              color="#4a4a4a"
              style={styles.icon}
            />
            <Text style={styles.infoText}>{jobDetails.address}</Text>
          </View>

          {jobDetails.website ? (
            <TouchableOpacity style={styles.infoItem}>
              <MaterialIcons
                name="language"
                size={20}
                color="#4a4a4a"
                style={styles.icon}
              />
              <Text style={[styles.infoText, styles.website]}>
                {jobDetails?.website}
              </Text>
            </TouchableOpacity>
          ) : (
            ""
          )}

          {jobDetails.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionTitle}>About Us</Text>
              <Text style={styles.descriptionText}>
                {jobDetails?.description}
              </Text>
            </View>
          ) : (
            ""
          )}
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 1,
    color: "#000",
    alignSelf: "center",
    marginTop: 12,
    marginRight: 180,
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
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  id: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  website: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  descriptionContainer: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
