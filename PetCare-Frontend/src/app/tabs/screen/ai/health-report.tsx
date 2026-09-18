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
    FileText,
    ShieldCheck,
    HeartPulse,
    CalendarCheck,
    Syringe,
    Activity,
    Share2,
    CheckCircle2,
} from 'lucide-react-native';
import { router } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getPetsByUserId } from '@/services/pet';
import { generateHealthReport } from '@/services/ai';

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
export default function HealthReportScreen() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [petsLoading, setPetsLoading] = useState(true);
    const [showPetSelector, setShowPetSelector] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [reportReady, setReportReady] = useState(false);
    const [reportUri, setReportUri] = useState<string | null>(null);
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
    const getPetId = (pet: Pet | null): string | null => {
        if (!pet) return null;
        return pet.petId || pet.id || pet._id || null;
    };
    const getPetSubtitle = (pet: Pet) => {
        const details = [pet.species, pet.breed].filter(Boolean);
        return details.length > 0 ? details.join(' • ') : 'Your pet';
    };
    const selectPet = (pet: Pet) => {
        setSelectedPet(pet);
        setShowPetSelector(false);
        setReportReady(false);
        setReportUri(null);
    };
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
            const chunk = bytes.subarray(
                i,
                Math.min(i + chunkSize, bytes.length)
            );
            binary += String.fromCharCode(...chunk);
        }
        return globalThis.btoa(binary);
    };
    const blobToBase64 = async (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    const result = reader.result as string;
                    const base64 = result.split(',')[1];
                    resolve(base64);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    const generateReport = async () => {
        if (!selectedPet) {
            Alert.alert(
                'Select a pet',
                'Please select a pet before generating a health report.'
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
            setGenerating(true);
            setReportReady(false);
            setReportUri(null);
            console.log('HEALTH REPORT REQUEST:', {
                petId,
            });
            const pdfData = await generateHealthReport({
                petId,
            });
            console.log('HEALTH REPORT PDF RECEIVED');
            let base64Data = '';
            if (pdfData instanceof Blob) {
                base64Data = await blobToBase64(pdfData);
            } else if (pdfData instanceof ArrayBuffer) {
                base64Data = arrayBufferToBase64(pdfData);
            } else if (pdfData?.arrayBuffer) {
                const buffer = await pdfData.arrayBuffer();
                base64Data = arrayBufferToBase64(buffer);
            } else {
                throw new Error(
                    'Unexpected PDF response format.'
                );
            }
            const fileName =
                `${selectedPet.name.replace(/[^a-zA-Z0-9]/g, '_')}_Health_Report.pdf`;
            const fileUri =
                `${FileSystem.cacheDirectory}${fileName}`;
            await FileSystem.writeAsStringAsync(
                fileUri,
                base64Data,
                {
                    encoding:
                        FileSystem.EncodingType.Base64,
                }
            );
            console.log(
                'HEALTH REPORT SAVED:',
                fileUri
            );
            setReportUri(fileUri);
            setReportReady(true);
            Alert.alert(
                'Report Ready ✨',
                `Health report for ${selectedPet.name} has been generated successfully.`
            );
        } catch (error) {
            console.error(
                'HEALTH REPORT ERROR:',
                error
            );
            Alert.alert(
                'Something went wrong',
                'PetPal could not generate the health report right now. Please try again.'
            );
        } finally {
            setGenerating(false);
        }
    };
    const shareReport = async () => {
        if (!reportUri) {
            Alert.alert(
                'Report not available',
                'Please generate the health report first.'
            );
            return;
        }
        try {
            const available =
                await Sharing.isAvailableAsync();
            if (!available) {
                Alert.alert(
                    'Sharing unavailable',
                    'Sharing is not available on this device.'
                );
                return;
            }
            await Sharing.shareAsync(
                reportUri,
                {
                    mimeType: 'application/pdf',
                    dialogTitle:
                        `${selectedPet?.name} Health Report`,
                    UTI:
                        'com.adobe.pdf',
                }
            );
        } catch (error) {
            console.error(
                'SHARE REPORT ERROR:',
                error
            );
            Alert.alert(
                'Unable to share',
                'The health report could not be shared.'
            );
        }
    };
    const generateAnotherReport = () => {
        setReportReady(false);
        setReportUri(null);
    };
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
                            <FileText
                                size={20}
                                color="#FFFFFF"
                                strokeWidth={2.2}
                            />
                        </View>
                        <View>
                            <Text style={styles.headerTitle}>
                                Health Report
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
                            Your pet's health at a glance
                        </Text>
                        <Text style={styles.introText}>
                            PetPal combines your pet's available health
                            information into a downloadable health report.
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
                                Please add a pet first to generate a health
                                report.
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
                {/* REPORT CONTENT */}
                {!reportReady && (
                    <>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>
                                What's Included
                            </Text>
                            <Text style={styles.sectionDescription}>
                                PetPal creates a health report using the
                                information available in your pet's records.
                            </Text>
                            <View style={styles.reportItem}>
                                <View style={styles.reportItemIcon}>
                                    <HeartPulse
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <View style={styles.reportItemContent}>
                                    <Text style={styles.reportItemTitle}>
                                        Overall Health Summary
                                    </Text>
                                    <Text style={styles.reportItemText}>
                                        A general summary of your pet's
                                        available health information.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.reportItem}>
                                <View style={styles.reportItemIcon}>
                                    <Activity
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <View style={styles.reportItemContent}>
                                    <Text style={styles.reportItemTitle}>
                                        Current Health Condition
                                    </Text>
                                    <Text style={styles.reportItemText}>
                                        AI-generated observations based on
                                        recorded health information.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.reportItem}>
                                <View style={styles.reportItemIcon}>
                                    <Syringe
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <View style={styles.reportItemContent}>
                                    <Text style={styles.reportItemTitle}>
                                        Vaccination Information
                                    </Text>
                                    <Text style={styles.reportItemText}>
                                        Relevant vaccination information from
                                        your pet's records.
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.reportItem}>
                                <View style={styles.reportItemIcon}>
                                    <CalendarCheck
                                        size={20}
                                        color="#6C5DD3"
                                    />
                                </View>
                                <View style={styles.reportItemContent}>
                                    <Text style={styles.reportItemTitle}>
                                        Care & Activity Information
                                    </Text>
                                    <Text style={styles.reportItemText}>
                                        Available activities and appointment
                                        information.
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={[
                                styles.generateButton,
                                (generating || !selectedPet) &&
                                    styles.generateButtonDisabled,
                            ]}
                            onPress={generateReport}
                            disabled={
                                generating ||
                                !selectedPet
                            }
                            activeOpacity={0.85}
                        >
                            {generating ? (
                                <>
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />
                                    <Text
                                        style={
                                            styles.generateButtonText
                                        }
                                    >
                                        PetPal is creating your report...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <FileText
                                        size={20}
                                        color="#FFFFFF"
                                        strokeWidth={2.2}
                                    />
                                    <Text
                                        style={
                                            styles.generateButtonText
                                        }
                                    >
                                        Generate Health Report
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                )}
                {/* REPORT READY */}
                {reportReady && (
                    <View style={styles.readyCard}>
                        <View style={styles.readyIconContainer}>
                            <CheckCircle2
                                size={32}
                                color="#6C5DD3"
                                strokeWidth={2}
                            />
                        </View>
                        <Text style={styles.readyTitle}>
                            Health Report Ready! ✨
                        </Text>
                        <Text style={styles.readyText}>
                            PetPal has created a health report for{' '}
                            <Text style={styles.readyPetName}>
                                {selectedPet?.name}
                            </Text>
                            .
                        </Text>
                        <View style={styles.fileCard}>
                            <View style={styles.fileIcon}>
                                <FileText
                                    size={23}
                                    color="#6C5DD3"
                                />
                            </View>
                            <View style={styles.fileInfo}>
                                <Text style={styles.fileName}>
                                    {selectedPet?.name}_Health_Report.pdf
                                </Text>
                                <Text style={styles.fileType}>
                                    PDF Health Report
                                </Text>
                            </View>
                        </View>
                        <TouchableOpacity
                            style={styles.shareButton}
                            onPress={shareReport}
                            activeOpacity={0.85}
                        >
                            <Share2
                                size={19}
                                color="#FFFFFF"
                            />
                            <Text style={styles.shareButtonText}>
                                Share / Open Report
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.anotherButton}
                            onPress={generateAnotherReport}
                            activeOpacity={0.8}
                        >
                            <RefreshIcon />
                            <Text style={styles.anotherButtonText}>
                                Generate Another Report
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                {/* DISCLAIMER */}
                <View style={styles.disclaimer}>
                    <ShieldCheck
                        size={17}
                        color="#9999A3"
                    />
                    <Text style={styles.disclaimerText}>
                        PetPal health reports provide general AI-generated
                        information and do not replace professional veterinary
                        evaluation or medical advice.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
// ======================================================
// REFRESH ICON
// ======================================================
const RefreshIcon = () => (
    <Text
        style={{
            color: '#6C5DD3',
            fontSize: 19,
            fontWeight: '600',
        }}
    >
        ↻
    </Text>
);
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
    reportItem: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 11,
        borderWidth: 1,
        borderColor: '#EEEEF3',
    },
    reportItemIcon: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },
    reportItemContent: {
        flex: 1,
    },
    reportItemTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 3,
    },
    reportItemText: {
        fontSize: 10,
        lineHeight: 15,
        color: '#85858F',
    },
    generateButton: {
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
    generateButtonDisabled: {
        opacity: 0.45,
        shadowOpacity: 0,
        elevation: 0,
    },
    generateButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    readyCard: {
        marginHorizontal: 16,
        marginTop: 22,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
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
    readyIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    readyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#292929',
        textAlign: 'center',
    },
    readyText: {
        fontSize: 12,
        lineHeight: 18,
        color: '#85858F',
        textAlign: 'center',
        marginTop: 6,
        marginBottom: 18,
    },
    readyPetName: {
        fontWeight: '700',
        color: '#6C5DD3',
    },
    fileCard: {
        width: '100%',
        backgroundColor: '#F8F6FF',
        borderRadius: 15,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    fileIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 11,
    },
    fileInfo: {
        flex: 1,
    },
    fileName: {
        fontSize: 12,
        fontWeight: '700',
        color: '#35353D',
    },
    fileType: {
        fontSize: 10,
        color: '#85858F',
        marginTop: 3,
    },
    shareButton: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#6C5DD3',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    shareButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    anotherButton: {
        width: '100%',
        height: 46,
        borderRadius: 23,
        backgroundColor: '#F0EDFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        marginTop: 10,
    },
    anotherButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6C5DD3',
    },
    disclaimer: {
        marginHorizontal: 25,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    disclaimerText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 15,
        color: '#9999A3',
        textAlign: 'center',
        marginLeft: 7,
    },
});