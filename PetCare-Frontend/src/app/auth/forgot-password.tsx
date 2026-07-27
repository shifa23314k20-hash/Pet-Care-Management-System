import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { forgotPassword } from "@/services/auth";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await forgotPassword({ email });

      Alert.alert("Success", response.message);

      router.push({
        pathname: "/auth/reset-password",
        params: { email },
      });

    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7FC" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2340" />
          </TouchableOpacity>

          <Text style={styles.title}>Forgot Password?</Text>

          <Text style={styles.subtitle}>
            Enter your registered email to receive an OTP.
          </Text>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9C9CB0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F7FC",
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2340",
    marginTop: 20,
  },
  subtitle: {
    color: "#8B8CA0",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 28,
    lineHeight: 22,
  },
  inputWrap: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAE9F2",
    paddingHorizontal: 16,
    height: 54,
    justifyContent: "center",
  },
  input: {
    fontSize: 15,
    color: "#1F2340",
  },
  button: {
    backgroundColor: "#6C4CE0",
    borderRadius: 14,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});