import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getPetsByUserId } from "@/services/pet";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  onSubmit: (values: AppointmentFormValues) => void;
}


const PRIMARY = "#7C5CFC";

export default function AppointmentForm({
  initialValues,
  buttonTitle,
  loading = false,
  onSubmit,
}: AppointmentFormProps) {
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [values, setValues] = useState<AppointmentFormValues>({
    title: "",
    petId: "",
    type: "vet",
    date: "",
    time: "",
    notes: "",
    reminderEnabled: true,
    status: "upcoming",
  });

  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
      }));
    }
  }, [initialValues]);

  const handleChange = (
    key: keyof AppointmentFormValues,
    value: any
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      setLoadingPets(true);

      const user = await AsyncStorage.getItem("user");
      if (!user) return;

      const parsedUser = JSON.parse(user);

      const response = await getPetsByUserId(parsedUser.id);

      setPets(
        response?.pets ||
        response?.data?.pets ||
        []
      );
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingPets(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Appointment Title */}
      <TextInput
        placeholder="Appointment Title"
        style={styles.input}
        value={values.title}
        onChangeText={(text) => handleChange("title", text)}
      />

      {/* Pet */}
      <View style={styles.dropdown}>
        {loadingPets ? (
          <ActivityIndicator color={PRIMARY} />
        ) : (
          <Picker
            selectedValue={values.petId}
            onValueChange={(value) =>
              handleChange("petId", value)
            }
          >
            <Picker.Item
              label="Select Pet"
              value=""
            />

            {pets.map((pet) => (
              <Picker.Item
                key={pet.id}
                label={pet.name}
                value={pet.id}
              />
            ))}
          </Picker>
        )}
      </View>

      {/* Appointment Type */}
      <View style={[styles.dropdown, { marginTop: 16 }]}>
        <Picker
          selectedValue={values.type}
          onValueChange={(value) =>
            handleChange("type", value)
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

      {/* Date & Time */}
      <View style={styles.row}>
        <TextInput
          placeholder="YYYY-MM-DD"
          style={[styles.input, styles.flex]}
          value={values.date}
          onChangeText={(text) =>
            handleChange("date", text)
          }
        />

        <TextInput
          placeholder="HH:MM"
          style={[styles.input, styles.flex]}
          value={values.time}
          onChangeText={(text) =>
            handleChange("time", text)
          }
        />
      </View>

      {/* Notes */}
      <TextInput
        placeholder="Notes"
        multiline
        numberOfLines={4}
        style={styles.notes}
        value={values.notes}
        onChangeText={(text) =>
          handleChange("notes", text)
        }
      />

      {/* Reminder */}
      <Text style={styles.label}>
        Reminder
      </Text>

      <View style={styles.optionRow}>
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
        >
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

      {/* Status */}
      <View style={[styles.dropdown, { marginBottom: 24 }]}>
        <Picker
          selectedValue={values.status}
          onValueChange={(value) =>
            handleChange("status", value)
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

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={() => onSubmit(values)}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {buttonTitle}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
    fontSize: 15,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  row: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  flex: {
    flex: 1,
  },

  notes: {
    minHeight: 110,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },

  optionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  optionButton: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
  },

  optionSelected: {
    backgroundColor: "#F3EFFF",
    borderColor: PRIMARY,
  },

  optionText: {
    fontWeight: "600",
    color: "#444",
  },

  optionSelectedText: {
    color: PRIMARY,
  },

  button: {
    height: 55,
    borderRadius: 14,
    backgroundColor: PRIMARY,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});