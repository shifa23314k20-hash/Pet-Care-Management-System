import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
  useRouter,
} from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  deleteHealthRecord,
  getHealthRecordsByPetId,
} from "@/services/health";

import { getPetsByUserId } from "@/services/pet";

/* =========================================================
   TYPES
========================================================= */

interface Pet {
  id: string;
  name: string;
  species?: string;
  breed?: string;
  image?: string;
  photo?: string;
}

interface HealthRecord {
  id: string;
  userId: string;
  petId: string;
  weight: number;
  temperature: number;
  illness: string;
  medication: string;
  veterinarian?: string;
  visitDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* =========================================================
   MAIN SCREEN
========================================================= */

export default function HealthRecordScreen() {
  const router = useRouter();

  /* =======================================================
     STATES
  ======================================================= */

  const [pets, setPets] = useState<Pet[]>([]);

  const [selectedPet, setSelectedPet] =
    useState<Pet | null>(null);

  const [records, setRecords] =
    useState<HealthRecord[]>([]);

  const [loadingPets, setLoadingPets] =
    useState(true);

  const [loadingRecords, setLoadingRecords] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [showPetSelector, setShowPetSelector] =
    useState(false);

  /* =======================================================
     GET USER ID
  ======================================================= */

  const getUserId = async () => {
    try {
      const storedUser =
        await AsyncStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      const user = JSON.parse(storedUser);

      return (
        user?.id ||
        user?._id ||
        user?.userId ||
        null
      );
    } catch (error) {
      console.log(
        "Error getting user:",
        error
      );

      return null;
    }
  };

  /* =======================================================
     LOAD USER'S PETS
  ======================================================= */

  const loadPets = async () => {
    try {
      setLoadingPets(true);

      const userId = await getUserId();

      if (!userId) {
        Alert.alert(
          "Error",
          "User information not found."
        );

        return;
      }

      const response =
        await getPetsByUserId(userId);

      /*
       * Handle different possible API response formats.
       */

      const petList: Pet[] = Array.isArray(response)
        ? response
        : response?.pets ||
          response?.data ||
          [];

      setPets(petList);

      /* -----------------------------------------------
         Select first pet automatically
      ------------------------------------------------ */

      if (petList.length > 0) {
        setSelectedPet((currentPet) => {
          /*
           * If a pet is already selected, keep it.
           * This prevents refresh from switching the pet.
           */

          if (currentPet) {
            const stillExists = petList.find(
              (pet) => pet.id === currentPet.id
            );

            if (stillExists) {
              return stillExists;
            }
          }

          return petList[0];
        });
      } else {
        setSelectedPet(null);
        setRecords([]);
      }
    } catch (error: any) {
      console.log(
        "Error loading pets:",
        error
      );

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Unable to load your pets."
      );
    } finally {
      setLoadingPets(false);
    }
  };

  /* =======================================================
     LOAD HEALTH RECORDS FOR SELECTED PET
  ======================================================= */

  const loadHealthRecords = async (
    petId: string
  ) => {
    try {
      setLoadingRecords(true);

      console.log(
        "Loading health records for pet:",
        petId
      );

      /*
       * IMPORTANT:
       *
       * We DO NOT use getAllHealthRecords().
       *
       * We directly call:
       *
       * GET /health-record/pet/:petId
       *
       * This gets records for the selected pet.
       */

      const response =
        await getHealthRecordsByPetId(
          petId
        );

      console.log(
        "Health records response:",
        response
      );

      /*
       * Handle possible response formats.
       */

      const recordList: HealthRecord[] =
        Array.isArray(response)
          ? response
          : response?.records ||
            response?.healthRecords ||
            response?.data ||
            [];

      setRecords(recordList);
    } catch (error: any) {
      console.log(
        "Error loading health records:",
        error
      );

      /*
       * Don't show an error alert every time the
       * screen comes into focus.
       */

      setRecords([]);

      Alert.alert(
        "Error",
        error?.response?.data?.message ||
          "Unable to load health records."
      );
    } finally {
      setLoadingRecords(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadPets();
  }, []);

  /* =======================================================
     LOAD RECORDS WHEN PET CHANGES
  ======================================================= */

  useEffect(() => {
    if (selectedPet?.id) {
      loadHealthRecords(
        selectedPet.id
      );
    }
  }, [selectedPet?.id]);

  /* =======================================================
     IMPORTANT:
     REFRESH WHEN SCREEN GETS FOCUS
  ======================================================= */

  useFocusEffect(
    useCallback(() => {
      /*
       * When the user returns from:
       *
       * Add Health Record
       *
       * this screen gets focus again.
       *
       * We fetch the selected pet's records again.
       */

      if (selectedPet?.id) {
        loadHealthRecords(
          selectedPet.id
        );
      }
    }, [selectedPet?.id])
  );

  /* =======================================================
     PULL TO REFRESH
  ======================================================= */

  const onRefresh = async () => {
    try {
      setRefreshing(true);

      if (selectedPet?.id) {
        await loadHealthRecords(
          selectedPet.id
        );
      }

      /*
       * Also refresh the pet list.
       */

      await loadPets();
    } finally {
      setRefreshing(false);
    }
  };

  /* =======================================================
     SELECT PET
  ======================================================= */

  const handlePetSelect = (
    pet: Pet
  ) => {
    setShowPetSelector(false);

    /*
     * Changing selectedPet triggers the
     * useEffect above and loads records
     * for the newly selected pet.
     */

    setSelectedPet(pet);
  };

  /* =======================================================
     DELETE HEALTH RECORD
  ======================================================= */

  const handleDelete = (
    recordId: string
  ) => {
    Alert.alert(
      "Delete Health Record",
      "Are you sure you want to delete this health record?",
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
              await deleteHealthRecord(
                recordId
              );

              /*
               * Remove record immediately
               * from the current screen.
               */

              setRecords(
                (previousRecords) =>
                  previousRecords.filter(
                    (record) =>
                      record.id !==
                      recordId
                  )
              );

              Alert.alert(
                "Deleted",
                "Health record deleted successfully."
              );
            } catch (error: any) {
              console.log(
                "Error deleting health record:",
                error
              );

              Alert.alert(
                "Error",
                error?.response
                  ?.data?.message ||
                  "Unable to delete health record."
              );
            }
          },
        },
      ]
    );
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "No date";
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {
      return "No date";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =======================================================
     HEALTH RECORD CARD
  ======================================================= */

  const renderHealthRecord = ({
    item,
  }: {
    item: HealthRecord;
  }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.recordCard}
        onPress={() => {
          router.push({
            pathname:
              "/tabs/screen/healthRecords/healthRecordDetails",
            params: {
              id: item.id,
            },
          });
        }}
      >
        {/* =================================================
            RECORD HEADER
        ================================================= */}

        <View
          style={styles.recordHeader}
        >
          <View
            style={styles.recordIconBox}
          >
            <Ionicons
              name="medkit-outline"
              size={23}
              color="#6C5DD3"
            />
          </View>

          <View
            style={styles.recordHeaderText}
          >
            <Text
              style={styles.illnessText}
              numberOfLines={1}
            >
              {item.illness ||
                "Health Checkup"}
            </Text>

            <Text
              style={styles.dateText}
            >
              {formatDate(
                item.visitDate
              )}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              handleDelete(item.id)
            }
          >
            <Ionicons
              name="trash-outline"
              size={19}
              color="#E05252"
            />
          </TouchableOpacity>
        </View>

        {/* =================================================
            WEIGHT + TEMPERATURE
        ================================================= */}

        <View style={styles.infoRow}>
          <View
            style={styles.infoItem}
          >
            <Ionicons
              name="scale-outline"
              size={18}
              color="#6C5DD3"
            />

            <View>
              <Text
                style={styles.infoLabel}
              >
                Weight
              </Text>

              <Text
                style={styles.infoValue}
              >
                {item.weight} kg
              </Text>
            </View>
          </View>

          <View
            style={styles.infoItem}
          >
            <Ionicons
              name="thermometer-outline"
              size={18}
              color="#6C5DD3"
            />

            <View>
              <Text
                style={styles.infoLabel}
              >
                Temperature
              </Text>

              <Text
                style={styles.infoValue}
              >
                {item.temperature} °C
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            MEDICATION
        ================================================= */}

        <View
          style={styles.medicationBox}
        >
          <Ionicons
            name="medical-outline"
            size={18}
            color="#6C5DD3"
          />

          <View style={{ flex: 1 }}>
            <Text
              style={styles.infoLabel}
            >
              Medication
            </Text>

            <Text
              style={styles.medicationText}
              numberOfLines={2}
            >
              {item.medication ||
                "No medication added"}
            </Text>
          </View>
        </View>

        {/* =================================================
            VETERINARIAN
        ================================================= */}

        {item.veterinarian ? (
          <View
            style={styles.vetRow}
          >
            <Ionicons
              name="person-outline"
              size={17}
              color="#8E8B99"
            />

            <Text
              style={styles.vetText}
              numberOfLines={1}
            >
              Dr. {item.veterinarian}
            </Text>
          </View>
        ) : null}

        {/* =================================================
            VIEW DETAILS
        ================================================= */}

        <View
          style={styles.viewDetailsRow}
        >
          <Text
            style={styles.viewDetailsText}
          >
            View Details
          </Text>

          <Ionicons
            name="chevron-forward"
            size={18}
            color="#6C5DD3"
          />
        </View>
      </TouchableOpacity>
    );
  };

  /* =======================================================
     LOADING PETS
  ======================================================= */

  if (loadingPets) {
    return (
      <SafeAreaView
        style={styles.safeArea}
      >
        <View
          style={styles.loadingContainer}
        >
          <ActivityIndicator
            size="large"
            color="#6C5DD3"
          />

          <Text
            style={styles.loadingText}
          >
            Loading your pets...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={["top"]}
    >
      <View style={styles.container}>

        {/* =================================================
            HEADER
        ================================================= */}

        <View
          style={styles.header}
        >
          <View>
            <Text
              style={styles.title}
            >
              Health Records
            </Text>

            <Text
              style={styles.subtitle}
            >
              Keep track of your pet's health
            </Text>
          </View>

          <View
            style={styles.headerIcon}
          >
            <Ionicons
              name="heart-outline"
              size={25}
              color="#6C5DD3"
            />
          </View>
        </View>

        {/* =================================================
            PET FILTER
        ================================================= */}

        {pets.length > 0 && (
          <View
            style={styles.filterSection}
          >
            <Text
              style={styles.filterLabel}
            >
              Select Pet
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.petSelector}
              onPress={() =>
                setShowPetSelector(true)
              }
            >
              <View
                style={
                  styles.selectedPetIcon
                }
              >
                <Ionicons
                  name="paw"
                  size={20}
                  color="#6C5DD3"
                />
              </View>

              <View
                style={
                  styles.selectedPetInfo
                }
              >
                <Text
                  style={
                    styles.selectedPetName
                  }
                >
                  {selectedPet?.name ||
                    "Select a pet"}
                </Text>

                <Text
                  style={
                    styles.selectedPetSubtext
                  }
                >
                  Choose pet for records
                </Text>
              </View>

              <Ionicons
                name="chevron-down"
                size={20}
                color="#777482"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* =================================================
            SELECTED PET SUMMARY
        ================================================= */}

        {selectedPet && (
          <View
            style={styles.summaryCard}
          >
            <View
              style={styles.summaryIcon}
            >
              <Ionicons
                name="document-text-outline"
                size={22}
                color="#6C5DD3"
              />
            </View>

            <View
              style={styles.summaryText}
            >
              <Text
                style={styles.summaryTitle}
              >
                {selectedPet.name}'s Records
              </Text>

              <Text
                style={styles.summarySubtitle}
              >
                {records.length === 1
                  ? "1 health record"
                  : `${records.length} health records`}
              </Text>
            </View>

            <View
              style={styles.summaryBadge}
            >
              <Text
                style={
                  styles.summaryBadgeText
                }
              >
                {records.length}
              </Text>
            </View>
          </View>
        )}

        {/* =================================================
            ADD HEALTH RECORD BUTTON
        ================================================= */}

        {selectedPet && (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addButton}
            onPress={() =>
              router.push(
                "/tabs/screen/healthRecords/healthRecordForm"
              )
            }
          >
            <Ionicons
              name="add"
              size={23}
              color="#FFFFFF"
            />

            <Text
              style={styles.addButtonText}
            >
              Add Health Record
            </Text>
          </TouchableOpacity>
        )}

        {/* =================================================
            RECORD LIST
        ================================================= */}

        <View
          style={styles.listSection}
        >
          {loadingRecords ? (
            <View
              style={styles.loadingRecords}
            >
              <ActivityIndicator
                size="small"
                color="#6C5DD3"
              />

              <Text
                style={
                  styles.loadingRecordsText
                }
              >
                Loading health records...
              </Text>
            </View>
          ) : records.length === 0 ? (
            /* =============================================
               EMPTY STATE
            ============================================= */

            <FlatList
              data={[]}
              renderItem={null}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#6C5DD3"
                />
              }
              contentContainerStyle={
                styles.emptyScrollContent
              }
              ListEmptyComponent={
                <View
                  style={styles.emptyState}
                >
                  <View
                    style={
                      styles.emptyIconBox
                    }
                  >
                    <Ionicons
                      name="document-text-outline"
                      size={42}
                      color="#6C5DD3"
                    />
                  </View>

                  <Text
                    style={styles.emptyTitle}
                  >
                    No Health Records
                  </Text>

                  <Text
                    style={
                      styles.emptyDescription
                    }
                  >
                    {selectedPet
                      ? `No health records have been added for ${selectedPet.name}`
                      : "Select a pet to view health records."}
                  </Text>

                  {selectedPet && (
                    <TouchableOpacity
                      style={
                        styles.emptyAddButton
                      }
                      onPress={() =>
                        router.push(
                          "/tabs/screen/healthRecords/healthRecordForm"
                        )
                      }
                    >
                      <Ionicons
                        name="add"
                        size={20}
                        color="#FFFFFF"
                      />

                      <Text
                        style={
                          styles.emptyAddText
                        }
                      >
                        Add First Record
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              }
            />
          ) : (
            /* =============================================
               HEALTH RECORDS
            ============================================= */

            <FlatList
              data={records}
              keyExtractor={(item) =>
                item.id
              }
              renderItem={
                renderHealthRecord
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.listContent
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor="#6C5DD3"
                />
              }
            />
          )}
        </View>
      </View>

      {/* =================================================
          PET SELECTOR MODAL
      ================================================= */}

      <Modal
        visible={showPetSelector}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowPetSelector(false)
        }
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() =>
            setShowPetSelector(false)
          }
        >
          <Pressable
            style={styles.petModal}
            onPress={(event) =>
              event.stopPropagation()
            }
          >
            {/* =============================================
                MODAL HEADER
            ============================================= */}

            <View
              style={styles.modalHeader}
            >
              <View>
                <Text
                  style={styles.modalTitle}
                >
                  Select Pet
                </Text>

                <Text
                  style={
                    styles.modalSubtitle
                  }
                >
                  View records for a specific pet
                </Text>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setShowPetSelector(false)
                }
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#555260"
                />
              </TouchableOpacity>
            </View>

            {/* =============================================
                PET LIST
            ============================================= */}

            <FlatList
              data={pets}
              keyExtractor={(item) =>
                item.id
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={
                styles.petListContent
              }
              renderItem={({
                item,
              }) => {
                const isSelected =
                  selectedPet?.id ===
                  item.id;

                return (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    style={[
                      styles.petOption,
                      isSelected &&
                        styles.selectedPetOption,
                    ]}
                    onPress={() =>
                      handlePetSelect(
                        item
                      )
                    }
                  >
                    <View
                      style={[
                        styles.petOptionIcon,
                        isSelected &&
                          styles.selectedPetOptionIcon,
                      ]}
                    >
                      <Ionicons
                        name="paw"
                        size={22}
                        color="#6C5DD3"
                      />
                    </View>

                    <View
                      style={
                        styles.petOptionTextContainer
                      }
                    >
                      <Text
                        style={
                          styles.petOptionName
                        }
                      >
                        {item.name}
                      </Text>

                      <Text
                        style={
                          styles.petOptionSpecies
                        }
                      >
                        {item.species ||
                          "Pet"}

                        {item.breed
                          ? ` • ${item.breed}`
                          : ""}
                      </Text>
                    </View>

                    {isSelected && (
                      <View
                        style={
                          styles.checkIcon
                        }
                      >
                        <Ionicons
                          name="checkmark"
                          size={18}
                          color="#FFFFFF"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  /* =======================================================
     MAIN
  ======================================================= */

  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8FD",
  },

  container: {
    flex: 1,
    paddingHorizontal: 18,
  },

  /* =======================================================
     HEADER
  ======================================================= */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 8,
    paddingBottom: 15,
  },

  title: {
    fontSize: 29,
    fontWeight: "800",
    color: "#242331",
  },

  subtitle: {
    marginTop: 3,
    fontSize: 14,
    color: "#92909E",
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EFECFB",
    justifyContent: "center",
    alignItems: "center",
  },

  /* =======================================================
     PET FILTER
  ======================================================= */

  filterSection: {
    marginBottom: 12,
  },

  filterLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#454350",
    marginBottom: 7,
  },

  petSelector: {
    minHeight: 62,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8E6EF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  selectedPetIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedPetInfo: {
    flex: 1,
    marginLeft: 11,
  },

  selectedPetName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#242331",
  },

  selectedPetSubtext: {
    marginTop: 2,
    fontSize: 12,
    color: "#96939F",
  },

  /* =======================================================
     SUMMARY
  ======================================================= */

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EEEAF8",
  },

  summaryIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: "#EFECFB",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryText: {
    flex: 1,
    marginLeft: 11,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#292735",
  },

  summarySubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#97949F",
  },

  summaryBadge: {
    minWidth: 35,
    height: 35,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#EFECFB",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryBadgeText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6C5DD3",
  },

  /* =======================================================
     ADD BUTTON
  ======================================================= */

  addButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#6C5DD3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginLeft: 7,
  },

  /* =======================================================
     LIST
  ======================================================= */

  listSection: {
    flex: 1,
  },

  listContent: {
    paddingBottom: 120,
  },

  /* =======================================================
     RECORD CARD
  ======================================================= */

  recordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 13,
    borderWidth: 1,
    borderColor: "#ECEAF2",
  },

  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  recordIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EFECFB",
    justifyContent: "center",
    alignItems: "center",
  },

  recordHeaderText: {
    flex: 1,
    marginLeft: 11,
  },

  illnessText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#292735",
  },

  dateText: {
    marginTop: 4,
    fontSize: 12,
    color: "#92909E",
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF1F1",
    justifyContent: "center",
    alignItems: "center",
  },

  /* =======================================================
     INFORMATION
  ======================================================= */

  infoRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },

  infoItem: {
    flex: 1,
    backgroundColor: "#F9F8FD",
    borderRadius: 14,
    padding: 11,
    flexDirection: "row",
    alignItems: "center",
  },

  infoLabel: {
    fontSize: 10,
    color: "#9895A1",
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#35323F",
  },

  /* =======================================================
     MEDICATION
  ======================================================= */

  medicationBox: {
    marginTop: 10,
    backgroundColor: "#F9F8FD",
    borderRadius: 14,
    padding: 11,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },

  medicationText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#3D3947",
  },

  /* =======================================================
     VETERINARIAN
  ======================================================= */

  vetRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
    paddingHorizontal: 2,
  },

  vetText: {
    marginLeft: 7,
    fontSize: 12,
    color: "#777480",
    fontWeight: "600",
  },

  /* =======================================================
     VIEW DETAILS
  ======================================================= */

  viewDetailsRow: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0EEF4",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  viewDetailsText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6C5DD3",
    marginRight: 3,
  },

  /* =======================================================
     LOADING
  ======================================================= */

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#777480",
  },

  loadingRecords: {
    paddingTop: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingRecordsText: {
    marginTop: 9,
    fontSize: 13,
    color: "#85818E",
  },

  /* =======================================================
     EMPTY STATE
  ======================================================= */

  emptyScrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
    paddingTop: 55,
  },

  emptyIconBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#292735",
  },

  emptyDescription: {
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
    color: "#94919D",
    marginTop: 7,
  },

  emptyAddButton: {
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#6C5DD3",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
  },

  emptyAddText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    marginLeft: 6,
  },

  /* =======================================================
     MODAL
  ======================================================= */

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(20, 18, 30, 0.45)",
    justifyContent: "flex-end",
  },

  petModal: {
    backgroundColor: "#F9F8FD",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "72%",
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 25,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#292735",
  },

  modalSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#92909E",
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  /* =======================================================
     PET OPTIONS
  ======================================================= */

  petListContent: {
    paddingBottom: 10,
  },

  petOption: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    minHeight: 68,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEAF2",
  },

  selectedPetOption: {
    borderColor: "#6C5DD3",
    backgroundColor: "#F7F5FF",
  },

  petOptionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
  },

  selectedPetOptionIcon: {
    backgroundColor: "#E8E4FC",
  },

  petOptionTextContainer: {
    flex: 1,
    marginLeft: 11,
  },

  petOptionName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#292735",
  },

  petOptionSpecies: {
    marginTop: 3,
    fontSize: 12,
    color: "#92909E",
  },

  checkIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: "#6C5DD3",
    justifyContent: "center",
    alignItems: "center",
  },
});