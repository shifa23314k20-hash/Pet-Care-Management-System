import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import {
    ArrowLeft,
    Sparkles,
    ChevronDown,
    Syringe,
    AlertTriangle,
    RefreshCw,
    CalendarCheck,
    ShieldCheck,
    Clock,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getPetsByUserId } from '@/services/pet';
import { vaccinationAssistant } from '@/services/ai';

type Pet = {
    id?: string;
    petId?: string;
    _id?: string;
    name: string;
    species?: string;
    breed?: string;
    age?: number | string;
    gender?: string;
    image?: string;
    profileImage?: string;
};
type VaccinationResponse = {
    success?: boolean;
    advice?: string;
    message?: string;
};
// ======================================================
// CLEAN AI RESPONSE
// ======================================================
const cleanAIResponse = (text: string) => {
    if (!text) return '';
    return text
        .replace(/\r\n/g, '\n')
        .replace(/\*\*/g, '')
        .replace(/^\s*[\*\-]\s+/gm, '• ')
        .replace(/^#+\s*/gm, '')
        .replace(/[ \t]+$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};
// ======================================================
// SCREEN
// ======================================================
export default function VaccinationAssistantScreen() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [petsLoading, setPetsLoading] = useState(true);
    const [showPetSelector, setShowPetSelector] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);
    // ==================================================
    // LOAD PETS
    // ==================================================
    useEffect(() => {
        loadPets();
    }, []);
    const loadPets = async () => {
        try {
            setPetsLoading(true);
            const response = await getPetsByUserId();
            console.log('PET RESPONSE:', response);
            let petList: Pet[] = [];
            if (Array.isArray(response)) {
                petList = response;
            } else if (response?.pets && Array.isArray(response.pets)) {
                petList = response.pets;
            } else if (response?.data && Array.isArray(response.data)) {
                petList = response.data;
            }
            setPets(petList);
            if (petList.length > 0) {
                setSelectedPet(petList[0]);
            }
        } catch (error) {
            console.error('LOAD PETS ERROR:', error);
            Alert.alert(
                'Unable to load pets',
                'We could not load your pets. Please try again.'
            );
        } finally {
            setPetsLoading(false);
        }
    };
    // ==================================================
    // GET PET ID
    // ==================================================
    const getPetId = (pet: Pet | null): string | null => {
        if (!pet) return null;
        return pet.petId || pet.id || pet._id || null;
    };
    // ==================================================
    // PET DETAILS
    // ==================================================
    const getPetSubtitle = (pet: Pet) => {
        const details = [pet.species, pet.breed].filter(Boolean);
        return details.length > 0 ? details.join(' • ') : 'Your pet';
    };
    // ==================================================
    // SELECT PET
    // ==================================================
    const selectPet = (pet: Pet) => {
        setSelectedPet(pet);
        setShowPetSelector(false);
        setResult(null);
    };
    // ==================================================
    // GET VACCINATION ADVICE
    // ==================================================
    const getVaccinationAdvice = async () => {
        if (!selectedPet) {
            Alert.alert(
                'Select a pet',
                'Please select a pet before asking PetPal about vaccinations.'
            );
            return;
        }
        const petId = getPetId(selectedPet);
        if (!petId) {
            Alert.alert(
                'Pet ID missing',
                'We could not identify this pet. Please try again.'
            );
            return;
        }
        try {
            setLoading(true);
            setResult(null);
            console.log('VACCINATION ASSISTANT REQUEST:', {
                petId,
            });
            const response: VaccinationResponse =
                await vaccinationAssistant({
                    petId,
                });
            console.log(
                'VACCINATION ASSISTANT RESPONSE:',
                response
            );
            if (response?.success && response?.advice) {
                setResult(response.advice);
            } else {
                throw new Error(
                    response?.message ||
                    'Unable to generate vaccination advice.'
                );
            }
        } catch (error) {
            console.error(
                'VACCINATION ASSISTANT ERROR:',
                error
            );
            Alert.alert(
                'Something went wrong',
                'PetPal could not generate vaccination advice right now. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };
    // ==================================================
    // RESET
    // ==================================================
    const resetAssistant = () => {
        setResult(null);
    };
    // ==================================================
    // SCREEN
    // ==================================================
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                    >
                        <ArrowLeft
                            size={23}
                            color="#252525"
                        />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <View style={styles.headerIcon}>
                            <Syringe
                                size={20}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>
                                Vaccination Assistant
                            </Text>
                            <Text style={styles.headerSubtitle}>
                                Powered by PetPal ✨
                            </Text>
                        </View>
                    </View>
                </View>
                {/* INTRO CARD */}
                <View style={styles.introCard}>
                    <View style={styles.introIcon}>
                        <Syringe
                            size={24}
                            color="#6C5DD3"
                            strokeWidth={2}
                        />
                    </View>
                    <View style={styles.introContent}>
                        <Text style={styles.introTitle}>
                            Stay on top of vaccinations
                        </Text>
                        <Text style={styles.introText}>
                            PetPal can review your pet's available vaccination
                            information and provide general guidance.
                        </Text>
                    </View>
                </View>
                {/* PET SECTION */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Select Your Pet
                    </Text>
                    {petsLoading ? (
                        <View style={styles.loadingCard}>
                            <ActivityIndicator
                                size="small"
                                color="#6C5DD3"
                            />
                            <Text style={styles.loadingCardText}>
                                Loading your pets...
                            </Text>
                        </View>
                    ) : pets.length === 0 ? (
                        <View style={styles.emptyPetCard}>
                            <Text style={styles.emptyPetTitle}>
                                No pets found
                            </Text>
                            <Text style={styles.emptyPetText}>
                                Please add a pet first to use the Vaccination
                                Assistant.
                            </Text>
                        </View>
                    ) : (
                        <>
                            {/* SELECTED PET */}
                            <TouchableOpacity
                                style={styles.petSelector}
                                onPress={() =>
                                    setShowPetSelector(!showPetSelector)
                                }
                                activeOpacity={0.8}
                            >
                                <View style={styles.petAvatar}>
                                    <Text style={styles.petAvatarText}>
                                        {selectedPet?.name
                                            ?.charAt(0)
                                            ?.toUpperCase() || '🐾'}
                                    </Text>
                                </View>
                                <View style={styles.petSelectorInfo}>
                                    <Text style={styles.petName}>
                                        {selectedPet?.name ||
                                            'Select a pet'}
                                    </Text>
                                    {selectedPet && (
                                        <Text style={styles.petDetails}>
                                            {getPetSubtitle(selectedPet)}
                                        </Text>
                                    )}
                                </View>
                                <ChevronDown
                                    size={21}
                                    color="#777783"
                                />
                            </TouchableOpacity>
                            {/* PET OPTIONS */}
                            {showPetSelector && (
                                <View style={styles.petOptions}>
                                    {pets.map((pet, index) => {
                                        const petId = getPetId(pet);
                                        const selectedId =
                                            getPetId(selectedPet);
                                        const isSelected =
                                            petId === selectedId;
                                        return (
                                            <TouchableOpacity
                                                key={petId || index}
                                                style={[
                                                    styles.petOption,
                                                    isSelected &&
                                                        styles.selectedPetOption,
                                                ]}
                                                onPress={() =>
                                                    selectPet(pet)
                                                }
                                                activeOpacity={0.75}
                                            >
                                                <View
                                                    style={
                                                        styles.optionAvatar
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.optionAvatarText
                                                        }
                                                    >
                                                        {pet.name
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            '🐾'}
                                                    </Text>
                                                </View>
                                                <View
                                                    style={styles.optionInfo}
                                                >
                                                    <Text
                                                        style={
                                                            styles.optionName
                                                        }
                                                    >
                                                        {pet.name}
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.optionDetails
                                                        }
                                                    >
                                                        {getPetSubtitle(pet)}
                                                    </Text>
                                                </View>
                                                {isSelected && (
                                                    <View
                                                        style={
                                                            styles.selectedDot
                                                        }
                                                    />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}
                        </>
                    )}
                </View>
                {/* VACCINATION AREAS */}
                {!result && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What PetPal Can Help With
                        </Text>
                        <Text style={styles.sectionDescription}>
                            Get general guidance about your pet's vaccination
                            and preventive care needs.
                        </Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoIcon}>
                                <CalendarCheck
                                    size={21}
                                    color="#6C5DD3"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Vaccination Schedule
                                </Text>
                                <Text style={styles.infoText}>
                                    General guidance about keeping vaccinations
                                    up to date.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.infoIcon}>
                                <ShieldCheck
                                    size={21}
                                    color="#6C5DD3"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Preventive Care
                                </Text>
                                <Text style={styles.infoText}>
                                    Helpful information about routine
                                    preventive healthcare.
                                </Text>
                            </View>
                        </View>
                        <View style={styles.infoCard}>
                            <View style={styles.infoIcon}>
                                <Clock
                                    size={21}
                                    color="#6C5DD3"
                                />
                            </View>
                            <View style={styles.infoContent}>
                                <Text style={styles.infoTitle}>
                                    Due & Upcoming Vaccines
                                </Text>
                                <Text style={styles.infoText}>
                                    Guidance based on vaccination information
                                    available for your pet.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* ASK PETPAL BUTTON */}
                {!result && (
                    <TouchableOpacity
                        style={[
                            styles.askButton,
                            (loading || !selectedPet) &&
                                styles.askButtonDisabled,
                        ]}
                        onPress={getVaccinationAdvice}
                        disabled={loading || !selectedPet}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                                <Text style={styles.askButtonText}>
                                    PetPal is checking...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Sparkles
                                    size={20}
                                    color="#FFFFFF"
                                    strokeWidth={2.2}
                                />
                                <Text style={styles.askButtonText}>
                                    Ask PetPal About Vaccinations
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
                {/* RESULT */}
                {result && (
                    <View style={styles.resultCard}>
                        {/* RESULT HEADER */}
                        <View style={styles.resultHeader}>
                            <View style={styles.resultIcon}>
                                <Syringe
                                    size={20}
                                    color="#6C5DD3"
                                    strokeWidth={2.2}
                                />
                            </View>
                            <View style={styles.resultHeaderText}>
                                <Text style={styles.resultTitle}>
                                    PetPal's Vaccination Advice ✨
                                </Text>
                                <Text style={styles.resultPetName}>
                                    For {selectedPet?.name}
                                </Text>
                            </View>
                        </View>
                        {/* RESULT BODY */}
                        <View style={styles.resultBody}>
                            <Text style={styles.resultText}>
                                {cleanAIResponse(result)}
                            </Text>
                        </View>
                        {/* WARNING */}
                        <View style={styles.warningBox}>
                            <AlertTriangle
                                size={18}
                                color="#C77A00"
                                strokeWidth={2}
                            />
                            <Text style={styles.warningText}>
                                Vaccination schedules can vary by species,
                                age, health history, location, and vaccine
                                type. Confirm vaccination decisions with your
                                veterinarian.
                            </Text>
                        </View>
                        {/* RESET */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetAssistant}
                            activeOpacity={0.8}
                        >
                            <RefreshCw
                                size={17}
                                color="#6C5DD3"
                            />
                            <Text style={styles.resetButtonText}>
                                Get Updated Advice
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* BOTTOM NOTE */}
                <View style={styles.bottomNote}>
                    <ShieldCheck
                        size={16}
                        color="#A0A0AA"
                    />
                    <Text style={styles.bottomNoteText}>
                        PetPal provides general vaccination information and
                        cannot replace advice from a qualified veterinarian.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
// ======================================================
// STYLES
// ======================================================
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8FF',
    },
    scrollContent: {
        paddingBottom: 30,
    },
    header: {
        height: 70,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F4',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F5F4FA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    headerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#6C5DD3',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#252525',
    },
    headerSubtitle: {
        fontSize: 11,
        color: '#85858F',
        marginTop: 2,
    },
    introCard: {
        marginHorizontal: 16,
        marginTop: 18,
        padding: 16,
        borderRadius: 18,
        backgroundColor: '#F0EDFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    introIcon: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    introContent: {
        flex: 1,
    },
    introTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#302B4F',
        marginBottom: 4,
    },
    introText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#656078',
    },
    section: {
        marginTop: 22,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 5,
    },
    sectionDescription: {
        fontSize: 12,
        lineHeight: 18,
        color: '#85858F',
        marginBottom: 13,
    },
    loadingCard: {
        height: 70,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    loadingCardText: {
        fontSize: 13,
        color: '#85858F',
        marginLeft: 9,
    },
    emptyPetCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    emptyPetTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 5,
    },
    emptyPetText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#85858F',
    },
    petSelector: {
        backgroundColor: '#FFFFFF',
        borderRadius: 17,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    petAvatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    petAvatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6C5DD3',
    },
    petSelectorInfo: {
        flex: 1,
        marginLeft: 12,
    },
    petName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#292929',
    },
    petDetails: {
        fontSize: 11,
        color: '#85858F',
        marginTop: 3,
    },
    petOptions: {
        marginTop: 7,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EEEEF3',
        overflow: 'hidden',
    },
    petOption: {
        minHeight: 65,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F5',
    },
    selectedPetOption: {
        backgroundColor: '#F8F6FF',
    },
    optionAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionAvatarText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6C5DD3',
    },
    optionInfo: {
        flex: 1,
        marginLeft: 10,
    },
    optionName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#292929',
    },
    optionDetails: {
        fontSize: 10,
        color: '#85858F',
        marginTop: 2,
    },
    selectedDot: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: '#6C5DD3',
        marginRight: 5,
    },
    infoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 11,
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    infoIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 3,
    },
    infoText: {
        fontSize: 10,
        lineHeight: 15,
        color: '#85858F',
    },
    askButton: {
        marginHorizontal: 16,
        marginTop: 25,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#6C5DD3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        shadowColor: '#6C5DD3',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.22,
        shadowRadius: 6,
        elevation: 4,
    },
    askButtonDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
        elevation: 0,
    },
    askButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    resultCard: {
        marginHorizontal: 16,
        marginTop: 22,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#EAE8F2',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    resultHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F4',
    },
    resultIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    resultHeaderText: {
        flex: 1,
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#292929',
    },
    resultPetName: {
        fontSize: 11,
        color: '#85858F',
        marginTop: 3,
    },
    resultBody: {
        paddingTop: 16,
        paddingBottom: 8,
    },
    resultText: {
        fontSize: 13,
        lineHeight: 21,
        color: '#45454D',
        fontWeight: '500',
    },
    warningBox: {
        backgroundColor: '#FFF8E9',
        borderRadius: 13,
        padding: 11,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    warningText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
        color: '#80601E',
        marginLeft: 8,
    },
    resetButton: {
        marginTop: 13,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F0EDFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
    },
    resetButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C5DD3',
    },
    bottomNote: {
        marginHorizontal: 25,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    bottomNoteText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
        color: '#9999A3',
        textAlign: 'center',
        marginLeft: 7,
    },
});