import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { IPAddress } from "../globals";
import axios from "axios";
import { storage } from "../Storage/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Toast from "react-native-toast-message";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [fullNameError, setFullNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [usernames, setUsernames] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersResponse = await axios.get(
        `http://${IPAddress}:5000/User/users/username`
      );
      setUsernames(usersResponse.data.users);
      console.log(usersResponse.data.users);
    };
    fetchUsers();
  }, []);

  const validateFullName = (name) => {
    if (!name) {
      setFullNameError("Full name is required");
    } else if (name.length < 2) {
      setFullNameError("Full name must be at least 2 characters");
    } else {
      setFullNameError("");
    }
  };

  const validateUsername = (username) => {
    const isUsernameTaken = usernames.some(
      (user) => user.username === username
    );

    if (!username) {
      setUsernameError("Username is required");
    } else if (isUsernameTaken) {
      setUsernameError("Username is already taken");
    } else {
      setUsernameError("");
    }
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    if (!email) {
      setEmailError("Email is required");
    } else if (!re.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError("Confirm password is required");
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  useEffect(() => {
    setIsFormValid(
      fullName &&
        username &&
        email &&
        password &&
        confirmPassword &&
        !fullNameError &&
        !usernameError &&
        !emailError &&
        !passwordError &&
        !confirmPasswordError
    );
  }, [
    fullName,
    username,
    email,
    password,
    confirmPassword,
    fullNameError,
    usernameError,
    emailError,
    passwordError,
    confirmPasswordError,
  ]);

  const handleSignUp = async () => {
    if (isFormValid) {
      try {
        let profileImageUrl = "";

        // Upload the profile picture if one is selected
        if (profilePic) {
          // Convert the image URI to a blob for Firebase upload
          const response = await fetch(profilePic);
          const blob = await response.blob();

          // Create a reference to Firebase storage
          const storageRef = ref(
            storage,
            `profile_pics/${username}_${Date.now()}.jpg`
          );

          // Upload the file to Firebase
          const uploadTask = await uploadBytesResumable(storageRef, blob);

          // Get the download URL after the image is uploaded
          profileImageUrl = await getDownloadURL(uploadTask.ref);
          console.log("Image uploaded. Download URL:", profileImageUrl);
        }

        // Prepare user data for backend API
        const userData = {
          fullName,
          username: "u/" + username,
          email,
          password,
          profilePic: profileImageUrl,
        };

        // Make the signup API request
        const response = await axios.post(
          `http://${IPAddress}:5000/User/signup`,
          userData
        );

        if (response.status === 200) {
          Toast.show({
            type: "success",
            position: "top",
            text1: "Account created successfully! You can now log in.",
            visibilityTime: 2000,
            autoHide: true,
          });
          navigation.navigate("SignInScreen");
        } else {
          Alert.alert("Error", "An error occurred during signup.");
        }
      } catch (error) {
        Alert.alert("Sign Up Error", error.message);
      }
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  return (
    <ImageBackground
      source={{ uri: "https://example.com/background-image.jpg" }}
      style={styles.backgroundImage}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.profilePicContainer}
          >
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePic} />
            ) : (
              <Ionicons name="person-add" size={50} color="white" />
            )}
          </TouchableOpacity>
          <Text style={styles.headerText}>Create Account</Text>
          {username && <Text style={styles.usernameDisplay}>u/{username}</Text>}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, fullNameError && styles.inputError]}
            placeholder="Full Name"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={(text) => {
              setFullName(text);
              validateFullName(text);
            }}
          />
          {fullNameError ? (
            <Text style={styles.errorText}>{fullNameError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, usernameError && styles.inputError]}
            placeholder="Username"
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              validateUsername(text);
            }}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Email"
            placeholderTextColor="#aaa"
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              validateEmail(text);
            }}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <TextInput
            style={[styles.input, confirmPasswordError && styles.inputError]}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validateConfirmPassword(text);
            }}
          />
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
        </View>
        <TouchableOpacity
          style={[styles.button, !isFormValid && styles.buttonDisabled]}
          onPress={handleSignUp}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <Text style={styles.signinLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profilePicContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
  },
  usernameDisplay: {
    fontSize: 18,
    color: "#4CAF50",
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    height: 50,
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    color: "white",
    marginBottom: 15,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#888",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signinContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signinText: {
    color: "white",
  },
  signinLink: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
});
