import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { User, Settings, Bell, LogOut, ChevronRight } from 'lucide-react-native';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' }} 
            style={styles.avatar} 
          />
          <Text style={styles.name}>Mahak Sharma</Text>
          <Text style={styles.email}>mahak@gmail.com</Text>
        </View>

        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <User size={18} color="#6C5DD3" />
              <Text style={styles.menuText}>Personal Information</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Bell size={18} color="#6C5DD3" />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Settings size={18} color="#6C5DD3" />
              <Text style={styles.menuText}>Account Settings</Text>
            </View>
            <ChevronRight size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <LogOut size={18} color="#EF4444" />
              <Text style={styles.logoutText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#F3E8FF', marginBottom: 12 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  email: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  menuGroup: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#F3F4F6', overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F9FAFB' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuText: { fontSize: 14, fontWeight: '500', color: '#374151' },
  logoutItem: { borderBottomWidth: 0 },
  logoutText: { fontSize: 14, fontWeight: '500', color: '#EF4444' },
});