import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Bell,
  Sparkles,
  PlusCircle,
  Calendar,
  FileText,
  Bot,
  Home,
  Heart,
  Activity,
  User,
  ChevronRight,
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Scrollable Content Area */}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          
          {/* Top Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.welcomeRow}>
                <Text style={styles.welcomeText}>Hi, Mahak</Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <Text style={styles.subText}>Good morning!</Text>
            </View>
            <TouchableOpacity style={styles.bellButton}>
              <Bell size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Pet Profile Card */}
          <View style={styles.sectionContainer}>
            <TouchableOpacity style={styles.petCard} activeOpacity={0.7}>
              <View style={styles.petInfoLeft}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=150&q=80',
                  }}
                  style={styles.petAvatar}
                />
                <View>
                  <Text style={styles.petName}>Bruno</Text>
                  <Text style={styles.petBreed}>Golden Retriever</Text>
                  <Text style={styles.petMeta}>3 Years • 28kgs</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Today's Overview Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.overviewGrid}>
              
              <View style={styles.overviewCard}>
                <Text style={styles.overviewNumber}>2</Text>
                <Text style={styles.overviewLabel}>Upcoming Vaccines</Text>
              </View>

              <View style={styles.overviewCard}>
                <Text style={styles.overviewNumber}>1</Text>
                <Text style={styles.overviewLabel}>Upcoming Appointment</Text>
              </View>

              <View style={styles.overviewCard}>
                <Text style={styles.overviewNumber}>3</Text>
                <Text style={styles.overviewLabel}>Recent Activities</Text>
              </View>

            </View>
          </View>

          {/* AI Health Highlights Banner */}
          <View style={styles.sectionContainer}>
            <View style={styles.aiBanner}>
              <View style={styles.aiHeader}>
                <Sparkles size={16} color="#FDE047" />
                <Text style={styles.aiTitle}>AI Health Highlights</Text>
              </View>

              <Text style={styles.aiDescription}>
                Bruno is doing great! Keep up with regular walks and a balanced diet.
              </Text>

              <View style={styles.aiFooter}>
                <TouchableOpacity style={styles.aiButton} activeOpacity={0.8}>
                  <Text style={styles.aiButtonText}>Ask AI Assistant</Text>
                </TouchableOpacity>
                <View style={styles.aiRobotIcon}>
                  <Bot size={22} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>

          {/* Quick Access Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              
              <TouchableOpacity style={styles.quickAccessItem} activeOpacity={0.7}>
                <View style={styles.quickIconBox}>
                  <PlusCircle size={22} color="#6C5DD3" />
                </View>
                <Text style={styles.quickAccessText}>Add Pet</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAccessItem} activeOpacity={0.7}>
                <View style={styles.quickIconBox}>
                  <Calendar size={22} color="#6C5DD3" />
                </View>
                <Text style={styles.quickAccessText}>Book Appt.</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAccessItem} activeOpacity={0.7}>
                <View style={styles.quickIconBox}>
                  <FileText size={22} color="#6C5DD3" />
                </View>
                <Text style={styles.quickAccessText}>Health Record</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAccessItem} activeOpacity={0.7}>
                <View style={styles.quickIconBox}>
                  <Bot size={22} color="#6C5DD3" />
                </View>
                <Text style={styles.quickAccessText}>AI Assistant</Text>
              </TouchableOpacity>

            </View>
          </View>

        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    position: 'relative',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  waveEmoji: {
    fontSize: 18,
  },
  subText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  petCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  petInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  petAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#F3E8FF',
  },
  petName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  petBreed: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  petMeta: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    borderWidth: 1,
    borderColor: '#EDE9FE',
    borderRadius: 16,
    padding: 12,
    justifyContent: 'space-between',
    minHeight: 85,
  },
  overviewNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#6C5DD3',
  },
  overviewLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
    marginTop: 8,
    lineHeight: 14,
  },
  aiBanner: {
    backgroundColor: '#6C5DD3',
    borderRadius: 16,
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F3E8FF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  aiDescription: {
    fontSize: 12,
    color: '#F9FAFB',
    marginBottom: 16,
    lineHeight: 18,
  },
  aiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  aiButtonText: {
    color: '#6C5DD3',
    fontSize: 12,
    fontWeight: 'bold',
  },
  aiRobotIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  quickIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickAccessText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#4B5563',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  navTextActive: {
    fontWeight: 'bold',
    color: '#6C5DD3',
  },
  floatingButtonContainer: {
    top: -18,
  },
  floatingButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C5DD3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5DD3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
});