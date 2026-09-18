import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
  router,
} from "expo-router";

import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
} from "lucide-react-native";

import {
  getUserById,
  updateUser,
} from "@/services/user";


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
  location?: string;
  bio?: string;
  profileImage?: string;
}


// ======================================================
// SCREEN
// ======================================================

export default function PersonalInformation() {

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [userId, setUserId] =
    useState("");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [profileImage, setProfileImage] =
    useState("");


  // ======================================================
  // LOAD USER
  // ======================================================

  const loadUser = async () => {

    try {

      const storedUser =
        await AsyncStorage.getItem("user");

      if (!storedUser) {

        router.replace("/auth/login");

        return;
      }

      const parsedUser =
        JSON.parse(storedUser);

      const response =
        await getUserById(parsedUser.id);

      const user: IUser =
        response.user;

      setUserId(user.id);
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setBio(user.bio || "");
      setProfileImage(
        user.profileImage || ""
      );

    } catch (error) {

      console.log(
        "PERSONAL INFO ERROR:",
        error
      );

      Alert.alert(
        "Error",
        "Unable to load profile information."
      );

    } finally {

      setLoading(false);

    }
  };


  // ======================================================
  // SCREEN FOCUS
  // ======================================================

  useFocusEffect(
    useCallback(() => {

      loadUser();

    }, [])
  );


  // ======================================================
  // SAVE
  // ======================================================

  const handleSave = async () => {

    try {

      setSaving(true);

      await updateUser(userId, {
        name,
        phone,
        location,
        bio,
        profileImage,
      });

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );


      // Update local user

      const stored =
        await AsyncStorage.getItem(
          "user"
        );

      if (stored) {

        const localUser =
          JSON.parse(stored);

        await AsyncStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            name,
            phone,
            location,
            bio,
            profileImage,
          })
        );

      }

    } catch (error: any) {

      console.log(
        "UPDATE PROFILE ERROR:",
        error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Something went wrong."
      );

    } finally {

      setSaving(false);

    }
  };


  // ======================================================
  // FORM FIELD
  // ======================================================

  const Field = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    editable = true,
    multiline = false,
    keyboardType = "default",
  }: {
    label: string;
    icon: React.ReactNode;
    value: string;
    onChangeText?: (text: string) => void;
    placeholder: string;
    editable?: boolean;
    multiline?: boolean;
    keyboardType?: any;
  }) => (

    <View style={styles.field}>

      <Text style={styles.label}>
        {label}
      </Text>

      <View
        style={[
          styles.inputContainer,
          !editable &&
            styles.disabledContainer,
          multiline &&
            styles.multilineContainer,
        ]}
      >

        <View style={styles.inputIcon}>
          {icon}
        </View>

        <TextInput
          style={[
            styles.input,
            multiline &&
              styles.multilineInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#AAA7B2"
          editable={editable}
          multiline={multiline}
          keyboardType={keyboardType}
        />

      </View>

    </View>
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
          Loading information...
        </Text>

      </View>
    );

  }


  // ======================================================
  // UI
  // ======================================================

  return (

    <SafeAreaView style={styles.safeArea}>

      <View style={styles.container}>

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
              Personal Information
            </Text>

            <Text style={styles.headerSubtitle}>
              Manage your personal details
            </Text>

          </View>

        </View>


        {/* ==================================================
            SCROLL
        ================================================== */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {/* ==================================================
              PROFILE IMAGE
          ================================================== */}

          <View style={styles.profileSection}>

            <Image
              source={
                profileImage
                  ? {
                      uri: profileImage,
                    }
                  : require("../../../../../assets/images/profile_placeholder.jpg")
              }
              style={styles.profileImage}
            />

            <Text style={styles.photoTitle}>
              Profile Photo
            </Text>
          </View>


          {/* ==================================================
              FORM CARD
          ================================================== */}

          <View style={styles.formCard}>

            <Field
              label="Full Name"
              icon={
                <User
                  size={18}
                  color={PURPLE}
                />
              }
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />


            <Field
              label="Email"
              icon={
                <Mail
                  size={18}
                  color="#AAA7B2"
                />
              }
              value={email}
              placeholder="Email"
              editable={false}
            />


            <Field
              label="Phone"
              icon={
                <Phone
                  size={18}
                  color={PURPLE}
                />
              }
              value={phone}
              onChangeText={setPhone}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />


            <Field
              label="Location"
              icon={
                <MapPin
                  size={18}
                  color={PURPLE}
                />
              }
              value={location}
              onChangeText={setLocation}
              placeholder="Enter location"
            />


            <Field
              label="Bio"
              icon={
                <FileText
                  size={18}
                  color={PURPLE}
                />
              }
              value={bio}
              onChangeText={setBio}
              placeholder="Write something about yourself..."
              multiline
            />


            {/* ==================================================
                SAVE
            ================================================== */}

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.85}
              onPress={handleSave}
              disabled={saving}
            >

              {saving ? (

                <ActivityIndicator
                  color="#FFFFFF"
                />

              ) : (

                <Text style={styles.saveButtonText}>
                  Save Changes
                </Text>

              )}

            </TouchableOpacity>

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

    paddingHorizontal: 20,

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
    fontSize: 21,
    fontWeight: "800",
    color: "#242331",
  },

  headerSubtitle: {
    fontSize: 12,
    color: "#92909E",
    marginTop: 3,
  },


  // ======================================================
  // PROFILE PHOTO
  // ======================================================

  profileSection: {
    alignItems: "center",

    paddingVertical: 10,

    marginBottom: 15,
  },

  profileImage: {
    width: 100,
    height: 100,

    borderRadius: 50,

    borderWidth: 4,
    borderColor: "#EFECFB",

    backgroundColor: "#EFECFB",
  },

  photoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242331",
    marginTop: 10,
  },

  photoSubtitle: {
    fontSize: 11,
    color: "#92909E",
    marginTop: 3,
  },


  // ======================================================
  // FORM
  // ======================================================

  formCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 17,

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

  field: {
    marginBottom: 15,
  },

  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#454350",

    marginBottom: 7,
  },

  inputContainer: {
    height: 52,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E8E6EF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 13,
  },

  disabledContainer: {
    backgroundColor: "#F4F3F7",
    borderColor: "#ECEAF2",
  },

  inputIcon: {
    width: 27,
    alignItems: "center",
    justifyContent: "center",

    marginRight: 5,
  },

  input: {
    flex: 1,

    height: "100%",

    fontSize: 14,

    color: "#242331",
  },

  multilineContainer: {
    height: 115,

    alignItems: "flex-start",

    paddingTop: 13,
  },

  multilineInput: {
    height: 95,

    textAlignVertical: "top",

    paddingTop: 0,
  },


  // ======================================================
  // BUTTON
  // ======================================================

  saveButton: {
    height: 54,

    borderRadius: 15,

    backgroundColor: PURPLE,

    alignItems: "center",
    justifyContent: "center",

    marginTop: 5,

    shadowColor: PURPLE,
    shadowOpacity: 0.22,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },


  // ======================================================
  // LOADING
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