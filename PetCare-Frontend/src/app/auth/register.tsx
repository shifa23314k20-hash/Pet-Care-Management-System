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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { register } from "@/services/auth";

export default function Register() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      const response = await register({
        name: fullName,
        email,
        password,
      });

      Alert.alert("Success", response.message);

      router.replace("/auth/login");

    } catch (error: any) {
      console.log("REGISTER ERROR:", error?.response?.data);

      Alert.alert(
        "Registration Failed",
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F7FC" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2340" />
          </TouchableOpacity>

          {/* Heading */}
          <Text style={styles.title}>Create Account 🐾</Text>
          <Text style={styles.subtitle}>Sign up to start caring for your pet</Text>

          {/* Full Name */}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9C9CB0"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Email / Phone */}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9C9CB0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="#9C9CB0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9C9CB0"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputWrap}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Confirm Password"
              placeholderTextColor="#9C9CB0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#9C9CB0"
              />
            </TouchableOpacity>
          </View>

          {/* Terms checkbox
          <TouchableOpacity
            style={styles.termsRow}
            activeOpacity={0.8}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}>
              {agreedToTerms && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <Text style={styles.termsText}>
              I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity> */}

          {/* Sign Up button */}
          <TouchableOpacity
            style={styles.registerButton}
            activeOpacity={0.85}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>
                Sign Up
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>
          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={goToLogin}>
              <Text style={styles.loginLink}>Login</Text>
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
    backgroundColor: '#F8F7FC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1F2340',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#8B8CA0',
    marginTop: 4,
    marginBottom: 24,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE9F2',
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1F2340',
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 4,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C9C8DA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#6C4CE0',
    borderColor: '#6C4CE0',
  },
  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#8B8CA0',
    lineHeight: 19,
  },
  termsLink: {
    color: '#6C4CE0',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#6C4CE0',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C4CE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  registerButtonDisabled: {
    opacity: 0.5,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E4EF',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
    color: '#9C9CB0',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE9F2',
    borderRadius: 14,
    height: 54,
    marginBottom: 14,
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2340',
    marginLeft: 10,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  loginText: {
    fontSize: 14,
    color: '#8B8CA0',
  },
  loginLink: {
    fontSize: 14,
    color: '#6C4CE0',
    fontWeight: '700',
  },
});