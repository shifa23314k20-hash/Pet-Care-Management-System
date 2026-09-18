import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import {
  ArrowLeft,
  ChevronRight,
  CircleHelp,
  Mail,
  Bug,
  BookOpen,
  Star,
  FileText,
  ShieldCheck,
  Info,
} from "lucide-react-native";


// ======================================================
// COLORS
// ======================================================

const PURPLE = "#6C5DD3";
const BACKGROUND = "#F9F8FD";


// ======================================================
// SCREEN
// ======================================================

export default function HelpSupport() {


  // ======================================================
  // HELP ITEM
  // ======================================================

  const HelpItem = ({
    title,
    subtitle,
    icon,
    onPress,
  }: {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onPress: () => void;
  }) => (

    <TouchableOpacity
      style={styles.item}
      activeOpacity={0.8}
      onPress={onPress}
    >

      <View style={styles.leftContainer}>

        <View style={styles.iconContainer}>
          {icon}
        </View>

        <View style={styles.textContainer}>

          <Text style={styles.itemTitle}>
            {title}
          </Text>

          <Text style={styles.itemSubtitle}>
            {subtitle}
          </Text>

        </View>

      </View>

      <ChevronRight
        size={20}
        color="#B5B2C0"
      />

    </TouchableOpacity>

  );


  // ======================================================
  // UI
  // ======================================================

  return (

    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <View style={styles.header}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.8}
            >

              <ArrowLeft
                size={22}
                color="#242331"
              />

            </TouchableOpacity>

            <View>

              <Text style={styles.headerTitle}>
                Help & Support
              </Text>

              <Text style={styles.headerSubtitle}>
                We're here to help you
              </Text>

            </View>

          </View>


          {/* ==================================================
              HELP CENTER
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Help Center
          </Text>

          <View style={styles.card}>

            <HelpItem
              title="Frequently Asked Questions"
              subtitle="Find answers to common questions"
              icon={
                <CircleHelp
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "FAQs",
                  "Frequently Asked Questions page coming soon."
                )
              }
            />

            <View style={styles.divider} />

            <HelpItem
              title="Contact Support"
              subtitle="Get in touch with the PetCare team"
              icon={
                <Mail
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Support",
                  "Email: support@petcare.com"
                )
              }
            />

            <View style={styles.divider} />

            <HelpItem
              title="Report a Bug"
              subtitle="Help us improve PetCare"
              icon={
                <Bug
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Bug Report",
                  "Bug reporting feature coming soon."
                )
              }
            />

            <View style={styles.divider} />

            <HelpItem
              title="User Guide"
              subtitle="Learn how to use PetCare"
              icon={
                <BookOpen
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "User Guide",
                  "User Guide coming soon."
                )
              }
            />

          </View>


          {/* ==================================================
              APP SETTINGS
          ================================================== */}

          <Text style={styles.sectionTitle}>
            App Settings
          </Text>

          <View style={styles.card}>

            <HelpItem
              title="Rate App"
              subtitle="Share your feedback with us"
              icon={
                <Star
                  size={20}
                  color="#F5B700"
                  fill="#F5B700"
                />
              }
              onPress={() =>
                Alert.alert(
                  "Rate PetCare",
                  "Thank you for supporting PetCare ❤️"
                )
              }
            />

            <View style={styles.divider} />

            <HelpItem
              title="Privacy Policy"
              subtitle="Learn how your information is handled"
              icon={
                <FileText
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "Privacy policy page coming soon."
                )
              }
            />

            <View style={styles.divider} />

            <HelpItem
              title="Terms & Conditions"
              subtitle="Read our terms of service"
              icon={
                <ShieldCheck
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Terms & Conditions",
                  "Terms and conditions page coming soon."
                )
              }
            />

          </View>


          {/* ==================================================
              APP INFORMATION
          ================================================== */}

          <Text style={styles.sectionTitle}>
            About PetCare
          </Text>

          <View style={styles.versionCard}>

            <View style={styles.versionIcon}>

              <Info
                size={21}
                color={PURPLE}
              />

            </View>

            <View style={styles.versionContent}>

              <Text style={styles.versionTitle}>
                PetCare Mobile Application
              </Text>

              <Text style={styles.versionText}>
                AI Powered Pet Health & Care
              </Text>

            </View>

            <View style={styles.versionBadge}>

              <Text style={styles.versionNumber}>
                v1.0.0
              </Text>

            </View>

          </View>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <View style={styles.footer}>

            <Text style={styles.footerTitle}>
              PetCare
            </Text>

            <Text style={styles.footerText}>
              Made with care for pets & their parents
            </Text>

            <Text style={styles.copyright}>
              © 2026 PetCare
            </Text>

          </View>

        </ScrollView>

      </View>

    </SafeAreaView>

  );
}


// ========================================================
// STYLES
// ========================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },


  // ======================================================
  // HEADER
  // ======================================================

  header: {
    flexDirection: "row",
    alignItems: "center",

    paddingTop: 18,
    paddingBottom: 18,
  },

  backButton: {
    width: 46,
    height: 46,

    borderRadius: 15,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#ECEAF2",

    marginRight: 12,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242331",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#92909E",
    marginTop: 3,
  },


  // ======================================================
  // SECTION
  // ======================================================

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#242331",

    marginTop: 10,
    marginBottom: 11,
  },


  // ======================================================
  // CARD
  // ======================================================

  card: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    borderWidth: 1,
    borderColor: "#ECEAF2",

    overflow: "hidden",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },


  // ======================================================
  // ITEM
  // ======================================================

  item: {
    minHeight: 72,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
  },

  iconContainer: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  textContainer: {
    flex: 1,
  },

  itemTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242331",
  },

  itemSubtitle: {
    fontSize: 11,
    color: "#92909E",

    marginTop: 3,
  },

  divider: {
    height: 1,

    backgroundColor: "#F0EEF5",

    marginLeft: 73,
    marginRight: 15,
  },


  // ======================================================
  // VERSION CARD
  // ======================================================

  versionCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 15,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#ECEAF2",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  versionIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  versionContent: {
    flex: 1,
  },

  versionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#242331",
  },

  versionText: {
    fontSize: 11,
    color: "#92909E",
    marginTop: 3,
  },

  versionBadge: {
    backgroundColor: "#EFECFB",

    paddingHorizontal: 9,
    paddingVertical: 6,

    borderRadius: 9,
  },

  versionNumber: {
    fontSize: 10,
    fontWeight: "800",
    color: PURPLE,
  },


  // ======================================================
  // FOOTER
  // ======================================================

  footer: {
    alignItems: "center",

    paddingVertical: 30,
  },

  footerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#AAA7B2",
  },

  footerText: {
    fontSize: 11,
    color: "#B5B2C0",
    marginTop: 4,
  },

  copyright: {
    fontSize: 10,
    color: "#C5C2CB",
    marginTop: 8,
  },

});