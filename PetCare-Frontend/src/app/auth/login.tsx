import React, { useState } from "react";
import { Alert, ActivityIndicator } from "react-native";
import { login } from "@/services/auth";
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
} from 'react-native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await login({
        email,
        password,
      });

      Alert.alert("Success", response.message);

      console.log("User:", response.user);

      router.replace("/tabs/dashboard");

    } catch (error: any) {
      console.log("LOGIN ERROR:", error);
      console.log("Response:", error?.response);
      console.log("Data:", error?.response?.data);

      Alert.alert(
        "Login Failed",
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push('/auth/register');
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
          <Text style={styles.title}>Welcome Back! 👋</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

          {/* Email / Phone */}
          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Email or Phone"
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

          {/* Forgot password */}
          <TouchableOpacity
            style={styles.forgotWrap}
          onPress={() => router.push('/auth/forgot-password')}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign up link */}
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={goToSignUp}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    color: '#6C4CE0',
    fontWeight: '600',
  },
  loginButton: {
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
  loginButtonText: {
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
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  signupText: {
    fontSize: 14,
    color: '#8B8CA0',
  },
  signupLink: {
    fontSize: 14,
    color: '#6C4CE0',
    fontWeight: '700',
  },
});