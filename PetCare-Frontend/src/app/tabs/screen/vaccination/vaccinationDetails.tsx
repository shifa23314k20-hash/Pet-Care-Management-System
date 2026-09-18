import React, {
    useCallback,
    useState,
} from "react";

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

import {
    router,
    useFocusEffect,
    useLocalSearchParams,
} from "expo-router";

import {
    CalendarDays,
    Bell,
    FileText,
    Syringe,
    Pencil,
    Trash2,
    ChevronLeft,
    PawPrint,
    CheckCircle2,
    Clock3,
} from "lucide-react-native";

import {
    getVaccinationById,
    deleteVaccination,
} from "@/services/vaccination";

import {
    getPetById,
} from "@/services/pet";

import VaccinationForm from "@/components/vaccinationForm";

const PRIMARY = "#6C5DD3";

export default function VaccinationDetailsScreen() {
    const { id } =
        useLocalSearchParams();

    const [vaccination, setVaccination] =
        useState<any>(null);

    const [pet, setPet] =
        useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    const [editVisible, setEditVisible] =
        useState(false);

    /* =========================================================
       FETCH
    ========================================================= */

    const fetchVaccination = async () => {
        try {
            setLoading(true);

            const response =
                await getVaccinationById(
                    id as string
                );

            console.log(
                "Vaccination details:",
                response
            );

            const data =
                response?.vaccination ||
                response?.data?.vaccination;

            setVaccination(data);

            if (data?.petId) {
                try {
                    const petResponse =
                        await getPetById(
                            data.petId
                        );

                    setPet(
                        petResponse?.pet ||
                            petResponse
                                ?.data?.pet ||
                            null
                    );
                } catch (error) {
                    console.log(
                        "Pet fetch error:",
                        error
                    );
                }
            }
        } catch (error) {
            console.log(
                "Vaccination fetch error:",
                error
            );

            Alert.alert(
                "Error",
                "Failed to load vaccination details."
            );
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (id) {
                fetchVaccination();
            }
        }, [id])
    );

    /* =========================================================
       DATE
    ========================================================= */

    const formatDate = (
        value?: string | null
    ) => {
        if (!value) {
            return "--";
        }

        const date =
            new Date(value);

        if (
            isNaN(
                date.getTime()
            )
        ) {
            return "--";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    /* =========================================================
       STATUS
    ========================================================= */

    const getStatus = () => {
        if (
            !vaccination?.nextDueDate
        ) {
            return "Completed";
        }

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );

        const due =
            new Date(
                vaccination.nextDueDate
            );

        due.setHours(
            0,
            0,
            0,
            0
        );

        const difference =
            Math.ceil(
                (due.getTime() -
                    today.getTime()) /
                    (1000 *
                        60 *
                        60 *
                        24)
            );

        if (difference < 0) {
            return "Overdue";
        }

        if (difference === 0) {
            return "Due Today";
        }

        if (difference <= 7) {
            return "Due Soon";
        }

        return "Upcoming";
    };

    /* =========================================================
       DELETE
    ========================================================= */

    const handleDelete = () => {
        Alert.alert(
            "Delete Vaccination",
            "Are you sure you want to delete this vaccination record?",
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
                            await deleteVaccination(
                                vaccination.id
                            );

                            Alert.alert(
                                "Deleted",
                                "Vaccination record deleted successfully."
                            );

                            router.back();
                        } catch (error) {
                            Alert.alert(
                                "Error",
                                "Unable to delete vaccination."
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
            <View
                style={
                    styles.loader
                }
            >
                <ActivityIndicator
                    size="large"
                    color={PRIMARY}
                />
            </View>
        );
    }

    if (!vaccination) {
        return (
            <View
                style={
                    styles.loader
                }
            >
                <Text
                    style={
                        styles.notFound
                    }
                >
                    Vaccination not found.
                </Text>

                <TouchableOpacity
                    style={
                        styles.backButton
                    }
                    onPress={() =>
                        router.back()
                    }
                >
                    <Text
                        style={
                            styles.backButtonText
                        }
                    >
                        Go Back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    const status =
        getStatus();

    return (
        <View
            style={
                styles.container
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={
                    false
                }
                contentContainerStyle={
                    styles.scrollContent
                }
            >
                {/* =================================================
                    HEADER
                ================================================= */}

                <View
                    style={
                        styles.header
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            router.back()
                        }
                    >
                        <ChevronLeft
                            size={
                                24
                            }
                            color="#242331"
                        />
                    </TouchableOpacity>

                    <Text
                        style={
                            styles.headerTitle
                        }
                    >
                        Vaccination
                    </Text>

                    <TouchableOpacity
                        style={
                            styles.headerButton
                        }
                        onPress={() =>
                            setEditVisible(
                                true
                            )
                        }
                    >
                        <Pencil
                            size={
                                19
                            }
                            color={
                                PRIMARY
                            }
                        />
                    </TouchableOpacity>
                </View>

                {/* =================================================
                    HERO
                ================================================= */}

                <View
                    style={
                        styles.heroCard
                    }
                >
                    <View
                        style={
                            styles.heroIcon
                        }
                    >
                        <Syringe
                            size={
                                31
                            }
                            color={
                                PRIMARY
                            }
                        />
                    </View>

                    <Text
                        style={
                            styles.heroTitle
                        }
                    >
                        {
                            vaccination.vaccineName
                        }
                    </Text>

                    <View
                        style={[
                            styles.statusBadge,
                            status ===
                                "Overdue" &&
                                styles.overdueBadge,
                            status ===
                                "Due Soon" &&
                                styles.dueSoonBadge,
                        ]}
                    >
                        {status ===
                            "Completed" ? (
                            <CheckCircle2
                                size={
                                    15
                                }
                                color="#22C55E"
                            />
                        ) : (
                            <Clock3
                                size={
                                    15
                                }
                                color={
                                    status ===
                                    "Overdue"
                                        ? "#DC2626"
                                        : status ===
                                          "Due Soon"
                                        ? "#D97706"
                                        : PRIMARY
                                }
                            />
                        )}

                        <Text
                            style={[
                                styles.statusText,
                                status ===
                                    "Overdue" &&
                                    styles.overdueText,
                                status ===
                                    "Due Soon" &&
                                    styles.dueSoonText,
                            ]}
                        >
                            {status}
                        </Text>
                    </View>
                </View>

                {/* =================================================
                    PET CARD
                ================================================= */}

                <View
                    style={
                        styles.petCard
                    }
                >
                    <Image
                        source={
                            pet?.petImage
                                ? {
                                      uri: pet.petImage,
                                  }
                                : require("../../../../../assets/images/dummy-pic.jpg")
                        }
                        style={
                            styles.petImage
                        }
                    />

                    <View
                        style={
                            styles.petContent
                        }
                    >
                        <Text
                            style={
                                styles.petLabel
                            }
                        >
                            Vaccination for
                        </Text>

                        <Text
                            style={
                                styles.petName
                            }
                        >
                            {pet?.name ||
                                "Unknown Pet"}
                        </Text>

                        <View
                            style={
                                styles.petInfoRow
                            }
                        >
                            <PawPrint
                                size={
                                    14
                                }
                                color={
                                    PRIMARY
                                }
                            />

                            <Text
                                style={
                                    styles.petInfo
                                }
                            >
                                {pet?.breed ||
                                    pet?.type ||
                                    "Pet"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* =================================================
                    VACCINATION DETAILS
                ================================================= */}

                <View
                    style={
                        styles.card
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Vaccination Details
                    </Text>

                    {/* Date Given */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <View
                            style={
                                styles.infoIcon
                            }
                        >
                            <CalendarDays
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.infoContent
                            }
                        >
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Date Given
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {formatDate(
                                    vaccination.dateGiven
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* Next Due */}

                    <View
                        style={
                            styles.infoRow
                        }
                    >
                        <View
                            style={
                                styles.infoIcon
                            }
                        >
                            <CalendarDays
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.infoContent
                            }
                        >
                            <Text
                                style={
                                    styles.infoLabel
                                }
                            >
                                Next Due Date
                            </Text>

                            <Text
                                style={
                                    styles.infoValue
                                }
                            >
                                {formatDate(
                                    vaccination.nextDueDate
                                )}
                            </Text>
                        </View>
                    </View>

                    {/* Reminder */}

                    <View
                        style={[
                            styles.infoRow,
                            {
                                marginBottom: 0,
                            },
                        ]}
                    >
                        <View
                            style={
                                styles.infoIcon
                            }
                        >
                            <Bell
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />
                        </View>

                        <View
                            style={
                                styles.infoContent
                            }
                        >
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
                                {vaccination.reminderEnabled
                                    ? "Enabled"
                                    : "Disabled"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* =================================================
                    NOTES
                ================================================= */}

                <View
                    style={
                        styles.card
                    }
                >
                    <Text
                        style={
                            styles.sectionTitle
                        }
                    >
                        Notes
                    </Text>

                    <View
                        style={
                            styles.notesBox
                        }
                    >
                        <FileText
                            size={
                                18
                            }
                            color={
                                PRIMARY
                            }
                        />

                        <Text
                            style={
                                styles.notes
                            }
                        >
                            {vaccination.notes ||
                                "No notes available for this vaccination."}
                        </Text>
                    </View>
                </View>

                {/* =================================================
                    BUTTONS
                ================================================= */}

                <View
                    style={
                        styles.buttonRow
                    }
                >
                    <TouchableOpacity
                        style={
                            styles.editButton
                        }
                        onPress={() =>
                            setEditVisible(
                                true
                            )
                        }
                    >
                        <Pencil
                            size={
                                18
                            }
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={
                            styles.deleteButton
                        }
                        onPress={
                            handleDelete
                        }
                    >
                        <Trash2
                            size={
                                18
                            }
                            color="#FFFFFF"
                        />

                        <Text
                            style={
                                styles.buttonText
                            }
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* =====================================================
                EDIT MODAL
            ===================================================== */}

            <Modal
                visible={
                    editVisible
                }
                animationType="slide"
                transparent
                onRequestClose={() =>
                    setEditVisible(
                        false
                    )
                }
            >
                <VaccinationForm
                    vaccination={
                        vaccination
                    }
                    userId={
                        vaccination.userId
                    }
                    onClose={() => {
                        setEditVisible(
                            false
                        );
                        fetchVaccination();
                    }}
                />
            </Modal>
        </View>
    );
}

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F8FD",
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

    notFound: {
        fontSize: 16,
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
        color: "#FFFFFF",
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

    headerButton: {
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
       HERO
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

        marginBottom: 13,
    },

    heroTitle: {
        fontSize: 25,
        fontWeight: "800",
        color: "#242331",
        textAlign: "center",
    },

    statusBadge: {
        marginTop: 12,

        flexDirection: "row",
        alignItems: "center",

        gap: 6,

        backgroundColor: "#EFECFB",

        paddingHorizontal: 14,
        paddingVertical: 7,

        borderRadius: 50,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "800",
        color: PRIMARY,
    },

    dueSoonBadge: {
        backgroundColor: "#FFF4DD",
    },

    dueSoonText: {
        color: "#D97706",
    },

    overdueBadge: {
        backgroundColor: "#FEECEC",
    },

    overdueText: {
        color: "#DC2626",
    },

    /* ---------------------------------------------------------
       PET
    --------------------------------------------------------- */

    petCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 22,

        padding: 15,

        marginBottom: 18,

        flexDirection: "row",
        alignItems: "center",

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

    petImage: {
        width: 82,
        height: 82,
        borderRadius: 41,
        backgroundColor: "#F3F2F8",
    },

    petContent: {
        flex: 1,
        marginLeft: 15,
    },

    petLabel: {
        fontSize: 11,
        color: "#92909E",
        fontWeight: "600",
    },

    petName: {
        fontSize: 21,
        fontWeight: "800",
        color: "#242331",
        marginTop: 2,
    },

    petInfoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        gap: 5,
    },

    petInfo: {
        fontSize: 13,
        color: "#777481",
    },

    /* ---------------------------------------------------------
       CARD
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

        fontSize: 14,
        lineHeight: 22,

        color: "#6F6C79",
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
        alignItems: "center",
        justifyContent: "center",

        marginRight: 6,
    },

    deleteButton: {
        flex: 0.65,
        height: 54,

        borderRadius: 15,

        backgroundColor: "#EF4444",

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",

        marginLeft: 6,
    },

    buttonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "800",
        marginLeft: 7,
    },
});