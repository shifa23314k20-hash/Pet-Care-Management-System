import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { register } from "@/services/auth";

export default function Register() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const name = fullName.trim();
    const userEmail = email.trim().toLowerCase();

    if (!name || !userEmail || !password || !confirmPassword) {
      Alert.alert(
        "Required Fields",
        "Please fill in all fields."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Invalid Password",
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Mismatch",
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        name,
        email: userEmail,
        password,
      });

      Alert.alert(
        "Account Created",
        response?.message || "Your account has been created successfully.",
        [
          {
            text: "Login",
            onPress: () =>
              router.replace("/auth/login"),
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "REGISTER ERROR:",
        error?.response?.data
      );

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F8FD"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : undefined
        }
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#1D1E2C"
            />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Create Account 🐾
            </Text>

            <Text style={styles.subtitle}>
              Create your account and start caring for your pet.
            </Text>
          </View>

          {/* Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#A3A2B1"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A3A2B1"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#A3A2B1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword((value) => !value)
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#8F8E9E"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm Password"
              placeholderTextColor="#A3A2B1"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setShowConfirmPassword(
                  (value) => !value
                )
              }
            >
              <Ionicons
                name={
                  showConfirmPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={20}
                color="#8F8E9E"
              />
            </TouchableOpacity>
          </View>

          {/* Register */}
          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.registerButtonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/auth/login")}
            >
              <Text style={styles.loginLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F8FD",
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingBottom: 28,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 4,
  },

  header: {
    marginTop: 26,
    marginBottom: 27,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1D1E2C",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 13.5,
    lineHeight: 20,
    color: "#898897",
    marginTop: 7,
    maxWidth: 330,
  },

  inputContainer: {
    height: 53,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5EE",
    borderRadius: 13,
    paddingHorizontal: 15,
    marginBottom: 13,

    shadowColor: "#B9B5C9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },

  input: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#202131",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#202131",
  },

  eyeButton: {
    width: 34,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-end",
  },

  registerButton: {
    height: 53,
    borderRadius: 13,
    backgroundColor: "#6C5DD3",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,

    shadowColor: "#6C5DD3",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 23,
  },

  loginText: {
    fontSize: 12.5,
    color: "#898897",
  },

  loginLink: {
    fontSize: 12.5,
    color: "#6C5DD3",
    fontWeight: "700",
  },
});