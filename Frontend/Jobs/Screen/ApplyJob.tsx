import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ionicons } from "react-native-vector-icons";
import { CheckBox } from "react-native-elements";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Storage/firebase"; // Firebase configuration
import { IPAddress } from "../../globals";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

const schema = yup.object().shape({
  firstName: yup.string().required("Please Enter a First Name"),
  lastName: yup.string().required("Please Enter a Last Name"),
  telephone: yup
    .string()
    .length(10, "Telephone must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Telephone must be a number")
    .required("Please Enter a Telephone Number"),
});

interface JobProviderFormInputs {
  firstName: String;
  telephone: string;
  lastName: String;
}

export default function ApplyJobScreen({ navigation, route }) {
  const { item } = route.params;
  const [documentUri, setDocumentUri] = useState(null);
  const user = "66f3dda2bd01bea47d940c63";
  const [documentError, setDocumentError] = useState("");
  const [URL, setURL] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobProviderFormInputs>({
    resolver: yupResolver(schema),
  });

  // Function to handle form submission
  const onSubmit = async (data: JobProviderFormInputs) => {
    if (!documentUri) {
      setDocumentError("Please upload your resume"); // Set error if no document is selected
      return; // Prevent submission
    } else {
      setDocumentError(""); // Clear the error if a document is selected
    }

    const formData = { ...data };
    let downloadURL = "";

    if (documentUri) {
      try {
        const response = await fetch(documentUri);
        const blob = await response.blob();

        // Generate a unique file name
        const storageRef = ref(
          storage,
          `jobDocuments/${user}_${Date.now()}_document.pdf`
        );

        // Upload the file to Firebase
        await uploadBytes(storageRef, blob);

        // Get the download URL
        downloadURL = await getDownloadURL(storageRef);
      } catch (error) {
        console.error("Error uploading document:", error);
        return; // Exit the function if there's an error
      }
    }

    try {
      // Post job application with the download URL
      const response = await axios.post(`http://${IPAddress}:5000/Job/apply`, {
        formData,
        item,
        user,
        URL: downloadURL, // Use the download URL directly here
      });

      console.log("Successfully applied for the job:", response.data);

      navigation.navigate("JobDetailsScreen", { item: item });
    } catch (error) {
      console.error("Error applying job:", error);
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf", // Change this to the type of documents you want to pick
      copyToCacheDirectory: true,
    });

    if (!result.cancelled) {
      setDocumentUri(result.assets[0].uri); // Use setLogoUri instead of setImage
      setDocumentError("");
    }
  };
  console.log(documentUri);
  const removeDocument = () => {
    setDocumentUri(null);
    setDocumentError("Please upload your resume");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Job Application</Text>
        <Text style={styles.subtitle}>
          Just a few more steps to complete your application.
        </Text>

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="First Name"
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.firstName && (
          <Text style={styles.errorText}>{errors.firstName.message}</Text>
        )}

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Last Name"
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.lastName && (
          <Text style={styles.errorText}>{errors.lastName.message}</Text>
        )}

        <Controller
          control={control}
          name="telephone"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Telephone"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          )}
        />
        {errors.telephone && (
          <Text style={styles.errorText}>{errors.telephone.message}</Text>
        )}

        <TouchableOpacity onPress={pickDocument} style={styles.uploadArea}>
          {documentUri ? (
            <View style={styles.imageContainer}>
              <Text>{documentUri.split("/").pop()}</Text>
              <TouchableOpacity
                onPress={removeDocument}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={50} color="#4A90E2" />
              <Text style={styles.placeholderText}>Tap to upload Resume</Text>
            </View>
          )}
        </TouchableOpacity>
        {documentError ? ( // Display the document error
          <Text style={styles.errorText}>{documentError}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.applyButtonText}>Apply</Text>
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
  signInText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  checkbox: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#333",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
    lineHeight: 20,
  },
  linkText: {
    color: "#007AFF",
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: -15,
    marginBottom: 10,
  },
  uploadArea: {
    width: 150,
    height: 150,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: "#4A90E2",
  },
  removeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 15,
  },
});
