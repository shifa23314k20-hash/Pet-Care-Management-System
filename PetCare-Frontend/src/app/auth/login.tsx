import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

import { login } from "@/services/auth";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Required Fields", "Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email: email.trim(),
        password,
      });

      console.log("Login Response:", response);

      // Save logged-in user
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(response.user)
      );

      await AsyncStorage.setItem(
        "token",
        response.token
      );

      // Save token if backend returns one
      if (response?.token) {
        await AsyncStorage.setItem("token", response.token);
      }

      console.log(
        "Saved User:",
        await AsyncStorage.getItem("user")
      );

      Alert.alert(
        "Login Successful",
        response?.message || "Welcome back!"
      );

      router.replace("/tabs/dashboard");
    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      console.log("Response:", error?.response);
      console.log("Data:", error?.response?.data);

      Alert.alert(
        "Login Failed",
        error?.response?.data?.message ||
        error?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push("/auth/register");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F8FD"
      />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#1F2030"
            />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Welcome Back! 👋
            </Text>

            <Text style={styles.subtitle}>
              Login to continue
            </Text>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
              placeholderTextColor="#A3A2B1"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
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
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword((previous) => !previous)
              }
              activeOpacity={0.7}
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

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotButton}
            onPress={() =>
              router.push("/auth/forgot-password")
            }
            activeOpacity={0.7}
          >
            <Text style={styles.forgotText}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.loginButtonText}>
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity
              onPress={goToSignUp}
              activeOpacity={0.7}
            >
              <Text style={styles.signupLink}>
                Sign Up
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

  /* Back Button */
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
    marginTop: 4,
  },

  /* Header */
  header: {
    marginTop: 26,
    marginBottom: 28,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1D1E2C",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 14,
    color: "#898897",
    marginTop: 6,
  },

  /* Inputs */
  inputContainer: {
    height: 53,
    width: "100%",
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

  /* Forgot Password */
  forgotButton: {
    alignSelf: "flex-end",
    marginTop: 1,
    marginBottom: 21,
  },

  forgotText: {
    fontSize: 12.5,
    fontWeight: "600",
    color: "#6C5DD3",
  },

  /* Login */
  loginButton: {
    height: 53,
    width: "100%",
    borderRadius: 13,
    backgroundColor: "#6C5DD3",
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#6C5DD3",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },

  loginButtonDisabled: {
    opacity: 0.75,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  /* Divider */
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E6E4ED",
  },

  dividerText: {
    marginHorizontal: 11,
    fontSize: 11.5,
    color: "#9695A5",
  },

  /* Social Buttons */
  socialButton: {
    height: 51,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E5E4EC",
    borderRadius: 13,

    marginBottom: 12,

    shadowColor: "#B9B5C9",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },

  socialButtonText: {
    marginLeft: 10,
    fontSize: 13.5,
    fontWeight: "600",
    color: "#252535",
  },

  /* Sign Up */
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 24,
  },

  signupText: {
    fontSize: 12.5,
    color: "#8D8C9B",
  },

  signupLink: {
    fontSize: 12.5,
    color: "#6C5DD3",
    fontWeight: "700",
  },
});