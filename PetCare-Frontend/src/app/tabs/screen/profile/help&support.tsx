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
    MessageCircle,
    Bug,
    BookOpen,
    Star,
    FileText,
    ShieldCheck,
    Info,
    Heart,
} from "lucide-react-native";

export default function HelpSupport() {

    const HelpItem = ({
        title,
        icon,
        onPress,
    }: any) => (
        <TouchableOpacity
            style={styles.item}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.leftContainer}>

                <View style={styles.iconContainer}>
                    {icon}
                </View>

                <Text style={styles.itemTitle}>
                    {title}
                </Text>

            </View>

            <ChevronRight
                size={20}
                color="#B3B3B3"
            />

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
                        Help & Support
                    </Text>

                    <View style={{ width: 24 }} />

                </View>

                {/* Help Section */}

                <Text style={styles.sectionTitle}>
                    Help Center
                </Text>

                <View style={styles.card}>

                    <HelpItem
                        title="Frequently Asked Questions"
                        icon={
                            <CircleHelp
                                size={20}
                                color="#6C4CE0"
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
                        icon={
                            <Mail
                                size={20}
                                color="#6C4CE0"
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
                        icon={
                            <Bug
                                size={20}
                                color="#6C4CE0"
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
                        icon={
                            <BookOpen
                                size={20}
                                color="#6C4CE0"
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
                {/* App Settings Section */}

                <Text style={styles.sectionTitle}>
                    App Settings
                </Text>


                <View style={styles.card}>


                    <HelpItem
                        title="Rate App"
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
                        icon={
                            <FileText
                                size={20}
                                color="#6C4CE0"
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
                        icon={
                            <ShieldCheck
                                size={20}
                                color="#6C4CE0"
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



                {/* App Version Card */}

                <View style={styles.versionCard}>


                    <View style={styles.versionIcon}>

                        <Info
                            size={22}
                            color="#6C4CE0"
                        />

                    </View>


                    <View style={{ flex: 1 }}>

                        <Text style={styles.versionTitle}>
                            App Version
                        </Text>


                        <Text style={styles.versionText}>
                            PetCare Mobile Application
                        </Text>

                    </View>


                    <Text style={styles.versionNumber}>
                        v1.0.0
                    </Text>


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

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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

    item: {
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

    itemTitle: {
        marginLeft: 15,
        fontSize: 15,
        fontWeight: "600",
        color: "#222",
    },

    divider: {
        height: 1,
        backgroundColor: "#F2F2F2",
        marginHorizontal: 18,
    },
    versionCard: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 18,
        padding: 18,

        flexDirection: "row",
        alignItems: "center",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },


    versionIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,

        backgroundColor: "#F3EEFF",

        justifyContent: "center",
        alignItems: "center",

        marginRight: 15,
    },


    versionTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: "#222",
    },


    versionText: {
        marginTop: 4,
        fontSize: 13,
        color: "#777",
    },


    versionNumber: {
        fontSize: 14,
        fontWeight: "700",
        color: "#6C4CE0",
    },


    footer: {
        alignItems: "center",
        justifyContent: "center",

        paddingVertical: 35,
        paddingHorizontal: 20,
    },


    footerTitle: {
        marginTop: 10,

        fontSize: 16,
        fontWeight: "700",

        color: "#1F2340",
    },


    footerText: {
        marginTop: 5,
        fontSize: 14,
        color: "#777",
    },

    copyright: {
        marginTop: 12,
        fontSize: 12,
        color: "#AAAAAA",
    },
});