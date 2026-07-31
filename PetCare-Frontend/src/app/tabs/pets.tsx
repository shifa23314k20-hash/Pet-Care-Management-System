import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus, ChevronRight, Pencil } from "lucide-react-native";
import { getPetsByUserId } from "@/services/pet"; // adjust path
import { SafeAreaView } from "react-native-safe-area-context";
import { createPet, updatePet } from "@/services/pet";
import PetForm from "@/components/petForm";
import { useFocusEffect } from "expo-router/build/react-navigation";

export default function MyPetsScreen() {

    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingPet, setEditingPet] = useState<any>(null);

    useEffect(() => {
        fetchPets();
    }, []);


    useFocusEffect(
        useCallback(() => {
            fetchPets();
        }, [])
    );


    const fetchPets = async () => {
        try {
            setLoading(true);
            const user = await AsyncStorage.getItem("user");
            if (!user) { return }

            const parsedUser = JSON.parse(user);
            const response = await getPetsByUserId(parsedUser.id);
            setPets(response.pets || []);
        } catch (error: any) {
            console.log("Fetch Pets Error:", error);
            Alert.alert(
                "Error",
                error?.response?.data?.message || error.message
            );

        } finally {
            setLoading(false);
        }
    };

    const handleSavePet = async (values: any) => {
        try {

            setSaving(true);


            if (editingPet) {

                // UPDATE MODE

                const response = await updatePet(
                    editingPet.id,
                    {
                        ...values,
                        age: Number(values.age),
                        weight: Number(values.weight),
                    }
                );


                Alert.alert(
                    "Success",
                    response.message
                );


            } else {


                // CREATE MODE

                const user = await AsyncStorage.getItem("user");

                if (!user) return;

                const parsedUser = JSON.parse(user);


                const response = await createPet({

                    userId: parsedUser.id,

                    ...values,

                    age: Number(values.age),

                    weight: Number(values.weight),
                });


                Alert.alert(
                    "Success",
                    response.message
                );
            }


            setModalVisible(false);

            setEditingPet(null);

            fetchPets();


        } catch (error: any) {

            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Something went wrong"
            );

        } finally {

            setSaving(false);

        }
    }

    if (loading) {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <ActivityIndicator
                    size="large"
                    color="#6C5DD3"
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* Header with Title and Add Button */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Pets</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setModalVisible(true)}
                        activeOpacity={0.8}>
                        <Plus size={16} color="#6C5DD3" />
                        <Text style={styles.addText}>Add Pet</Text>
                    </TouchableOpacity>
                </View>

                {/* Scrollable Pet Cards List */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {pets.length === 0 ? (
                        <View
                            style={{
                                alignItems: "center",
                                marginTop: 80,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: "700",
                                }}
                            >
                                No Pets Yet 🐶
                            </Text>

                            <Text
                                style={{
                                    marginTop: 8,
                                    color: "#777",
                                }}
                            >
                                Tap Add Pet to create your first pet.
                            </Text>
                        </View>
                    ) : (
                        pets.map((pet: any) => (
                            <TouchableOpacity
                                key={pet.id}
                                style={styles.petCard}
                                activeOpacity={0.8}
                                onPress={() =>
                                    router.push({
                                        pathname: "/screen/pets/petProfile",
                                        params: {
                                            id: pet.id,
                                        },
                                    })
                                }
                            >
                                <Image
                                    source={
                                        pet.petImage
                                            ? { uri: pet.petImage }
                                            : require("../../../assets/images/dummy-pic.jpg")
                                    }
                                    style={styles.avatar}
                                />

                                <View style={styles.info}>
                                    <Text style={styles.name}>{pet.name}</Text>

                                    <Text style={styles.breed}>
                                        {pet.type} • {pet.breed}
                                    </Text>

                                    <Text style={styles.meta}>
                                        {pet.age} Years • {pet.gender}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => {
                                        setEditingPet(pet);
                                        setModalVisible(true);
                                    }}
                                >
                                    <Pencil
                                        size={18}
                                        color="#6C5DD3"
                                    />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
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
                            overflow: "hidden",
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
                                    color: "#111827",
                                }}
                            >
                                {
                                    editingPet
                                        ? "Edit Pet Profile"
                                        : "Add Pet"
                                }
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                            >
                                <Text
                                    style={{
                                        fontSize: 24,
                                        color: "#6B7280",
                                    }}
                                >
                                    ✕
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <PetForm
                            buttonTitle={
                                editingPet
                                    ? "Update Pet"
                                    : "Save Pet"
                            }

                            loading={saving}

                            initialValues={
                                editingPet
                                    ? {
                                        name: editingPet.name,
                                        type: editingPet.type,
                                        breed: editingPet.breed,
                                        age: String(editingPet.age),
                                        gender: editingPet.gender,
                                        weight: String(editingPet.weight),
                                        healthInfo: editingPet.healthInfo,
                                        petImage: editingPet.petImage,
                                    }
                                    : undefined
                            }

                            onSubmit={handleSavePet}
                        />
                    </SafeAreaView>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F5F3FF',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    addText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6C5DD3',
    },
    scrollContent: {
        paddingBottom: 100, // Extra space to clear the custom floating bottom navigation bar
    },
    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        maxHeight: "80%",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    petCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: '#F3E8FF',
    },
    info: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    breed: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    meta: {
        fontSize: 11,
        color: '#9CA3AF',
        marginTop: 2,
    },
});