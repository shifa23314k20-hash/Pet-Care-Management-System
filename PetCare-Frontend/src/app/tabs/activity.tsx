import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { Calendar as CalendarIcon, Clock } from 'lucide-react-native';

const appointments = [
  { id: '1', title: 'General Checkup', date: '16 May 2025', time: '10:30 AM', doctor: 'Dr. Smith' },
  { id: '2', title: 'Dental Cleaning', date: '22 May 2025', time: '11:00 AM', doctor: 'Dr. Brown' },
];

export default function CalendarScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Appointments & Schedule</Text>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {appointments.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.iconBox}>
                <CalendarIcon size={20} color="#6C5DD3" />
              </View>
              <View style={styles.details}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.doctor}>{item.doctor}</Text>
                <View style={styles.timeRow}>
                  <Clock size={12} color="#9CA3AF" />
                  <Text style={styles.timeText}>{item.date} • {item.time}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F9FAFB' },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 16 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  scrollContent: { paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F5F3FF', justifyContent: 'center', alignItems: 'center' },
  details: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#111827' },
  doctor: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  timeText: { fontSize: 11, color: '#9CA3AF' },
});