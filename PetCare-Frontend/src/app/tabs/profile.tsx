import React, { useState, useCallback } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
  router,
} from "expo-router";

import {
  User,
  Settings,
  CircleHelp,
  LogOut,
  ChevronRight,
  Camera,
  ShieldCheck,
} from "lucide-react-native";

import { getUserById } from "@/services/user";


// ======================================================
// COLORS
// ======================================================

const PURPLE = "#6C5DD3";
const BACKGROUND = "#F9F8FD";


// ======================================================
// USER INTERFACE
// ======================================================

interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
}


// ======================================================
// PROFILE SCREEN
// ======================================================

export default function ProfileScreen() {

  const [user, setUser] =
    useState<IUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // ======================================================
  // FETCH PROFILE
  // ======================================================

  const fetchProfile = async () => {

    try {

      const savedUser =
        await AsyncStorage.getItem("user");

      if (!savedUser) {

        router.replace("/auth/login");

        return;
      }

      const parsedUser =
        JSON.parse(savedUser);

      const response =
        await getUserById(parsedUser.id);

      setUser(response.user);

    } catch (error) {

      console.log(
        "PROFILE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load profile."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ======================================================
  // SCREEN FOCUS
  // ======================================================

  useFocusEffect(
    useCallback(() => {

      fetchProfile();

    }, [])
  );


  // ======================================================
  // REFRESH
  // ======================================================

  const onRefresh = () => {

    setRefreshing(true);

    fetchProfile();

  };


  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = () => {

    Alert.alert(
      "Logout",
      "Do you really want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },

        {
          text: "Logout",
          style: "destructive",

          onPress: async () => {

            await AsyncStorage.removeItem(
              "user"
            );

            await AsyncStorage.removeItem(
              "token"
            );

            router.replace(
              "/auth/login"
            );

          },
        },
      ]
    );

  };


  // ======================================================
  // MENU ITEM
  // ======================================================

  const MenuItem = ({
    title,
    subtitle,
    icon,
    onPress,
    danger = false,
  }: {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    onPress: () => void;
    danger?: boolean;
  }) => (

    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={0.8}
      onPress={onPress}
    >

      <View style={styles.menuLeft}>

        <View
          style={[
            styles.iconBox,
            danger &&
              styles.dangerIconBox,
          ]}
        >
          {icon}
        </View>

        <View style={styles.menuTextContainer}>

          <Text
            style={[
              styles.menuTitle,
              danger &&
                styles.dangerMenuTitle,
            ]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text style={styles.menuSubtitle}>
              {subtitle}
            </Text>
          ) : null}

        </View>

      </View>

      {!danger && (
        <ChevronRight
          size={20}
          color="#B5B2C0"
        />
      )}

    </TouchableOpacity>

  );


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (
      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color={PURPLE}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>

      </View>
    );

  }


  // ======================================================
  // MAIN UI
  // ======================================================

  return (

    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={PURPLE}
            />
          }
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* ==================================================
              HEADER
          ================================================== */}

          <View style={styles.header}>

            <View>

              <Text style={styles.headerTitle}>
                Profile
              </Text>

              <Text style={styles.headerSubtitle}>
                Manage your personal account
              </Text>

            </View>

          </View>


          {/* ==================================================
              PROFILE CARD
          ================================================== */}

          <View style={styles.profileCard}>

            <View style={styles.profileImageWrapper}>

              <Image
                source={
                  user?.profileImage
                    ? {
                        uri: user.profileImage,
                      }
                    : require("../../../assets/images/profile_placeholder.jpg")
                }
                style={styles.profileImage}
              />

              <View style={styles.cameraButton}>

                <Camera
                  size={16}
                  color="#FFFFFF"
                />

              </View>

            </View>


            <Text style={styles.userName}>
              {user?.name || "Pet Parent"}
            </Text>


            <Text style={styles.userEmail}>
              {user?.email || ""}
            </Text>


            <View style={styles.profileBadge}>

              <ShieldCheck
                size={14}
                color={PURPLE}
              />

              <Text style={styles.profileBadgeText}>
                PetCare Member
              </Text>

            </View>

          </View>


          {/* ==================================================
              ACCOUNT SECTION
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Account
          </Text>

          <View style={styles.menuCard}>

            <MenuItem
              title="Personal Information"
              subtitle="Name, phone, location & bio"
              icon={
                <User
                  size={21}
                  color={PURPLE}
                />
              }
              onPress={() =>
                router.push(
                  "/tabs/screen/profile/personal-info"
                )
              }
            />

            <View style={styles.divider} />

            <MenuItem
              title="Account Settings"
              subtitle="Password, notifications & preferences"
              icon={
                <Settings
                  size={21}
                  color={PURPLE}
                />
              }
              onPress={() =>
                router.push(
                  "/tabs/screen/profile/account-setting"
                )
              }
            />

            <View style={styles.divider} />

            <MenuItem
              title="Help & Support"
              subtitle="FAQs, support & app information"
              icon={
                <CircleHelp
                  size={21}
                  color={PURPLE}
                />
              }
              onPress={() =>
                router.push(
                  "/tabs/screen/profile/help&support"
                )
              }
            />

          </View>


          {/* ==================================================
              LOGOUT
          ================================================== */}

          <Text style={styles.sectionTitle}>
            Account Actions
          </Text>

          <TouchableOpacity
            style={styles.logoutCard}
            activeOpacity={0.8}
            onPress={logout}
          >

            <View style={styles.logoutIcon}>

              <LogOut
                size={21}
                color="#EF4444"
              />

            </View>

            <View style={styles.logoutTextContainer}>

              <Text style={styles.logoutTitle}>
                Logout
              </Text>

              <Text style={styles.logoutSubtitle}>
                Sign out of your PetCare account
              </Text>

            </View>

            <ChevronRight
              size={20}
              color="#EF4444"
            />

          </TouchableOpacity>

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
    marginTop: 18,
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#242331",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#92909E",
    marginTop: 3,
  },


  // ======================================================
  // PROFILE CARD
  // ======================================================

  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,

    alignItems: "center",

    paddingTop: 22,
    paddingBottom: 20,

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

  profileImageWrapper: {
    position: "relative",
    marginBottom: 11,
  },

  profileImage: {
    width: 100,
    height: 100,

    borderRadius: 50,

    borderWidth: 4,
    borderColor: "#EFECFB",

    backgroundColor: "#EFECFB",
  },

  cameraButton: {
    position: "absolute",

    right: -1,
    bottom: 2,

    width: 31,
    height: 31,

    borderRadius: 16,

    backgroundColor: PURPLE,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242331",
  },

  userEmail: {
    fontSize: 13,
    color: "#92909E",
    marginTop: 4,
  },

  profileBadge: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#EFECFB",

    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 50,

    marginTop: 11,
  },

  profileBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: PURPLE,
    marginLeft: 5,
  },


  // ======================================================
  // SECTION
  // ======================================================

  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#242331",

    marginTop: 24,
    marginBottom: 11,
  },


  // ======================================================
  // MENU
  // ======================================================

  menuCard: {
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

  menuItem: {
    minHeight: 75,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  menuTextContainer: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242331",
  },

  menuSubtitle: {
    fontSize: 11,
    color: "#92909E",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#F0EEF5",
    marginLeft: 74,
    marginRight: 15,
  },


  // ======================================================
  // LOGOUT
  // ======================================================

  logoutCard: {
    minHeight: 70,

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    paddingHorizontal: 15,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#F2DADA",
  },

  logoutIcon: {
    width: 46,
    height: 46,

    borderRadius: 14,

    backgroundColor: "#FEECEC",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  logoutTextContainer: {
    flex: 1,
  },

  logoutTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#EF4444",
  },

  logoutSubtitle: {
    fontSize: 11,
    color: "#A78B8B",
    marginTop: 3,
  },

  dangerIconBox: {
    backgroundColor: "#FEECEC",
  },

  dangerMenuTitle: {
    color: "#EF4444",
  },


  // ======================================================
  // FOOTER
  // ======================================================

  footer: {
    alignItems: "center",
    marginTop: 28,
    marginBottom: 20,
  },

  footerTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#AAA7B2",
  },

  footerVersion: {
    fontSize: 11,
    color: "#C0BDC7",
    marginTop: 3,
  },


  // ======================================================
  // LOADER
  // ======================================================

  loader: {
    flex: 1,
    backgroundColor: BACKGROUND,

    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#92909E",
  },

});