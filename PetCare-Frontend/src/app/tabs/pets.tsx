import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Plus, ChevronRight } from "lucide-react-native";

import { getPetsByUserId } from "@/services/pet"; // adjust path
import { SafeAreaView } from "react-native-safe-area-context";
import { Modal, TextInput } from "react-native";
import { createPet } from "@/services/pet";

export default function MyPetsScreen() {

    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [gender, setGender] = useState("male");
    const [weight, setWeight] = useState("");
    const [healthInfo, setHealthInfo] = useState("");
    const [petImage, setPetImage] = useState("");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        try {
            setLoading(true);

            const user = await AsyncStorage.getItem("user");

            if (!user) {
                return;
            }

            const parsedUser = JSON.parse(user);

            const response = await getPetsByUserId(parsedUser.id);

            setPets(response.pets || []);
        } catch (error: any) {
            console.log(error);

            Alert.alert(
                "Error",
                "Couldn't load pets."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePet = async () => {
        try {
            if (!name || !type) {
                Alert.alert("Error", "Name and Type are required");
                return;
            }

            setSaving(true);

            const user = await AsyncStorage.getItem("user");

            if (!user) return;

            const parsedUser = JSON.parse(user);

            const response = await createPet({
                userId: parsedUser.id,
                name,
                type,
                breed,
                age: Number(age),
                gender,
                weight: Number(weight),
                healthInfo,
                petImage,
            });

            Alert.alert("Success", response.message);

            setModalVisible(false);

            setName("");
            setType("");
            setBreed("");
            setAge("");
            setGender("male");
            setWeight("");
            setHealthInfo("");
            setPetImage("");

            fetchPets();

        } catch (error: any) {
            Alert.alert(
                "Error",
                error?.response?.data?.message ||
                "Couldn't create pet."
            );
        } finally {
            setSaving(false);
        }
    };

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
                                activeOpacity={0.7}
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
                                <ChevronRight size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>

            </View>
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>

                        <Text style={styles.modalTitle}>
                            Add Pet
                        </Text>

                        <TextInput
                            placeholder="Pet Name"
                            style={styles.modalInput}
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput
                            placeholder="Type (Dog, Cat...)"
                            style={styles.modalInput}
                            value={type}
                            onChangeText={setType}
                        />

                        <TextInput
                            placeholder="Breed"
                            style={styles.modalInput}
                            value={breed}
                            onChangeText={setBreed}
                        />

                        <TextInput
                            placeholder="Age"
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={age}
                            onChangeText={setAge}
                        />

                        <TextInput
                            placeholder="Gender"
                            style={styles.modalInput}
                            value={gender}
                            onChangeText={setGender}
                        />

                        <TextInput
                            placeholder="Weight"
                            style={styles.modalInput}
                            keyboardType="numeric"
                            value={weight}
                            onChangeText={setWeight}
                        />

                        <TextInput
                            placeholder="Health Info"
                            style={styles.modalInput}
                            value={healthInfo}
                            onChangeText={setHealthInfo}
                        />

                        <TextInput
                            placeholder="Image URL"
                            style={styles.modalInput}
                            value={petImage}
                            onChangeText={setPetImage}
                        />

                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleCreatePet}
                            disabled={saving}
                        >
                            {saving ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.saveText}>
                                    Save Pet
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelText}>
                                Cancel
                            </Text>
                        </TouchableOpacity>

                    </View>
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
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "flex-end",
    },

    modalContainer: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 20,
    },

    modalInput: {
        borderWidth: 1,
        borderColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 50,
        marginBottom: 14,
    },

    saveButton: {
        backgroundColor: "#6C5DD3",
        height: 54,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 14,
        marginTop: 10,
    },

    saveText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },

    cancelText: {
        textAlign: "center",
        marginTop: 16,
        color: "#6C5DD3",
        fontWeight: "600",
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