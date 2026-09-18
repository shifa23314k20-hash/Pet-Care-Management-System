// ============================================================
// HEALTH RECORD DETAILS PAGE
// ============================================================
// Displays complete information about ONE selected
// health record.
//
// DATA FLOW:
//
// Health Record List
//        ↓
// User clicks one record
//        ↓
// record.id is passed through router
//        ↓
// getHealthRecordById(recordId)
//        ↓
// Backend returns:
// {
//    healthRecord: {...},
//    pet: {...}
// }
//        ↓
// Display dynamic health record + pet information
//
// ============================================================

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

import {
  Activity,
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  FileText,
  HeartPulse,
  Pill,
  Stethoscope,
  Thermometer,
  Trash2,
  Weight,
} from "lucide-react-native";

import {
  deleteHealthRecord,
  getHealthRecordById,
} from "@/services/health";

// ============================================================
// TYPES
// ============================================================

interface HealthRecord {
  id: string;

  userId: string;

  petId: string;

  weight: number;

  temperature: number;

  illness: string;

  medication: string;

  veterinarian?: string;

  visitDate: string;

  notes?: string;

  createdAt?: string;

  updatedAt?: string;
}

interface Pet {
  id: string;

  name: string;

  image?: string;

  photo?: string;

  species?: string;

  breed?: string;
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

  lightRed: "#FFF1F1",
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function HealthRecordDetailsScreen() {
  const router = useRouter();

  // ==========================================================
  // GET RECORD ID
  // ==========================================================

  const { id } = useLocalSearchParams();

  const recordId = Array.isArray(id)
    ? id[0]
    : id;

  // ==========================================================
  // STATES
  // ==========================================================

  const [record, setRecord] =
    useState<HealthRecord | null>(null);

  const [pet, setPet] =
    useState<Pet | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [deleting, setDeleting] =
    useState(false);

  // ==========================================================
  // LOAD SINGLE HEALTH RECORD
  // ==========================================================
  //
  // IMPORTANT:
  //
  // We ONLY call:
  //
  // getHealthRecordById(recordId)
  //
  // The backend now returns both:
  //
  // healthRecord
  // pet
  //
  // So there is NO need to call:
  //
  // getPetsByUserId()
  //
  // ==========================================================

  const loadRecord = async () => {
    if (!recordId) {
      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "Loading Health Record:",
        recordId
      );

      console.log(
        "================================"
      );

      // ======================================================
      // GET SINGLE RECORD
      // ======================================================

      const response =
        await getHealthRecordById(
          recordId
        );

      console.log(
        "Health Record API Response:",
        response
      );

      // ======================================================
      // GET HEALTH RECORD FROM RESPONSE
      // ======================================================

      const recordData =
        response?.healthRecord ||
        response?.data?.healthRecord ||
        response?.record ||
        response?.data;

      // ======================================================
      // GET PET FROM SAME RESPONSE
      // ======================================================

      const petData =
        response?.pet ||
        response?.data?.pet ||
        null;

      // ======================================================
      // CHECK RECORD
      // ======================================================

      if (!recordData) {
        Alert.alert(
          "Record Not Found",

          "This health record could not be found.",

          [
            {
              text: "Go Back",

              onPress: () =>
                router.back(),
            },
          ]
        );

        return;
      }

      // ======================================================
      // SET RECORD
      // ======================================================

      console.log(
        "Selected Health Record:",
        recordData
      );

      setRecord(recordData);

      // ======================================================
      // SET PET
      // ======================================================

      console.log(
        "Pet Details:",
        petData
      );

      setPet(petData);
    } catch (error: any) {
      console.log(
        "Health Record Details Error:",
        error?.response?.data ||
          error?.message ||
          error
      );

      Alert.alert(
        "Unable to Load Record",

        error?.response?.data?.message ||
          "Something went wrong while loading this health record.",

        [
          {
            text: "Go Back",

            onPress: () =>
              router.back(),
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (recordId) {
      loadRecord();
    }
  }, [recordId]);

  // ==========================================================
  // REFRESH WHEN SCREEN GETS FOCUS
  // ==========================================================
  //
  // This is useful after editing the record.
  //
  // Edit → Save → Back
  //       ↓
  // Details screen gets focus
  //       ↓
  // Record is fetched again
  //
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      if (recordId) {
        loadRecord();
      }
    }, [recordId])
  );

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    dateString?: string
  ) => {
    if (!dateString) {
      return "Not available";
    }

    const date =
      new Date(dateString);

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return "Not available";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",

        day: "2-digit",

        month: "short",

        year: "numeric",
      }
    );
  };

  // ==========================================================
  // FORMAT DATE + TIME
  // ==========================================================

  const formatDateTime = (
    dateString?: string
  ) => {
    if (!dateString) {
      return "Not available";
    }

    const date =
      new Date(dateString);

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return "Not available";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",
      }
    );
  };

  // ==========================================================
  // EDIT RECORD
  // ==========================================================

  const handleEdit = () => {
    if (!record) {
      return;
    }

    router.push({
      pathname:
        "/tabs/screen/healthRecords/healthRecordForm",

      params: {
        id: record.id,
      },
    });
  };

  // ==========================================================
  // DELETE RECORD
  // ==========================================================

  const handleDelete = () => {
    if (!record) {
      return;
    }

    Alert.alert(
      "Delete Health Record",

      "Are you sure you want to delete this health record? This action cannot be undone.",

      [
        {
          text: "Cancel",

          style: "cancel",
        },

        {
          text: "Delete",

          style: "destructive",

          onPress:
            confirmDelete,
        },
      ]
    );
  };

  // ==========================================================
  // CONFIRM DELETE
  // ==========================================================

  const confirmDelete =
    async () => {
      if (!record) {
        return;
      }

      try {
        setDeleting(true);

        await deleteHealthRecord(
          record.id
        );

        Alert.alert(
          "Record Deleted",

          "The health record has been deleted successfully.",

          [
            {
              text: "OK",

              onPress: () =>
                router.back(),
            },
          ]
        );
      } catch (error: any) {
        console.log(
          "Delete Health Record Error:",
          error?.response?.data ||
            error?.message ||
            error
        );

        Alert.alert(
          "Delete Failed",

          error?.response?.data
            ?.message ||
            "Unable to delete the health record. Please try again."
        );
      } finally {
        setDeleting(false);
      }
    };

  // ==========================================================
  // LOADING SCREEN
  // ==========================================================

  if (loading) {
    return (
      <SafeAreaView
        style={
          styles.loadingContainer
        }
        edges={[
          "top",
          "bottom",
        ]}
      >
        <View
          style={
            styles.loadingIcon
          }
        >
          <HeartPulse
            size={31}
            color={
              COLORS.primary
            }
          />
        </View>

        <ActivityIndicator
          size="small"
          color={
            COLORS.primary
          }
          style={
            styles.loadingSpinner
          }
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading health record...
        </Text>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // RECORD NOT FOUND
  // ==========================================================

  if (!record) {
    return (
      <SafeAreaView
        style={
          styles.notFoundContainer
        }
        edges={[
          "top",
          "bottom",
        ]}
      >
        <View
          style={
            styles.notFoundIcon
          }
        >
          <FileText
            size={35}
            color={
              COLORS.primary
            }
          />
        </View>

        <Text
          style={
            styles.notFoundTitle
          }
        >
          Record Not Found
        </Text>

        <Text
          style={
            styles.notFoundText
          }
        >
          We couldn't find the
          health record you're
          looking for.
        </Text>

        <TouchableOpacity
          style={
            styles.backToRecordsButton
          }
          onPress={() =>
            router.back()
          }
          activeOpacity={0.85}
        >
          <Text
            style={
              styles.backToRecordsText
            }
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ==========================================================
  // PET IMAGE
  // ==========================================================

  const petImage =
    pet?.image ||
    pet?.photo ||
    null;

  // ==========================================================
  // MAIN UI
  // ==========================================================

  return (
    <SafeAreaView
      style={styles.container}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        {/* ==================================================
            HEADER
        ================================================== */}

        <View
          style={styles.header}
        >
          <TouchableOpacity
            style={
              styles.backButton
            }
            activeOpacity={0.75}
            onPress={() =>
              router.back()
            }
          >
            <ArrowLeft
              size={21}
              color={
                COLORS.text
              }
              strokeWidth={2.2}
            />
          </TouchableOpacity>

          <View
            style={
              styles.headerText
            }
          >
            <Text
              style={styles.title}
            >
              Health Record
            </Text>

            <Text
              style={
                styles.subtitle
              }
            >
              Complete medical information
            </Text>
          </View>

          {/* HEADER DELETE */}

          <TouchableOpacity
            style={
              styles.headerDeleteButton
            }
            activeOpacity={0.75}
            onPress={
              handleDelete
            }
            disabled={deleting}
          >
            <Trash2
              size={19}
              color={
                COLORS.red
              }
            />
          </TouchableOpacity>
        </View>

        {/* ==================================================
            DYNAMIC PET CARD
        ================================================== */}

        <View
          style={styles.petCard}
        >
          {/* =================================================
              PET IMAGE
          ================================================= */}

          <View
            style={
              styles.petImageContainer
            }
          >
            {petImage ? (
              <Image
                source={{
                  uri: petImage,
                }}
                style={
                  styles.petImage
                }
              />
            ) : (
              <HeartPulse
                size={29}
                color={
                  COLORS.primary
                }
                strokeWidth={2}
              />
            )}
          </View>

          {/* =================================================
              PET DETAILS
          ================================================= */}

          <View
            style={
              styles.petInfo
            }
          >
            <Text
              style={
                styles.petLabel
              }
            >
              HEALTH RECORD FOR
            </Text>

            <Text
              style={
                styles.petName
              }
              numberOfLines={1}
            >
              {pet?.name ||
                "Pet Information Unavailable"}
            </Text>

            {/* SPECIES + BREED */}

            {(pet?.species ||
              pet?.breed) && (
              <Text
                style={
                  styles.petDetails
                }
                numberOfLines={1}
              >
                {pet?.species ||
                  ""}

                {pet?.species &&
                pet?.breed
                  ? " • "
                  : ""}

                {pet?.breed ||
                  ""}
              </Text>
            )}

            {/* PET ID ONLY IF PET DETAILS ARE
                NOT AVAILABLE */}

            {!pet && (
              <Text
                style={
                  styles.petIdText
                }
                numberOfLines={1}
              >
                Pet ID:{" "}
                {record.petId}
              </Text>
            )}
          </View>

          {/* =================================================
              MEDICAL BADGE
          ================================================= */}

          <View
            style={
              styles.recordBadge
            }
          >
            <HeartPulse
              size={14}
              color={
                COLORS.primary
              }
            />

            <Text
              style={
                styles.recordBadgeText
              }
            >
              Medical
            </Text>
          </View>
        </View>

        {/* ==================================================
            VISIT DATE
        ================================================== */}

        <View
          style={
            styles.visitCard
          }
        >
          <View
            style={
              styles.visitIcon
            }
          >
            <CalendarDays
              size={21}
              color={
                COLORS.primary
              }
            />
          </View>

          <View
            style={
              styles.visitInfo
            }
          >
            <Text
              style={
                styles.visitLabel
              }
            >
              VISIT DATE
            </Text>

            <Text
              style={
                styles.visitDate
              }
            >
              {formatDate(
                record.visitDate
              )}
            </Text>
          </View>
        </View>

        {/* ==================================================
            HEALTH MEASUREMENTS
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Health Measurements
        </Text>

        <View
          style={
            styles.measurementsRow
          }
        >
          {/* WEIGHT */}

          <View
            style={
              styles.measurementCard
            }
          >
            <View
              style={
                styles.measurementIcon
              }
            >
              <Weight
                size={21}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text
              style={
                styles.measurementLabel
              }
            >
              Weight
            </Text>

            <Text
              style={
                styles.measurementValue
              }
            >
              {record.weight}

              <Text
                style={
                  styles.measurementUnit
                }
              >
                {" "}
                kg
              </Text>
            </Text>
          </View>

          {/* TEMPERATURE */}

          <View
            style={
              styles.measurementCard
            }
          >
            <View
              style={
                styles.measurementIcon
              }
            >
              <Thermometer
                size={21}
                color={
                  COLORS.primary
                }
              />
            </View>

            <Text
              style={
                styles.measurementLabel
              }
            >
              Temperature
            </Text>

            <Text
              style={
                styles.measurementValue
              }
            >
              {record.temperature}

              <Text
                style={
                  styles.measurementUnit
                }
              >
                {" "}
                °C
              </Text>
            </Text>
          </View>
        </View>

        {/* ==================================================
            MEDICAL INFORMATION
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Medical Information
        </Text>

        <View
          style={
            styles.detailsCard
          }
        >
          {/* ILLNESS */}

          <DetailRow
            icon={
              <Activity
                size={19}
                color={
                  COLORS.primary
                }
              />
            }
            label="Illness / Health Issue"
            value={
              record.illness
            }
          />

          <View
            style={
              styles.detailDivider
            }
          />

          {/* MEDICATION */}

          <DetailRow
            icon={
              <Pill
                size={19}
                color={
                  COLORS.primary
                }
              />
            }
            label="Medication"
            value={
              record.medication
            }
          />

          {/* VETERINARIAN */}

          {record.veterinarian ? (
            <>
              <View
                style={
                  styles.detailDivider
                }
              />

              <DetailRow
                icon={
                  <Stethoscope
                    size={19}
                    color={
                      COLORS.primary
                    }
                  />
                }
                label="Veterinarian"
                value={
                  record.veterinarian
                }
              />
            </>
          ) : null}
        </View>

        {/* ==================================================
            NOTES
        ================================================== */}

        {record.notes ? (
          <>
            <Text
              style={
                styles.sectionTitle
              }
            >
              Notes
            </Text>

            <View
              style={
                styles.notesCard
              }
            >
              <View
                style={
                  styles.notesIcon
                }
              >
                <FileText
                  size={19}
                  color={
                    COLORS.primary
                  }
                />
              </View>

              <Text
                style={
                  styles.notesText
                }
              >
                {record.notes}
              </Text>
            </View>
          </>
        ) : null}

        {/* ==================================================
            RECORD INFORMATION
        ================================================== */}

        <Text
          style={
            styles.sectionTitle
          }
        >
          Record Information
        </Text>

        <View
          style={
            styles.recordInfoCard
          }
        >
          {/* RECORD ID */}

          <View
            style={
              styles.recordInfoRow
            }
          >
            <Text
              style={
                styles.recordInfoLabel
              }
            >
              Record ID
            </Text>

            <Text
              style={
                styles.recordInfoValue
              }
              numberOfLines={1}
            >
              {record.id}
            </Text>
          </View>

          {/* PET ID */}

          <View
            style={
              styles.detailDivider
            }
          />

          <View
            style={
              styles.recordInfoRow
            }
          >
            <Text
              style={
                styles.recordInfoLabel
              }
            >
              Pet ID
            </Text>

            <Text
              style={
                styles.recordInfoValue
              }
              numberOfLines={1}
            >
              {record.petId}
            </Text>
          </View>

          {/* CREATED */}

          {record.createdAt && (
            <>
              <View
                style={
                  styles.detailDivider
                }
              />

              <View
                style={
                  styles.recordInfoRow
                }
              >
                <Text
                  style={
                    styles.recordInfoLabel
                  }
                >
                  Created
                </Text>

                <Text
                  style={
                    styles.recordInfoValue
                  }
                >
                  {formatDateTime(
                    record.createdAt
                  )}
                </Text>
              </View>
            </>
          )}

          {/* UPDATED */}

          {record.updatedAt && (
            <>
              <View
                style={
                  styles.detailDivider
                }
              />

              <View
                style={
                  styles.recordInfoRow
                }
              >
                <Text
                  style={
                    styles.recordInfoLabel
                  }
                >
                  Last Updated
                </Text>

                <Text
                  style={
                    styles.recordInfoValue
                  }
                >
                  {formatDateTime(
                    record.updatedAt
                  )}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* ==================================================
            EDIT BUTTON
        ================================================== */}

        <TouchableOpacity
          style={
            styles.editButton
          }
          activeOpacity={0.85}
          onPress={
            handleEdit
          }
        >
          <FileText
            size={19}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.editButtonText
            }
          >
            Edit Health Record
          </Text>

          <ChevronRight
            size={19}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        {/* ==================================================
            DELETE BUTTON
        ================================================== */}

        <TouchableOpacity
          style={
            styles.deleteButton
          }
          activeOpacity={0.8}
          onPress={
            handleDelete
          }
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator
              size="small"
              color={
                COLORS.red
              }
            />
          ) : (
            <>
              <Trash2
                size={18}
                color={
                  COLORS.red
                }
              />

              <Text
                style={
                  styles.deleteButtonText
                }
              >
                Delete Health Record
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* ==================================================
            BOTTOM SPACE
        ================================================== */}

        <View
          style={
            styles.bottomSpace
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================
// DETAIL ROW COMPONENT
// ============================================================

interface DetailRowProps {
  icon: React.ReactNode;

  label: string;

  value: string;
}

const DetailRow = ({
  icon,
  label,
  value,
}: DetailRowProps) => {
  return (
    <View
      style={
        styles.detailRow
      }
    >
      {/* ICON */}

      <View
        style={
          styles.detailIcon
        }
      >
        {icon}
      </View>

      {/* CONTENT */}

      <View
        style={
          styles.detailContent
        }
      >
        <Text
          style={
            styles.detailLabel
          }
        >
          {label}
        </Text>

        <Text
          style={
            styles.detailValue
          }
        >
          {value ||
            "Not specified"}
        </Text>
      </View>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  // ==========================================================
  // MAIN
  // ==========================================================

  container: {
    flex: 1,

    backgroundColor:
      COLORS.background,
  },

  scrollContent: {
    paddingHorizontal: 20,

    paddingTop: 14,

    paddingBottom: 30,
  },

  // ==========================================================
  // HEADER
  // ==========================================================

  header: {
    flexDirection: "row",

    alignItems: "center",

    marginBottom: 18,
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
    fontSize: 25,

    fontWeight: "800",

    color: COLORS.text,

    letterSpacing: -0.4,
  },

  subtitle: {
    fontSize: 12,

    color: COLORS.secondaryText,

    marginTop: 4,
  },

  headerDeleteButton: {
    width: 42,

    height: 42,

    borderRadius: 13,

    backgroundColor:
      COLORS.lightRed,

    alignItems: "center",

    justifyContent: "center",
  },

  // ==========================================================
  // PET CARD
  // ==========================================================

  petCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 22,

    padding: 17,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 14,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.05,

    shadowRadius: 8,

    elevation: 2,
  },

  petImageContainer: {
    width: 58,

    height: 58,

    borderRadius: 18,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",

    overflow: "hidden",
  },

  petImage: {
    width: 58,

    height: 58,

    borderRadius: 18,
  },

  petInfo: {
    flex: 1,

    marginLeft: 13,

    marginRight: 7,
  },

  petLabel: {
    fontSize: 9,

    fontWeight: "800",

    color:
      COLORS.secondaryText,

    letterSpacing: 0.6,
  },

  petName: {
    fontSize: 19,

    fontWeight: "800",

    color: COLORS.text,

    marginTop: 3,
  },

  petDetails: {
    fontSize: 11,

    color:
      COLORS.secondaryText,

    marginTop: 3,
  },

  petIdText: {
    fontSize: 9,

    color:
      COLORS.secondaryText,

    marginTop: 4,
  },

  recordBadge: {
    flexDirection: "row",

    alignItems: "center",

    gap: 4,

    paddingHorizontal: 8,

    paddingVertical: 6,

    borderRadius: 10,

    backgroundColor:
      COLORS.lightPurple,
  },

  recordBadgeText: {
    fontSize: 9,

    fontWeight: "700",

    color: COLORS.primary,
  },

  // ==========================================================
  // VISIT CARD
  // ==========================================================

  visitCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 18,

    padding: 15,

    flexDirection: "row",

    alignItems: "center",

    marginBottom: 23,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 7,

    elevation: 2,
  },

  visitIcon: {
    width: 45,

    height: 45,

    borderRadius: 14,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",
  },

  visitInfo: {
    marginLeft: 11,
  },

  visitLabel: {
    fontSize: 9,

    fontWeight: "800",

    color:
      COLORS.secondaryText,

    letterSpacing: 0.5,
  },

  visitDate: {
    fontSize: 14,

    fontWeight: "700",

    color: COLORS.text,

    marginTop: 3,
  },

  // ==========================================================
  // SECTION
  // ==========================================================

  sectionTitle: {
    fontSize: 18,

    fontWeight: "800",

    color: COLORS.text,

    marginBottom: 12,
  },

  // ==========================================================
  // MEASUREMENTS
  // ==========================================================

  measurementsRow: {
    flexDirection: "row",

    gap: 12,

    marginBottom: 23,
  },

  measurementCard: {
    flex: 1,

    backgroundColor:
      COLORS.white,

    borderRadius: 19,

    padding: 15,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 7,

    elevation: 2,
  },

  measurementIcon: {
    width: 39,

    height: 39,

    borderRadius: 12,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 10,
  },

  measurementLabel: {
    fontSize: 11,

    color:
      COLORS.secondaryText,
  },

  measurementValue: {
    fontSize: 20,

    fontWeight: "800",

    color: COLORS.text,

    marginTop: 3,
  },

  measurementUnit: {
    fontSize: 11,

    fontWeight: "600",

    color:
      COLORS.secondaryText,
  },

  // ==========================================================
  // MEDICAL DETAILS
  // ==========================================================

  detailsCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 20,

    padding: 16,

    marginBottom: 23,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 7,

    elevation: 2,
  },

  detailRow: {
    flexDirection: "row",

    alignItems: "center",
  },

  detailIcon: {
    width: 42,

    height: 42,

    borderRadius: 13,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 11,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 10,

    color:
      COLORS.secondaryText,

    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,

    fontWeight: "700",

    color: COLORS.text,

    lineHeight: 20,
  },

  detailDivider: {
    height: 1,

    backgroundColor:
      "#F0EEF4",

    marginVertical: 14,
  },

  // ==========================================================
  // NOTES
  // ==========================================================

  notesCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 20,

    padding: 16,

    flexDirection: "row",

    alignItems: "flex-start",

    marginBottom: 23,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 7,

    elevation: 2,
  },

  notesIcon: {
    width: 40,

    height: 40,

    borderRadius: 12,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",

    marginRight: 11,
  },

  notesText: {
    flex: 1,

    fontSize: 13,

    color: COLORS.label,

    lineHeight: 20,
  },

  // ==========================================================
  // RECORD INFORMATION
  // ==========================================================

  recordInfoCard: {
    backgroundColor:
      COLORS.white,

    borderRadius: 20,

    padding: 16,

    marginBottom: 22,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.04,

    shadowRadius: 7,

    elevation: 2,
  },

  recordInfoRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    gap: 15,
  },

  recordInfoLabel: {
    fontSize: 11,

    color:
      COLORS.secondaryText,
  },

  recordInfoValue: {
    flex: 1,

    fontSize: 11,

    fontWeight: "600",

    color: COLORS.text,

    textAlign: "right",
  },

  // ==========================================================
  // EDIT BUTTON
  // ==========================================================

  editButton: {
    height: 54,

    borderRadius: 15,

    backgroundColor:
      COLORS.primary,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 17,

    gap: 8,

    marginBottom: 11,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.12,

    shadowRadius: 7,

    elevation: 4,
  },

  editButtonText: {
    flex: 1,

    color: COLORS.white,

    fontSize: 14,

    fontWeight: "700",
  },

  // ==========================================================
  // DELETE BUTTON
  // ==========================================================

  deleteButton: {
    height: 50,

    borderRadius: 15,

    backgroundColor:
      COLORS.lightRed,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 8,
  },

  deleteButtonText: {
    color: COLORS.red,

    fontSize: 13,

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
  // NOT FOUND
  // ==========================================================

  notFoundContainer: {
    flex: 1,

    backgroundColor:
      COLORS.background,

    alignItems: "center",

    justifyContent: "center",

    paddingHorizontal: 30,
  },

  notFoundIcon: {
    width: 90,

    height: 90,

    borderRadius: 28,

    backgroundColor:
      COLORS.lightPurple,

    alignItems: "center",

    justifyContent: "center",

    marginBottom: 18,
  },

  notFoundTitle: {
    fontSize: 20,

    fontWeight: "800",

    color: COLORS.text,
  },

  notFoundText: {
    fontSize: 13,

    color:
      COLORS.secondaryText,

    textAlign: "center",

    lineHeight: 20,

    marginTop: 8,
  },

  backToRecordsButton: {
    marginTop: 22,

    backgroundColor:
      COLORS.primary,

    paddingHorizontal: 22,

    height: 48,

    borderRadius: 14,

    alignItems: "center",

    justifyContent: "center",
  },

  backToRecordsText: {
    color: COLORS.white,

    fontSize: 13,

    fontWeight: "700",
  },

  // ==========================================================
  // BOTTOM SPACE
  // ==========================================================

  bottomSpace: {
    height: 100,
  },
});