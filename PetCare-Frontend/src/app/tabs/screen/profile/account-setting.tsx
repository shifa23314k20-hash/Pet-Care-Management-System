import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";

import {
  ArrowLeft,
  Lock,
  Languages,
  Bell,
  Mail,
  ChevronRight,
  Shield,
  FileText,
  Info,
  Star,
  Trash2,
} from "lucide-react-native";


// ======================================================
// COLORS
// ======================================================

const PURPLE = "#6C5DD3";
const BACKGROUND = "#F9F8FD";


// ======================================================
// ACCOUNT SETTINGS SCREEN
// ======================================================

export default function AccountSettings() {

  const [pushNotification, setPushNotification] =
    useState(true);

  const [emailNotification, setEmailNotification] =
    useState(true);


  // ======================================================
  // SETTING ITEM COMPONENT
  // ======================================================

  const SettingItem = ({
    icon,
    title,
    subtitle,
    value,
    onPress,
    rightComponent,
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    value?: string;
    onPress?: () => void;
    rightComponent?: React.ReactNode;
  }) => (

    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={!onPress}
    >

      {/* LEFT SIDE */}

      <View style={styles.leftContainer}>

        {/* Icon */}

        <View style={styles.iconContainer}>
          {icon}
        </View>


        {/* Text */}

        <View style={styles.textContainer}>

          <Text style={styles.settingTitle}>
            {title}
          </Text>

          <Text style={styles.settingSubtitle}>
            {subtitle}
          </Text>

        </View>

      </View>


      {/* RIGHT SIDE */}

      {rightComponent ? (

        rightComponent

      ) : (

        <View style={styles.rightContainer}>

          {value ? (
            <Text style={styles.valueText}>
              {value}
            </Text>
          ) : null}

          <ChevronRight
            size={20}
            color="#B5B2C0"
          />

        </View>

      )}

    </TouchableOpacity>

  );


  // ======================================================
  // MAIN UI
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
              activeOpacity={0.8}
              onPress={() => router.back()}
            >

              <ArrowLeft
                size={22}
                color="#242331"
              />

            </TouchableOpacity>


            <View style={styles.headerTextContainer}>

              <Text style={styles.headerTitle}>
                Account Settings
              </Text>

              <Text style={styles.headerSubtitle}>
                Manage your account preferences
              </Text>

            </View>

          </View>


          {/* ==================================================
              ACCOUNT SECTION
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Account
          </Text>


          <View style={styles.card}>

            {/* CHANGE PASSWORD */}

            <SettingItem
              title="Change Password"
              subtitle="Update your account password"
              icon={
                <Lock
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                router.push(
                  "/auth/forgot-password"
                )
              }
            />


            <View style={styles.divider} />


            {/* LANGUAGE */}

            <SettingItem
              title="Language"
              subtitle="Choose your preferred language"
              value="English"
              icon={
                <Languages
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Language selection will be available soon."
                )
              }
            />

          </View>


          {/* ==================================================
              PREFERENCES SECTION
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Preferences
          </Text>


          <View style={styles.card}>

            {/* PUSH NOTIFICATIONS */}

            <SettingItem
              title="Push Notifications"
              subtitle="Receive reminders and updates"
              icon={
                <Bell
                  size={20}
                  color={PURPLE}
                />
              }
              rightComponent={

                <Switch
                  value={pushNotification}
                  onValueChange={
                    setPushNotification
                  }

                  trackColor={{
                    false: "#D9D7E0",
                    true: "#C8C2F4",
                  }}

                  thumbColor={
                    pushNotification
                      ? PURPLE
                      : "#FFFFFF"
                  }

                  ios_backgroundColor="#D9D7E0"
                />

              }
            />


            <View style={styles.divider} />


            {/* EMAIL NOTIFICATIONS */}

            <SettingItem
              title="Email Notifications"
              subtitle="Receive updates through email"
              icon={
                <Mail
                  size={20}
                  color={PURPLE}
                />
              }
              rightComponent={

                <Switch
                  value={emailNotification}
                  onValueChange={
                    setEmailNotification
                  }

                  trackColor={{
                    false: "#D9D7E0",
                    true: "#C8C2F4",
                  }}

                  thumbColor={
                    emailNotification
                      ? PURPLE
                      : "#FFFFFF"
                  }

                  ios_backgroundColor="#D9D7E0"
                />

              }
            />

          </View>


          {/* ==================================================
              SUPPORT & INFORMATION
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Support & Information
          </Text>


          <View style={styles.card}>

            {/* PRIVACY */}

            <SettingItem
              title="Privacy Policy"
              subtitle="Learn how your information is used"
              icon={
                <Shield
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Privacy Policy",
                  "Privacy Policy page coming soon."
                )
              }
            />


            <View style={styles.divider} />


            {/* TERMS */}

            <SettingItem
              title="Terms & Conditions"
              subtitle="View the terms of using PetCare"
              icon={
                <FileText
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "Terms & Conditions",
                  "Terms & Conditions page coming soon."
                )
              }
            />


            <View style={styles.divider} />


            {/* RATE */}

            <SettingItem
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
                  "Rate App",
                  "Redirect to Play Store/App Store."
                )
              }
            />


            <View style={styles.divider} />


            {/* ABOUT */}

            <SettingItem
              title="About App"
              subtitle="PetCare application information"
              icon={
                <Info
                  size={20}
                  color={PURPLE}
                />
              }
              onPress={() =>
                Alert.alert(
                  "PetCare",
                  "AI Powered PetCare\nVersion 1.0.0"
                )
              }
            />

          </View>


          {/* ==================================================
              DANGER ZONE
          ================================================== */}

          <Text style={styles.dangerTitle}>
            Danger Zone
          </Text>


          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Delete Account",
                "This feature will be available in a future update.",
                [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },

                  {
                    text: "OK",
                  },
                ]
              )
            }
          >

            {/* DELETE ICON */}

            <View style={styles.deleteIcon}>

              <Trash2
                size={20}
                color="#EF4444"
              />

            </View>


            {/* DELETE TEXT */}

            <View style={styles.deleteContent}>

              <Text style={styles.deleteText}>
                Delete Account
              </Text>

              <Text style={styles.deleteSubtitle}>
                Permanently remove your account
              </Text>

            </View>


            <ChevronRight
              size={20}
              color="#EF4444"
            />

          </TouchableOpacity>


          {/* ==================================================
              BOTTOM SPACE
          ================================================== */}

          <View style={styles.bottomSpace} />

        </ScrollView>

      </View>

    </SafeAreaView>

  );
}


// ========================================================
// STYLES
// ========================================================

const styles = StyleSheet.create({

  // ======================================================
  // MAIN
  // ======================================================

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

  headerTextContainer: {
    flex: 1,
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
  // SECTION TITLE
  // ======================================================

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",

    color: "#242331",

    marginTop: 10,
    marginBottom: 11,
  },


  // ======================================================
  // SETTINGS CARD
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
  // SETTING ITEM
  // ======================================================

  settingItem: {
    minHeight: 76,

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

  settingTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: "#242331",
  },

  settingSubtitle: {
    fontSize: 11,

    color: "#92909E",

    marginTop: 3,
  },


  // ======================================================
  // RIGHT SIDE
  // ======================================================

  rightContainer: {
    flexDirection: "row",

    alignItems: "center",

    marginLeft: 8,
  },

  valueText: {
    fontSize: 12,

    fontWeight: "700",

    color: "#777481",

    marginRight: 6,
  },


  // ======================================================
  // DIVIDER
  // ======================================================

  divider: {
    height: 1,

    backgroundColor: "#F0EEF5",

    marginLeft: 73,

    marginRight: 15,
  },


  // ======================================================
  // DANGER ZONE
  // ======================================================

  dangerTitle: {
    fontSize: 16,

    fontWeight: "800",

    color: "#EF4444",

    marginTop: 25,

    marginBottom: 11,
  },

  deleteButton: {
    minHeight: 72,

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    paddingHorizontal: 15,

    flexDirection: "row",

    alignItems: "center",

    borderWidth: 1,

    borderColor: "#F2DADA",
  },

  deleteIcon: {
    width: 45,
    height: 45,

    borderRadius: 14,

    backgroundColor: "#FEECEC",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  deleteContent: {
    flex: 1,
  },

  deleteText: {
    fontSize: 14,

    fontWeight: "800",

    color: "#EF4444",
  },

  deleteSubtitle: {
    fontSize: 11,

    color: "#A78B8B",

    marginTop: 3,
  },


  // ======================================================
  // BOTTOM
  // ======================================================

  bottomSpace: {
    height: 30,
  },

});