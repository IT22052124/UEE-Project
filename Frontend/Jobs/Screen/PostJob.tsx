import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation
import { IPAddress } from "../../globals";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function JobPostingScreen() {
  const navigation = useNavigation();
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState([]);

  const addSkill = () => {
    if (skill.trim()) {
      setSkills([...skills, skill.trim()]);
      setSkill("");
    }
  };

  const removeSkill = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const postJob = async () => {
    if (
      !jobTitle ||
      !jobDescription ||
      !location ||
      !salary ||
      skills.length === 0
    ) {
      Alert.alert(
        "Error",
        "Please fill in all fields and add at least one skill."
      );
      return;
    }

    try {
      const userDetails = await AsyncStorage.getItem("user");
      const user = JSON.parse(userDetails)?._id;
      const response = await axios.post(
        `http://${IPAddress}:5000/JobProvider/postJob`,
        { jobTitle, jobDescription, location, salary, skills, user }
      );
      Alert.alert("Success", "Job posted successfully!");

      // Reset form
      setJobTitle("");
      setJobDescription("");
      setLocation("");
      setSalary("");
      setSkills([]);
    } catch (error) {
      console.error(
        "Error posting job:",
        error.response?.data || error.message
      );
      Alert.alert(
        "Error",
        "There was an issue posting the job. Please try again."
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Post a New Job 💼</Text>

        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          value={jobTitle}
          onChangeText={setJobTitle}
          placeholder="Enter job title"
        />

        <Text style={styles.label}>Job Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={jobDescription}
          onChangeText={setJobDescription}
          placeholder="Enter job description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter job location"
        />

        <Text style={styles.label}>Salary</Text>
        <TextInput
          style={styles.input}
          value={salary}
          onChangeText={setSalary}
          placeholder="Enter salary"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Required Skills</Text>
        <View style={styles.skillsContainer}>
          {skills.map((item, index) => (
            <View key={index} style={styles.skillItem}>
              <Text style={styles.skillText}>{item}</Text>
              <TouchableOpacity onPress={() => removeSkill(index)}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.addSkillContainer}>
          <TextInput
            style={styles.skillInput}
            value={skill}
            onChangeText={setSkill}
            placeholder="Enter a skill"
          />
          <TouchableOpacity style={styles.addButton} onPress={addSkill}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.postButton} onPress={postJob}>
          <Text style={styles.postButtonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    alignSelf: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  skillItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  skillText: {
    marginRight: 5,
  },
  addSkillContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  skillInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  postButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    marginBottom: 50,
    marginTop: 30,
  },
  postButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
