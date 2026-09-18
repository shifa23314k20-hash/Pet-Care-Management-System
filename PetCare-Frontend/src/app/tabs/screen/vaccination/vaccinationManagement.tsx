import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Alert,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  CalendarDays,
  CirclePlus,
  CheckCircle2,
  Syringe,
  ChevronRight,
} from "lucide-react-native";

import {
  router,
  useFocusEffect,
} from "expo-router";

import VaccinationForm from "@/components/vaccinationForm";

import {
  deleteVaccination,
  getVaccinationsByUserId,
} from "@/services/vaccination";

const PRIMARY = "#6C5DD3";

/* =========================================================
   TYPES
========================================================= */

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

type TabType = "Upcoming" | "History";

/* =========================================================
   COMPONENT
========================================================= */

export default function VaccinationManagement() {
  /* =========================================================
     STATE
  ========================================================= */

  const [userId, setUserId] = useState("");

  const [vaccinations, setVaccinations] =
    useState<Vaccination[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [tab, setTab] =
    useState<TabType>("Upcoming");

  const [modalVisible, setModalVisible] =
    useState(false);

  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);

  /* =========================================================
     LOAD LOGGED-IN USER
  ========================================================= */

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser =
          await AsyncStorage.getItem("user");

        console.log(
          "Stored user:",
          storedUser
        );

        if (!storedUser) {
          console.log(
            "No logged-in user found."
          );

          setLoading(false);
          return;
        }

        const user =
          JSON.parse(storedUser);

        console.log(
          "Vaccination user:",
          user
        );

        if (!user?.id) {
          console.log(
            "User ID not found."
          );

          setLoading(false);
          return;
        }

        setUserId(user.id);
      } catch (error) {
        console.log(
          "Load user error:",
          error
        );

        setLoading(false);
      }
    };

    loadUser();
  }, []);

  /* =========================================================
     FETCH VACCINATIONS
  ========================================================= */

  const fetchVaccinations = async (
    showLoader = true
  ) => {
    if (!userId) {
      return;
    }

    try {
      if (showLoader) {
        setLoading(true);
      }

      const response =
        await getVaccinationsByUserId(
          userId
        );

      console.log(
        "Vaccination response:",
        response
      );

      if (
        response?.success &&
        Array.isArray(
          response?.vaccinations
        )
      ) {
        setVaccinations(
          response.vaccinations
        );
      } else {
        setVaccinations([]);
      }
    } catch (error) {
      console.log(
        "Fetch vaccinations error:",
        error
      );

      Alert.alert(
        "Error",
        "Failed to fetch vaccination records."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     REFRESH WHEN SCREEN OPENS
  ========================================================= */

  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchVaccinations();
      }
    }, [userId])
  );

  /* =========================================================
     PULL TO REFRESH
  ========================================================= */

  const onRefresh = async () => {
    setRefreshing(true);

    await fetchVaccinations(false);
  };

  /* =========================================================
     TODAY
  ========================================================= */

  const today = useMemo(() => {
    const date = new Date();

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date;
  }, []);

  /* =========================================================
     GET DATE WITHOUT TIME
  ========================================================= */

  const getDateOnly = (
    value: string
  ) => {
    const date = new Date(value);

    date.setHours(
      0,
      0,
      0,
      0
    );

    return date;
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (
    value?: string | null
  ) => {
    if (!value) {
      return "--";
    }

    const date =
      new Date(value);

    if (
      isNaN(
        date.getTime()
      )
    ) {
      return "--";
    }

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     UPCOMING VACCINATIONS
  ========================================================= */

  const upcomingVaccinations =
    useMemo(() => {
      return vaccinations
        .filter((item) => {
          if (!item.nextDueDate) {
            return false;
          }

          const dueDate =
            getDateOnly(
              item.nextDueDate
            );

          return (
            dueDate.getTime() >=
            today.getTime()
          );
        })
        .sort((a, b) => {
          return (
            new Date(
              a.nextDueDate!
            ).getTime() -
            new Date(
              b.nextDueDate!
            ).getTime()
          );
        });
    }, [
      vaccinations,
      today,
    ]);

  /* =========================================================
     HISTORY
  ========================================================= */

  const historyVaccinations =
    useMemo(() => {
      return vaccinations
        .filter((item) => {
          /*
           * No next due date means
           * completed / historical record.
           */
          if (!item.nextDueDate) {
            return true;
          }

          const dueDate =
            getDateOnly(
              item.nextDueDate
            );

          return (
            dueDate.getTime() <
            today.getTime()
          );
        })
        .sort((a, b) => {
          return (
            new Date(
              b.dateGiven
            ).getTime() -
            new Date(
              a.dateGiven
            ).getTime()
          );
        });
    }, [
      vaccinations,
      today,
    ]);

  /* =========================================================
     CURRENT TAB DATA
  ========================================================= */

  const data =
    tab === "Upcoming"
      ? upcomingVaccinations
      : historyVaccinations;

  /* =========================================================
     VACCINATION STATUS
  ========================================================= */

  const getStatus = (
    nextDueDate?: string | null
  ) => {
    if (!nextDueDate) {
      return "Completed";
    }

    const dueDate =
      getDateOnly(nextDueDate);

    const difference =
      Math.ceil(
        (dueDate.getTime() -
          today.getTime()) /
          (1000 *
            60 *
            60 *
            24)
      );

    if (difference === 0) {
      return "Due Today";
    }

    if (difference <= 7) {
      return "Due Soon";
    }

    return "Upcoming";
  };

  /* =========================================================
     OPEN ADD MODAL
  ========================================================= */

  const openAddModal = () => {
    setSelectedVaccination(null);
    setModalVisible(true);
  };

  /* =========================================================
     CLOSE MODAL
  ========================================================= */

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVaccination(null);
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (
    id: string
  ) => {
    Alert.alert(
      "Delete Vaccination",
      "Are you sure you want to delete this vaccination record?",
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
              await deleteVaccination(
                id
              );

              await fetchVaccinations(
                false
              );

              Alert.alert(
                "Deleted",
                "Vaccination record deleted successfully."
              );
            } catch (error) {
              console.log(
                "Delete vaccination error:",
                error
              );

              Alert.alert(
                "Error",
                "Unable to delete vaccination."
              );
            }
          },
        },
      ]
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <View
        style={
          styles.loaderContainer
        }
      >
        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

        <Text
          style={
            styles.loadingText
          }
        >
          Loading vaccinations...
        </Text>
      </View>
    );
  }

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  const renderEmpty = () => {
    return (
      <View
        style={
          styles.emptyContainer
        }
      >
        <View
          style={
            styles.emptyIcon
          }
        >
          <Syringe
            size={40}
            color={PRIMARY}
          />
        </View>

        <Text
          style={
            styles.emptyTitle
          }
        >
          No Vaccinations
        </Text>

        <Text
          style={
            styles.emptySubtitle
          }
        >
          Keep your pet's health records
          organized by adding their
          vaccination details.
        </Text>

        <TouchableOpacity
          style={
            styles.emptyButton
          }
          onPress={
            openAddModal
          }
          activeOpacity={0.85}
        >
          <CirclePlus
            size={19}
            color="#FFFFFF"
          />

          <Text
            style={
              styles.emptyButtonText
            }
          >
            Add Vaccination
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <View
      style={
        styles.container
      }
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <View
        style={
          styles.header
        }
      >
        <View>
          <Text
            style={
              styles.headerTitle
            }
          >
            Vaccinations
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }
          >
            Keep track of your pet's vaccines
          </Text>
        </View>

        <TouchableOpacity
          style={
            styles.addButton
          }
          onPress={
            openAddModal
          }
          activeOpacity={0.85}
        >
          <CirclePlus
            size={25}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* =====================================================
          TABS
      ===================================================== */}

      <View
        style={
          styles.tabContainer
        }
      >
        {/* Upcoming */}

        <TouchableOpacity
          style={[
            styles.tabButton,
            tab === "Upcoming" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setTab("Upcoming")
          }
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              tab === "Upcoming" &&
                styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>

          <View
            style={[
              styles.countBadge,
              tab === "Upcoming" &&
                styles.activeCountBadge,
            ]}
          >
            <Text
              style={[
                styles.countText,
                tab === "Upcoming" &&
                  styles.activeCountText,
              ]}
            >
              {
                upcomingVaccinations.length
              }
            </Text>
          </View>
        </TouchableOpacity>

        {/* History */}

        <TouchableOpacity
          style={[
            styles.tabButton,
            tab === "History" &&
              styles.activeTab,
          ]}
          onPress={() =>
            setTab("History")
          }
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              tab === "History" &&
                styles.activeTabText,
            ]}
          >
            History
          </Text>

          <View
            style={[
              styles.countBadge,
              tab === "History" &&
                styles.activeCountBadge,
            ]}
          >
            <Text
              style={[
                styles.countText,
                tab === "History" &&
                  styles.activeCountText,
              ]}
            >
              {
                historyVaccinations.length
              }
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* =====================================================
          VACCINATION LIST
      ===================================================== */}

      <FlatList
        data={data}
        keyExtractor={(item) =>
          item.id
        }
        showsVerticalScrollIndicator={
          false
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
            tintColor={
              PRIMARY
            }
          />
        }
        contentContainerStyle={[
          styles.listContent,
          data.length === 0 &&
            styles.emptyListContent,
        ]}
        ListEmptyComponent={
          renderEmpty
        }
        renderItem={({
          item,
        }) => {
          const status =
            getStatus(
              item.nextDueDate
            );

          return (
            <TouchableOpacity
              activeOpacity={0.85}
              style={
                styles.card
              }
              onPress={() =>
                router.push({
                  pathname:
                    "/tabs/screen/vaccination/vaccinationDetails",
                  params: {
                    id: item.id,
                  },
                })
              }
            >
              {/* Icon */}

              <View
                style={[
                  styles.iconContainer,
                  tab ===
                    "History" &&
                    styles.historyIcon,
                ]}
              >
                {tab ===
                "Upcoming" ? (
                  <CalendarDays
                    size={23}
                    color={
                      PRIMARY
                    }
                  />
                ) : (
                  <CheckCircle2
                    size={23}
                    color="#22C55E"
                  />
                )}
              </View>

              {/* Content */}

              <View
                style={
                  styles.cardContent
                }
              >
                <Text
                  style={
                    styles.vaccineName
                  }
                  numberOfLines={
                    1
                  }
                >
                  {
                    item.vaccineName
                  }
                </Text>

                <View
                  style={
                    styles.dateRow
                  }
                >
                  <CalendarDays
                    size={14}
                    color="#92909E"
                  />

                  <Text
                    style={
                      styles.dateText
                    }
                  >
                    {tab ===
                    "Upcoming"
                      ? `Due ${formatDate(
                          item.nextDueDate
                        )}`
                      : `Given ${formatDate(
                          item.dateGiven
                        )}`}
                  </Text>
                </View>

                {tab ===
                  "History" &&
                  item.nextDueDate && (
                    <Text
                      style={
                        styles.givenText
                      }
                    >
                      Next due{" "}
                      {formatDate(
                        item.nextDueDate
                      )}
                    </Text>
                  )}
              </View>

              {/* Right side */}

              <View
                style={
                  styles.rightSection
                }
              >
                {tab ===
                "Upcoming" ? (
                  <View
                    style={[
                      styles.statusBadge,
                      status ===
                        "Due Soon" &&
                        styles.dueSoonBadge,
                      status ===
                        "Due Today" &&
                        styles.dueTodayBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        status ===
                          "Due Soon" &&
                          styles.dueSoonText,
                        status ===
                          "Due Today" &&
                          styles.dueTodayText,
                      ]}
                    >
                      {status}
                    </Text>
                  </View>
                ) : (
                  <CheckCircle2
                    size={22}
                    color="#22C55E"
                  />
                )}

                <ChevronRight
                  size={19}
                  color="#B5B2C0"
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      <Modal
        visible={
          modalVisible
        }
        animationType="slide"
        transparent
        onRequestClose={
          closeModal
        }
      >
        <VaccinationForm
          vaccination={
            selectedVaccination
          }
          userId={userId}
          onClose={async () => {
            closeModal();

            await fetchVaccinations(
              false
            );
          }}
        />
      </Modal>
    </View>
  );
}

/* =============================================================
   STYLES
============================================================= */

const styles = StyleSheet.create({
  /* ---------------------------------------------------------
     MAIN
  --------------------------------------------------------- */

  container: {
    flex: 1,
    backgroundColor: "#F9F8FD",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F8FD",
  },

  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: "#92909E",
  },

  /* ---------------------------------------------------------
     HEADER
  --------------------------------------------------------- */

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: "#242331",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#92909E",
    marginTop: 3,
  },

  addButton: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: PRIMARY,

    alignItems: "center",
    justifyContent: "center",

    shadowColor: PRIMARY,
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  /* ---------------------------------------------------------
     TABS
  --------------------------------------------------------- */

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",

    borderRadius: 16,

    padding: 4,
    marginBottom: 18,

    borderWidth: 1,
    borderColor: "#ECEAF2",
  },

  tabButton: {
    flex: 1,
    minHeight: 46,

    borderRadius: 13,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,
  },

  activeTab: {
    backgroundColor: PRIMARY,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#92909E",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  countBadge: {
    minWidth: 23,
    height: 23,

    paddingHorizontal: 6,

    borderRadius: 12,

    backgroundColor: "#F1F0F6",

    alignItems: "center",
    justifyContent: "center",
  },

  activeCountBadge: {
    backgroundColor:
      "rgba(255,255,255,0.20)",
  },

  countText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#777481",
  },

  activeCountText: {
    color: "#FFFFFF",
  },

  /* ---------------------------------------------------------
     LIST
  --------------------------------------------------------- */

  listContent: {
    paddingBottom: 160,
  },

  emptyListContent: {
    flexGrow: 1,
  },

  /* ---------------------------------------------------------
     CARD
  --------------------------------------------------------- */

  card: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#FFFFFF",

    borderRadius: 20,

    padding: 15,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: "#ECEAF2",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  iconContainer: {
    width: 58,
    height: 58,

    borderRadius: 18,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 13,
  },

  historyIcon: {
    backgroundColor: "#EAFBF2",
  },

  cardContent: {
    flex: 1,
    minWidth: 0,
  },

  vaccineName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#242331",

    marginBottom: 6,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",

    gap: 5,
  },

  dateText: {
    fontSize: 13,
    color: "#777481",
    fontWeight: "600",
  },

  givenText: {
    fontSize: 11,
    color: "#AAA7B2",
    marginTop: 4,
  },

  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",

    gap: 9,

    marginLeft: 8,
  },

  /* ---------------------------------------------------------
     STATUS
  --------------------------------------------------------- */

  statusBadge: {
    backgroundColor: "#EFECFB",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 50,
  },

  dueSoonBadge: {
    backgroundColor: "#FFF4DD",
  },

  dueTodayBadge: {
    backgroundColor: "#FEECEC",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: PRIMARY,
  },

  dueSoonText: {
    color: "#D97706",
  },

  dueTodayText: {
    color: "#DC2626",
  },

  /* ---------------------------------------------------------
     EMPTY STATE
  --------------------------------------------------------- */

  emptyContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 90,
    height: 90,

    borderRadius: 28,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#242331",
  },

  emptySubtitle: {
    fontSize: 14,
    color: "#92909E",

    textAlign: "center",

    lineHeight: 21,

    marginTop: 7,
  },

  emptyButton: {
    height: 50,

    paddingHorizontal: 20,

    borderRadius: 15,

    backgroundColor: PRIMARY,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    marginTop: 20,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});