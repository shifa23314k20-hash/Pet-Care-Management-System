import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, Alert, Modal } from "react-native";
import PetForm from "@/components/petForm";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { deletePet, getPetById, updatePet } from "@/services/pet";

interface Pet {
    id: string;
    name: string;
    type: string;
    breed: string;
    age: number;
    gender: string;
    weight: number;
    healthInfo: string;
    petImage?: string;
}

const PLACEHOLDER = require("../../../../../assets/images/dummy-pic.jpg");

export default function PetProfile() {
    const { id } = useLocalSearchParams();
    const [pet, setPet] = useState<Pet | null>(null);
    const [editVisible, setEditVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchPet = useCallback(async () => {
        try {
            const res = await getPetById(id as string);
            console.log("Response:", res);
            setPet(res.pet);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPet();
    }, [fetchPet]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchPet();
    };

    const handleUpdate = async (values: any) => {
        try {
            setSaving(true);
            const response = await updatePet(pet!.id, {
                ...values,
                age: Number(values.age),
                weight: Number(values.weight),
            });
            Alert.alert("Success", response.message);
            setEditVisible(false);
            fetchPet();
        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Couldn't update pet."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Delete Pet",
            "Are you sure you want to delete this pet?",
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
                            setDeleting(true);
                            await deletePet(id as string);
                            console.log("Deleting ID:", id);
                            Alert.alert("Success", "Pet deleted successfully.");
                            router.back();
                        } catch (err: any) {
                            console.log("Delete Error:", err.response?.data || err.message);
                            Alert.alert(
                                "Error",
                                err.response?.data?.message || "Failed to delete pet."
                            );
                        } finally {
                            setDeleting(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.center}>
                <ActivityIndicator size="large" color="#6C5DD3" />
            </SafeAreaView>
        );
    }

    if (!pet) {
        return (
            <SafeAreaView style={styles.center}>
                <MaterialCommunityIcons
                    name="paw-off"
                    size={70}
                    color="#C4C4C4"
                />

                <Text style={styles.emptyTitle}>
                    Pet not found
                </Text>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.primaryButtonText}>
                        Go Back
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6C5DD3"
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color="#111827"
                        />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>
                        Pet Profile
                    </Text>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => setEditVisible(true)}
                    >
                        <Feather
                            name="edit-2"
                            size={20}
                            color="#6C5DD3"
                        />
                    </TouchableOpacity>
                </View>

                {/* Profile Card */}

                <View style={styles.profileCard}>
                    <Image
                        source={
                            pet.petImage && pet.petImage.trim() !== ""
                                ? { uri: pet.petImage }
                                : PLACEHOLDER
                        }
                        style={styles.image}
                    />

                    <Text style={styles.petName}>
                        {pet.name}
                    </Text>

                    <Text style={styles.petBreed}>
                        {pet.breed} • {pet.type}
                    </Text>

                    <View style={styles.badge}>
                        <MaterialCommunityIcons
                            name="paw"
                            size={15}
                            color="#6C5DD3"
                        />

                        <Text style={styles.badgeText}>
                            Loved Pet
                        </Text>
                    </View>
                </View>

                {/* Stats */}

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <MaterialCommunityIcons
                            name="calendar"
                            size={28}
                            color="#6C5DD3"
                        />

                        <Text style={styles.statValue}>
                            {pet.age}
                        </Text>

                        <Text style={styles.statLabel}>
                            Years
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons
                            name="weight-kilogram"
                            size={28}
                            color="#6C5DD3"
                        />

                        <Text style={styles.statValue}>
                            {pet.weight}
                        </Text>

                        <Text style={styles.statLabel}>
                            Kg
                        </Text>
                    </View>

                    <View style={styles.statCard}>
                        <MaterialCommunityIcons
                            name={
                                pet.gender?.toLowerCase() === "male"
                                    ? "gender-male"
                                    : "gender-female"
                            }
                            size={28}
                            color="#6C5DD3"
                        />

                        <Text style={styles.statValue}>
                            {pet.gender}
                        </Text>

                        <Text style={styles.statLabel}>
                            Gender
                        </Text>
                    </View>
                </View>
                {/* Health Information */}

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons
                            name="heart-pulse"
                            size={32}
                            color="#6C5DD3"
                        />

                        <Text style={styles.cardTitle}>
                            Health Information
                        </Text>
                    </View>

                    <Text style={styles.healthText}>
                        {pet.healthInfo?.trim()
                            ? pet.healthInfo
                            : "No health information available."}
                    </Text>
                </View>

                {/* Quick Actions */}

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>
                        Quick Actions
                    </Text>

                    <View style={styles.actionGrid}>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/tabs/screen/health-record",
                                    params: { petId: pet.id },
                                })
                            }
                        >
                            <MaterialCommunityIcons
                                name="heart-pulse"
                                size={32}
                                color="#6C5DD3"
                            />

                            <Text style={styles.actionText}>
                                Health
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/tabs/screen/vaccination",
                                    params: { petId: pet.id },
                                })
                            }
                        >
                            <MaterialCommunityIcons
                                name="needle"
                                size={32}
                                color="#6C5DD3"
                            />

                            <Text style={styles.actionText}>
                                Vaccinations
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/tabs/screen/appointments",
                                    params: { petId: pet.id },
                                })
                            }
                        >
                            <MaterialCommunityIcons
                                name="calendar-check"
                                size={32}
                                color="#6C5DD3"
                            />

                            <Text style={styles.actionText}>
                                Appointments
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() =>
                                router.push({
                                    pathname: "/tabs/screen/gallery",
                                    params: { petId: pet.id },
                                })
                            }
                        >
                            <MaterialCommunityIcons
                                name="image-multiple"
                                size={32}
                                color="#6C5DD3"
                            />

                            <Text style={styles.actionText}>
                                Gallery
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>

                {/* Buttons */}

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={() => setEditVisible(true)}
                >
                    <Feather
                        name="edit-2"
                        size={18}
                        color="#fff"
                    />

                    <Text style={styles.primaryButtonText}>
                        Edit Pet
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    disabled={deleting}
                    onPress={handleDelete}
                >
                    {deleting ? (
                        <ActivityIndicator color="#EF4444" />
                    ) : (
                        <>
                            <Feather
                                name="trash-2"
                                size={18}
                                color="#EF4444"
                            />

                            <Text style={styles.deleteText}>
                                Delete Pet
                            </Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />

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
                            maxHeight: "82%",
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
                                Edit Pet
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

                        <PetForm
                            initialValues={{
                                name: pet.name,
                                type: pet.type,
                                breed: pet.breed,
                                age: String(pet.age),
                                gender: pet.gender,
                                weight: String(pet.weight),
                                healthInfo: pet.healthInfo,
                                petImage: pet.petImage ?? "",
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
    safe: {
        flex: 1,
        backgroundColor: "#F7F8FC",
    },

    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F8FC",
        paddingHorizontal: 30,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
    },

    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    profileCard: {
        marginHorizontal: 20,
        marginTop: 10,
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        alignItems: "center",
        paddingVertical: 30,
        paddingHorizontal: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    image: {
        width: 130,
        height: 130,
        borderRadius: 65,
        borderWidth: 4,
        borderColor: "#6C5DD3",
        marginBottom: 18,
    },

    petName: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
    },

    petBreed: {
        fontSize: 15,
        color: "#6B7280",
        marginTop: 6,
        marginBottom: 16,
    },

    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#EEEAFE",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 999,
    },

    badgeText: {
        marginLeft: 6,
        color: "#6C5DD3",
        fontWeight: "600",
    },

    statsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginTop: 20,
    },

    statCard: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        marginHorizontal: 5,
        borderRadius: 18,
        alignItems: "center",
        paddingVertical: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    statValue: {
        marginTop: 10,
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
    },

    statLabel: {
        marginTop: 5,
        color: "#6B7280",
        fontSize: 13,
    },

    card: {
        backgroundColor: "#FFFFFF",
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },

    cardTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
    },

    healthText: {
        color: "#6B7280",
        fontSize: 15,
        lineHeight: 24,
    },

    actionGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
    },

    actionCard: {
        width: "48%",
        backgroundColor: "#F7F4FF",
        borderRadius: 18,
        alignItems: "center",
        paddingVertical: 22,
        marginBottom: 15,
    },

    actionText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: "600",
        color: "#111827",
    },

    primaryButton: {
        backgroundColor: "#6C5DD3",
        marginHorizontal: 20,
        marginTop: 25,
        borderRadius: 16,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        elevation: 3,
        shadowColor: "#6C5DD3",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 3,
        },
    },

    primaryButtonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        marginLeft: 10,
    },

    deleteButton: {
        backgroundColor: "#FFF5F5",
        borderWidth: 1,
        borderColor: "#FECACA",
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 16,
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        marginBottom: 30,
    },

    deleteText: {
        color: "#EF4444",
        fontWeight: "700",
        fontSize: 16,
        marginLeft: 10,
    },

    emptyTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginVertical: 20,
    },
});