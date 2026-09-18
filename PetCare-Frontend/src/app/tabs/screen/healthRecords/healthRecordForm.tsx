// ============================================================
// HEALTH RECORD FORM
// ============================================================
// Used for:
// 1. Adding a new health record
// 2. Editing an existing health record
//
// Backend APIs:
// - createHealthRecord()
// - getHealthRecordById()
// - updateHealthRecord()
//
// Pet API:
// - getPetsByUserId()
//
// ============================================================

import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  FileText,
  HeartPulse,
  Pill,
  Stethoscope,
  Thermometer,
  Weight,
} from "lucide-react-native";

import { getPetsByUserId } from "@/services/pet";

import {
  createHealthRecord,
  getHealthRecordById,
  updateHealthRecord,
} from "@/services/health";

// ============================================================
// TYPES
// ============================================================

interface Pet {
  id: string;
  name: string;
  image?: string;
  photo?: string;
  species?: string;
  breed?: string;
}

interface FormData {
  petId: string;
  weight: string;
  temperature: string;
  illness: string;
  medication: string;
  veterinarian: string;
  visitDate: string;
  notes: string;
}

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  primary: "#6C5DD3",
  background: "#F9F8FD",
  white: "#FFFFFF",
  text: "#242331",
  secondaryText: "#92909E",
  label: "#454350",
  border: "#E8E6EF",
  lightPurple: "#EFECFB",
  red: "#D95353",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function HealthRecordFormScreen() {
  const router = useRouter();

  // ==========================================================
  // GET RECORD ID
  // ==========================================================

  const { id } = useLocalSearchParams();

  const recordId = Array.isArray(id) ? id[0] : id;

  // If recordId exists → EDIT MODE
  // If recordId does not exist → ADD MODE

  const isEditMode = Boolean(recordId);

  // ==========================================================
  // STATES
  // ==========================================================

  const [pets, setPets] = useState<Pet[]>([]);

  const [selectedPet, setSelectedPet] =
    useState<Pet | null>(null);

  const [showPetList, setShowPetList] =
    useState(false);

  const [formData, setFormData] =
    useState<FormData>({
      petId: "",
      weight: "",
      temperature: "",
      illness: "",
      medication: "",
      veterinarian: "",
      visitDate: formatToday(),
      notes: "",
    });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  // ==========================================================
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    loadFormData();
  }, [recordId]);

  // ==========================================================
  // LOAD PETS + EXISTING RECORD
  // ==========================================================

  const loadFormData = async () => {
    try {
      setLoading(true);

      // ======================================================
      // STEP 1 — LOAD USER PETS
      // ======================================================

      const petsResponse = await getPetsByUserId();

      console.log(
        "PETS RESPONSE:",
        JSON.stringify(petsResponse, null, 2)
      );

      const petsData =
        petsResponse?.pets ||
        petsResponse?.data?.pets ||
        petsResponse?.data ||
        petsResponse ||
        [];

      const petList: Pet[] = Array.isArray(petsData)
        ? petsData
        : [];

      setPets(petList);

      // ======================================================
      // STEP 2 — EDIT MODE
      // ======================================================

      if (isEditMode && recordId) {
        console.log(
          "EDIT MODE - RECORD ID:",
          recordId
        );

        const response =
          await getHealthRecordById(recordId);

        console.log(
          "HEALTH RECORD RESPONSE:",
          JSON.stringify(response, null, 2)
        );

        // ====================================================
        // IMPORTANT
        // Backend returns:
        //
        // {
        //   success: true,
        //   healthRecord: {...},
        //   pet: {...}
        // }
        //
        // ====================================================

        const record =
          response?.healthRecord ||
          response?.data?.healthRecord ||
          response?.record ||
          response?.data ||
          response;

        const petFromResponse =
          response?.pet ||
          response?.data?.pet ||
          null;

        console.log(
          "EDIT RECORD:",
          JSON.stringify(record, null, 2)
        );

        console.log(
          "EDIT PET:",
          JSON.stringify(
            petFromResponse,
            null,
            2
          )
        );

        // ====================================================
        // CHECK RECORD
        // ====================================================

        if (!record || !record.petId) {
          Alert.alert(
            "Error",
            "Unable to load the health record."
          );

          return;
        }

        // ====================================================
        // STEP 3 — FILL EXISTING FORM DATA
        // ====================================================

        setFormData({
          petId: record.petId || "",

          weight:
            record.weight !== undefined &&
            record.weight !== null
              ? String(record.weight)
              : "",

          temperature:
            record.temperature !== undefined &&
            record.temperature !== null
              ? String(record.temperature)
              : "",

          illness:
            record.illness || "",

          medication:
            record.medication || "",

          veterinarian:
            record.veterinarian || "",

          visitDate:
            formatDateForInput(
              record.visitDate
            ),

          notes:
            record.notes || "",
        });

        // ====================================================
        // STEP 4 — SET PET
        // ====================================================

        // Prefer pet returned by backend

        if (petFromResponse) {
          setSelectedPet(petFromResponse);
        } else {
          // Otherwise find pet from pet list

          const matchingPet =
            petList.find(
              (pet) =>
                pet.id === record.petId
            );

          if (matchingPet) {
            setSelectedPet(matchingPet);
          }
        }

        return;
      }

      // ======================================================
      // STEP 5 — ADD MODE
      // ======================================================

      if (petList.length === 1) {
        setSelectedPet(petList[0]);

        setFormData((previous) => ({
          ...previous,
          petId: petList[0].id,
        }));
      }
    } catch (error: any) {
      console.log(
        "HEALTH RECORD FORM ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        "Error",
        "Unable to load the health record form."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UPDATE FORM FIELD
  // ==========================================================

  const updateField = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // ==========================================================
  // SELECT PET
  // ==========================================================

  const handlePetSelect = (pet: Pet) => {
    setSelectedPet(pet);

    setFormData((previous) => ({
      ...previous,
      petId: pet.id,
    }));

    setShowPetList(false);
  };

  // ==========================================================
  // VALIDATE FORM
  // ==========================================================

  const validateForm = () => {
    // --------------------------------------------------------
    // PET
    // --------------------------------------------------------

    if (!formData.petId) {
      Alert.alert(
        "Pet Required",
        "Please select a pet."
      );

      return false;
    }

    // --------------------------------------------------------
    // WEIGHT
    // --------------------------------------------------------

    if (!formData.weight.trim()) {
      Alert.alert(
        "Weight Required",
        "Please enter your pet's weight."
      );

      return false;
    }

    if (
      isNaN(Number(formData.weight)) ||
      Number(formData.weight) <= 0
    ) {
      Alert.alert(
        "Invalid Weight",
        "Please enter a valid weight."
      );

      return false;
    }

    // --------------------------------------------------------
    // TEMPERATURE
    // --------------------------------------------------------

    if (!formData.temperature.trim()) {
      Alert.alert(
        "Temperature Required",
        "Please enter your pet's temperature."
      );

      return false;
    }

    if (
      isNaN(Number(formData.temperature)) ||
      Number(formData.temperature) <= 0
    ) {
      Alert.alert(
        "Invalid Temperature",
        "Please enter a valid temperature."
      );

      return false;
    }

    // --------------------------------------------------------
    // ILLNESS
    // --------------------------------------------------------

    if (!formData.illness.trim()) {
      Alert.alert(
        "Illness Required",
        "Please enter the illness or health issue."
      );

      return false;
    }

    // --------------------------------------------------------
    // MEDICATION
    // --------------------------------------------------------

    if (!formData.medication.trim()) {
      Alert.alert(
        "Medication Required",
        "Please enter the medication."
      );

      return false;
    }

    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    if (!formData.visitDate.trim()) {
      Alert.alert(
        "Visit Date Required",
        "Please enter the visit date."
      );

      return false;
    }

    const date = new Date(
      formData.visitDate
    );

    if (isNaN(date.getTime())) {
      Alert.alert(
        "Invalid Date",
        "Please enter the date in YYYY-MM-DD format."
      );

      return false;
    }

    return true;
  };

  // ==========================================================
  // SAVE / UPDATE RECORD
  // ==========================================================

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // ======================================================
      // PREPARE PAYLOAD
      // ======================================================

      const payload = {
        petId: formData.petId,

        weight: Number(
          formData.weight
        ),

        temperature: Number(
          formData.temperature
        ),

        illness:
          formData.illness.trim(),

        medication:
          formData.medication.trim(),

        veterinarian:
          formData.veterinarian.trim(),

        visitDate: new Date(
          formData.visitDate
        ).toISOString(),

        notes:
          formData.notes.trim(),
      };

      console.log(
        "HEALTH RECORD PAYLOAD:",
        JSON.stringify(
          payload,
          null,
          2
        )
      );

      // ======================================================
      // EDIT EXISTING RECORD
      // ======================================================

      if (isEditMode && recordId) {
        console.log(
          "UPDATING RECORD:",
          recordId
        );

        const response =
          await updateHealthRecord(
            recordId,
            payload
          );

        console.log(
          "UPDATE RESPONSE:",
          JSON.stringify(
            response,
            null,
            2
          )
        );

        Alert.alert(
          "Updated Successfully",
          "Health record has been updated.",
          [
            {
              text: "OK",
              onPress: () => {
                router.back();
              },
            },
          ]
        );

        return;
      }

      // ======================================================
      // CREATE NEW RECORD
      // ======================================================

      console.log(
        "CREATING NEW HEALTH RECORD"
      );

      const response =
        await createHealthRecord(
          payload
        );

      console.log(
        "CREATE RESPONSE:",
        JSON.stringify(
          response,
          null,
          2
        )
      );

      Alert.alert(
        "Added Successfully",
        "Health record has been added.",
        [
          {
            text: "OK",
            onPress: () => {
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.log(
        "SAVE HEALTH RECORD ERROR:",
        error?.response?.data ||
          error?.message ||
          error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Something went wrong while saving the health record.";

      Alert.alert(
        "Unable to Save",
        message
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingIcon}>
          <HeartPulse
            size={30}
            color={COLORS.primary}
            strokeWidth={2}
          />
        </View>

        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loadingSpinner}
        />

        <Text style={styles.loadingText}>
          {isEditMode
            ? "Loading record..."
            : "Preparing form..."}
        </Text>
      </View>
    );
  }

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.75}
            onPress={() => router.back()}
          >
            <ArrowLeft
              size={21}
              color={COLORS.text}
              strokeWidth={2.2}
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              {isEditMode
                ? "Edit Health Record"
                : "Add Health Record"}
            </Text>

            <Text style={styles.subtitle}>
              {isEditMode
                ? "Update your pet's medical information"
                : "Record your pet's latest health information"}
            </Text>
          </View>
        </View>

        {/* ==================================================
            FORM CARD
        ================================================== */}

        <View style={styles.formCard}>

          {/* =================================================
              PET SELECTION
          ================================================= */}

          <Text style={styles.label}>
            Select Pet{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <TouchableOpacity
            style={[
              styles.selectInput,
              showPetList &&
                styles.selectInputActive,
            ]}
            activeOpacity={0.8}
            onPress={() =>
              setShowPetList(
                !showPetList
              )
            }
          >
            <View style={styles.inputIcon}>
              <HeartPulse
                size={19}
                color={COLORS.primary}
              />
            </View>

            <Text
              style={[
                styles.selectText,
                !selectedPet &&
                  styles.placeholderText,
              ]}
            >
              {selectedPet
                ? selectedPet.name
                : "Select a pet"}
            </Text>

            <ChevronDown
              size={20}
              color={
                COLORS.secondaryText
              }
            />
          </TouchableOpacity>

          {/* =================================================
              PET DROPDOWN
          ================================================= */}

          {showPetList && (
            <View
              style={styles.petDropdown}
            >
              {pets.length === 0 ? (
                <View
                  style={
                    styles.noPetsContainer
                  }
                >
                  <Text
                    style={
                      styles.noPetsText
                    }
                  >
                    No pets found. Please add
                    a pet first.
                  </Text>
                </View>
              ) : (
                pets.map((pet) => {
                  const isSelected =
                    selectedPet?.id ===
                    pet.id;

                  return (
                    <TouchableOpacity
                      key={pet.id}
                      style={[
                        styles.petOption,
                        isSelected &&
                          styles.petOptionSelected,
                      ]}
                      activeOpacity={0.75}
                      onPress={() =>
                        handlePetSelect(
                          pet
                        )
                      }
                    >
                      <View
                        style={[
                          styles.petOptionIcon,
                          isSelected &&
                            styles.petOptionIconSelected,
                        ]}
                      >
                        <HeartPulse
                          size={17}
                          color={
                            isSelected
                              ? COLORS.white
                              : COLORS.primary
                          }
                        />
                      </View>

                      <View
                        style={
                          styles.petOptionText
                        }
                      >
                        <Text
                          style={
                            styles.petOptionName
                          }
                        >
                          {pet.name}
                        </Text>

                        {(pet.species ||
                          pet.breed) && (
                          <Text
                            style={
                              styles.petOptionDetails
                            }
                          >
                            {pet.species ||
                              ""}

                            {pet.species &&
                            pet.breed
                              ? " • "
                              : ""}

                            {pet.breed ||
                              ""}
                          </Text>
                        )}
                      </View>

                      {isSelected && (
                        <Check
                          size={19}
                          color={
                            COLORS.primary
                          }
                          strokeWidth={
                            2.5
                          }
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              )}
            </View>
          )}

          {/* =================================================
              WEIGHT
          ================================================= */}

          <FormField
            label="Weight"
            required
            icon={
              <Weight
                size={19}
                color={COLORS.primary}
              />
            }
            placeholder="Enter weight"
            value={formData.weight}
            onChangeText={(value) =>
              updateField(
                "weight",
                value
              )
            }
            keyboardType="decimal-pad"
            suffix="kg"
          />

          {/* =================================================
              TEMPERATURE
          ================================================= */}

          <FormField
            label="Temperature"
            required
            icon={
              <Thermometer
                size={19}
                color={COLORS.primary}
              />
            }
            placeholder="Enter temperature"
            value={
              formData.temperature
            }
            onChangeText={(value) =>
              updateField(
                "temperature",
                value
              )
            }
            keyboardType="decimal-pad"
            suffix="°C"
          />

          {/* =================================================
              ILLNESS
          ================================================= */}

          <FormField
            label="Illness / Health Issue"
            required
            icon={
              <Activity
                size={19}
                color={COLORS.primary}
              />
            }
            placeholder="e.g. Fever, skin infection"
            value={formData.illness}
            onChangeText={(value) =>
              updateField(
                "illness",
                value
              )
            }
          />

          {/* =================================================
              MEDICATION
          ================================================= */}

          <FormField
            label="Medication"
            required
            icon={
              <Pill
                size={19}
                color={COLORS.primary}
              />
            }
            placeholder="Enter medication"
            value={
              formData.medication
            }
            onChangeText={(value) =>
              updateField(
                "medication",
                value
              )
            }
          />

          {/* =================================================
              VETERINARIAN
          ================================================= */}

          <FormField
            label="Veterinarian"
            icon={
              <Stethoscope
                size={19}
                color={COLORS.primary}
              />
            }
            placeholder="Enter veterinarian name"
            value={
              formData.veterinarian
            }
            onChangeText={(value) =>
              updateField(
                "veterinarian",
                value
              )
            }
          />

          {/* =================================================
              VISIT DATE
          ================================================= */}

          <Text style={styles.label}>
            Visit Date{" "}
            <Text style={styles.required}>
              *
            </Text>
          </Text>

          <View
            style={styles.inputWrapper}
          >
            <View style={styles.inputIcon}>
              <CalendarDays
                size={19}
                color={COLORS.primary}
              />
            </View>

            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#AAA7B3"
              value={
                formData.visitDate
              }
              onChangeText={(value) =>
                updateField(
                  "visitDate",
                  value
                )
              }
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />
          </View>

          <Text
            style={styles.helperText}
          >
            Enter date in YYYY-MM-DD format
          </Text>

          {/* =================================================
              NOTES
          ================================================= */}

          <Text style={styles.label}>
            Notes
          </Text>

          <View
            style={[
              styles.inputWrapper,
              styles.textAreaWrapper,
            ]}
          >
            <View
              style={[
                styles.inputIcon,
                styles.textAreaIcon,
              ]}
            >
              <FileText
                size={19}
                color={COLORS.primary}
              />
            </View>

            <TextInput
              style={[
                styles.input,
                styles.textArea,
              ]}
              placeholder="Add any additional notes..."
              placeholderTextColor="#AAA7B3"
              value={formData.notes}
              onChangeText={(value) =>
                updateField(
                  "notes",
                  value
                )
              }
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* =================================================
              SAVE / UPDATE BUTTON
          ================================================= */}

          <TouchableOpacity
            style={[
              styles.saveButton,
              saving &&
                styles.saveButtonDisabled,
            ]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator
                color={
                  COLORS.white
                }
                size="small"
              />
            ) : (
              <>
                <Check
                  size={20}
                  color={
                    COLORS.white
                  }
                  strokeWidth={2.5}
                />

                <Text
                  style={
                    styles.saveButtonText
                  }
                >
                  {isEditMode
                    ? "Update Health Record"
                    : "Save Health Record"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* ==================================================
            BOTTOM SPACE
        ================================================== */}

        <View
          style={styles.bottomSpace}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ============================================================
// REUSABLE FORM FIELD
// ============================================================

interface FormFieldProps {
  label: string;
  required?: boolean;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: any;
  suffix?: string;
}

const FormField = ({
  label,
  required = false,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  suffix,
}: FormFieldProps) => {
  return (
    <>
      {/* LABEL */}

      <Text style={styles.label}>
        {label}{" "}
        {required && (
          <Text
            style={styles.required}
          >
            *
          </Text>
        )}
      </Text>

      {/* INPUT */}

      <View
        style={styles.inputWrapper}
      >
        <View
          style={styles.inputIcon}
        >
          {icon}
        </View>

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#AAA7B3"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
        />

        {suffix && (
          <Text
            style={styles.suffix}
          >
            {suffix}
          </Text>
        )}
      </View>
    </>
  );
};

// ============================================================
// DATE HELPERS
// ============================================================

function formatToday() {
  const date = new Date();

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================
// FORMAT DATABASE DATE FOR INPUT
// ============================================================

function formatDateForInput(
  dateString?: string
) {
  if (!dateString) {
    return formatToday();
  }

  const date = new Date(
    dateString
  );

  if (isNaN(date.getTime())) {
    return formatToday();
  }

  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({

  // ==========================================================
  // MAIN CONTAINER
  // ==========================================================

  container: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor:
      COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 12,
    color:
      COLORS.secondaryText,
    marginTop: 4,
    lineHeight: 18,
  },

  // ==========================================================
  // FORM CARD
  // ==========================================================

  formCard: {
    backgroundColor:
      COLORS.white,
    borderRadius: 24,
    padding: 18,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // ==========================================================
  // LABEL
  // ==========================================================

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.label,
    marginBottom: 8,
    marginTop: 17,
  },

  required: {
    color: COLORS.red,
  },

  // ==========================================================
  // INPUT
  // ==========================================================

  inputWrapper: {
    minHeight: 52,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    backgroundColor:
      COLORS.white,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  inputIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",
    justifyContent: "center",

    marginRight: 9,
  },

  input: {
    flex: 1,
    height: 50,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 0,
  },

  suffix: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    marginLeft: 6,
  },

  helperText: {
    fontSize: 10,
    color:
      COLORS.secondaryText,
    marginTop: 5,
    marginLeft: 3,
  },

  // ==========================================================
  // PET SELECT
  // ==========================================================

  selectInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    backgroundColor:
      COLORS.white,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  selectInputActive: {
    borderColor:
      COLORS.primary,
  },

  selectText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },

  placeholderText: {
    color: "#AAA7B3",
    fontWeight: "400",
  },

  // ==========================================================
  // PET DROPDOWN
  // ==========================================================

  petDropdown: {
    marginTop: 8,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor:
      COLORS.white,
  },

  petOption: {
    minHeight: 60,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,

    borderBottomWidth: 1,
    borderBottomColor:
      "#F1EFF5",
  },

  petOptionSelected: {
    backgroundColor:
      "#FAF9FE",
  },

  petOptionIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",
    justifyContent: "center",
  },

  petOptionIconSelected: {
    backgroundColor:
      COLORS.primary,
  },

  petOptionText: {
    flex: 1,
    marginLeft: 10,
  },

  petOptionName: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
  },

  petOptionDetails: {
    fontSize: 10,
    color:
      COLORS.secondaryText,
    marginTop: 3,
  },

  noPetsContainer: {
    padding: 18,
    alignItems: "center",
  },

  noPetsText: {
    fontSize: 12,
    color:
      COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 18,
  },

  // ==========================================================
  // TEXT AREA
  // ==========================================================

  textAreaWrapper: {
    minHeight: 120,
    alignItems: "flex-start",
    paddingTop: 10,
  },

  textAreaIcon: {
    marginTop: 1,
  },

  textArea: {
    height: 100,
    paddingTop: 5,
  },

  // ==========================================================
  // SAVE BUTTON
  // ==========================================================

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor:
      COLORS.primary,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 8,

    marginTop: 25,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 7,
    elevation: 4,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },

  // ==========================================================
  // LOADING
  // ==========================================================

  loadingContainer: {
    flex: 1,
    backgroundColor:
      COLORS.background,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingIcon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingSpinner: {
    marginTop: 18,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color:
      COLORS.secondaryText,
  },

  // ==========================================================
  // BOTTOM SPACE
  // ==========================================================

  bottomSpace: {
    height: 100,
  },
});