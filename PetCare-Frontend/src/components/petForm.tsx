import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from "react-native";

interface PetFormValues {
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  healthInfo: string;
  petImage: string;
}

interface PetFormProps {
  initialValues?: Partial<PetFormValues>;
  buttonTitle: string;
  loading?: boolean;
  onSubmit: (values: PetFormValues) => void;
}

export default function PetForm({
  initialValues,
  buttonTitle,
  loading = false,
  onSubmit,
}: PetFormProps) {
  const [values, setValues] = useState<PetFormValues>({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    weight: "",
    healthInfo: "",
    petImage: "",
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
    key: keyof PetFormValues,
    value: string
  ) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.container}
    >

      <TextInput
        placeholder="Pet Name"
        style={styles.input}
        value={values.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <TextInput
        placeholder="Pet Type"
        style={styles.input}
        value={values.type}
        onChangeText={(text) => handleChange("type", text)}
      />

      <TextInput
        placeholder="Breed"
        style={styles.input}
        value={values.breed}
        onChangeText={(text) => handleChange("breed", text)}
      />

      <TextInput
        placeholder="Age"
        keyboardType="numeric"
        style={styles.input}
        value={values.age}
        onChangeText={(text) => handleChange("age", text)}
      />

      <TextInput
        placeholder="Gender"
        style={styles.input}
        value={values.gender}
        onChangeText={(text) => handleChange("gender", text)}
      />

      <TextInput
        placeholder="Weight (kg)"
        keyboardType="numeric"
        style={styles.input}
        value={values.weight}
        onChangeText={(text) => handleChange("weight", text)}
      />

      <TextInput
        placeholder="Health Information"
        multiline
        textAlignVertical="top"
        style={[styles.input, styles.textArea]}
        value={values.healthInfo}
        onChangeText={(text) => handleChange("healthInfo", text)}
      />

      <TextInput
        placeholder="Image URL"
        style={styles.input}
        value={values.petImage}
        onChangeText={(text) => handleChange("petImage", text)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => onSubmit(values)}
        disabled={loading}
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
    paddingHorizontal: 20,
    paddingBottom: 30,
},

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F9FAFB",
    marginBottom: 16,
    fontSize: 15,
  },

  textArea: {
    height: 100,
    paddingTop: 14,
  },

  button: {
    height: 55,
    borderRadius: 14,
    backgroundColor: "#6C5DD3",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});