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
    HeartPulse,
    AlertTriangle,
    RefreshCw,
    Utensils,
    Dumbbell,
    Heart,
    ShieldCheck,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getPetsByUserId } from '@/services/pet';
import { careRecommendation } from '@/services/ai';

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
type CareResponse = {
    success?: boolean;
    recommendation?: string;
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
export default function CareRecommendationScreen() {
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
    // GET CARE RECOMMENDATION
    // ==================================================
    const getRecommendation = async () => {
        if (!selectedPet) {
            Alert.alert(
                'Select a pet',
                'Please select a pet before getting care recommendations.'
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
            console.log('CARE RECOMMENDATION REQUEST:', {
                petId,
            });
            const response: CareResponse = await careRecommendation({
                petId,
            });
            console.log(
                'CARE RECOMMENDATION RESPONSE:',
                response
            );
            if (response?.success && response?.recommendation) {
                setResult(response.recommendation);
            } else {
                throw new Error(
                    response?.message ||
                    'Unable to generate care recommendations.'
                );
            }
        } catch (error) {
            console.error(
                'CARE RECOMMENDATION ERROR:',
                error
            );
            Alert.alert(
                'Something went wrong',
                'PetPal could not generate care recommendations right now. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };
    // ==================================================
    // RESET
    // ==================================================
    const resetRecommendation = () => {
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
                            <HeartPulse
                                size={20}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>
                                Care Recommendations
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
                        <Sparkles
                            size={24}
                            color="#6C5DD3"
                            strokeWidth={2}
                        />
                    </View>
                    <View style={styles.introContent}>
                        <Text style={styles.introTitle}>
                            Personalized care for your pet
                        </Text>
                        <Text style={styles.introText}>
                            PetPal looks at your pet's available health
                            information and provides general care suggestions.
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
                                Please add a pet first to use Care
                                Recommendations.
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
                {/* CARE AREAS */}
                {!result && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            What PetPal Can Help With
                        </Text>
                        <Text style={styles.sectionDescription}>
                            Recommendations can cover different areas of
                            your pet's everyday care.
                        </Text>
                        <View style={styles.careGrid}>
                            <View style={styles.careCard}>
                                <View style={styles.careIcon}>
                                    <Utensils
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <Text style={styles.careTitle}>
                                    Nutrition
                                </Text>
                                <Text style={styles.careText}>
                                    General feeding and nutrition guidance
                                </Text>
                            </View>
                            <View style={styles.careCard}>
                                <View style={styles.careIcon}>
                                    <Dumbbell
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <Text style={styles.careTitle}>
                                    Activity
                                </Text>
                                <Text style={styles.careText}>
                                    Exercise and activity suggestions
                                </Text>
                            </View>
                            <View style={styles.careCard}>
                                <View style={styles.careIcon}>
                                    <Heart
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <Text style={styles.careTitle}>
                                    Wellness
                                </Text>
                                <Text style={styles.careText}>
                                    Everyday health and wellbeing tips
                                </Text>
                            </View>
                            <View style={styles.careCard}>
                                <View style={styles.careIcon}>
                                    <ShieldCheck
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <Text style={styles.careTitle}>
                                    Prevention
                                </Text>
                                <Text style={styles.careText}>
                                    General preventive care suggestions
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
                {/* GET RECOMMENDATION BUTTON */}
                {!result && (
                    <TouchableOpacity
                        style={[
                            styles.recommendButton,
                            (loading || !selectedPet) &&
                                styles.recommendButtonDisabled,
                        ]}
                        onPress={getRecommendation}
                        disabled={loading || !selectedPet}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                                <Text style={styles.recommendButtonText}>
                                    PetPal is preparing recommendations...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Sparkles
                                    size={20}
                                    color="#FFFFFF"
                                    strokeWidth={2.2}
                                />
                                <Text style={styles.recommendButtonText}>
                                    Get Care Recommendations
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
                                <Sparkles
                                    size={20}
                                    color="#6C5DD3"
                                    strokeWidth={2.2}
                                />
                            </View>
                            <View style={styles.resultHeaderText}>
                                <Text style={styles.resultTitle}>
                                    PetPal's Care Plan ✨
                                </Text>
                                <Text style={styles.resultPetName}>
                                    Personalized for {selectedPet?.name}
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
                                These are general AI-generated care
                                suggestions, not professional veterinary
                                advice. Consult your veterinarian for
                                personalized medical or dietary guidance.
                            </Text>
                        </View>
                        {/* RESET */}
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={resetRecommendation}
                            activeOpacity={0.8}
                        >
                            <RefreshCw
                                size={17}
                                color="#6C5DD3"
                            />
                            <Text style={styles.resetButtonText}>
                                Get Another Recommendation
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* BOTTOM NOTE */}
                <View style={styles.bottomNote}>
                    <HeartPulse
                        size={16}
                        color="#A0A0AA"
                    />
                    <Text style={styles.bottomNoteText}>
                        PetPal provides general care information based on
                        available pet data and cannot replace professional
                        veterinary care.
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
    careGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    careCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    careIcon: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 9,
    },
    careTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 4,
    },
    careText: {
        fontSize: 10,
        lineHeight: 15,
        color: '#85858F',
    },
    recommendButton: {
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
    recommendButtonDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
        elevation: 0,
    },
    recommendButtonText: {
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