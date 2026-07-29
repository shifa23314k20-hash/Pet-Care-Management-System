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
import { useRouter, useLocalSearchParams } from "expo-router";
import { resetPassword } from "@/services/auth";

export default function ResetPassword() {
  const router = useRouter();

  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        email,
        otp,
        newPassword: password,
      });

      Alert.alert(
        "Success",
        response.message,
        [
          {
            text: "Login",
            onPress: () => router.replace("/auth/login"),
          },
        ]
      );

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

          <Text style={styles.title}>Reset Password</Text>

          <Text style={styles.subtitle}>
            Enter the OTP sent to your email and create a new password.
          </Text>

          <View style={styles.inputWrap}>
            <TextInput
              // placeholder="OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              style={styles.input}
            />
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="New Password"
              secureTextEntry={!show1}
              value={password}
              onChangeText={setPassword}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShow1(!show1)}>
              <Ionicons
                name={show1 ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!show2}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={[styles.input, { flex: 1 }]}
            />
            <TouchableOpacity onPress={() => setShow2(!show2)}>
              <Ionicons
                name={show2 ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Reset Password</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EAE9F2",
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 16,
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
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});