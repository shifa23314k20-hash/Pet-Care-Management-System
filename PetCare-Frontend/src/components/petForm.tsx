import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";

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
    gender: "Male",
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

  const handleChange = (key: keyof PetFormValues, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      handleChange("petImage", result.assets[0].uri);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Photo */}
      <TouchableOpacity style={styles.photoContainer} onPress={pickImage}>
        {values.petImage ? (
          <Image source={{ uri: values.petImage }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Feather name="camera" size={24} color="#8B5CF6" />
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.addPhoto}>Add Photo</Text>

      {/* Name */}
      <TextInput
        placeholder="Pet Name"
        style={styles.input}
        value={values.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      {/* Breed */}
      <TextInput
        placeholder="Breed"
        style={styles.input}
        value={values.breed}
        onChangeText={(text) => handleChange("breed", text)}
      />

      {/* Age */}
      <View style={styles.row}>
        <TextInput
          placeholder="Age"
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={values.age}
          onChangeText={(text) => handleChange("age", text)}
        />

        <View style={styles.dropdown}>
          <Picker>
            <Picker.Item label="Years" value="years" />
            <Picker.Item label="Months" value="month"/>
          </Picker>
        </View>
      </View>

      {/* Pet Type */}
      <View style={[styles.dropdown, { marginTop: 16 }]}>
        <Picker
          selectedValue={values.type}
          onValueChange={(item) => handleChange("type", item)}
        >
          <Picker.Item label="Pet Type" value="" />
          <Picker.Item label="Dog" value="dog" />
          <Picker.Item label="Cat" value="cat" />
          <Picker.Item label="Rabbit" value="rabbit" />
        </Picker>
      </View>

      {/* Gender */}
      <View style={styles.genderRow}>
        <TouchableOpacity
          style={[
            styles.genderButton,
            values.gender === "male" && styles.genderSelected,
          ]}
          onPress={() => handleChange("gender", "male")}
        >
          <Text
            style={[
              styles.genderText,
              values.gender === "male" && styles.genderSelectedText,
            ]}
          >
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.genderButton,
            values.gender === "female" && styles.genderSelected,
          ]}
          onPress={() => handleChange("gender", "female")}
        >
          <Text
            style={[
              styles.genderText,
              values.gender === "female" && styles.genderSelectedText,
            ]}
          >
            Female
          </Text>
        </TouchableOpacity>
      </View>

      {/* Weight */}
      <View style={styles.weightContainer}>
        <TextInput
          placeholder="Weight"
          keyboardType="numeric"
          style={styles.weightInput}
          value={values.weight}
          onChangeText={(text) => handleChange("weight", text)}
        />
        <Text style={styles.kg}>kg</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => onSubmit(values)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{buttonTitle}</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const PRIMARY = "#7C5CFC";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  photoContainer: {
    alignItems: "center",
    marginBottom: 8,
  },

  photoPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F2EEFF",
    justifyContent: "center",
    alignItems: "center",
  },

  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },

  addPhoto: {
    textAlign: "center",
    color: PRIMARY,
    fontWeight: "600",
    marginBottom: 25,
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

  row: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },

  dropdown: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#fff",
  },

  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
    marginBottom: 16,
  },

  genderButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    justifyContent: "center",
    alignItems: "center",
  },

  genderSelected: {
    borderColor: PRIMARY,
    backgroundColor: "#F3EFFF",
  },

  genderText: {
    color: "#444",
    fontWeight: "600",
  },

  genderSelectedText: {
    color: PRIMARY,
  },

  weightContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECECEC",
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 24,
  },

  weightInput: {
    flex: 1,
    fontSize: 15,
  },

  kg: {
    color: "#999",
    fontSize: 15,
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