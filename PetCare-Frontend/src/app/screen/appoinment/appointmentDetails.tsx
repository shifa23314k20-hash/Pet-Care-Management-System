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
} from "lucide-react-native";

import {
    getAppointmentById,
    deleteAppointment,
    getAppointmentsByPetId,
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
                response.appointment ||
                response.data?.appointment;

            setAppointment(appointmentData);

            if (appointmentData?.petId) {
                try {
                    const petResponse = await getPetById(
                        appointmentData.petId
                    );

                    console.log("Pet Response:", petResponse);

                    setPet(
                        petResponse.pet ||
                        petResponse.data?.pet
                    );
                } catch (err) {
                    console.log("Pet fetch failed", err);
                }
            }
        } catch (error) {
            console.log(error);

            Alert.alert(
                "Error",
                "Failed to load appointment."
            );
        } finally {
            setLoading(false);
        }
    };


    const handleUpdate = async (values: any) => {
        try {
            setSaving(true);

            const response = await updateAppointment(
                appointment.id,
                {
                    ...values,
                    petId: appointment.petId,
                    userId: appointment.userId,
                }
            );

            Alert.alert("Success", response.message);

            setEditVisible(false);

            fetchAppointment();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Couldn't update appointment."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Appointment",
            "Are you sure?",
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
                        } catch {
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

    if (!appointment) {
        return (
            <SafeAreaView style={styles.loader}>
                <Text>Appointment not found.</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
            >
                {/* Pet Card */}

                <View style={styles.petCard}>
                    <Image
                        source={
                            pet?.petImage
                                ? { uri: pet.petImage }
                                : require("../../../../assets/images/dummy-pic.jpg")
                        }
                        style={styles.avatar}
                    />

                    <View style={styles.petContent}>
                        <Text style={styles.petName}>
                            {pet?.name || "Unknown Pet"}
                        </Text>

                        <Text style={styles.petBreed}>
                            {pet?.breed || "Unknown Breed"}
                        </Text>

                        <View style={styles.petBadges}>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {pet?.type || "Pet"}
                                </Text>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {pet?.gender || "Unknown"}
                                </Text>
                            </View>

                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>
                                    {pet?.age ? `${pet.age} yrs` : "--"}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.weightBox}>
                            <Text style={styles.weightLabel}>
                                Weight
                            </Text>

                            <Text style={styles.weightValue}>
                                {pet?.weight ? `${pet.weight} kg` : "--"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Appointment Card */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Appointment Details
                    </Text>

                    <View style={styles.infoRow}>
                        <CalendarDays size={20} color={PRIMARY} />
                        <View>
                            <Text style={styles.infoLabel}>
                                Date
                            </Text>

                            <Text style={styles.infoValue}>
                                {new Date(
                                    appointment.dateTime
                                ).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Clock3 size={20} color={PRIMARY} />
                        <View>
                            <Text style={styles.infoLabel}>
                                Time
                            </Text>

                            <Text style={styles.infoValue}>
                                {new Date(
                                    appointment.dateTime
                                ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Tag size={20} color={PRIMARY} />
                        <View>
                            <Text style={styles.infoLabel}>
                                Type
                            </Text>

                            <Text style={styles.infoValue}>
                                {appointment.type}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <Bell size={20} color={PRIMARY} />
                        <View>
                            <Text style={styles.infoLabel}>
                                Reminder
                            </Text>

                            <Text style={styles.infoValue}>
                                {appointment.reminderEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <FileText size={20} color={PRIMARY} />
                        <View>
                            <Text style={styles.infoLabel}>
                                Status
                            </Text>

                            <Text style={styles.infoValue}>
                                {appointment.status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Notes */}

                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>
                        Notes
                    </Text>

                    <Text style={styles.notes}>
                        {appointment.notes ||
                            "No notes available."}
                    </Text>
                </View>

                {/* Buttons */}

                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => setEditVisible(true)}
                    >
                        <Pencil size={18} color="#fff" />
                        <Text style={styles.buttonText}>
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDelete}
                    >
                        <Trash2 size={18} color="#fff" />
                        <Text style={styles.buttonText}>
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                visible={editVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setEditVisible(false)}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.45)",
                    }}
                >
                    <SafeAreaView
                        style={{
                            backgroundColor: "#fff",
                            borderTopLeftRadius: 28,
                            borderTopRightRadius: 28,
                            maxHeight: "85%",
                        }}
                    >
                        {/* Handle */}
                        <View
                            style={{
                                width: 45,
                                height: 5,
                                backgroundColor: "#D1D5DB",
                                borderRadius: 999,
                                alignSelf: "center",
                                marginTop: 10,
                                marginBottom: 10,
                            }}
                        />

                        {/* Header */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingHorizontal: 20,
                                paddingBottom: 15,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: "700",
                                }}
                            >
                                Edit Appointment
                            </Text>

                            <TouchableOpacity
                                onPress={() => setEditVisible(false)}
                            >
                                <Text
                                    style={{
                                        fontSize: 24,
                                    }}
                                >
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <AppointmentForm
                            initialValues={{
                                title: appointment.title,
                                type: appointment.type,
                                dateTime: appointment.dateTime,
                                notes: appointment.notes,
                                reminderEnabled:
                                    appointment.reminderEnabled,
                                reminderTime:
                                    appointment.reminderTime,
                                status: appointment.status,
                                petId: appointment.petId,
                            }}
                            buttonTitle="Save Changes"
                            loading={saving}
                            onSubmit={handleUpdate}
                        />
                    </SafeAreaView>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F7FB",
        paddingHorizontal: 18,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    heroCard: {
        backgroundColor: PRIMARY,
        borderRadius: 28,
        paddingVertical: 28,
        paddingHorizontal: 22,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 22,
    },

    heroType: {
        color: "#DDD6FE",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 1,
        marginTop: 14,
    },

    heroTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginTop: 8,
    },

    statusBadge: {
        marginTop: 18,
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 100,
    },

    card: {
        backgroundColor: "#fff",
        borderRadius: 22,
        padding: 20,
        marginBottom: 18,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },
        elevation: 3,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 18,
    },

    petRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    petCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 22,
        padding: 18,
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,

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
        backgroundColor: "#F3F4F6",
    },

    petContent: {
        flex: 1,
        marginLeft: 18,
    },

    petName: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    petBreed: {
        marginTop: 3,
        fontSize: 15,
        color: "#6B7280",
    },

    petBadges: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 14,
    },

    badge: {
        backgroundColor: "#EEEAFE",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 50,
        marginRight: 8,
        marginBottom: 8,
    },

    badgeText: {
        color: PRIMARY,
        fontWeight: "600",
        fontSize: 13,
    },

    weightBox: {
        marginTop: 8,
        backgroundColor: "#F8F8FC",
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10,
        alignSelf: "flex-start",
    },

    weightLabel: {
        fontSize: 12,
        color: "#9CA3AF",
    },

    weightValue: {
        marginTop: 2,
        fontSize: 18,
        fontWeight: "700",
        color: PRIMARY,
    },

    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 18,
    },

    infoLabel: {
        marginLeft: 14,
        fontSize: 13,
        color: "#9CA3AF",
    },

    infoValue: {
        marginLeft: 14,
        marginTop: 2,
        fontSize: 16,
        fontWeight: "600",
        color: "#111827",
        textTransform: "capitalize",
    },

    notes: {
        color: "#6B7280",
        lineHeight: 24,
        fontSize: 15,
    },

    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    editButton: {
        flex: 1,
        height: 55,
        borderRadius: 16,
        backgroundColor: PRIMARY,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },

    deleteButton: {
        flex: 1,
        height: 55,
        borderRadius: 16,
        backgroundColor: "#EF4444",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 10,
    },

    buttonText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 8,
    },
});