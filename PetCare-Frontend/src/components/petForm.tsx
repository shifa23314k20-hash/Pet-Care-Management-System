import React, {
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
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

import * as ImagePicker from "expo-image-picker";

import {
  Feather,
} from "@expo/vector-icons";


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

  onSubmit: (
    values: PetFormValues
  ) => void;
}


const PRIMARY = "#6C5DD3";


export default function PetForm({
  initialValues,
  buttonTitle,
  loading = false,
  onSubmit,
}: PetFormProps) {

  const [values, setValues] =
    useState<PetFormValues>({
      name: "",
      type: "",
      breed: "",
      age: "",
      gender: "male",
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


  // =====================================
  // IMAGE PICKER
  // =====================================

  const pickImage = async () => {

    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {

      alert(
        "Please allow photo access to select a pet image."
      );

      return;
    }


    const result =
      await ImagePicker.launchImageLibraryAsync({

        mediaTypes: ["images"],

        allowsEditing: true,

        aspect: [1, 1],

        quality: 0.8,

      });


    if (!result.canceled) {

      handleChange(
        "petImage",
        result.assets[0].uri
      );

    }
  };


  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = () => {

    if (!values.name.trim()) {

      alert(
        "Please enter your pet's name."
      );

      return;
    }


    if (!values.type) {

      alert(
        "Please select a pet type."
      );

      return;
    }


    onSubmit(values);
  };


  return (

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      {/* ===============================
          PHOTO
      =============================== */}

      <TouchableOpacity
        style={styles.photoWrapper}
        onPress={pickImage}
        activeOpacity={0.8}
      >

        {values.petImage ? (

          <Image
            source={{
              uri: values.petImage,
            }}
            style={styles.photo}
          />

        ) : (

          <View
            style={
              styles.photoPlaceholder
            }
          >

            <Feather
              name="camera"
              size={27}
              color={PRIMARY}
            />

          </View>

        )}

      </TouchableOpacity>


      <Text style={styles.addPhoto}>
        {values.petImage
          ? "Change Photo"
          : "Add Photo"}
      </Text>


      {/* ===============================
          PET NAME
      =============================== */}

      <Text style={styles.label}>
        Pet Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your pet's name"
        placeholderTextColor="#A3A1AD"
        value={values.name}
        onChangeText={(text) =>
          handleChange(
            "name",
            text
          )
        }
      />


      {/* ===============================
          PET TYPE
      =============================== */}

      <Text style={styles.label}>
        Pet Type
      </Text>

      <View
        style={styles.dropdown}
      >

        <Picker
          selectedValue={values.type}
          onValueChange={(item) =>
            handleChange(
              "type",
              item
            )
          }
          style={styles.picker}
        >

          <Picker.Item
            label="Select pet type"
            value=""
          />

          <Picker.Item
            label="Dog"
            value="dog"
          />

          <Picker.Item
            label="Cat"
            value="cat"
          />

          <Picker.Item
            label="Rabbit"
            value="rabbit"
          />

        </Picker>

      </View>


      {/* ===============================
          BREED
      =============================== */}

      <Text style={styles.label}>
        Breed
      </Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Golden Retriever"
        placeholderTextColor="#A3A1AD"
        value={values.breed}
        onChangeText={(text) =>
          handleChange(
            "breed",
            text
          )
        }
      />


      {/* ===============================
          AGE + WEIGHT
      =============================== */}

      <View style={styles.twoColumn}>

        <View
          style={styles.column}
        >

          <Text style={styles.label}>
            Age
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Years"
            placeholderTextColor="#A3A1AD"
            keyboardType="numeric"
            value={values.age}
            onChangeText={(text) =>
              handleChange(
                "age",
                text
              )
            }
          />

        </View>


        <View
          style={styles.column}
        >

          <Text style={styles.label}>
            Weight
          </Text>

          <View
            style={
              styles.weightContainer
            }
          >

            <TextInput
              style={
                styles.weightInput
              }
              placeholder="Weight"
              placeholderTextColor="#A3A1AD"
              keyboardType="decimal-pad"
              value={values.weight}
              onChangeText={(text) =>
                handleChange(
                  "weight",
                  text
                )
              }
            />

            <Text
              style={styles.kg}
            >
              kg
            </Text>

          </View>

        </View>

      </View>


      {/* ===============================
          GENDER
      =============================== */}

      <Text style={styles.label}>
        Gender
      </Text>

      <View
        style={styles.genderRow}
      >

        <TouchableOpacity
          style={[
            styles.genderButton,

            values.gender === "male" &&
              styles.genderSelected,
          ]}
          onPress={() =>
            handleChange(
              "gender",
              "male"
            )
          }
        >

          <Text
            style={[
              styles.genderText,

              values.gender === "male" &&
                styles.genderSelectedText,
            ]}
          >
            Male
          </Text>

        </TouchableOpacity>


        <TouchableOpacity
          style={[
            styles.genderButton,

            values.gender === "female" &&
              styles.genderSelected,
          ]}
          onPress={() =>
            handleChange(
              "gender",
              "female"
            )
          }
        >

          <Text
            style={[
              styles.genderText,

              values.gender === "female" &&
                styles.genderSelectedText,
            ]}
          >
            Female
          </Text>

        </TouchableOpacity>

      </View>


      {/* ===============================
          HEALTH INFORMATION
      =============================== */}

      <Text style={styles.label}>
        Health Information
      </Text>

      <TextInput
        style={
          styles.healthInput
        }
        placeholder="Any allergies, conditions or important information..."
        placeholderTextColor="#A3A1AD"
        multiline
        textAlignVertical="top"
        value={values.healthInfo}
        onChangeText={(text) =>
          handleChange(
            "healthInfo",
            text
          )
        }
      />


      {/* ===============================
          BUTTON
      =============================== */}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
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


const styles = StyleSheet.create({

  scroll: {
    flex: 1,
  },

  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  // PHOTO

  photoWrapper: {
    alignSelf: "center",
    marginTop: 5,
  },

  photoPlaceholder: {
    width: 105,
    height: 105,
    borderRadius: 53,
    backgroundColor: "#F0EDFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E4DFFF",
    borderStyle: "dashed",
  },

  photo: {
    width: 105,
    height: 105,
    borderRadius: 53,
  },

  addPhoto: {
    textAlign: "center",
    color: PRIMARY,
    fontSize: 13,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 18,
  },

  // LABEL

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#454350",
    marginBottom: 7,
  },

  // INPUT

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

  // DROPDOWN

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

  // TWO COLUMNS

  twoColumn: {
    flexDirection: "row",
    gap: 12,
  },

  column: {
    flex: 1,
  },

  // WEIGHT

  weightContainer: {
    height: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E6EF",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginBottom: 15,
  },

  weightInput: {
    flex: 1,
    fontSize: 14,
    color: "#292735",
  },

  kg: {
    fontSize: 13,
    color: "#9997A5",
    fontWeight: "600",
  },

  // GENDER

  genderRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 15,
  },

  genderButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8E6EF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  genderSelected: {
    backgroundColor: "#F0EDFF",
    borderColor: PRIMARY,
  },

  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666471",
  },

  genderSelectedText: {
    color: PRIMARY,
  },

  // HEALTH

  healthInput: {
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E8E6EF",
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: "#292735",
    marginBottom: 20,
  },

  // BUTTON

  button: {
    height: 54,
    backgroundColor: PRIMARY,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",

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