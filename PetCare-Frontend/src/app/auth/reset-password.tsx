import { Ionicons } from "@expo/vector-icons";
import {
  useLocalSearchParams,
  useRouter,
} from "expo-router";
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

import { resetPassword } from "@/services/auth";

export default function ResetPassword() {
  const router = useRouter();

  const { email } = useLocalSearchParams<{
    email?: string;
  }>();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      Alert.alert(
        "Error",
        "Email information is missing. Please restart the password reset process."
      );
      return;
    }

    if (!otp.trim() || !password || !confirmPassword) {
      Alert.alert(
        "Required Fields",
        "Please fill in all fields."
      );
      return;
    }

    if (otp.trim().length !== 6) {
      Alert.alert(
        "Invalid OTP",
        "Please enter the 6-digit OTP."
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

      const response = await resetPassword({
        email: String(email).trim().toLowerCase(),
        otp: otp.trim(),
        newPassword: password,
      });

      Alert.alert(
        "Password Reset",
        response?.message ||
          "Your password has been reset successfully.",
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
        "RESET PASSWORD ERROR:",
        error?.response?.data
      );

      Alert.alert(
        "Reset Failed",
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
              Reset Password
            </Text>

            <Text style={styles.subtitle}>
              Enter the OTP sent to your email and
              create a new password.
            </Text>
          </View>

          {/* OTP */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#A3A2B1"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              returnKeyType="next"
            />
          </View>

          {/* New Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="New Password"
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
                setShowPassword(
                  (value) => !value
                )
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

          {/* Reset */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleReset}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Reset Password
              </Text>
            )}
          </TouchableOpacity>

          {/* Login */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Remember your password?{" "}
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace("/auth/login")
              }
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
    marginBottom: 29,
  },

  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#1D1E2C",
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 13.5,
    lineHeight: 21,
    color: "#898897",
    marginTop: 7,
    maxWidth: 340,
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

  button: {
    height: 53,
    borderRadius: 13,
    backgroundColor: "#6C5DD3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,

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

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
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