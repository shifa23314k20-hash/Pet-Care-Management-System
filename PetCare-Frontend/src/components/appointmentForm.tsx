import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Picker,
} from "@react-native-picker/picker";

import {
  CalendarDays,
  Clock3,
  Bell,
} from "lucide-react-native";

import {
  getPetsByUserId,
} from "@/services/pet";


// =====================================================
// TYPES
// =====================================================

export interface AppointmentFormValues {
  title: string;
  petId: string;
  type: string;
  date: string;
  time: string;
  notes: string;
  reminderEnabled: boolean;
  status: string;
}


interface Pet {
  id: string;
  name: string;
}


interface AppointmentFormProps {
  initialValues?: Partial<AppointmentFormValues>;

  buttonTitle: string;

  loading?: boolean;

  onSubmit: (
    values: AppointmentFormValues
  ) => void;
}


// =====================================================
// CONSTANTS
// =====================================================

const PRIMARY = "#6C5DD3";


// =====================================================
// COMPONENT
// =====================================================

export default function AppointmentForm({
  initialValues,
  buttonTitle,
  loading = false,
  onSubmit,
}: AppointmentFormProps) {

  const [pets, setPets] =
    useState<Pet[]>([]);

  const [loadingPets, setLoadingPets] =
    useState(true);


  const [values, setValues] =
    useState<AppointmentFormValues>({
      title: "",
      petId: "",
      type: "vet",
      date: "",
      time: "",
      notes: "",
      reminderEnabled: true,
      status: "upcoming",
    });


  // =====================================================
  // INITIAL VALUES
  // =====================================================

  useEffect(() => {

    if (initialValues) {

      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }));

    }

  }, [initialValues]);


  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (
    key: keyof AppointmentFormValues,
    value: any
  ) => {

    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));

  };


  // =====================================================
  // FETCH PETS
  // =====================================================

  useEffect(() => {

    fetchPets();

  }, []);


  const fetchPets = async () => {

    try {

      setLoadingPets(true);


      const response =
        await getPetsByUserId();


      console.log(
        "APPOINTMENT PETS:",
        response
      );


      setPets(
        response?.pets ||
        response?.data?.pets ||
        []
      );

    } catch (error: any) {

      console.log(
        "FETCH PETS ERROR:",
        error?.response?.data ||
        error?.message
      );

      setPets([]);

    } finally {

      setLoadingPets(false);

    }

  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = () => {

    if (!values.title.trim()) {

      alert(
        "Please enter an appointment title."
      );

      return;
    }


    if (!values.petId) {

      alert(
        "Please select a pet."
      );

      return;
    }


    if (!values.date) {

      alert(
        "Please enter the appointment date."
      );

      return;
    }


    if (!values.time) {

      alert(
        "Please enter the appointment time."
      );

      return;
    }


    onSubmit(values);

  };


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={
        styles.container
      }
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      {/* =================================================
          APPOINTMENT TITLE
      ================================================= */}

      <Text
        style={styles.label}
      >
        Appointment Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Annual Vet Checkup"
        placeholderTextColor="#A3A1AD"
        value={values.title}
        onChangeText={(text) =>
          handleChange(
            "title",
            text
          )
        }
      />


      {/* =================================================
          PET
      ================================================= */}

      <Text
        style={styles.label}
      >
        Select Pet
      </Text>

      <View
        style={styles.dropdown}
      >

        {loadingPets ? (

          <View
            style={
              styles.pickerLoading
            }
          >

            <ActivityIndicator
              size="small"
              color={PRIMARY}
            />

            <Text
              style={
                styles.loadingText
              }
            >
              Loading pets...
            </Text>

          </View>

        ) : pets.length === 0 ? (

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
              No pets available
            </Text>

          </View>

        ) : (

          <Picker
            selectedValue={
              values.petId
            }
            onValueChange={(
              value
            ) =>
              handleChange(
                "petId",
                value
              )
            }
            style={
              styles.picker
            }
          >

            <Picker.Item
              label="Select your pet"
              value=""
            />

            {pets.map(
              (pet) => (

                <Picker.Item
                  key={pet.id}
                  label={pet.name}
                  value={pet.id}
                />

              )
            )}

          </Picker>

        )}

      </View>


      {/* =================================================
          APPOINTMENT TYPE
      ================================================= */}

      <Text
        style={styles.label}
      >
        Appointment Type
      </Text>

      <View
        style={styles.dropdown}
      >

        <Picker
          selectedValue={
            values.type
          }
          onValueChange={(
            value
          ) =>
            handleChange(
              "type",
              value
            )
          }
          style={
            styles.picker
          }
        >

          <Picker.Item
            label="Vet Visit"
            value="vet"
          />

          <Picker.Item
            label="Vaccination"
            value="vaccination"
          />

          <Picker.Item
            label="Checkup"
            value="checkup"
          />

          <Picker.Item
            label="Grooming"
            value="grooming"
          />

          <Picker.Item
            label="Training"
            value="training"
          />

          <Picker.Item
            label="Other"
            value="other"
          />

        </Picker>

      </View>


      {/* =================================================
          DATE + TIME
      ================================================= */}

      <View
        style={styles.twoColumn}
      >

        {/* DATE */}

        <View
          style={styles.column}
        >

          <Text
            style={styles.label}
          >
            Date
          </Text>

          <View
            style={
              styles.iconInputContainer
            }
          >

            <CalendarDays
              size={18}
              color="#9997A5"
            />

            <TextInput
              style={
                styles.iconInput
              }
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#A3A1AD"
              value={values.date}
              onChangeText={(
                text
              ) =>
                handleChange(
                  "date",
                  text
                )
              }
            />

          </View>

        </View>


        {/* TIME */}

        <View
          style={styles.column}
        >

          <Text
            style={styles.label}
          >
            Time
          </Text>

          <View
            style={
              styles.iconInputContainer
            }
          >

            <Clock3
              size={18}
              color="#9997A5"
            />

            <TextInput
              style={
                styles.iconInput
              }
              placeholder="HH:MM"
              placeholderTextColor="#A3A1AD"
              value={values.time}
              onChangeText={(
                text
              ) =>
                handleChange(
                  "time",
                  text
                )
              }
            />

          </View>

        </View>

      </View>


      {/* =================================================
          NOTES
      ================================================= */}

      <Text
        style={styles.label}
      >
        Notes
      </Text>

      <TextInput
        style={
          styles.notesInput
        }
        placeholder="Add any important information about this appointment..."
        placeholderTextColor="#A3A1AD"
        multiline
        textAlignVertical="top"
        value={values.notes}
        onChangeText={(
          text
        ) =>
          handleChange(
            "notes",
            text
          )
        }
      />


      {/* =================================================
          REMINDER
      ================================================= */}

      <Text
        style={styles.label}
      >
        Reminder
      </Text>

      <View
        style={styles.reminderRow}
      >

        {/* YES */}

        <TouchableOpacity
          style={[
            styles.optionButton,

            values.reminderEnabled &&
              styles.optionSelected,
          ]}
          onPress={() =>
            handleChange(
              "reminderEnabled",
              true
            )
          }
          activeOpacity={0.8}
        >

          <Bell
            size={18}
            color={
              values.reminderEnabled
                ? PRIMARY
                : "#777582"
            }
          />

          <Text
            style={[
              styles.optionText,

              values.reminderEnabled &&
                styles.optionSelectedText,
            ]}
          >
            Yes
          </Text>

        </TouchableOpacity>


        {/* NO */}

        <TouchableOpacity
          style={[
            styles.optionButton,

            !values.reminderEnabled &&
              styles.optionSelected,
          ]}
          onPress={() =>
            handleChange(
              "reminderEnabled",
              false
            )
          }
          activeOpacity={0.8}
        >

          <Text
            style={[
              styles.optionText,

              !values.reminderEnabled &&
                styles.optionSelectedText,
            ]}
          >
            No
          </Text>

        </TouchableOpacity>

      </View>


      {/* =================================================
          STATUS
      ================================================= */}

      <Text
        style={styles.label}
      >
        Appointment Status
      </Text>

      <View
        style={styles.dropdown}
      >

        <Picker
          selectedValue={
            values.status
          }
          onValueChange={(
            value
          ) =>
            handleChange(
              "status",
              value
            )
          }
          style={
            styles.picker
          }
        >

          <Picker.Item
            label="Upcoming"
            value="upcoming"
          />

          <Picker.Item
            label="Completed"
            value="completed"
          />

          <Picker.Item
            label="Cancelled"
            value="cancelled"
          />

        </Picker>

      </View>


      {/* =================================================
          SUBMIT BUTTON
      ================================================= */}

      <TouchableOpacity
        style={styles.button}
        onPress={
          handleSubmit
        }
        disabled={
          loading
        }
        activeOpacity={0.85}
      >

        {loading ? (

          <ActivityIndicator
            color="#FFFFFF"
          />

        ) : (

          <Text
            style={
              styles.buttonText
            }
          >
            {buttonTitle}
          </Text>

        )}

      </TouchableOpacity>


      <View
        style={{
          height: 30,
        }}
      />

    </ScrollView>

  );
}


// =====================================================
// STYLES
// =====================================================

const styles =
  StyleSheet.create({

    scroll: {
      flex: 1,
    },


    container: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },


    // ===================================================
    // LABEL
    // ===================================================

    label: {
      fontSize: 13,

      fontWeight: "700",

      color: "#454350",

      marginBottom: 7,
    },


    // ===================================================
    // INPUT
    // ===================================================

    input: {
      height: 52,

      backgroundColor: "#FFFFFF",

      borderWidth: 1,

      borderColor: "#E8E6EF",

      borderRadius: 14,

      paddingHorizontal: 15,

      fontSize: 14,

      color: "#292735",

      marginBottom: 15,
    },


    // ===================================================
    // DROPDOWN
    // ===================================================

    dropdown: {
      height: 52,

      backgroundColor: "#FFFFFF",

      borderWidth: 1,

      borderColor: "#E8E6EF",

      borderRadius: 14,

      overflow: "hidden",

      marginBottom: 15,
    },


    picker: {
      color: "#292735",
    },


    pickerLoading: {
      flex: 1,

      flexDirection: "row",

      alignItems: "center",

      justifyContent: "center",

      gap: 8,
    },


    loadingText: {
      fontSize: 13,

      color: "#9997A5",
    },


    noPetsContainer: {
      flex: 1,

      alignItems: "center",

      justifyContent: "center",
    },


    noPetsText: {
      fontSize: 13,

      color: "#9997A5",
    },


    // ===================================================
    // DATE + TIME
    // ===================================================

    twoColumn: {
      flexDirection: "row",

      gap: 12,
    },


    column: {
      flex: 1,
    },


    iconInputContainer: {
      height: 52,

      backgroundColor: "#FFFFFF",

      borderWidth: 1,

      borderColor: "#E8E6EF",

      borderRadius: 14,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 13,

      marginBottom: 15,
    },


    iconInput: {
      flex: 1,

      marginLeft: 8,

      fontSize: 13,

      color: "#292735",

      paddingVertical: 0,
    },


    // ===================================================
    // NOTES
    // ===================================================

    notesInput: {
      minHeight: 95,

      backgroundColor: "#FFFFFF",

      borderWidth: 1,

      borderColor: "#E8E6EF",

      borderRadius: 14,

      padding: 14,

      fontSize: 14,

      color: "#292735",

      marginBottom: 20,
    },


    // ===================================================
    // REMINDER
    // ===================================================

    reminderRow: {
      flexDirection: "row",

      gap: 12,

      marginBottom: 15,
    },


    optionButton: {
      flex: 1,

      height: 50,

      borderRadius: 14,

      borderWidth: 1,

      borderColor: "#E8E6EF",

      backgroundColor: "#FFFFFF",

      alignItems: "center",

      justifyContent: "center",

      flexDirection: "row",

      gap: 7,
    },


    optionSelected: {
      backgroundColor: "#F0EDFF",

      borderColor: PRIMARY,
    },


    optionText: {
      fontSize: 14,

      fontWeight: "600",

      color: "#666471",
    },


    optionSelectedText: {
      color: PRIMARY,
    },


    // ===================================================
    // BUTTON
    // ===================================================

    button: {
      height: 54,

      backgroundColor: PRIMARY,

      borderRadius: 15,

      alignItems: "center",

      justifyContent: "center",

      marginTop: 5,

      shadowColor: PRIMARY,

      shadowOffset: {
        width: 0,

        height: 5,
      },

      shadowOpacity: 0.2,

      shadowRadius: 8,

      elevation: 4,
    },


    buttonText: {
      color: "#FFFFFF",

      fontSize: 15,

      fontWeight: "800",
    },

  });