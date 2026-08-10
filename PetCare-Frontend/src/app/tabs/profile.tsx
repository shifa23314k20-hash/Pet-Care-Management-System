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
import { useFocusEffect, router } from "expo-router";

import {
  User,
  Settings,
  Bell,
  CircleHelp,
  LogOut,
  ChevronRight,
  Camera,
} from "lucide-react-native";

import { getUserById } from "@/services/user";

interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = async () => {
    try {

      const savedUser = await AsyncStorage.getItem("user");

      if (!savedUser) {
        router.replace("/auth/login");
        return;
      }

      const parsedUser = JSON.parse(savedUser);

      const response = await getUserById(parsedUser.id);

      setUser(response.user);

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Error",
        "Unable to load profile."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const logout = () => {

    Alert.alert(
      "Logout",
      "Do you really want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("user");
            router.replace("/auth/login");
          }
        }
      ]
    );

  };

  const MenuItem = ({
    title,
    icon,
    onPress,
    danger = false,
  }: any) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.menuItem}
      onPress={onPress}
    >

      <View style={styles.menuLeft}>

        <View style={styles.iconBox}>
          {icon}
        </View>

        <Text
          style={[
            styles.menuText,
            danger && { color: "#EF4444" }
          ]}
        >
          {title}
        </Text>

      </View>

      {!danger && (
        <ChevronRight
          color="#B5B5B5"
          size={22}
        />
      )}

    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator
          size="large"
          color="#6C4CE0"
        />
      </View>
    )
  }

  return (

    <SafeAreaView style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

        {/* Header */}

        <View style={styles.header}>

          <Text style={styles.profileTitle}>
            Profile
          </Text>

        </View>

        {/* Profile Card */}

        <View style={styles.profileCard}>

          <View style={styles.imageContainer}>

            <Image
              source={
                user?.profileImage
                  ? { uri: user.profileImage }
                  : require("../../../assets/images/profile_placeholder.jpg")
              }
              style={styles.profileImage}
            />

            <TouchableOpacity
              style={styles.cameraButton}
            >
              <Camera
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

          </View>

          <Text style={styles.userName}>
            {user?.name}
          </Text>

          <Text style={styles.userEmail}>
            {user?.email}
          </Text>

        </View>

        {/* Menu */}

        <View style={styles.menuContainer}>
          <MenuItem
            title="Personal Information"
            icon={<User size={22} color="#6C4CE0" />}
            onPress={() => router.push("/tabs/screen/profile/personal-info")}
          />

          <MenuItem
            title="Account Settings"
            icon={<Settings size={22} color="#6C4CE0" />}
            onPress={() => router.push("/tabs/screen/profile/account-setting")}
          />

          <MenuItem
            title="Help & Support"
            icon={<CircleHelp size={22} color="#6C4CE0" />}
            onPress={() => router.push("/tabs/screen/profile/help&support")}
          />

          <MenuItem
            title="Logout"
            icon={<LogOut size={22} color="#EF4444" />}
            danger
            onPress={logout}
          />

          <View style={styles.footer}>
            <Text style={styles.footerTitle}>PetCare</Text>
            <Text style={styles.footerVersion}>
              Version 1.0.0
            </Text>
          </View>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F6FB",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FB",
  },

  header: {
    height: 210,
    backgroundColor: "#6C4CE0",
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  profileTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: "#fff",
    marginTop: 20,
  },

  profileCard: {
    marginHorizontal: 24,
    backgroundColor: "#fff",
    borderRadius: 30,
    marginTop: -65,
    alignItems: "center",
    paddingTop: 75,
    paddingBottom: 35,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },

  imageContainer: {
    position: "absolute",
    top: -60,
  },

  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: "#fff",
  },

  cameraButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#6C4CE0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginTop: 6,
  },

  userEmail: {
    fontSize: 15,
    color: "#777",
    marginTop: 5,
  },

  menuContainer: {
    marginTop: 35,
    paddingHorizontal: 24,
  },


  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 16,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#F2EDFF",
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },

  footer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  footerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#999",
  },

  footerVersion: {
    marginTop: 4,
    fontSize: 13,
    color: "#B5B5B5",
  },

});