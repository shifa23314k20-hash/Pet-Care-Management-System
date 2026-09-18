import React, {
    useEffect,
    useState,
} from "react";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Switch,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";

import {
    CalendarDays,
    Syringe,
    FileText,
    Bell,
    X,
    ChevronDown,
    PawPrint,
} from "lucide-react-native";

import {
    createVaccination,
    updateVaccination,
} from "@/services/vaccination";

import {
    getPetsByUserId,
} from "@/services/pet";

const PRIMARY = "#6C5DD3";

interface Pet {
    id: string;
    name: string;
    breed?: string;
    type?: string;
    petType?: string;
}

interface Vaccination {
    id: string;
    userId: string;
    petId: string;
    vaccineName: string;
    dateGiven: string;
    nextDueDate?: string | null;
    notes?: string;
    reminderEnabled: boolean;
}

interface VaccinationFormProps {
    vaccination: Vaccination | null;
    userId: string;
    onClose: () => void;
}

export default function VaccinationForm({
    vaccination,
    userId,
    onClose,
}: VaccinationFormProps) {
    const isEditMode =
        vaccination !== null;

    const [pets, setPets] =
        useState<Pet[]>([]);

    const [petsLoading, setPetsLoading] =
        useState(true);

    const [dropdownVisible, setDropdownVisible] =
        useState(false);

    const [selectedPetId, setSelectedPetId] =
        useState("");

    const [vaccineName, setVaccineName] =
        useState("");

    const [dateGiven, setDateGiven] =
        useState("");

    const [nextDueDate, setNextDueDate] =
        useState("");

    const [notes, setNotes] =
        useState("");

    const [reminderEnabled, setReminderEnabled] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    /* =========================================================
       LOAD PETS
    ========================================================= */

    useEffect(() => {
        const fetchPets = async () => {
            try {
                setPetsLoading(true);

                /*
                 * Pet service already gets the
                 * logged-in user from stored auth.
                 */
                const response =
                    await getPetsByUserId();

                console.log(
                    "Pets response:",
                    response
                );

                if (
                    response?.success &&
                    Array.isArray(response?.pets)
                ) {
                    setPets(response.pets);
                } else {
                    setPets([]);
                }
            } catch (error) {
                console.log(
                    "Fetch pets error:",
                    error
                );

                Alert.alert(
                    "Error",
                    "Unable to load your pets."
                );

                setPets([]);
            } finally {
                setPetsLoading(false);
            }
        };

        fetchPets();
    }, []);

    /* =========================================================
       RESET / LOAD FORM
    ========================================================= */

    useEffect(() => {
        if (vaccination) {
            setSelectedPetId(
                vaccination.petId || ""
            );

            setVaccineName(
                vaccination.vaccineName || ""
            );

            setDateGiven(
                vaccination.dateGiven
                    ? formatDateForInput(
                          vaccination.dateGiven
                      )
                    : ""
            );

            setNextDueDate(
                vaccination.nextDueDate
                    ? formatDateForInput(
                          vaccination.nextDueDate
                      )
                    : ""
            );

            setNotes(
                vaccination.notes || ""
            );

            setReminderEnabled(
                vaccination.reminderEnabled ??
                    false
            );
        } else {
            resetForm();
        }
    }, [vaccination]);

    const resetForm = () => {
        setSelectedPetId("");
        setVaccineName("");
        setDateGiven("");
        setNextDueDate("");
        setNotes("");
        setReminderEnabled(false);
        setDropdownVisible(false);
    };

    /* =========================================================
       DATE FORMAT
    ========================================================= */

    const formatDateForInput = (
        value: string
    ) => {
        const parsedDate =
            new Date(value);

        if (
            isNaN(
                parsedDate.getTime()
            )
        ) {
            return "";
        }

        const day = String(
            parsedDate.getDate()
        ).padStart(2, "0");

        const month = String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

        const year =
            parsedDate.getFullYear();

        return `${day}/${month}/${year}`;
    };

    /* =========================================================
       PARSE DD/MM/YYYY
    ========================================================= */

    const parseDate = (
        value: string
    ): Date | null => {
        const parts =
            value.split("/");

        if (parts.length !== 3) {
            return null;
        }

        const day = Number(parts[0]);
        const month = Number(parts[1]);
        const year = Number(parts[2]);

        if (
            !day ||
            !month ||
            !year ||
            day < 1 ||
            day > 31 ||
            month < 1 ||
            month > 12 ||
            year < 1900
        ) {
            return null;
        }

        const date = new Date(
            year,
            month - 1,
            day
        );

        if (
            date.getFullYear() !== year ||
            date.getMonth() !==
                month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    };

    /* =========================================================
       DATE TO ISO WITHOUT TIMEZONE SHIFT
    ========================================================= */

    const dateToISO = (
        date: Date
    ) => {
        return new Date(
            Date.UTC(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            )
        ).toISOString();
    };

    /* =========================================================
       DATE INPUT
    ========================================================= */

    const handleDateChange = (
        value: string,
        setter: (
            value: string
        ) => void
    ) => {
        const numbers =
            value.replace(
                /\D/g,
                ""
            );

        let formatted =
            numbers;

        if (
            numbers.length > 2
        ) {
            formatted =
                numbers.substring(
                    0,
                    2
                ) +
                "/" +
                numbers.substring(2);
        }

        if (
            numbers.length > 4
        ) {
            formatted =
                numbers.substring(
                    0,
                    2
                ) +
                "/" +
                numbers.substring(
                    2,
                    4
                ) +
                "/" +
                numbers.substring(
                    4,
                    8
                );
        }

        setter(formatted);
    };

    /* =========================================================
       SELECTED PET
    ========================================================= */

    const selectedPet =
        pets.find(
            (pet) =>
                pet.id ===
                selectedPetId
        );

    /* =========================================================
       SUBMIT
    ========================================================= */

    const handleSubmit =
        async () => {
            if (!selectedPetId) {
                Alert.alert(
                    "Pet Required",
                    "Please select a pet."
                );
                return;
            }

            if (
                !vaccineName.trim()
            ) {
                Alert.alert(
                    "Required",
                    "Please enter the vaccine name."
                );
                return;
            }

            if (
                !dateGiven.trim()
            ) {
                Alert.alert(
                    "Required",
                    "Please enter the date the vaccine was given."
                );
                return;
            }

            const givenDate =
                parseDate(
                    dateGiven
                );

            if (!givenDate) {
                Alert.alert(
                    "Invalid Date",
                    "Please enter a valid date in DD/MM/YYYY format."
                );
                return;
            }

            let dueDate:
                | Date
                | null = null;

            if (
                nextDueDate.trim()
            ) {
                dueDate =
                    parseDate(
                        nextDueDate
                    );

                if (!dueDate) {
                    Alert.alert(
                        "Invalid Date",
                        "Please enter a valid next due date."
                    );
                    return;
                }

                if (
                    dueDate.getTime() <
                    givenDate.getTime()
                ) {
                    Alert.alert(
                        "Invalid Date",
                        "Next due date cannot be before the date given."
                    );
                    return;
                }
            }

            try {
                setLoading(true);

                const vaccinationData =
                    {
                        petId:
                            selectedPetId,

                        vaccineName:
                            vaccineName.trim(),

                        dateGiven:
                            dateToISO(
                                givenDate
                            ),

                        nextDueDate:
                            dueDate
                                ? dateToISO(
                                      dueDate
                                  )
                                : null,

                        notes:
                            notes.trim(),

                        reminderEnabled,
                    };

                console.log(
                    "Vaccination payload:",
                    vaccinationData
                );

                if (isEditMode) {
                    await updateVaccination(
                        vaccination!.id,
                        vaccinationData
                    );

                    Alert.alert(
                        "Success",
                        "Vaccination updated successfully.",
                        [
                            {
                                text: "OK",
                                onPress:
                                    onClose,
                            },
                        ]
                    );
                } else {
                    await createVaccination(
                        vaccinationData
                    );

                    Alert.alert(
                        "Success",
                        "Vaccination added successfully.",
                        [
                            {
                                text: "OK",
                                onPress:
                                    onClose,
                            },
                        ]
                    );
                }
            } catch (error: any) {
                console.log(
                    "Vaccination save error:",
                    error?.response
                        ?.data || error
                );

                Alert.alert(
                    "Error",
                    error?.response
                        ?.data?.message ||
                        "Unable to save vaccination."
                );
            } finally {
                setLoading(false);
            }
        };

    /* =========================================================
       UI
    ========================================================= */

    return (
        <KeyboardAvoidingView
            style={
                styles.modalOverlay
            }
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : undefined
            }
        >
            <View
                style={
                    styles.modalContent
                }
            >
                {/* Handle */}

                <View
                    style={
                        styles.modalHandle
                    }
                />

                {/* Header */}

                <View
                    style={
                        styles.header
                    }
                >
                    <View
                        style={
                            styles.headerText
                        }
                    >
                        <Text
                            style={
                                styles.title
                            }
                        >
                            {isEditMode
                                ? "Edit Vaccination"
                                : "Add Vaccination"}
                        </Text>

                        <Text
                            style={
                                styles.subtitle
                            }
                        >
                            {isEditMode
                                ? "Update your pet's vaccination record"
                                : "Keep track of your pet's vaccination"}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={
                            styles.closeButton
                        }
                        onPress={
                            onClose
                        }
                    >
                        <X
                            size={21}
                            color="#555260"
                        />
                    </TouchableOpacity>
                </View>

                {/* Form Scroll */}

                <ScrollView
                    style={
                        styles.formScroll
                    }
                    contentContainerStyle={
                        styles.scrollContent
                    }
                    showsVerticalScrollIndicator={
                        false
                    }
                    keyboardShouldPersistTaps="handled"
                >
                    {/* PET */}

                    <View
                        style={
                            styles.fieldContainer
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Select Pet
                        </Text>

                        <TouchableOpacity
                            style={
                                styles.inputContainer
                            }
                            onPress={() =>
                                !petsLoading &&
                                setDropdownVisible(
                                    !dropdownVisible
                                )
                            }
                            activeOpacity={
                                0.8
                            }
                        >
                            <PawPrint
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />

                            <View
                                style={
                                    styles.petSelectedContent
                                }
                            >
                                {petsLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={
                                            PRIMARY
                                        }
                                    />
                                ) : (
                                    <Text
                                        style={[
                                            styles.inputText,
                                            !selectedPet &&
                                                styles.placeholderText,
                                        ]}
                                    >
                                        {selectedPet
                                            ? selectedPet.name
                                            : "Select your pet"}
                                    </Text>
                                )}
                            </View>

                            <ChevronDown
                                size={
                                    19
                                }
                                color="#92909E"
                            />
                        </TouchableOpacity>

                        {dropdownVisible && (
                            <View
                                style={
                                    styles.dropdown
                                }
                            >
                                {pets.length ===
                                0 ? (
                                    <Text
                                        style={
                                            styles.noPetsText
                                        }
                                    >
                                        No pets found.
                                    </Text>
                                ) : (
                                    pets.map(
                                        (
                                            pet
                                        ) => (
                                            <TouchableOpacity
                                                key={
                                                    pet.id
                                                }
                                                style={[
                                                    styles.petOption,
                                                    selectedPetId ===
                                                        pet.id &&
                                                        styles.selectedPetOption,
                                                ]}
                                                onPress={() => {
                                                    setSelectedPetId(
                                                        pet.id
                                                    );
                                                    setDropdownVisible(
                                                        false
                                                    );
                                                }}
                                            >
                                                <View
                                                    style={
                                                        styles.petOptionIcon
                                                    }
                                                >
                                                    <PawPrint
                                                        size={
                                                            17
                                                        }
                                                        color={
                                                            PRIMARY
                                                        }
                                                    />
                                                </View>

                                                <View>
                                                    <Text
                                                        style={
                                                            styles.petOptionName
                                                        }
                                                    >
                                                        {
                                                            pet.name
                                                        }
                                                    </Text>

                                                    {pet.breed && (
                                                        <Text
                                                            style={
                                                                styles.petOptionBreed
                                                            }
                                                        >
                                                            {
                                                                pet.breed
                                                            }
                                                        </Text>
                                                    )}
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    )
                                )}
                            </View>
                        )}
                    </View>

                    {/* VACCINE NAME */}

                    <View
                        style={
                            styles.fieldContainer
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Vaccine Name
                        </Text>

                        <View
                            style={
                                styles.inputContainer
                            }
                        >
                            <Syringe
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    vaccineName
                                }
                                onChangeText={
                                    setVaccineName
                                }
                                placeholder="e.g. Rabies, DHPP, Bordetella"
                                placeholderTextColor="#A1A1AA"
                            />
                        </View>
                    </View>

                    {/* DATE GIVEN */}

                    <View
                        style={
                            styles.fieldContainer
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Date Given
                        </Text>

                        <View
                            style={
                                styles.inputContainer
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

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    dateGiven
                                }
                                onChangeText={(
                                    value
                                ) =>
                                    handleDateChange(
                                        value,
                                        setDateGiven
                                    )
                                }
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor="#A1A1AA"
                                keyboardType="number-pad"
                                maxLength={
                                    10
                                }
                            />
                        </View>
                    </View>

                    {/* NEXT DUE DATE */}

                    <View
                        style={
                            styles.fieldContainer
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Next Due Date{" "}
                            <Text
                                style={
                                    styles.optional
                                }
                            >
                                (Optional)
                            </Text>
                        </Text>

                        <View
                            style={
                                styles.inputContainer
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

                            <TextInput
                                style={
                                    styles.input
                                }
                                value={
                                    nextDueDate
                                }
                                onChangeText={(
                                    value
                                ) =>
                                    handleDateChange(
                                        value,
                                        setNextDueDate
                                    )
                                }
                                placeholder="DD/MM/YYYY"
                                placeholderTextColor="#A1A1AA"
                                keyboardType="number-pad"
                                maxLength={
                                    10
                                }
                            />
                        </View>
                    </View>

                    {/* NOTES */}

                    <View
                        style={
                            styles.fieldContainer
                        }
                    >
                        <Text
                            style={
                                styles.label
                            }
                        >
                            Notes{" "}
                            <Text
                                style={
                                    styles.optional
                                }
                            >
                                (Optional)
                            </Text>
                        </Text>

                        <View
                            style={[
                                styles.inputContainer,
                                styles.notesContainer,
                            ]}
                        >
                            <FileText
                                size={
                                    19
                                }
                                color={
                                    PRIMARY
                                }
                            />

                            <TextInput
                                style={[
                                    styles.input,
                                    styles.notesInput,
                                ]}
                                value={
                                    notes
                                }
                                onChangeText={
                                    setNotes
                                }
                                placeholder="Add any additional information..."
                                placeholderTextColor="#A1A1AA"
                                multiline
                                textAlignVertical="top"
                            />
                        </View>
                    </View>

                    {/* REMINDER */}

                    <View
                        style={
                            styles.reminderCard
                        }
                    >
                        <View
                            style={
                                styles.reminderIcon
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
                                styles.reminderContent
                            }
                        >
                            <Text
                                style={
                                    styles.reminderTitle
                                }
                            >
                                Vaccination Reminder
                            </Text>

                            <Text
                                style={
                                    styles.reminderSubtitle
                                }
                            >
                                Get reminded when this vaccination is due
                            </Text>
                        </View>

                        <Switch
                            value={
                                reminderEnabled
                            }
                            onValueChange={
                                setReminderEnabled
                            }
                            trackColor={{
                                false:
                                    "#D9D7E2",
                                true:
                                    "#BDB6F4",
                            }}
                            thumbColor={
                                reminderEnabled
                                    ? PRIMARY
                                    : "#FFFFFF"
                            }
                        />
                    </View>

                    {/* BUTTONS */}

                    <View
                        style={
                            styles.buttonContainer
                        }
                    >
                        <TouchableOpacity
                            style={
                                styles.cancelButton
                            }
                            onPress={
                                onClose
                            }
                            disabled={
                                loading
                            }
                        >
                            <Text
                                style={
                                    styles.cancelText
                                }
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.saveButton,
                                loading &&
                                    styles.disabledButton,
                            ]}
                            onPress={
                                handleSubmit
                            }
                            disabled={
                                loading
                            }
                        >
                            {loading ? (
                                <ActivityIndicator
                                    size="small"
                                    color="#FFFFFF"
                                />
                            ) : (
                                <Text
                                    style={
                                        styles.saveText
                                    }
                                >
                                    {isEditMode
                                        ? "Update Vaccination"
                                        : "Save Vaccination"}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
}

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor:
            "rgba(0,0,0,0.45)",
        justifyContent: "flex-end",
    },

    modalContent: {
        width: "100%",
        height: "90%",
        backgroundColor: "#F9F8FD",

        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,

        overflow: "hidden",
    },

    modalHandle: {
        width: 45,
        height: 5,
        borderRadius: 999,
        backgroundColor: "#D1D5DB",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        paddingHorizontal: 20,
        paddingBottom: 15,

        borderBottomWidth: 1,
        borderBottomColor: "#ECEAF2",
    },

    headerText: {
        flex: 1,
        paddingRight: 15,
    },

    title: {
        fontSize: 22,
        fontWeight: "800",
        color: "#242331",
    },

    subtitle: {
        fontSize: 13,
        color: "#92909E",
        marginTop: 4,
    },

    closeButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: "#F0EFF6",
        justifyContent: "center",
        alignItems: "center",
    },

    formScroll: {
        flex: 1,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 35,
    },

    fieldContainer: {
        marginBottom: 17,
    },

    label: {
        fontSize: 13,
        fontWeight: "700",
        color: "#454350",
        marginBottom: 8,
    },

    optional: {
        color: "#AAA7B2",
        fontWeight: "500",
    },

    inputContainer: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#E8E6EF",

        borderRadius: 14,

        paddingHorizontal: 15,
    },

    input: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        color: "#242331",
        paddingVertical: 13,
    },

    inputText: {
        marginLeft: 10,
        fontSize: 14,
        color: "#242331",
    },

    placeholderText: {
        color: "#A1A1AA",
    },

    petSelectedContent: {
        flex: 1,
    },

    dropdown: {
        backgroundColor: "#FFFFFF",
        borderRadius: 15,
        marginTop: 6,

        borderWidth: 1,
        borderColor: "#E8E6EF",

        overflow: "hidden",

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 3,
        },

        elevation: 4,
    },

    petOption: {
        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 14,
        paddingVertical: 12,

        borderBottomWidth: 1,
        borderBottomColor: "#F1EFF5",
    },

    selectedPetOption: {
        backgroundColor: "#F4F1FC",
    },

    petOptionIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: "#EFECFB",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 11,
    },

    petOptionName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#242331",
    },

    petOptionBreed: {
        fontSize: 12,
        color: "#92909E",
        marginTop: 2,
    },

    noPetsText: {
        textAlign: "center",
        paddingVertical: 18,
        color: "#92909E",
        fontSize: 14,
    },

    notesContainer: {
        alignItems: "flex-start",
        paddingTop: 14,
        minHeight: 105,
    },

    notesInput: {
        minHeight: 80,
        paddingTop: 0,
    },

    reminderCard: {
        flexDirection: "row",
        alignItems: "center",

        backgroundColor: "#EFECFB",

        borderRadius: 17,

        padding: 14,
        marginBottom: 20,
    },

    reminderIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,

        backgroundColor: "#FFFFFF",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 11,
    },

    reminderContent: {
        flex: 1,
        paddingRight: 7,
    },

    reminderTitle: {
        fontSize: 14,
        fontWeight: "800",
        color: "#454350",
    },

    reminderSubtitle: {
        fontSize: 11,
        color: "#7C7987",
        marginTop: 3,
        lineHeight: 16,
    },

    buttonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: 2,
    },

    cancelButton: {
        flex: 1,
        height: 54,
        borderRadius: 15,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#E8E6EF",

        alignItems: "center",
        justifyContent: "center",
    },

    cancelText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#777481",
    },

    saveButton: {
        flex: 1.25,
        height: 54,
        borderRadius: 15,

        backgroundColor: PRIMARY,

        alignItems: "center",
        justifyContent: "center",

        shadowColor: PRIMARY,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 4,
    },

    disabledButton: {
        opacity: 0.65,
    },

    saveText: {
        fontSize: 14,
        fontWeight: "800",
        color: "#FFFFFF",
    },
});