import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Search,
  Plus,
  ChevronRight,
  Pencil,
  X,
  PawPrint,
} from "lucide-react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  createPet,
  getPetsByUserId,
  updatePet,
} from "@/services/pet";

import PetForm from "@/components/petForm";


export default function MyPetsScreen() {

  const [pets, setPets] = useState<any[]>([]);

  const [searchText, setSearchText] = useState("");

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editingPet, setEditingPet] =
    useState<any>(null);


  // =====================================
  // FETCH PETS
  // =====================================

  const fetchPets = async () => {

    try {

      setLoading(true);

      const response =
        await getPetsByUserId();

      console.log(
        "MY PETS RESPONSE:",
        response
      );

      setPets(response?.pets || []);

    } catch (error: any) {

      console.log(
        "FETCH PETS ERROR:",
        error?.response?.data ||
        error?.message
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Failed to load your pets."
      );

    } finally {

      setLoading(false);

    }
  };


  // =====================================
  // REFRESH WHEN SCREEN OPENS
  // =====================================

  useFocusEffect(
    useCallback(() => {

      fetchPets();

    }, [])
  );


  // =====================================
  // SEARCH
  // =====================================

  const filteredPets = pets.filter(
    (pet) => {

      const search =
        searchText
          .toLowerCase()
          .trim();

      if (!search) {
        return true;
      }

      return (
        pet.name
          ?.toLowerCase()
          .includes(search) ||

        pet.type
          ?.toLowerCase()
          .includes(search) ||

        pet.breed
          ?.toLowerCase()
          .includes(search)
      );
    }
  );


  // =====================================
  // OPEN ADD PET
  // =====================================

  const openAddPet = () => {

    setEditingPet(null);

    setModalVisible(true);
  };


  // =====================================
  // OPEN EDIT PET
  // =====================================

  const openEditPet = (
    pet: any
  ) => {

    setEditingPet(pet);

    setModalVisible(true);
  };


  // =====================================
  // CLOSE MODAL
  // =====================================

  const closeModal = () => {

    if (saving) {
      return;
    }

    setModalVisible(false);

    setEditingPet(null);
  };


  // =====================================
  // SAVE PET
  // =====================================

  const handleSavePet = async (
    values: any
  ) => {

    try {

      setSaving(true);

      const petData = {

        ...values,

        age: Number(values.age) || 0,

        weight:
          Number(values.weight) || 0,

      };


      // UPDATE
      if (editingPet) {

        const response =
          await updatePet(
            editingPet.id,
            petData
          );

        Alert.alert(
          "Success",
          response.message ||
          "Pet updated successfully."
        );

      }

      // CREATE
      else {

        const response =
          await createPet(
            petData
          );

        Alert.alert(
          "Success",
          response.message ||
          "Pet created successfully."
        );
      }


      closeModal();

      await fetchPets();

    } catch (error: any) {

      console.log(
        "SAVE PET ERROR:",
        error?.response?.data ||
        error?.message
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Something went wrong."
      );

    } finally {

      setSaving(false);

    }
  };


  // =====================================
  // OPEN PET PROFILE
  // =====================================

  const openPetProfile = (
    petId: string
  ) => {

    console.log(
      "OPEN PET PROFILE:",
      petId
    );

    router.push({
      pathname:
        "/tabs/screen/pets/petProfile",
      params: {
        id: petId,
      },
    });
  };


  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (
      <SafeAreaView
        style={styles.loadingContainer}
      >
        <ActivityIndicator
          size="large"
          color="#6C5DD3"
        />

        <Text style={styles.loadingText}>
          Loading your pets...
        </Text>
      </SafeAreaView>
    );
  }


  return (

    <SafeAreaView
      style={styles.safeArea}
    >

      <View style={styles.container}>

        {/* =================================
            HEADER
        ================================= */}

        <View style={styles.header}>

          <View>

            <Text style={styles.headerTitle}>
              My Pets
            </Text>

            <Text style={styles.headerSubtitle}>
              {pets.length}{" "}
              {pets.length === 1
                ? "pet"
                : "pets"}{" "}
              in your care
            </Text>

          </View>


          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddPet}
            activeOpacity={0.8}
          >

            <Plus
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Add Pet
            </Text>

          </TouchableOpacity>

        </View>


        {/* =================================
            SEARCH
        ================================= */}

        {pets.length > 0 && (

          <View style={styles.searchContainer}>

            <Search
              size={21}
              color="#9997A6"
            />

            <TextInput
              style={styles.searchInput}
              placeholder="Search your pets"
              placeholderTextColor="#9997A6"
              value={searchText}
              onChangeText={
                setSearchText
              }
              autoCapitalize="none"
            />

            {searchText.length > 0 && (

              <TouchableOpacity
                onPress={() =>
                  setSearchText("")
                }
              >

                <X
                  size={18}
                  color="#9997A6"
                />

              </TouchableOpacity>

            )}

          </View>

        )}


        {/* =================================
            PET LIST
        ================================= */}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            styles.scrollContent
          }
        >

          {pets.length === 0 ? (

            <View style={styles.emptyContainer}>

              <View
                style={styles.emptyIcon}
              >

                <PawPrint
                  size={42}
                  color="#6C5DD3"
                />

              </View>

              <Text style={styles.emptyTitle}>
                No Pets Yet
              </Text>

              <Text
                style={styles.emptyText}
              >
                Add your first pet to start
                managing their health and care.
              </Text>

              <TouchableOpacity
                style={styles.emptyButton}
                onPress={openAddPet}
              >

                <Plus
                  size={19}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.emptyButtonText
                  }
                >
                  Add Your First Pet
                </Text>

              </TouchableOpacity>

            </View>

          ) : filteredPets.length === 0 ? (

            <View
              style={styles.noResults}
            >

              <Search
                size={40}
                color="#C4C1D1"
              />

              <Text
                style={styles.noResultsTitle}
              >
                No pets found
              </Text>

              <Text
                style={styles.noResultsText}
              >
                Try searching by name, type or
                breed.
              </Text>

            </View>

          ) : (

            filteredPets.map(
              (pet) => (

                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    openPetProfile(
                      pet.id
                    )
                  }
                >

                  {/* PET IMAGE */}

                  <Image
                    source={
                      pet.petImage
                        ? {
                            uri:
                              pet.petImage,
                          }
                        : require(
                            "@/assets/images/dummy-pic.jpg"
                          )
                    }
                    style={styles.petImage}
                  />


                  {/* PET INFO */}

                  <View
                    style={styles.petInfo}
                  >

                    <View
                      style={
                        styles.nameRow
                      }
                    >

                      <Text
                        style={
                          styles.petName
                        }
                      >
                        {pet.name}
                      </Text>

                      <View
                        style={
                          styles.typeBadge
                        }
                      >

                        <Text
                          style={
                            styles.typeText
                          }
                        >
                          {pet.type}
                        </Text>

                      </View>

                    </View>


                    <Text
                      style={
                        styles.petBreed
                      }
                    >
                      {pet.breed ||
                        "Unknown breed"}
                    </Text>


                    <Text
                      style={
                        styles.petMeta
                      }
                    >
                      {pet.age} Years
                      {"  •  "}
                      {pet.weight} kg
                      {"  •  "}
                      {pet.gender}
                    </Text>

                  </View>


                  {/* EDIT */}

                  <TouchableOpacity
                    style={
                      styles.editButton
                    }
                    onPress={(event) => {

                      event.stopPropagation();

                      openEditPet(pet);

                    }}
                    activeOpacity={0.7}
                  >

                    <Pencil
                      size={19}
                      color="#6C5DD3"
                    />

                  </TouchableOpacity>


                  {/* ARROW */}

                  <ChevronRight
                    size={20}
                    color="#A4A1AD"
                  />

                </TouchableOpacity>

              )
            )

          )}

        </ScrollView>


        {/* =================================
            ADD / EDIT MODAL
        ================================= */}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={
            closeModal
          }
        >

          <View
            style={
              styles.modalOverlay
            }
          >

            <SafeAreaView
              style={
                styles.modalContainer
              }
            >

              {/* Handle */}

              <View
                style={
                  styles.modalHandle
                }
              />


              {/* Modal Header */}

              <View
                style={
                  styles.modalHeader
                }
              >

                <View
                  style={{
                    flex: 1,
                  }}
                >

                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    {editingPet
                      ? "Edit Pet"
                      : "Add New Pet"}
                  </Text>

                  <Text
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {editingPet
                      ? "Update your pet's information"
                      : "Tell us a little about your pet"}
                  </Text>

                </View>


                <TouchableOpacity
                  style={
                    styles.closeButton
                  }
                  onPress={
                    closeModal
                  }
                  disabled={saving}
                >

                  <X
                    size={20}
                    color="#777582"
                  />

                </TouchableOpacity>

              </View>


              {/* FORM */}

              <View
                style={
                  styles.formContainer
                }
              >

                <PetForm

                  buttonTitle={
                    editingPet
                      ? "Save Changes"
                      : "Add Pet"
                  }

                  loading={saving}

                  initialValues={
                    editingPet
                      ? {
                          name:
                            editingPet.name,

                          type:
                            editingPet.type,

                          breed:
                            editingPet.breed,

                          age:
                            String(
                              editingPet.age ??
                              ""
                            ),

                          gender:
                            editingPet.gender,

                          weight:
                            String(
                              editingPet.weight ??
                              ""
                            ),

                          healthInfo:
                            editingPet.healthInfo ||
                            "",

                          petImage:
                            editingPet.petImage ||
                            "",
                        }
                      : undefined
                  }

                  onSubmit={
                    handleSavePet
                  }

                />

              </View>

            </SafeAreaView>

          </View>

        </Modal>

      </View>

    </SafeAreaView>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8FD",
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9F8FD",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#888694",
  },

  // HEADER

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 18,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#242331",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#92909E",
    marginTop: 3,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6C5DD3",
    paddingHorizontal: 17,
    height: 48,
    borderRadius: 15,
    gap: 7,

    shadowColor: "#6C5DD3",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  // SEARCH

  searchContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E6EF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    marginBottom: 18,
  },

  searchInput: {
    flex: 1,
    marginLeft: 11,
    fontSize: 14,
    color: "#292735",
  },

  // LIST

  scrollContent: {
    paddingBottom: 110,
  },

  petCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,

    padding: 15,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 13,

    borderWidth: 1,
    borderColor: "#ECEAF2",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },

  petImage: {
    width: 68,
    height: 68,
    borderRadius: 34,

    borderWidth: 2,
    borderColor: "#E8E2FF",
  },

  petInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  petName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#292735",
  },

  typeBadge: {
    backgroundColor: "#EFECFB",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 8,
  },

  typeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6C5DD3",
    textTransform: "capitalize",
  },

  petBreed: {
    fontSize: 13,
    fontWeight: "600",
    color: "#5F5D6B",
    marginTop: 4,
  },

  petMeta: {
    fontSize: 11,
    color: "#9997A5",
    marginTop: 5,
  },

  editButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#F1EEFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },

  // EMPTY

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 90,
    height: 90,
    borderRadius: 30,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#292735",
  },

  emptyText: {
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: "#9694A2",
    marginTop: 8,
  },

  emptyButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#6C5DD3",
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 14,
    marginTop: 24,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  noResults: {
    alignItems: "center",
    paddingTop: 80,
  },

  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#292735",
    marginTop: 12,
  },

  noResultsText: {
    fontSize: 13,
    color: "#9694A2",
    marginTop: 5,
  },

  // MODAL

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(20,18,35,0.45)",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    height: "88%",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: "hidden",
  },

  formContainer: {
    flex: 1,
  },

  modalHandle: {
    width: 45,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D7D4DF",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 13,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242331",
  },

  modalSubtitle: {
    fontSize: 12,
    color: "#9694A2",
    marginTop: 3,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F4F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
});