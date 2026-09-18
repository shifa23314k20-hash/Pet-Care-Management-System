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

import { forgotPassword } from "@/services/auth";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    const userEmail = email.trim().toLowerCase();

    if (!userEmail) {
      Alert.alert(
        "Required Field",
        "Please enter your email address."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({
        email: userEmail,
      });

      Alert.alert(
        "OTP Sent",
        response?.message ||
          "Your OTP has been generated.",
        [
          {
            text: "Continue",
            onPress: () => {
              router.push({
                pathname: "/auth/reset-password",
                params: {
                  email: userEmail,
                },
              });
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "FORGOT PASSWORD ERROR:",
        error?.response?.data
      );

      Alert.alert(
        "Unable to Continue",
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
              Forgot Password?
            </Text>

            <Text style={styles.subtitle}>
              Enter your registered email and we'll
              send you an OTP to reset your password.
            </Text>
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#A3A2B1"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleSendOTP}
            />
          </View>

          {/* Send OTP */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleSendOTP}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Send OTP
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
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
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7E5EE",
    borderRadius: 13,
    paddingHorizontal: 15,
    justifyContent: "center",

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
    height: "100%",
    fontSize: 14,
    color: "#202131",
  },

  button: {
    height: 53,
    borderRadius: 13,
    backgroundColor: "#6C5DD3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,

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