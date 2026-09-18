import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";

import {
    CalendarDays,
    Clock3,
    Bell,
    FileText,
    Tag,
    Pencil,
    Trash2,
    ChevronLeft,
    Stethoscope,
} from "lucide-react-native";

import {
    getAppointmentById,
    deleteAppointment,
    updateAppointment,
} from "@/services/appointment";

import { getPetById } from "@/services/pet";
import AppointmentForm from "@/components/appointmentForm";

const PRIMARY = "#6C5DD3";

export default function AppointmentDetailsScreen() {
    const { id } = useLocalSearchParams();

    const [appointment, setAppointment] = useState<any>(null);
    const [pet, setPet] = useState<any>(null);

    const [loading, setLoading] = useState(true);
    const [editVisible, setEditVisible] = useState(false);
    const [saving, setSaving] = useState(false);

    /* =========================================================
       FETCH APPOINTMENT
    ========================================================= */

    useFocusEffect(
        useCallback(() => {
            fetchAppointment();
        }, [id])
    );

    const fetchAppointment = async () => {
        try {
            setLoading(true);

            const response = await getAppointmentById(id as string);

            const appointmentData =
                response?.appointment ||
                response?.data?.appointment;

            setAppointment(appointmentData);

            /* ---------------- Fetch Pet ---------------- */

            if (appointmentData?.petId) {
                try {
                    const petResponse = await getPetById(
                        appointmentData.petId
                    );

                    setPet(
                        petResponse?.pet ||
                        petResponse?.data?.pet
                    );
                } catch (error) {
                    console.log("Pet fetch failed:", error);
                    setPet(null);
                }
            }
        } catch (error) {
            console.log("Appointment fetch error:", error);

            Alert.alert(
                "Error",
                "Failed to load appointment."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       DATE / TIME HELPERS
    ========================================================= */

    const getAppointmentDate = () => {
        if (!appointment?.dateTime) return "--";

        return new Date(
            appointment.dateTime
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getAppointmentTime = () => {
        if (!appointment?.dateTime) return "--";

        return new Date(
            appointment.dateTime
        ).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getEditDate = () => {
        if (!appointment?.dateTime) return "";

        const date = new Date(appointment.dateTime);

        const year = date.getFullYear();
        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const getEditTime = () => {
        if (!appointment?.dateTime) return "";

        const date = new Date(appointment.dateTime);

        const hours = String(
            date.getHours()
        ).padStart(2, "0");

        const minutes = String(
            date.getMinutes()
        ).padStart(2, "0");

        return `${hours}:${minutes}`;
    };

    /* =========================================================
       UPDATE APPOINTMENT
    ========================================================= */

    const handleUpdate = async (values: any) => {
        try {
            setSaving(true);

            const dateTime = new Date(
                `${values.date}T${values.time}:00`
            ).toISOString();

            const response = await updateAppointment(
                appointment.id,
                {
                    title: values.title,
                    type: values.type,
                    dateTime,
                    notes: values.notes,
                    reminderEnabled:
                        values.reminderEnabled,

                    reminderTime:
                        values.reminderEnabled
                            ? dateTime
                            : null,

                    status: values.status,

                    petId: appointment.petId,
                    userId: appointment.userId,
                }
            );

            Alert.alert(
                "Success",
                response?.message ||
                "Appointment updated successfully."
            );

            setEditVisible(false);

            await fetchAppointment();
        } catch (error: any) {
            console.log("Update error:", error);

            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Couldn't update appointment."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =========================================================
       DELETE APPOINTMENT
    ========================================================= */

    const handleDelete = () => {
        Alert.alert(
            "Delete Appointment",
            "Are you sure you want to delete this appointment?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },

                {
                    text: "Delete",
                    style: "destructive",

                    onPress: async () => {
                        try {
                            await deleteAppointment(
                                appointment.id
                            );

                            Alert.alert(
                                "Deleted",
                                "Appointment deleted successfully."
                            );

                            router.back();
                        } catch (error) {
                            console.log(
                                "Delete error:",
                                error
                            );

                            Alert.alert(
                                "Error",
                                "Unable to delete appointment."
                            );
                        }
                    },
                },
            ]
        );
    };

    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {
        return (
            <SafeAreaView style={styles.loader}>
                <ActivityIndicator
                    size="large"
                    color={PRIMARY}
                />
            </SafeAreaView>
        );
    }

    /* =========================================================
       NOT FOUND
    ========================================================= */

    if (!appointment) {
        return (
            <SafeAreaView style={styles.loader}>
                <Text style={styles.notFoundTitle}>
                    Appointment not found.
                </Text>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>
                        Go Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    /* =========================================================
       MAIN UI
    ========================================================= */

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => router.back()}
                    >
                        <ChevronLeft
                            size={24}
                            color="#242331"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Appointment
                    </Text>

                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() =>
                            setEditVisible(true)
                        }
                    >
                        <Pencil
                            size={19}
                            color={PRIMARY}
                        />
                    </TouchableOpacity>
                </View>

                {/* =================================================
                    APPOINTMENT HERO CARD
                ================================================= */}

                <View style={styles.heroCard}>
                    <View style={styles.heroIcon}>
                        <Stethoscope
                            size={30}
                            color={PRIMARY}
                        />
                    </View>

                    <Text style={styles.heroTitle}>
                        {appointment.title ||
                            "Pet Appointment"}
                    </Text>

                    <View style={styles.heroTypeBadge}>
                        <Text
                            style={
                                styles.heroTypeText
                            }
                        >
                            {appointment.type ||
                                "Appointment"}
                        </Text>
                    </View>
                </View>

                {/* =================================================
                    PET CARD
                ================================================= */}

                <View style={styles.petCard}>
                    <Image
                        source={
                            pet?.petImage
                                ? {
                                    uri: pet.petImage,
                                }
                                : require("../../../../../assets/images/dummy-pic.jpg")
                        }
                        style={styles.avatar}
                    />

                    <View style={styles.petContent}>
                        <Text style={styles.petName}>
                            {pet?.name ||
                                "Unknown Pet"}
                        </Text>

                        <Text style={styles.petBreed}>
                            {pet?.breed ||
                                "Unknown Breed"}
                        </Text>

                        <View style={styles.petBadges}>
                            <View
                                style={styles.badge}
                            >
                                <Text
                                    style={
                                        styles.badgeText
                                    }
                                >
                                    {pet?.type ||
                                        "Pet"}
                                </Text>
                            </View>

                            <View
                                style={styles.badge}
                            >
                                <Text
                                    style={
                                        styles.badgeText
                                    }
                                >
                                    {pet?.gender ||
                                        "Unknown"}
                                </Text>
                            </View>

                            <View
                                style={styles.badge}
                            >
                                <Text
                                    style={
                                        styles.badgeText
                                    }
                                >
                                    {pet?.age
                                        ? `${pet.age} yrs`
                                        : "--"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.weightBox}>
                            <Text
                                style={
                                    styles.weightLabel
                                }
                            >
                                Weight
                            </Text>

                            <Text
                                style={
                                    styles.weightValue
                                }
                            >
                                {pet?.weight
                                    ? `${pet.weight} kg`
                                    : "--"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* =================================================
                    APPOINTMENT INFORMATION
                ================================================= */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Appointment Details
                    </Text>

                    {/* Date */}

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <CalendarDays
                                size={19}
                                color={PRIMARY}
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Date
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {getAppointmentDate()}
                            </Text>
                        </View>
                    </View>

                    {/* Time */}

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Clock3
                                size={19}
                                color={PRIMARY}
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Time
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {getAppointmentTime()}
                            </Text>
                        </View>
                    </View>

                    {/* Type */}

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Tag
                                size={19}
                                color={PRIMARY}
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Appointment Type
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {appointment.type ||
                                    "--"}
                            </Text>
                        </View>
                    </View>

                    {/* Reminder */}

                    <View style={styles.infoRow}>
                        <View style={styles.infoIcon}>
                            <Bell
                                size={19}
                                color={PRIMARY}
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Reminder
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {appointment.reminderEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </Text>
                        </View>
                    </View>

                    {/* Status */}

                    <View
                        style={[
                            styles.infoRow,
                            { marginBottom: 0 },
                        ]}
                    >
                        <View style={styles.infoIcon}>
                            <FileText
                                size={19}
                                color={PRIMARY}
                            />
                        </View>

                        <View style={styles.infoContent}>
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Status
                            </Text>

                            <View
                                style={
                                    styles.statusBadge
                                }
                            >
                                <Text
                                    style={
                                        styles.statusText
                                    }
                                >
                                    {appointment.status ||
                                        "upcoming"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* =================================================
                    NOTES
                ================================================= */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Notes
                    </Text>

                    <View style={styles.notesBox}>
                        <FileText
                            size={18}
                            color={PRIMARY}
                        />

                        <Text style={styles.notes}>
                            {appointment.notes ||
                                "No notes available for this appointment."}
                        </Text>
                    </View>
                </View>

                {/* =================================================
                    ACTION BUTTONS
                ================================================= */}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() =>
                            setEditVisible(true)
                        }
                    >
                        <Pencil
                            size={18}
                            color="#fff"
                        />

                        <Text
                            style={styles.buttonText}
                        >
                            Edit Appointment
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Trash2
                            size={18}
                            color="#fff"
                        />

                        <Text
                            style={styles.buttonText}
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* =====================================================
    EDIT APPOINTMENT MODAL
===================================================== */}

            <Modal
                visible={editVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setEditVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <SafeAreaView style={styles.modalContainer}>

                        {/* Handle */}
                        <View style={styles.modalHandle} />

                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={styles.modalHeaderText}>
                                <Text style={styles.modalTitle}>
                                    Edit Appointment
                                </Text>

                                <Text style={styles.modalSubtitle}>
                                    Update appointment details
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setEditVisible(false)}
                            >
                                <Text style={styles.closeText}>×</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <View style={styles.modalForm}>
                            <AppointmentForm
                                initialValues={{
                                    title: appointment.title || "",

                                    petId:
                                        appointment.petId || "",

                                    type:
                                        appointment.type || "vet",

                                    date: getEditDate(),

                                    time: getEditTime(),

                                    notes:
                                        appointment.notes || "",

                                    reminderEnabled:
                                        appointment.reminderEnabled ?? true,

                                    status:
                                        appointment.status || "upcoming",
                                }}
                                buttonTitle="Save Changes"
                                loading={saving}
                                onSubmit={handleUpdate}
                            />
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({
    /* ---------------------------------------------------------
       MAIN
    --------------------------------------------------------- */

    container: {
        flex: 1,
        backgroundColor: "#F9F8FD",
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 160,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F8FD",
    },

    notFoundTitle: {
        fontSize: 17,
        color: "#555260",
        marginBottom: 15,
    },

    backButton: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 14,
    },

    backButtonText: {
        color: "#fff",
        fontWeight: "700",
    },

    /* ---------------------------------------------------------
       HEADER
    --------------------------------------------------------- */

    header: {
        height: 62,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: "800",
        color: "#242331",
    },

    headerIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",

        borderWidth: 1,
        borderColor: "#ECEAF2",
    },

    /* ---------------------------------------------------------
       HERO CARD
    --------------------------------------------------------- */

    heroCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 22,
        alignItems: "center",
        marginBottom: 18,

        borderWidth: 1,
        borderColor: "#ECEAF2",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 3,
    },

    heroIcon: {
        width: 68,
        height: 68,
        borderRadius: 22,
        backgroundColor: "#EFECFB",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },

    heroTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#242331",
        textAlign: "center",
    },

    heroTypeBadge: {
        backgroundColor: "#EFECFB",
        paddingHorizontal: 15,
        paddingVertical: 7,
        borderRadius: 50,
        marginTop: 10,
    },

    heroTypeText: {
        color: PRIMARY,
        fontSize: 13,
        fontWeight: "700",
        textTransform: "capitalize",
    },

    /* ---------------------------------------------------------
       PET CARD
    --------------------------------------------------------- */

    petCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        padding: 15,
        marginBottom: 18,

        flexDirection: "row",
        alignItems: "center",

        borderWidth: 1,
        borderColor: "#ECEAF2",

        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 3,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#F3F2F8",
    },

    petContent: {
        flex: 1,
        marginLeft: 15,
    },

    petName: {
        fontSize: 21,
        fontWeight: "800",
        color: "#242331",
    },

    petBreed: {
        marginTop: 3,
        fontSize: 14,
        color: "#92909E",
    },

    petBadges: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 10,
    },

    badge: {
        backgroundColor: "#EFECFB",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 50,
        marginRight: 6,
        marginBottom: 5,
    },

    badgeText: {
        color: PRIMARY,
        fontSize: 12,
        fontWeight: "700",
        textTransform: "capitalize",
    },

    weightBox: {
        marginTop: 4,
        backgroundColor: "#F8F7FC",
        borderRadius: 12,
        paddingHorizontal: 11,
        paddingVertical: 7,
        alignSelf: "flex-start",
    },

    weightLabel: {
        fontSize: 11,
        color: "#92909E",
    },

    weightValue: {
        marginTop: 1,
        fontSize: 15,
        fontWeight: "800",
        color: PRIMARY,
    },

    /* ---------------------------------------------------------
       GENERAL CARD
    --------------------------------------------------------- */

    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,

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

    sectionTitle: {
        fontSize: 19,
        fontWeight: "800",
        color: "#242331",
        marginBottom: 18,
    },

    /* ---------------------------------------------------------
       INFO ROWS
    --------------------------------------------------------- */

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    infoIcon: {
        width: 43,
        height: 43,
        borderRadius: 14,
        backgroundColor: "#EFECFB",
        alignItems: "center",
        justifyContent: "center",
    },

    infoContent: {
        flex: 1,
        marginLeft: 13,
    },

    infoLabel: {
        fontSize: 12,
        color: "#92909E",
        fontWeight: "600",
    },

    infoValue: {
        marginTop: 3,
        fontSize: 15,
        fontWeight: "700",
        color: "#242331",
        textTransform: "capitalize",
    },

    /* ---------------------------------------------------------
       STATUS
    --------------------------------------------------------- */

    statusBadge: {
        backgroundColor: "#EFECFB",
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 50,
        alignSelf: "flex-start",
        marginTop: 4,
    },

    statusText: {
        color: PRIMARY,
        fontSize: 13,
        fontWeight: "700",
        textTransform: "capitalize",
    },

    /* ---------------------------------------------------------
       NOTES
    --------------------------------------------------------- */

    notesBox: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#F9F8FD",
        borderRadius: 15,
        padding: 15,
    },

    notes: {
        flex: 1,
        marginLeft: 10,
        color: "#6F6C79",
        fontSize: 14,
        lineHeight: 22,
    },

    /* ---------------------------------------------------------
       BUTTONS
    --------------------------------------------------------- */

    buttonRow: {
        flexDirection: "row",
        marginTop: 2,
    },

    editButton: {
        flex: 1,
        height: 54,
        borderRadius: 15,
        backgroundColor: PRIMARY,

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        marginRight: 6,

        shadowColor: PRIMARY,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    deleteButton: {
        flex: 0.65,
        height: 54,
        borderRadius: 15,
        backgroundColor: "#EF4444",

        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",

        marginLeft: 6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontWeight: "700",
        fontSize: 14,
        marginLeft: 7,
    },

    /* =========================================================
   EDIT MODAL
========================================================= */

    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0, 0, 0, 0.45)",
    },

    modalContainer: {
        width: "100%",
        height: "88%",
        backgroundColor: "#FFFFFF",

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,

        overflow: "hidden",
    },

    modalHandle: {
        width: 45,
        height: 5,
        backgroundColor: "#D1D5DB",
        borderRadius: 999,

        alignSelf: "center",

        marginTop: 10,
        marginBottom: 10,
    },

    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 20,
        paddingBottom: 16,

        borderBottomWidth: 1,
        borderBottomColor: "#F0EEF5",
    },

    modalHeaderText: {
        flex: 1,
        paddingRight: 15,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: "#242331",
    },

    modalSubtitle: {
        marginTop: 4,
        fontSize: 13,
        color: "#92909E",
        fontWeight: "600",
    },

    closeButton: {
        width: 42,
        height: 42,

        borderRadius: 14,

        backgroundColor: "#F5F4FA",

        alignItems: "center",
        justifyContent: "center",
    },

    closeText: {
        fontSize: 28,
        lineHeight: 30,

        color: "#555260",
        fontWeight: "500",
    },

    modalForm: {
        flex: 1,
    },
    formScroll: {
        flex: 1,
    }
});