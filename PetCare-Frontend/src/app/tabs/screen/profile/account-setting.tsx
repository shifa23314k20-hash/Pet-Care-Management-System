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
    Moon,
    Bell,
    Mail,
    ChevronRight,
    Shield,
    FileText,
    Info,
    Star,
    Trash2,
} from "lucide-react-native";

export default function AccountSettings() {
    const [darkMode, setDarkMode] = useState(false);
    const [pushNotification, setPushNotification] = useState(true);
    const [emailNotification, setEmailNotification] = useState(true);

    const SettingItem = ({
        icon,
        title,
        value,
        onPress,
        rightComponent,
    }: any) => (
        <TouchableOpacity
            style={styles.settingItem}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>{icon}</View>

                <Text style={styles.settingTitle}>{title}</Text>
            </View>

            {rightComponent ? (
                rightComponent
            ) : (
                <View style={styles.rightContainer}>
                    {value && (
                        <Text style={styles.valueText}>
                            {value}
                        </Text>
                    )}

                    <ChevronRight
                        size={20}
                        color="#A0A0A0"
                    />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}

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
                        Account Settings
                    </Text>

                    <View style={{ width: 24 }} />
                </View>

                {/* Account */}

                <Text style={styles.sectionTitle}>
                    Account
                </Text>

                <View style={styles.card}>

                    <SettingItem
                        title="Change Password"
                        icon={
                            <Lock
                                size={20}
                                color="#6C4CE0"
                            />
                        }
                        onPress={() =>
                            router.push("/auth/forgot-password")
                        }
                    />

                    <View style={styles.divider} />

                    <SettingItem
                        title="Language"
                        value="English"
                        icon={
                            <Languages
                                size={20}
                                color="#6C4CE0"
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

                {/* Preferences */}

                <Text style={styles.sectionTitle}>
                    Preferences
                </Text>

                <View style={styles.card}>

                    <SettingItem
                        title="Push Notifications"
                        icon={
                            <Bell
                                size={20}
                                color="#6C4CE0"
                            />
                        }
                        rightComponent={
                            <Switch
                                value={pushNotification}
                                onValueChange={setPushNotification}
                                trackColor={{
                                    false: "#D1D5DB",
                                    true: "#C4B5FD",
                                }}
                                thumbColor={
                                    pushNotification
                                        ? "#6C4CE0"
                                        : "#FFFFFF"
                                }
                            />
                        }
                    />

                    <View style={styles.divider} />

                    <SettingItem
                        title="Email Notifications"
                        icon={
                            <Mail
                                size={20}
                                color="#6C4CE0"
                            />
                        }
                        rightComponent={
                            <Switch
                                value={emailNotification}
                                onValueChange={setEmailNotification}
                                trackColor={{
                                    false: "#D1D5DB",
                                    true: "#C4B5FD",
                                }}
                                thumbColor={
                                    emailNotification
                                        ? "#6C4CE0"
                                        : "#FFFFFF"
                                }
                            />
                        }
                    />

                </View>
                {/* Support */}

                <Text style={styles.sectionTitle}>
                    Support
                </Text>

                <View style={styles.card}>

                    <SettingItem
                        title="Privacy Policy"
                        icon={
                            <Shield
                                size={20}
                                color="#6C4CE0"
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

                    <SettingItem
                        title="Terms & Conditions"
                        icon={
                            <FileText
                                size={20}
                                color="#6C4CE0"
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

                    <SettingItem
                        title="Rate App"
                        icon={
                            <Star
                                size={20}
                                color="#6C4CE0"
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

                    <SettingItem
                        title="About App"
                        icon={
                            <Info
                                size={20}
                                color="#6C4CE0"
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

                {/* Danger Zone */}

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
                    <Trash2
                        size={22}
                        color="#EF4444"
                    />

                    <Text style={styles.deleteText}>
                        Delete Account
                    </Text>
                </TouchableOpacity>

                <View style={{ height: 40 }} />

            </ScrollView>

        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F6FB",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#ECECEC",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#1F2340",
    },

    sectionTitle: {
        marginTop: 25,
        marginBottom: 12,
        marginHorizontal: 20,
        fontSize: 16,
        fontWeight: "700",
        color: "#555",
    },

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        borderRadius: 18,
        paddingVertical: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },

    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 18,
        paddingVertical: 18,
    },

    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: "#F3EEFF",
        justifyContent: "center",
        alignItems: "center",
    },

    settingTitle: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },

    rightContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    valueText: {
        marginRight: 8,
        color: "#777",
        fontSize: 14,
    },

    divider: {
        height: 1,
        backgroundColor: "#F1F1F1",
        marginHorizontal: 18,
    },
    dangerTitle: {
        marginTop: 28,
        marginBottom: 12,
        marginHorizontal: 20,
        fontSize: 16,
        fontWeight: "700",
        color: "#EF4444",
    },

    deleteButton: {
        marginHorizontal: 20,
        height: 60,
        backgroundColor: "#FFF5F5",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 18,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        shadowColor: "#EF4444",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },

    deleteText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: "700",
        color: "#EF4444",
    },
});