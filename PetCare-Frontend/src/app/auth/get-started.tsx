import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function PetCareOnboarding() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/auth/register');
  };

  const handleLogin = () => {
    router.push('/auth/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7FB" />

      {/* Decorative background icons */}
      <MaterialCommunityIcons
        name="paw"
        size={34}
        color="#DCD9F5"
        style={[styles.decor, { top: 40, left: 24, transform: [{ rotate: '-20deg' }] }]}
      />
      <MaterialCommunityIcons
        name="paw"
        size={30}
        color="#DCD9F5"
        style={[styles.decor, { top: 60, right: 32, transform: [{ rotate: '15deg' }] }]}
      />
      <MaterialCommunityIcons
        name="paw"
        size={26}
        color="#E3E0F7"
        style={[styles.decor, { top: 220, right: 20 }]}
      />
      <Ionicons
        name="sparkles"
        size={18}
        color="#DCD9F5"
        style={[styles.decor, { top: 165, left: 40 }]}
      />
      <Ionicons
        name="sparkles"
        size={16}
        color="#DCD9F5"
        style={[styles.decor, { top: 400, left: 20 }]}
      />
      <Ionicons
        name="heart"
        size={26}
        color="#D9D4F5"
        style={[styles.decor, { top: 265, left: 24 }]}
      />
      <Ionicons
        name="heart-outline"
        size={26}
        color="#C9C2F0"
        style={[styles.decor, { top: 350, right: 24 }]}
      />

      {/* Logo */}
      <View style={styles.logoRow}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: '#2864a0' }]}>Pet</Text>
        <Text style={[styles.title, { color: '#3CB878' }]}>Care</Text>
      </View>

      <Text style={styles.subtitleBold}>AI-Powered Pet Care</Text>
      <Text style={styles.subtitle}>
        Smart Pet Health &{'\n'}Care Management
      </Text>

      {/* Pet image (combined cat + dog asset) */}
      <View style={styles.petImageWrap}>
        <Image
          source={require('@/assets/images/get-started.png')}
          style={styles.heroImage}
          resizeMode="contain"
        />
      </View>

      {/* CTA */}
      <TouchableOpacity activeOpacity={0.85} onPress={handleGetStarted}>
        <LinearGradient
          colors={['#7C6CF0', '#6C4CE0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7FC',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  decor: {
    position: 'absolute',
    zIndex: 0,
  },
  logoRow: {
    marginTop: 32,
    width: '100%',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 120,
    height: 64,
  },
  titleRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
  },
  subtitleBold: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2340',
    marginTop: 14,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B8CA0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  petImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
    height: width * 0.75,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  ctaButton: {
    width: width - 48,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#6C4CE0',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: 18,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 15,
    color: '#8B8CA0',
  },
  loginLink: {
    fontSize: 15,
    color: '#6C4CE0',
    fontWeight: '700',
  },
});