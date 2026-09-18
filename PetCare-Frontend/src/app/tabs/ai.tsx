import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import {
    Sparkles,
    MessageCircle,
    Stethoscope,
    HeartPulse,
    Syringe,
    FileText,
    ChevronRight,
    ShieldCheck,
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function AIHomeScreen() {
    const aiFeatures = [
        {
            title: 'Symptom Checker',
            description: 'Check your pet’s symptoms with AI',
            icon: Stethoscope,
            route: '/tabs/screen/ai/symptom-checker',
        },
        {
            title: 'Care Recommendations',
            description: 'Get personalized daily care tips',
            icon: HeartPulse,
            route: '/tabs/screen/ai/care-recommendation',
        },
        {
            title: 'Vaccination Assistant',
            description: 'Understand your pet’s vaccination history',
            icon: Syringe,
            route: '/tabs/screen/ai/vaccination-assistant',
        },
        {
            title: 'Health Report',
            description: 'Generate an AI-powered health report',
            icon: FileText,
            route: '/tabs/screen/ai/health-report',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>PetPal ✨</Text>

                        <Text style={styles.subtitle}>
                            Your AI companion for happier, healthier pets k.
                        </Text>
                    </View>

                    <View style={styles.aiIcon}>
                        <Sparkles
                            size={25}
                            color="#FFFFFF"
                            strokeWidth={2.3}
                        />
                    </View>
                </View>

                {/* WELCOME CARD */}
                <View style={styles.welcomeCard}>
                    <View style={styles.welcomeIcon}>
                        <Sparkles
                            size={30}
                            color="#6C5DD3"
                            strokeWidth={2}
                        />
                    </View>

                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeTitle}>
                            Hi! I'm PetPal 👋
                        </Text>

                        <Text style={styles.welcomeText}>
                            I can help you understand your pet’s health,
                            care, vaccinations and more.
                        </Text>
                    </View>
                </View>

                {/* CHAT BUTTON */}
                <TouchableOpacity
                    activeOpacity={0.85}
                    style={styles.chatButton}
                    onPress={() => router.push('/tabs/screen/ai/ai-chat')}
                >
                    <View style={styles.chatIcon}>
                        <MessageCircle
                            size={24}
                            color="#FFFFFF"
                            strokeWidth={2.2}
                        />
                    </View>

                    <View style={styles.chatContent}>
                        <Text style={styles.chatTitle}>
                            Chat with PetPal
                        </Text>

                        <Text style={styles.chatSubtitle}>
                            Ask anything about your pet
                        </Text>
                    </View>

                    <ChevronRight
                        size={23}
                        color="#FFFFFF"
                        strokeWidth={2.2}
                    />
                </TouchableOpacity>

                {/* SECTION TITLE */}
                <Text style={styles.sectionTitle}>
                    PetPal Health Tools
                </Text>

                {/* AI FEATURE CARDS */}
                <View style={styles.featuresGrid}>
                    {aiFeatures.map((feature, index) => {
                        const Icon = feature.icon;

                        return (
                            <TouchableOpacity
                                key={index}
                                activeOpacity={0.85}
                                style={styles.featureCard}
                                onPress={() => router.push(feature.route as any)}
                            >
                                <View style={styles.featureIcon}>
                                    <Icon
                                        size={25}
                                        color="#6C5DD3"
                                        strokeWidth={2}
                                    />
                                </View>

                                <Text style={styles.featureTitle}>
                                    {feature.title}
                                </Text>

                                <Text style={styles.featureDescription}>
                                    {feature.description}
                                </Text>

                                <View style={styles.cardArrow}>
                                    <ChevronRight
                                        size={17}
                                        color="#6C5DD3"
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* DISCLAIMER */}
                <View style={styles.disclaimerCard}>
                    <ShieldCheck
                        size={20}
                        color="#6C5DD3"
                        strokeWidth={2}
                    />

                    <Text style={styles.disclaimerText}>
                        PetPal provides general information for educational
                        purposes. It does not replace professional
                        veterinary advice.
                    </Text>
                </View>

                <View style={styles.bottomSpace} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F8FF',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 30,
    },

    /* HEADER */
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 22,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#202124',
    },

    subtitle: {
        fontSize: 14,
        color: '#85858F',
        marginTop: 4,
        maxWidth: 260,
    },

    aiIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#6C5DD3',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* WELCOME */
    welcomeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },

    welcomeIcon: {
        width: 58,
        height: 58,
        borderRadius: 18,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },

    welcomeContent: {
        flex: 1,
    },

    welcomeTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#252525',
        marginBottom: 5,
    },

    welcomeText: {
        fontSize: 13,
        lineHeight: 19,
        color: '#777782',
    },

    /* CHAT */
    chatButton: {
        backgroundColor: '#6C5DD3',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
    },

    chatIcon: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 13,
    },

    chatContent: {
        flex: 1,
    },

    chatTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    chatSubtitle: {
        fontSize: 12,
        color: '#E9E7FF',
        marginTop: 4,
    },

    /* SECTION */
    sectionTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#252525',
        marginBottom: 14,
    },

    /* FEATURES */
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    featureCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        minHeight: 175,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },

    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: '#F0EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 14,
    },

    featureTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#292929',
        marginBottom: 6,
    },

    featureDescription: {
        fontSize: 12,
        lineHeight: 17,
        color: '#85858F',
        paddingRight: 5,
    },

    cardArrow: {
        position: 'absolute',
        right: 13,
        bottom: 13,
    },

    /* DISCLAIMER */
    disclaimerCard: {
        marginTop: 10,
        backgroundColor: '#F0EDFF',
        borderRadius: 17,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    disclaimerText: {
        flex: 1,
        fontSize: 11,
        lineHeight: 17,
        color: '#66627F',
        marginLeft: 10,
    },

    bottomSpace: {
        height: 20,
    },
});