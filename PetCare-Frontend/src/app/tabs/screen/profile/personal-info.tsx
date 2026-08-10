import React, { useCallback, useState } from "react";
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
import { useFocusEffect, router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { getUserById, updateUser } from "@/services/user";

interface IUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location?: string;
    bio?: string;
    profileImage?: string;
}

export default function PersonalInformation() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [userId, setUserId] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState("");

    const [bio, setBio] = useState("");
    const [profileImage, setProfileImage] = useState("");

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem("user");

            if (!storedUser) {
                router.replace("/auth/login");
                return;
            }

            const parsedUser = JSON.parse(storedUser);

            const response = await getUserById(parsedUser.id);

            const user: IUser = response.user;

            setUserId(user.id);
            setName(user.name);
            setEmail(user.email);
            setPhone(user.phone || "");
            setLocation(user.location || "");
            setBio(user.bio || "");
            setProfileImage(user.profileImage || "");
        } catch (error) {
            console.log(error);

            Alert.alert(
                "Error",
                "Unable to load profile information."
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadUser();
        }, [])
    );

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

            const stored = await AsyncStorage.getItem("user");

            if (stored) {
                const localUser = JSON.parse(stored);

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
            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Something went wrong."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color="#6C4CE0"
                />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                    >
                        <ArrowLeft
                            size={24}
                            color="#1F2340"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Personal Information
                    </Text>

                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.profileSection}>
                    <Image
                        source={
                            profileImage
                                ? { uri: profileImage }
                                : require("../../../../../assets/images/profile_placeholder.jpg")
                        }
                        style={styles.profileImage}
                    />

                    <Text style={styles.changePhoto}>
                        Profile Photo
                    </Text>
                </View>

                <View style={styles.form}>

                    <Text style={styles.label}>Full Name</Text>

                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Enter your name"
                    />

                    <Text style={styles.label}>Email</Text>

                    <TextInput
                        style={[
                            styles.input,
                            styles.disabledInput,
                        ]}
                        value={email}
                        editable={false}
                    />

                    <Text style={styles.label}>Phone</Text>

                    <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholder="Enter phone number"
                    />

                    <Text style={styles.label}>Location</Text>

                    <TextInput
                        style={styles.input}
                        value={location}
                        onChangeText={setLocation}
                        placeholder="Enter location"
                    />

                    <Text style={styles.label}>Bio</Text>

                    <TextInput
                        style={[
                            styles.input,
                            styles.bioInput,
                        ]}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Write something..."
                        multiline
                    />

                    <TouchableOpacity
                        style={styles.saveButton}
                        activeOpacity={0.85}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>
                                Save Changes
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F6F7FB",
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F6F7FB",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#EFEFEF",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2340",
    },

    profileSection: {
        alignItems: "center",
        marginTop: 30,
        marginBottom: 30,
    },

    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: "#FFFFFF",
        backgroundColor: "#ECECEC",
    },

    changePhoto: {
        marginTop: 12,
        fontSize: 15,
        fontWeight: "600",
        color: "#6C4CE0",
    },

    form: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
        marginBottom: 8,
        marginTop: 16,
    },

    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#E5E7EB",
        paddingHorizontal: 16,
        height: 55,
        fontSize: 15,
        color: "#1F2340",
    },

    disabledInput: {
        backgroundColor: "#F3F4F6",
        color: "#9CA3AF",
    },

    bioInput: {
        height: 120,
        textAlignVertical: "top",
        paddingTop: 16,
    },

    saveButton: {
        marginTop: 35,
        backgroundColor: "#6C4CE0",
        height: 55,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#6C4CE0",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
    },

    saveButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },
});