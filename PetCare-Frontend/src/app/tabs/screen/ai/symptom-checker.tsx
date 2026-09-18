import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import {
    ArrowLeft,
    Sparkles,
    ChevronDown,
    X,
    Plus,
    Stethoscope,
    AlertTriangle,
    RefreshCw,
} from 'lucide-react-native';
import { router } from 'expo-router';
import { getPetsByUserId } from '@/services/pet';
import { symptomChecker } from '@/services/ai';

type Pet = {
    id?: string;
    petId?: string;
    _id?: string;
    name: string;
    species?: string;
    breed?: string;
    image?: string;
    profileImage?: string;
};
type SymptomResponse = {
    success?: boolean;
    diagnosis?: string;
    message?: string;
};
// ======================================================
// COMMON SYMPTOMS
// ======================================================
const COMMON_SYMPTOMS = [
    'Vomiting',
    'Diarrhea',
    'Loss of appetite',
    'Lethargy',
    'Coughing',
    'Sneezing',
    'Itching',
    'Fever',
    'Hair loss',
    'Skin irritation',
    'Difficulty breathing',
    'Excessive thirst',
];
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
export default function SymptomCheckerScreen() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [petsLoading, setPetsLoading] = useState(true);
    const [showPetSelector, setShowPetSelector] = useState(false);
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [customSymptom, setCustomSymptom] = useState('');
    const [checking, setChecking] = useState(false);
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
    // SELECT PET
    // ==================================================
    const selectPet = (pet: Pet) => {
        setSelectedPet(pet);
        setShowPetSelector(false);
        setResult(null);
    };
    // ==================================================
    // TOGGLE SYMPTOM
    // ==================================================
    const toggleSymptom = (symptom: string) => {
        const alreadySelected = selectedSymptoms.includes(symptom);
        if (alreadySelected) {
            setSelectedSymptoms(
                selectedSymptoms.filter((item) => item !== symptom)
            );
        } else {
            setSelectedSymptoms([...selectedSymptoms, symptom]);
        }
        setResult(null);
    };
    // ==================================================
    // ADD CUSTOM SYMPTOM
    // ==================================================
    const addCustomSymptom = () => {
        const symptom = customSymptom.trim();
        if (!symptom) return;
        const exists = selectedSymptoms.some(
            (item) => item.toLowerCase() === symptom.toLowerCase()
        );
        if (exists) {
            setCustomSymptom('');
            return;
        }
        setSelectedSymptoms([...selectedSymptoms, symptom]);
        setCustomSymptom('');
        setResult(null);
    };
    // ==================================================
    // REMOVE SYMPTOM
    // ==================================================
    const removeSymptom = (symptom: string) => {
        setSelectedSymptoms(
            selectedSymptoms.filter((item) => item !== symptom)
        );
        setResult(null);
    };
    // ==================================================
    // CHECK SYMPTOMS
    // ==================================================
    const checkSymptoms = async () => {
        if (!selectedPet) {
            Alert.alert(
                'Select a pet',
                'Please select a pet before checking symptoms.'
            );
            return;
        }
        if (selectedSymptoms.length === 0) {
            Alert.alert(
                'Add symptoms',
                'Please select at least one symptom.'
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
            setChecking(true);
            setResult(null);
            console.log('SYMPTOM CHECK REQUEST:', {
                petId,
                symptoms: selectedSymptoms,
            });
            const response: SymptomResponse = await symptomChecker({
                petId,
                symptoms: selectedSymptoms,
            });
            console.log('SYMPTOM CHECK RESPONSE:', response);
            if (response?.success && response?.diagnosis) {
                setResult(response.diagnosis);
            } else {
                throw new Error(
                    response?.message || 'Unable to analyze symptoms.'
                );
            }
        } catch (error) {
            console.error('SYMPTOM CHECK ERROR:', error);
            Alert.alert(
                'Something went wrong',
                'PetPal could not analyze the symptoms right now. Please try again.'
            );
        } finally {
            setChecking(false);
        }
    };
    // ==================================================
    // RESET
    // ==================================================
    const resetChecker = () => {
        setSelectedSymptoms([]);
        setCustomSymptom('');
        setResult(null);
    };
    // ==================================================
    // PET DETAILS
    // ==================================================
    const getPetSubtitle = (pet: Pet) => {
        const details = [pet.species, pet.breed].filter(Boolean);
        return details.length > 0 ? details.join(' • ') : 'Your pet';
    };
    // ==================================================
    // SCREEN
    // ==================================================
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* HEADER */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => router.back()}
                            activeOpacity={0.7}
                        >
                            <ArrowLeft size={23} color="#252525" />
                        </TouchableOpacity>
                        <View style={styles.headerTitleContainer}>
                            <View style={styles.headerIcon}>
                                <Stethoscope
                                    size={20}
                                    color="#FFFFFF"
                                    strokeWidth={2.2}
                                />
                            </View>
                            <View>
                                <Text style={styles.headerTitle}>
                                    Symptom Checker
                                </Text>
                                <Text style={styles.headerSubtitle}>
                                    Powered by PetPal ✨
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/* INTRO */}
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
                                What's bothering your pet?
                            </Text>
                            <Text style={styles.introText}>
                                Select your pet and tell PetPal about the
                                symptoms you're noticing.
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
                                    Please add a pet first to use the Symptom
                                    Checker.
                                </Text>
                            </View>
                        ) : (
                            <>
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
                    {/* SYMPTOMS */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Select Symptoms
                        </Text>
                        <Text style={styles.sectionDescription}>
                            Choose all the symptoms you have noticed.
                        </Text>
                        <View style={styles.symptomsGrid}>
                            {COMMON_SYMPTOMS.map((symptom) => {
                                const selected =
                                    selectedSymptoms.includes(symptom);
                                return (
                                    <TouchableOpacity
                                        key={symptom}
                                        style={[
                                            styles.symptomChip,
                                            selected &&
                                                styles.selectedSymptomChip,
                                        ]}
                                        onPress={() =>
                                            toggleSymptom(symptom)
                                        }
                                        activeOpacity={0.75}
                                    >
                                        <Text
                                            style={[
                                                styles.symptomChipText,
                                                selected &&
                                                    styles.selectedSymptomChipText,
                                            ]}
                                        >
                                            {symptom}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {/* CUSTOM SYMPTOM */}
                        <View style={styles.customSymptomContainer}>
                            <TextInput
                                value={customSymptom}
                                onChangeText={setCustomSymptom}
                                placeholder="Add another symptom..."
                                placeholderTextColor="#A0A0AA"
                                style={styles.customInput}
                                onSubmitEditing={addCustomSymptom}
                                returnKeyType="done"
                            />
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={addCustomSymptom}
                                activeOpacity={0.8}
                            >
                                <Plus
                                    size={19}
                                    color="#FFFFFF"
                                    strokeWidth={2.5}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* SELECTED SYMPTOMS */}
                        {selectedSymptoms.length > 0 && (
                            <View style={styles.selectedSection}>
                                <Text style={styles.selectedTitle}>
                                    Selected Symptoms
                                </Text>
                                <View
                                    style={styles.selectedSymptomsContainer}
                                >
                                    {selectedSymptoms.map((symptom) => (
                                        <View
                                            key={symptom}
                                            style={styles.selectedSymptom}
                                        >
                                            <Text
                                                style={
                                                    styles.selectedSymptomText
                                                }
                                            >
                                                {symptom}
                                            </Text>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    removeSymptom(symptom)
                                                }
                                                activeOpacity={0.7}
                                            >
                                                <X
                                                    size={15}
                                                    color="#6C5DD3"
                                                    strokeWidth={2.5}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                    {/* CHECK BUTTON */}
                    <TouchableOpacity
                        style={[
                            styles.checkButton,
                            (checking ||
                                !selectedPet ||
                                selectedSymptoms.length === 0) &&
                                styles.checkButtonDisabled,
                        ]}
                        onPress={checkSymptoms}
                        disabled={
                            checking ||
                            !selectedPet ||
                            selectedSymptoms.length === 0
                        }
                        activeOpacity={0.85}
                    >
                        {checking ? (
                            <>
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                                <Text style={styles.checkButtonText}>
                                    PetPal is analyzing...
                                </Text>
                            </>
                        ) : (
                            <>
                                <Sparkles
                                    size={20}
                                    color="#FFFFFF"
                                    strokeWidth={2.2}
                                />
                                <Text style={styles.checkButtonText}>
                                    Check Symptoms
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                    {/* RESULT */}
                    {result && (
                        <View style={styles.resultCard}>
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
                                        PetPal's Analysis ✨
                                    </Text>
                                    <Text style={styles.resultPetName}>
                                        For {selectedPet?.name}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.resultBody}>
                                <Text style={styles.resultText}>
                                    {cleanAIResponse(result)}
                                </Text>
                            </View>
                            <View style={styles.warningBox}>
                                <AlertTriangle
                                    size={18}
                                    color="#C77A00"
                                    strokeWidth={2}
                                />
                                <Text style={styles.warningText}>
                                    This is general AI-generated information,
                                    not a veterinary diagnosis. If your pet
                                    has severe or worsening symptoms, contact a
                                    veterinarian promptly.
                                </Text>
                            </View>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={resetChecker}
                                activeOpacity={0.8}
                            >
                                <RefreshCw
                                    size={17}
                                    color="#6C5DD3"
                                />
                                <Text style={styles.resetButtonText}>
                                    Check Different Symptoms
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* BOTTOM NOTE */}
                    <View style={styles.bottomNote}>
                        <Stethoscope
                            size={16}
                            color="#A0A0AA"
                        />
                        <Text style={styles.bottomNoteText}>
                            PetPal helps you understand possible concerns, but
                            it cannot replace professional veterinary care.
                        </Text>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
    keyboardContainer: {
        flex: 1,
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
    symptomsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 9,
    },
    symptomChip: {
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E3EC',
    },
    selectedSymptomChip: {
        backgroundColor: '#6C5DD3',
        borderColor: '#6C5DD3',
    },
    symptomChipText: {
        fontSize: 12,
        color: '#5E5E68',
        fontWeight: '500',
    },
    selectedSymptomChipText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    customSymptomContainer: {
        marginTop: 14,
        minHeight: 50,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E3EC',
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 14,
        paddingRight: 6,
    },
    customInput: {
        flex: 1,
        fontSize: 13,
        color: '#292929',
        height: 48,
    },
    addButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#6C5DD3',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSection: {
        marginTop: 17,
    },
    selectedTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5E5E68',
        marginBottom: 9,
    },
    selectedSymptomsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectedSymptom: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0EDFF',
        paddingLeft: 11,
        paddingRight: 7,
        paddingVertical: 7,
        borderRadius: 15,
    },
    selectedSymptomText: {
        fontSize: 11,
        color: '#5145A5',
        fontWeight: '600',
        marginRight: 5,
    },
    checkButton: {
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
    checkButtonDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
        elevation: 0,
    },
    checkButtonText: {
        fontSize: 14,
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