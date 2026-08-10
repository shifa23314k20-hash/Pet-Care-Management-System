import React, { useEffect, useState } from "react";
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

import { getPetsByUserId } from "@/services/pet";

interface Pet {
  id: string;
  name: string;
  breed?: string;
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
  const isEditMode = vaccination !== null;

  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [selectedPetId, setSelectedPetId] = useState("");

  const [vaccineName, setVaccineName] = useState("");
  const [dateGiven, setDateGiven] = useState("");
  const [nextDueDate, setNextDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [reminderEnabled, setReminderEnabled] = useState(false);

  const [loading, setLoading] = useState(false);

  /*
   * Get pets belonging to the logged-in user
   */
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setPetsLoading(true);

        const response = await getPetsByUserId(userId);

        console.log("Pets response:", response);

        if (response.success) {
          setPets(response.pets || []);
        } else {
          setPets([]);
        }
      } catch (error) {
        console.log("Fetch pets error:", error);

        Alert.alert(
          "Error",
          "Unable to load your pets."
        );
      } finally {
        setPetsLoading(false);
      }
    };

    if (userId) {
      fetchPets();
    }
  }, [userId]);

  /*
   * Load existing vaccination when editing
   */
  useEffect(() => {
    if (vaccination) {
      setSelectedPetId(vaccination.petId || "");

      setVaccineName(
        vaccination.vaccineName || ""
      );

      setDateGiven(
        vaccination.dateGiven
          ? formatDateForInput(vaccination.dateGiven)
          : ""
      );

      setNextDueDate(
        vaccination.nextDueDate
          ? formatDateForInput(vaccination.nextDueDate)
          : ""
      );

      setNotes(vaccination.notes || "");

      setReminderEnabled(
        vaccination.reminderEnabled || false
      );
    } else {
      resetForm();
    }
  }, [vaccination]);

  /*
   * Convert API date into DD/MM/YYYY
   */
  const formatDateForInput = (date: string) => {
    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return "";
    }

    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const year = parsedDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  /*
   * Convert DD/MM/YYYY into Date
   */
  const parseDate = (dateString: string) => {
    const parts = dateString.split("/");

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

    /*
     * Prevent invalid dates such as 31/02/2026
     */
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  /*
   * Format date input while typing
   */
  const handleDateChange = (
    value: string,
    setter: (value: string) => void
  ) => {
    const numbersOnly = value.replace(/\D/g, "");

    let formatted = numbersOnly;

    if (numbersOnly.length > 2) {
      formatted =
        numbersOnly.substring(0, 2) +
        "/" +
        numbersOnly.substring(2);
    }

    if (numbersOnly.length > 4) {
      formatted =
        numbersOnly.substring(0, 2) +
        "/" +
        numbersOnly.substring(2, 4) +
        "/" +
        numbersOnly.substring(4, 8);
    }

    setter(formatted);
  };

  /*
   * Reset form
   */
  const resetForm = () => {
    setSelectedPetId("");
    setVaccineName("");
    setDateGiven("");
    setNextDueDate("");
    setNotes("");
    setReminderEnabled(false);
    setDropdownVisible(false);
  };

  /*
   * Selected pet object
   */
  const selectedPet = pets.find(
    (pet) => pet.id === selectedPetId
  );

  /*
   * Save vaccination
   */
  const handleSubmit = async () => {
    /*
     * Pet validation
     */
    if (!selectedPetId) {
      Alert.alert(
        "Pet Required",
        "Please select a pet."
      );
      return;
    }

    if (!vaccineName.trim()) {
      Alert.alert(
        "Required",
        "Please enter the vaccine name."
      );
      return;
    }

    if (!dateGiven.trim()) {
      Alert.alert(
        "Required",
        "Please enter the date the vaccine was given."
      );
      return;
    }

    const givenDate = parseDate(dateGiven);

    if (!givenDate) {
      Alert.alert(
        "Invalid Date",
        "Please enter a valid date in DD/MM/YYYY format."
      );
      return;
    }

    let dueDate: Date | null = null;

    if (nextDueDate.trim()) {
      dueDate = parseDate(nextDueDate);

      if (!dueDate) {
        Alert.alert(
          "Invalid Date",
          "Please enter a valid next due date in DD/MM/YYYY format."
        );
        return;
      }

      if (dueDate < givenDate) {
        Alert.alert(
          "Invalid Date",
          "Next due date cannot be before the date given."
        );
        return;
      }
    }

    try {
      setLoading(true);

      const vaccinationData = {
        userId,
        petId: selectedPetId,
        vaccineName: vaccineName.trim(),
        dateGiven: givenDate.toISOString(),
        nextDueDate: dueDate
          ? dueDate.toISOString()
          : null,
        notes: notes.trim(),
        reminderEnabled,
      };

      console.log(
        isEditMode
          ? "Updating vaccination:"
          : "Creating vaccination:",
        vaccinationData
      );

      if (isEditMode) {
        await updateVaccination(
          vaccination.id,
          vaccinationData
        );

        Alert.alert(
          "Success",
          "Vaccination updated successfully.",
          [
            {
              text: "OK",
              onPress: onClose,
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
              onPress: onClose,
            },
          ]
        );
      }
    } catch (error: any) {
      console.log(
        "Vaccination save error:",
        error?.response?.data || error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Unable to save vaccination."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.modalContainer}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <View style={styles.modalContent}>

        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              {isEditMode
                ? "Edit Vaccination"
                : "Add Vaccination"}
            </Text>

            <Text style={styles.subtitle}>
              {isEditMode
                ? "Update your pet's vaccination record"
                : "Keep track of your pet's vaccination"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <X
              size={22}
              color="#6B7280"
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
          keyboardShouldPersistTaps="handled"
        >

          {/* PET DROPDOWN */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Select Pet
            </Text>

            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() =>
                !petsLoading &&
                setDropdownVisible(
                  !dropdownVisible
                )
              }
              activeOpacity={0.8}
            >
              <PawPrint
                size={20}
                color="#6C63FF"
              />

              <View style={styles.petSelectedContent}>
                {petsLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="#6C63FF"
                  />
                ) : (
                  <Text
                    style={[
                      styles.input,
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
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>

            {/* Dropdown */}

            {dropdownVisible && (
              <View style={styles.dropdown}>
                {pets.length === 0 ? (
                  <Text style={styles.noPetsText}>
                    No pets found.
                  </Text>
                ) : (
                  pets.map((pet) => (
                    <TouchableOpacity
                      key={pet.id}
                      style={[
                        styles.petOption,
                        selectedPetId === pet.id &&
                          styles.selectedPetOption,
                      ]}
                      onPress={() => {
                        setSelectedPetId(
                          pet.id
                        );
                        setDropdownVisible(false);
                      }}
                    >
                      <View
                        style={
                          styles.petOptionIcon
                        }
                      >
                        <PawPrint
                          size={18}
                          color="#6C63FF"
                        />
                      </View>

                      <View>
                        <Text
                          style={
                            styles.petOptionName
                          }
                        >
                          {pet.name}
                        </Text>

                        {pet.breed && (
                          <Text
                            style={
                              styles.petOptionBreed
                            }
                          >
                            {pet.breed}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          {/* Vaccine Name */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Vaccine Name
            </Text>

            <View style={styles.inputContainer}>
              <Syringe
                size={20}
                color="#6C63FF"
              />

              <TextInput
                style={styles.input}
                value={vaccineName}
                onChangeText={setVaccineName}
                placeholder="e.g. Rabies, DHPP, Bordetella"
                placeholderTextColor="#A1A1AA"
              />
            </View>
          </View>

          {/* Date Given */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Date Given
            </Text>

            <View style={styles.inputContainer}>
              <CalendarDays
                size={20}
                color="#6C63FF"
              />

              <TextInput
                style={styles.input}
                value={dateGiven}
                onChangeText={(value) =>
                  handleDateChange(
                    value,
                    setDateGiven
                  )
                }
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#A1A1AA"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Next Due Date */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Next Due Date
              <Text style={styles.optional}>
                {" "}
                (Optional)
              </Text>
            </Text>

            <View style={styles.inputContainer}>
              <CalendarDays
                size={20}
                color="#6C63FF"
              />

              <TextInput
                style={styles.input}
                value={nextDueDate}
                onChangeText={(value) =>
                  handleDateChange(
                    value,
                    setNextDueDate
                  )
                }
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#A1A1AA"
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Notes */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              Notes
              <Text style={styles.optional}>
                {" "}
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
                size={20}
                color="#6C63FF"
              />

              <TextInput
                style={[
                  styles.input,
                  styles.notesInput,
                ]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional information..."
                placeholderTextColor="#A1A1AA"
                multiline
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Reminder */}

          <View style={styles.reminderCard}>
            <View style={styles.reminderIcon}>
              <Bell
                size={20}
                color="#6C63FF"
              />
            </View>

            <View style={styles.reminderContent}>
              <Text style={styles.reminderTitle}>
                Vaccination Reminder
              </Text>

              <Text style={styles.reminderSubtitle}>
                Get reminded when this vaccination is due
              </Text>
            </View>

            <Switch
              value={reminderEnabled}
              onValueChange={
                setReminderEnabled
              }
              trackColor={{
                false: "#D9D9E2",
                true: "#BDB6F4",
              }}
              thumbColor={
                reminderEnabled
                  ? "#6C63FF"
                  : "#FFFFFF"
              }
            />
          </View>

          {/* Buttons */}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
              disabled={loading}
            >
              <Text style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                loading &&
                  styles.disabledButton,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Text style={styles.saveText}>
                {loading
                  ? "Saving..."
                  : isEditMode
                  ? "Update Vaccination"
                  : "Save Vaccination"}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#F5F6FB",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "92%",
    paddingTop: 22,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },

  subtitle: {
    fontSize: 13,
    color: "#8B8B9A",
    marginTop: 4,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },

  optional: {
    fontWeight: "400",
    color: "#A1A1AA",
  },

  inputContainer: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    marginLeft: 11,
    fontSize: 15,
    color: "#333333",
    paddingVertical: 14,
  },

  placeholderText: {
    color: "#A1A1AA",
  },

  petSelectedContent: {
    flex: 1,
  },

  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  petOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F5",
  },

  selectedPetOption: {
    backgroundColor: "#F3F1FF",
  },

  petOptionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F1FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  petOptionName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },

  petOptionBreed: {
    fontSize: 12,
    color: "#8B8B9A",
    marginTop: 2,
  },

  noPetsText: {
    textAlign: "center",
    paddingVertical: 18,
    color: "#9CA3AF",
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
    backgroundColor: "#F3F1FF",
    borderRadius: 18,
    padding: 15,
    marginBottom: 22,
  },

  reminderIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  reminderContent: {
    flex: 1,
    paddingRight: 8,
  },

  reminderTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333333",
  },

  reminderSubtitle: {
    fontSize: 12,
    color: "#7C7C89",
    marginTop: 3,
    lineHeight: 17,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 2,
  },

  cancelButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },

  saveButton: {
    flex: 1,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});