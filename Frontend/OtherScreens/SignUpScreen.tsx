import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateFullName = (name) => {
    if (!name) {
      setFullNameError("Full name is required");
    } else if (name.length < 2) {
      setFullNameError("Full name must be at least 2 characters");
    } else {
      setFullNameError("");
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
        email &&
        password &&
        confirmPassword &&
        !fullNameError &&
        !emailError &&
        !passwordError &&
        !confirmPasswordError
    );
  }, [
    fullName,
    email,
    password,
    confirmPassword,
    fullNameError,
    emailError,
    passwordError,
    confirmPasswordError,
  ]);

  const handleSignUp = () => {
    if (isFormValid) {
      // Implement your sign-up logic here
      Alert.alert("Success", "Sign up successful!");
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
          <Ionicons name="person-add" size={50} color="white" />
          <Text style={styles.headerText}>Create Account</Text>
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
          <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
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
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginTop: 10,
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
