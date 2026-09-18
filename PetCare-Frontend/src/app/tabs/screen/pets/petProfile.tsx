import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
} from "@expo/vector-icons";

import PetForm from "@/components/petForm";
import {
  deletePet,
  getPetById,
  updatePet,
} from "@/services/pet";


// ==========================================
// TYPES
// ==========================================

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
  gender: string;
  weight: number;
  healthInfo: string;
  petImage?: string;
}


// ==========================================
// PLACEHOLDER IMAGE
// ==========================================

const PLACEHOLDER = require("../../../../../assets/images/dummy-pic.jpg");


// ==========================================
// COMPONENT
// ==========================================

export default function PetProfile() {
  const { id } = useLocalSearchParams();

  const petId = Array.isArray(id) ? id[0] : id;

  const [pet, setPet] = useState<Pet | null>(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [editVisible, setEditVisible] = useState(false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);


  // ==========================================
  // FETCH PET
  // ==========================================

  const fetchPet = useCallback(async () => {
    if (!petId) {
      setLoading(false);
      return;
    }

    try {
      const response = await getPetById(petId);

      console.log("PET PROFILE RESPONSE:", response);

      if (response?.pet) {
        setPet(response.pet);
      } else {
        setPet(null);
      }
    } catch (error: any) {
      console.log(
        "FETCH PET ERROR:",
        error?.response?.data || error?.message
      );

      setPet(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [petId]);


  // ==========================================
  // LOAD PET
  // ==========================================

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);


  // ==========================================
  // REFRESH
  // ==========================================

  const onRefresh = () => {
    setRefreshing(true);
    fetchPet();
  };


  // ==========================================
  // UPDATE PET
  // ==========================================

  const handleUpdate = async (values: any) => {
    if (!pet) return;

    try {
      setSaving(true);

      const response = await updatePet(pet.id, {
        ...values,
        age: Number(values.age) || 0,
        weight: Number(values.weight) || 0,
      });

      console.log("UPDATE PET RESPONSE:", response);

      Alert.alert(
        "Success",
        response?.message || "Pet updated successfully."
      );

      setEditVisible(false);

      await fetchPet();

    } catch (error: any) {
      console.log(
        "UPDATE PET ERROR:",
        error?.response?.data || error?.message
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          error?.message ||
          "Couldn't update pet."
      );
    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE PET
  // ==========================================

  const handleDelete = () => {
    if (!petId) return;

    Alert.alert(
      "Delete Pet",
      `Are you sure you want to delete ${pet?.name || "this pet"}? This action cannot be undone.`,
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
              setDeleting(true);

              console.log("DELETING PET:", petId);

              const response = await deletePet(petId);

              console.log("DELETE RESPONSE:", response);

              Alert.alert(
                "Deleted",
                response?.message || "Pet deleted successfully.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      router.replace("/tabs/pets");
                    },
                  },
                ]
              );

            } catch (error: any) {
              console.log(
                "DELETE PET ERROR:",
                error?.response?.data || error?.message
              );

              Alert.alert(
                "Error",
                error?.response?.data?.message ||
                  error?.message ||
                  "Failed to delete pet."
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator
          size="large"
          color="#6C5DD3"
        />

        <Text style={styles.loadingText}>
          Loading pet profile...
        </Text>
      </SafeAreaView>
    );
  }


  // ==========================================
  // PET NOT FOUND
  // ==========================================

  if (!pet) {
    return (
      <SafeAreaView style={styles.center}>

        <View style={styles.emptyIcon}>
          <MaterialCommunityIcons
            name="paw-off"
            size={48}
            color="#6C5DD3"
          />
        </View>

        <Text style={styles.emptyTitle}>
          Pet not found
        </Text>

        <Text style={styles.emptyText}>
          We couldn't find this pet profile.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>

      </SafeAreaView>
    );
  }


  // ==========================================
  // MAIN SCREEN
  // ==========================================

  return (
    <SafeAreaView style={styles.safe}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C5DD3"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >

        {/* =====================================
            HEADER
        ====================================== */}

        <View style={styles.header}>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color="#111827"
            />
          </TouchableOpacity>


          <Text style={styles.headerTitle}>
            Pet Profile
          </Text>


          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              console.log("EDIT PET CLICKED");
              setEditVisible(true);
            }}
            activeOpacity={0.7}
          >
            <Feather
              name="edit-2"
              size={19}
              color="#6C5DD3"
            />
          </TouchableOpacity>

        </View>


        {/* =====================================
            PROFILE CARD
        ====================================== */}

        <View style={styles.profileCard}>

          <Image
            source={
              pet.petImage &&
              pet.petImage.trim() !== ""
                ? { uri: pet.petImage }
                : PLACEHOLDER
            }
            style={styles.image}
          />


          <Text style={styles.petName}>
            {pet.name}
          </Text>


          <Text style={styles.petBreed}>
            {pet.breed || "Breed not specified"}{" "}
            •{" "}
            {pet.type}
          </Text>


          <View style={styles.badge}>

            <MaterialCommunityIcons
              name="paw"
              size={15}
              color="#6C5DD3"
            />

            <Text style={styles.badgeText}>
              Loved Pet
            </Text>

          </View>

        </View>


        {/* =====================================
            STATS
        ====================================== */}

        <View style={styles.statsContainer}>

          {/* AGE */}

          <View style={styles.statCard}>

            <View style={styles.statIcon}>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color="#6C5DD3"
              />
            </View>

            <Text style={styles.statValue}>
              {pet.age}
            </Text>

            <Text style={styles.statLabel}>
              Years
            </Text>

          </View>


          {/* WEIGHT */}

          <View style={styles.statCard}>

            <View style={styles.statIcon}>
              <MaterialCommunityIcons
                name="weight-kilogram"
                size={24}
                color="#6C5DD3"
              />
            </View>

            <Text style={styles.statValue}>
              {pet.weight}
            </Text>

            <Text style={styles.statLabel}>
              Kg
            </Text>

          </View>


          {/* GENDER */}

          <View style={styles.statCard}>

            <View style={styles.statIcon}>
              <MaterialCommunityIcons
                name={
                  pet.gender?.toLowerCase() === "male"
                    ? "gender-male"
                    : "gender-female"
                }
                size={24}
                color="#6C5DD3"
              />
            </View>

            <Text
              style={[
                styles.statValue,
                {
                  fontSize: 16,
                  textTransform: "capitalize",
                },
              ]}
            >
              {pet.gender}
            </Text>

            <Text style={styles.statLabel}>
              Gender
            </Text>

          </View>

        </View>


        {/* =====================================
            HEALTH INFORMATION
        ====================================== */}

        <View style={styles.card}>

          <View style={styles.cardHeader}>

            <View style={styles.cardIcon}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={25}
                color="#6C5DD3"
              />
            </View>

            <Text style={styles.cardTitle}>
              Health Information
            </Text>

          </View>


          <Text style={styles.healthText}>
            {pet.healthInfo?.trim()
              ? pet.healthInfo
              : "No health information has been added yet."}
          </Text>

        </View>


        {/* =====================================
            QUICK ACTIONS
        ====================================== */}

        <View style={styles.card}>

          <Text style={styles.quickTitle}>
            Quick Actions
          </Text>


          <View style={styles.actionGrid}>

            {/* HEALTH RECORDS */}

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
            //   onPress={() => {
            //     router.push({
            //       pathname: "/tabs/screen/health-record",
            //       params: {
            //         petId: pet.id,
            //       },
            //     });
            //   }}
            >

              <View style={styles.actionIcon}>
                <MaterialCommunityIcons
                  name="heart-outline"
                  size={29}
                  color="#6C5DD3"
                />
              </View>

              <Text style={styles.actionText}>
                Health Records
              </Text>

            </TouchableOpacity>


            {/* VACCINATIONS */}

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/tabs/screen/vaccination/vaccinationManagement",
                  params: {
                    petId: pet.id,
                  },
                });
              }}
            >

              <View style={styles.actionIcon}>
                <MaterialCommunityIcons
                  name="needle"
                  size={29}
                  color="#6C5DD3"
                />
              </View>

              <Text style={styles.actionText}>
                Vaccinations
              </Text>

            </TouchableOpacity>


            {/* APPOINTMENTS */}

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
              onPress={() => {
                router.push({
                  pathname: "/tabs/screen/appoinment/appointmentDetails",
                  params: {
                    petId: pet.id,
                  },
                });
              }}
            >

              <View style={styles.actionIcon}>
                <MaterialCommunityIcons
                  name="calendar-check-outline"
                  size={29}
                  color="#6C5DD3"
                />
              </View>

              <Text style={styles.actionText}>
                Appointments
              </Text>

            </TouchableOpacity>


            {/* GALLERY */}

            <TouchableOpacity
              style={styles.actionCard}
              activeOpacity={0.8}
            //   onPress={() => {
            //     router.push({
            //       pathname: "/tabs/screen/gallery",
            //       params: {
            //         petId: pet.id,
            //       },
            //     });
            //   }}
            >

              <View style={styles.actionIcon}>
                <MaterialCommunityIcons
                  name="image-multiple-outline"
                  size={29}
                  color="#6C5DD3"
                />
              </View>

              <Text style={styles.actionText}>
                Gallery
              </Text>

            </TouchableOpacity>

          </View>

        </View>


        {/* =====================================
            EDIT PET
        ====================================== */}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            console.log("EDIT PET BUTTON CLICKED");
            setEditVisible(true);
          }}
          activeOpacity={0.85}
        >

          <Feather
            name="edit-2"
            size={19}
            color="#FFFFFF"
          />

          <Text style={styles.primaryButtonText}>
            Edit Pet
          </Text>

        </TouchableOpacity>


        {/* =====================================
            DELETE PET
        ====================================== */}

        <TouchableOpacity
          style={styles.deleteButton}
          disabled={deleting}
          onPress={handleDelete}
          activeOpacity={0.8}
        >

          {deleting ? (
            <ActivityIndicator
              size="small"
              color="#EF4444"
            />
          ) : (
            <>
              <Feather
                name="trash-2"
                size={19}
                color="#EF4444"
              />

              <Text style={styles.deleteText}>
                Delete Pet
              </Text>
            </>
          )}

        </TouchableOpacity>


        {/* =====================================
            SPACE FOR BOTTOM NAVIGATION
        ====================================== */}

        <View style={{ height: 130 }} />

      </ScrollView>


      {/* =========================================
          EDIT MODAL
      ========================================== */}

      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          if (!saving) {
            setEditVisible(false);
          }
        }}
      >

        <View style={styles.modalOverlay}>

          <SafeAreaView style={styles.editModal}>

            {/* HANDLE */}

            <View style={styles.modalHandle} />


            {/* MODAL HEADER */}

            <View style={styles.modalHeader}>

              <View style={styles.modalHeaderText}>

                <Text style={styles.modalTitle}>
                  Edit Pet
                </Text>

                <Text style={styles.modalSubtitle}>
                  Update {pet.name}'s information
                </Text>

              </View>


              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => {
                  if (!saving) {
                    setEditVisible(false);
                  }
                }}
                disabled={saving}
                activeOpacity={0.7}
              >

                <Ionicons
                  name="close"
                  size={23}
                  color="#777482"
                />

              </TouchableOpacity>

            </View>


            {/* FORM */}

            <View style={styles.formWrapper}>

              <PetForm
                initialValues={{
                  name: pet.name,
                  type: pet.type,
                  breed: pet.breed,
                  age: String(pet.age ?? ""),
                  gender: pet.gender?.toLowerCase() || "male",
                  weight: String(pet.weight ?? ""),
                  healthInfo: pet.healthInfo ?? "",
                  petImage: pet.petImage ?? "",
                }}
                buttonTitle="Save Changes"
                loading={saving}
                onSubmit={handleUpdate}
              />

            </View>

          </SafeAreaView>

        </View>

      </Modal>

    </SafeAreaView>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({

  // ========================================
  // SCREEN
  // ========================================

  safe: {
    flex: 1,
    backgroundColor: "#F7F8FC",
  },

  scrollContent: {
    paddingTop: 4,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#F7F8FC",

    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,

    color: "#8B8997",

    fontSize: 14,
  },


  // ========================================
  // HEADER
  // ========================================

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    paddingHorizontal: 20,

    paddingVertical: 15,
  },

  headerTitle: {
    fontSize: 22,

    fontWeight: "800",

    color: "#1F1F2D",
  },

  iconButton: {
    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.07,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },


  // ========================================
  // PROFILE CARD
  // ========================================

  profileCard: {
    marginHorizontal: 20,

    marginTop: 8,

    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    alignItems: "center",

    paddingVertical: 28,

    paddingHorizontal: 20,

    elevation: 3,

    shadowColor: "#000",

    shadowOpacity: 0.06,

    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  image: {
    width: 125,
    height: 125,

    borderRadius: 63,

    borderWidth: 4,

    borderColor: "#6C5DD3",

    marginBottom: 17,
  },

  petName: {
    fontSize: 26,

    fontWeight: "800",

    color: "#171722",
  },

  petBreed: {
    fontSize: 14,

    color: "#777582",

    marginTop: 6,

    marginBottom: 15,

    textTransform: "capitalize",
  },

  badge: {
    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#EEEAFE",

    paddingHorizontal: 15,

    paddingVertical: 8,

    borderRadius: 999,
  },

  badgeText: {
    marginLeft: 6,

    color: "#6C5DD3",

    fontWeight: "700",

    fontSize: 13,
  },


  // ========================================
  // STATS
  // ========================================

  statsContainer: {
    flexDirection: "row",

    marginHorizontal: 15,

    marginTop: 20,
  },

  statCard: {
    flex: 1,

    backgroundColor: "#FFFFFF",

    marginHorizontal: 5,

    borderRadius: 19,

    alignItems: "center",

    paddingVertical: 17,

    elevation: 2,

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 5,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  statIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: "#F0EDFC",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 5,
  },

  statValue: {
    marginTop: 5,

    fontSize: 20,

    fontWeight: "800",

    color: "#242330",
  },

  statLabel: {
    marginTop: 3,

    color: "#9996A3",

    fontSize: 12,

    fontWeight: "600",
  },


  // ========================================
  // CARDS
  // ========================================

  card: {
    backgroundColor: "#FFFFFF",

    marginHorizontal: 20,

    marginTop: 20,

    borderRadius: 22,

    padding: 20,

    elevation: 2,

    shadowColor: "#000",

    shadowOpacity: 0.04,

    shadowRadius: 6,

    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  cardHeader: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 15,
  },

  cardIcon: {
    width: 48,
    height: 48,

    borderRadius: 15,

    backgroundColor: "#F0EDFC",

    justifyContent: "center",

    alignItems: "center",
  },

  cardTitle: {
    marginLeft: 12,

    fontSize: 18,

    fontWeight: "800",

    color: "#22212D",
  },

  healthText: {
    color: "#777582",

    fontSize: 14,

    lineHeight: 22,

    fontWeight: "500",
  },


  // ========================================
  // QUICK ACTIONS
  // ========================================

  quickTitle: {
    fontSize: 18,

    fontWeight: "800",

    color: "#22212D",

    marginBottom: 3,
  },

  actionGrid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",

    marginTop: 15,
  },

  actionCard: {
    width: "48%",

    backgroundColor: "#F8F6FF",

    borderRadius: 18,

    alignItems: "center",

    justifyContent: "center",

    paddingVertical: 22,

    marginBottom: 13,
  },

  actionIcon: {
    width: 56,
    height: 56,

    borderRadius: 17,

    backgroundColor: "#F0EDFC",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 10,
  },

  actionText: {
    fontSize: 13,

    fontWeight: "700",

    color: "#35333F",

    textAlign: "center",
  },


  // ========================================
  // PRIMARY BUTTON
  // ========================================

  primaryButton: {
    backgroundColor: "#6C5DD3",

    marginHorizontal: 20,

    marginTop: 22,

    height: 58,

    borderRadius: 17,

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "row",

    elevation: 4,

    shadowColor: "#6C5DD3",

    shadowOpacity: 0.24,

    shadowRadius: 7,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  primaryButtonText: {
    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "800",

    marginLeft: 10,
  },


  // ========================================
  // DELETE BUTTON
  // ========================================

  deleteButton: {
    backgroundColor: "#FFF7F7",

    borderWidth: 1,

    borderColor: "#F6CACA",

    marginHorizontal: 20,

    marginTop: 14,

    minHeight: 58,

    borderRadius: 17,

    justifyContent: "center",

    alignItems: "center",

    flexDirection: "row",
  },

  deleteText: {
    color: "#EF4444",

    fontSize: 16,

    fontWeight: "800",

    marginLeft: 10,
  },


  // ========================================
  // EMPTY STATE
  // ========================================

  emptyIcon: {
    width: 90,
    height: 90,

    borderRadius: 45,

    backgroundColor: "#EEEAFE",

    justifyContent: "center",

    alignItems: "center",

    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 23,

    fontWeight: "800",

    color: "#22212D",

    marginTop: 10,
  },

  emptyText: {
    fontSize: 14,

    color: "#8B8997",

    marginTop: 6,

    marginBottom: 25,
  },


  // ========================================
  // MODAL
  // ========================================

  modalOverlay: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(25,23,38,0.48)",
  },

  editModal: {
    width: "100%",

    height: "90%",

    backgroundColor: "#FFFFFF",

    borderTopLeftRadius: 30,

    borderTopRightRadius: 30,

    overflow: "hidden",
  },

  modalHandle: {
    width: 46,

    height: 5,

    borderRadius: 999,

    backgroundColor: "#D6D3DE",

    alignSelf: "center",

    marginTop: 10,

    marginBottom: 12,
  },

  modalHeader: {
    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 20,

    paddingBottom: 15,

    borderBottomWidth: 1,

    borderBottomColor: "#F0EEF4",
  },

  modalHeaderText: {
    flex: 1,
  },

  modalTitle: {
    fontSize: 23,

    fontWeight: "800",

    color: "#242331",
  },

  modalSubtitle: {
    fontSize: 12,

    color: "#9996A5",

    marginTop: 4,
  },

  modalCloseButton: {
    width: 42,

    height: 42,

    borderRadius: 21,

    backgroundColor: "#F4F2F7",

    justifyContent: "center",

    alignItems: "center",
  },

  formWrapper: {
    flex: 1,
  },

});