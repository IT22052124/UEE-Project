import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView, // Import KeyboardAvoidingView
  Platform, // Import Platform for conditional behavior
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../../Storage/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import axios from "axios";
import { IPAddress } from "../../globals";

const schema = yup.object().shape({
  companyName: yup.string().required("Please Enter a Company Name"),
  contactPersonName: yup.string().required("Please Enter a Person Name"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Please Enter an Email"),
  password: yup
    .string()
    .required("Please Enter a Password")
    .min(6, "Password must be at least 6 characters"),
  telephone: yup
    .string()
    .length(10, "Telephone must be exactly 10 digits")
    .matches(/^[0-9]+$/, "Telephone must be a number")
    .required("Please Enter a Telephone Number"),
  address: yup.string().required("Please Enter an Address"),
});

interface JobProviderFormInputs {
  companyName: string;
  contactPersonName: string;
  email: string;
  password: string;
  telephone: string;
  address: string;
  website?: string;
  description?: string;
  companyLogo?: string;
}

export default function JobProviderRegistration() {
  const [logoUri, setLogoUri] = useState<string | undefined>(undefined);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<JobProviderFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: JobProviderFormInputs) => {
    const formData = { ...data };

    if (logoUri) {
      const response = await fetch(logoUri);
      const blob = await response.blob();
      const storageRef = ref(storage, `companyLogos/${data.companyName}.png`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      formData.companyLogo = downloadURL;
    }

    try {
      const response = await axios.post(
        `http://${IPAddress}:5000/JobProvider/jobProvider`,
        formData
      ); // Replace with your API endpoint
      console.log("Job provider created successfully:", response.data);
    } catch (error) {
      console.error("Error creating job provider:", error);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setLogoUri(undefined);
  };

  const CustomButton = ({ title, onPress, color }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }} // Ensure it takes full space
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust for iOS and Android
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Job Provider Registration</Text>

        {/* Company Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Name:</Text>
          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.companyName && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Company Name"
                placeholderTextColor="#888"
              />
            )}
          />
          {errors.companyName && (
            <Text style={styles.errorText}>{errors.companyName.message}</Text>
          )}
        </View>

        {/* Contact Person Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contact Person Name:</Text>
          <Controller
            control={control}
            name="contactPersonName"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  errors.contactPersonName && styles.errorBorder,
                ]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Contact Person Name"
                placeholderTextColor="#888"
              />
            )}
          />
          {errors.contactPersonName && (
            <Text style={styles.errorText}>
              {errors.contactPersonName.message}
            </Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.email && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Email"
                placeholderTextColor="#888"
              />
            )}
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email.message}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.password && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Password"
                secureTextEntry
                placeholderTextColor="#888"
              />
            )}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password.message}</Text>
          )}
        </View>

        {/* Telephone */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Telephone:</Text>
          <Controller
            control={control}
            name="telephone"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.telephone && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Telephone Number"
                placeholderTextColor="#888"
                keyboardType="phone-pad" // Open number pad
                maxLength={10} // Optional: Limit input to 10 digits
              />
            )}
          />
          {errors.telephone && (
            <Text style={styles.errorText}>{errors.telephone.message}</Text>
          )}
        </View>

        {/* Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address:</Text>
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.address && styles.errorBorder]}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Address"
                placeholderTextColor="#888"
              />
            )}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address.message}</Text>
          )}
        </View>

        {/* Company Logo */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Company Logo (Optional):</Text>
          {!logoUri ? (
            <CustomButton
              title="Select Logo"
              onPress={pickImage}
              color="#28A745"
            />
          ) : (
            <>
              <Image
                source={{ uri: logoUri }}
                style={styles.logo}
                resizeMode="contain"
              />
              <CustomButton
                title="Remove Logo"
                onPress={removeImage}
                color="#DC3545"
              />
            </>
          )}
        </View>

        {/* Optional Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Website (Optional):</Text>
          <Controller
            control={control}
            name="website"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Website (Optional)"
                placeholderTextColor="#888"
              />
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description (Optional):</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, { height: 100 }]} // Change height here
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Enter Description (Optional)"
                placeholderTextColor="#888"
                multiline // Ensure the TextInput is multiline
                textAlignVertical="top" // Align text to the top
              />
            )}
          />
        </View>

        {/* Submit Button */}
        <CustomButton
          title="Register"
          onPress={handleSubmit(onSubmit)}
          color="#007BFF"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20, // Make input fields more rounded
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical: 10,
    alignSelf:"center"
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
  errorBorder: {
    borderColor: "red",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25, // Make buttons more rounded
    marginTop: 10,
    width: "70%", // Reduce width of buttons
    alignSelf: "center", // Center the buttons
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Add some elevation for Android
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
