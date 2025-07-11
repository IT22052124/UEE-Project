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
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Ionicons } from "react-native-vector-icons";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../Storage/firebase"; // Firebase configuration
import { IPAddress } from "../../globals";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

const schema = yup.object().shape({
  telephone: yup
    .string()
    .length(10, "Telephone must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Telephone must be a number")
    .required("Please Enter a Telephone Number"),
  address: yup.string().required("Please Enter an Address"),
  description: yup.string(),
  website: yup.string(),
});

interface JobProviderFormInputs {
  telephone: string;
  address: string;
  description: string;
  website: string;
}

export default function JobProviderRegistration2({ route }) {
  const navigation = useNavigation();
  const { formData: previousFormData } = route.params;
  const [logoUri, setLogoUri] = useState<string | undefined>(undefined);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobProviderFormInputs>({
    resolver: yupResolver(schema),
  });

  const signPage = () => {
    navigation.navigate("JobProviderSignIn");
  }

  // Function to handle form submission
  const onSubmit = async (data: JobProviderFormInputs) => {
    if (!isChecked) {
      alert("You must agree to the terms to proceed.");
      return;
    }
    setIsLoading(true);
    const combinedFormData = { ...previousFormData, ...data };

    try {
      if (logoUri) {
        const response = await fetch(logoUri);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `companyLogos/${previousFormData.companyName}.png`
        );
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        combinedFormData.companyLogo = downloadURL;
      }

      const response = await axios.post(
        `http://${IPAddress}:5000/JobProvider/jobProvider`,
        combinedFormData
      );

      console.log("Job provider created successfully:", response.data);

      Toast.show({
        type: "success",
        position: "top",
        text1: "Account Created Successfully",
        visibilityTime: 2000,
        autoHide: true,
      });

      navigation.navigate("JobProviderSignIn");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;

        if (errorMessage.includes("Job provider with this email already exists")) {
          Alert.alert(
            "Registration Failed",
            "This email is already registered. Please use a different email."
          );
        } else {
          Alert.alert("Error", errorMessage);
        }
      } else if (error.request) {
        Alert.alert(
          "Error",
          "No response from the server. Please check your internet connection."
        );
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Image picker function
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setLogoUri(null);
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
          <TouchableOpacity onPress={signPage}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Set up your profile ✏️</Text>
        <Text style={styles.subtitle}>
          You are nearing the completion of your account setup.
        </Text>

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
              maxLength={10}
            />
          )}
        />
        {errors.telephone && (
          <Text style={styles.errorText}>{errors.telephone.message}</Text>
        )}

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Address"
              placeholderTextColor="#999"
            />
          )}
        />
        {errors.address && (
          <Text style={styles.errorText}>{errors.address.message}</Text>
        )}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, styles.textArea]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Description (Optional)"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="website"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Website URL (Optional)"
              placeholderTextColor="#999"
            />
          )}
        />

        <TouchableOpacity onPress={pickImage} style={styles.uploadArea}>
          {logoUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: logoUri }} style={styles.image} />
              <TouchableOpacity
                onPress={removeImage}
                style={styles.removeButton}
              >
                <Ionicons name="close-circle" size={30} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="cloud-upload-outline" size={50} color="#4A90E2" />
              <Text style={styles.placeholderText}>
                Tap to upload Logo (Optional)
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.checkboxContainer}>
          <CheckBox
            checked={isChecked}
            onPress={() => setIsChecked(!isChecked)}
            containerStyle={styles.checkbox}
          />
          <Text style={styles.checkboxText}>
            I'm at least 18 years old and agree to the following terms:
          </Text>
        </View>

        <Text style={styles.termsText}>
          By tapping Sign Up, I've read and agree to the{" "}
          <Text style={styles.linkText}>E-Sign Disclosure and Consent</Text> to
          receive all communications electronically
        </Text>

        <TouchableOpacity
          style={[styles.signUpButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
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
  signUpButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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