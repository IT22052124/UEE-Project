import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Share,
  Linking,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { IPAddress } from "../../globals";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock data for job details
const jobDetails = {
  id: "1",
  title: "Senior Software Engineer",
  companyName: "TechCorp Inc.",
  logo: "https://example.com/techcorp-logo.png",
  address: "San Francisco, CA",
  postedTime: "3 days ago",
  applications: 45,
  salary: "$120,000 - $150,000",
  skills: ["React", "Node.js", "TypeScript", "AWS"],
  description:
    "We are seeking a talented Senior Software Engineer to join our dynamic team. The ideal candidate will have strong experience in full-stack development, with a focus on React and Node.js. You will be responsible for designing, developing, and maintaining high-performance web applications.\n\nResponsibilities:\n• Develop new features and improve existing ones\n• Collaborate with cross-functional teams\n• Mentor junior developers\n• Participate in code reviews and architectural discussions\n\nRequirements:\n• 5+ years of experience in software development\n• Strong proficiency in React, Node.js, and TypeScript\n• Experience with cloud platforms, preferably AWS\n• Excellent problem-solving and communication skills",
};

export default function JobDetailsScreen({ navigation, route }) {
  const { item } = route.params;
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(item);

  const checkApplicationStatus = async () => {
    try {
      setLoading(true);
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;

      const response = await axios.get(`http://${IPAddress}:5000/Job/check`, {
        params: { item, user },
      });

      if (response.data.applied) {
        setApplied(true);
      } else {
        setApplied(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking application status:", error);
      setLoading(false);
    }
  };

  // useEffect to run when component mounts or when applicantID/jobID changes
  useEffect(() => {
    checkApplicationStatus();
  }, [item, applied]);

  const handleWebsitePress = () => {
    Linking.openURL(item.postedBy.website);
  };

  const getDaysAgo = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
    const differenceInTime = currentDate - createdDate; // Difference in milliseconds
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24)); // Convert milliseconds to days
    return differenceInDays;
  };

  const handleApply = () => {
    navigation.navigate("ApplyJobScreen", { item: item });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job opportunity: ${item.title} at ${item?.postedBy?.companyName}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#4a90e2" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{item.title}</Text>
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#4a90e2" />
          </TouchableOpacity>
        </View>

        <View style={styles.companyInfo}>
          <Image
            source={
              item.postedBy?.companyLogo
                ? { uri: item.postedBy.companyLogo }
                : require("./../notAvailabe.jpg")
            }
            style={styles.logo}
          />
          <View style={styles.companyText}>
            <Text style={styles.companyName}>{item.postedBy?.companyName}</Text>
            <View style={styles.statItem}>
              <MaterialIcons name="location-on" size={20} color="#666" />
              <Text style={styles.statText}>{item.location}</Text>
            </View>
            <View style={styles.statItem}>
              <MaterialIcons name="email" size={20} color="#666" />
              <Text style={styles.statText}>{item.postedBy?.email}</Text>
            </View>
            {item.postedBy.website ? (
              <TouchableOpacity onPress={handleWebsitePress}>
                <View style={styles.statItem}>
                  <MaterialIcons name="language" size={20} color="#666" />
                  <Text style={styles.statText}>{item?.postedBy?.website}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              ""
            )}
          </View>
        </View>

        <View style={styles.jobStats}>
          <View style={styles.statItem}>
            <MaterialIcons name="access-time" size={20} color="#666" />
            <Text style={styles.statText}>
              Posted {getDaysAgo(item?.createdAt)} days ago
            </Text>
          </View>
          <View style={styles.statItem}>
            <FontAwesome5 name="users" size={20} color="#666" />
            <Text style={styles.statText}>{item?.applications} applicants</Text>
          </View>
        </View>

        <View style={styles.salaryContainer}>
          <Text style={styles.salaryLabel}>Salary</Text>
          <Text style={styles.salaryAmount}>{item.salary}.00 LKR</Text>
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Required Skills</Text>
          <View style={styles.skillsList}>
            {item.skills.map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Job Description</Text>
          <Text style={styles.descriptionText}>{item.description}</Text>
        </View>

        {applied ? (
          <TouchableOpacity style={styles.applyButtonDisable} disabled>
            <Text style={styles.applyButtonText}>Applied</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Now</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  shareButton: {
    padding: 8,
  },
  companyInfo: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 16,
  },
  companyText: {
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: 16,
    color: "#666",
  },
  jobStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
  },
  salaryContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  salaryLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  salaryAmount: {
    fontSize: 18,
    color: "#4caf50",
    fontWeight: "bold",
  },
  skillsContainer: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  skillsLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    backgroundColor: "#e0e0e0",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    color: "#333",
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
  },
  applyButton: {
    backgroundColor: "#4caf50",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  applyButtonDisable: {
    backgroundColor: "#bdbdbd",
    borderRadius: 8,
    padding: 16,
    margin: 16,
    alignItems: "center",
  },
});
