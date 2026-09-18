import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { CalendarDays, ChevronRight, Plus, X, Clock3 } from "lucide-react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAppointment, getAllAppointments, updateAppointment } from "@/services/appointment";
import AppointmentForm from "@/components/appointmentForm";

const PRIMARY = "#6C5DD3";

interface Appointment {
  id: string;
  title: string;
  type: string;
  dateTime: string;
  status: string;
  notes?: string;
  petId?: string;
  userId?: string;
  reminderEnabled?: boolean;
  reminderTime?: string | null;
}

export default function CalendarScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<"Upcoming" | "Past">("Upcoming");
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await getAllAppointments();
      console.log("APPOINTMENT RESPONSE:", res);

      const data = res?.data?.appointments || res?.data || res?.appointments || [];
      console.log("APPOINTMENTS:", data);

      setAppointments(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log("FETCH APPOINTMENTS ERROR:", error?.response?.data || error?.message);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh =
    useCallback(() => {
      setRefreshing(true);
      fetchAppointments();
    }, []);

  const filteredAppointments =
    useMemo(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return appointments.filter(
        (item) => {
          const date = new Date(item.dateTime);
          date.setHours(0, 0, 0, 0);
          return tab === "Upcoming"
            ? date >= today
            : date < today;
        }
      );
    }, [appointments, tab]);

  const openAddAppointment = () => {
    setEditingAppointment(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) { return }
    setModalVisible(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = async (values: any) => {
    try {
      setSaving(true);
      if (editingAppointment) {
        const response =
          await updateAppointment(
            editingAppointment.id,
            {
              ...values,
              userId: editingAppointment.userId,
              petId: values.petId || editingAppointment.petId,
              dateTime:
                values.date &&
                  values.time
                  ? new Date(`${values.date}T${values.time}:00`).toISOString()
                  : editingAppointment.dateTime,
            }
          );
        Alert.alert("Success", response?.message || "Appointment updated successfully.");
      }
      else {
        const user = await AsyncStorage.getItem("user");
        if (!user) {
          Alert.alert("Error", "User not found.");
          return;
        }
        const parsedUser = JSON.parse(user);
        const appointmentDateTime = new Date(`${values.date}T${values.time}:00`);
        const payload = {
          userId: parsedUser.id,
          petId: values.petId,
          title: values.title,
          type: values.type,
          dateTime: appointmentDateTime.toISOString(),
          notes: values.notes,
          reminderEnabled: values.reminderEnabled,
          reminderTime: values.reminderEnabled ? appointmentDateTime.toISOString() : null,
          status: values.status,
        };
        console.log("CREATE APPOINTMENT PAYLOAD:", payload);
        const response = await createAppointment(payload);
        Alert.alert("Success", response?.message || "Appointment created successfully.");
      }
      closeModal();
      await fetchAppointments();
    } catch (error: any) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };
  const renderItem =
    ({
      item,
    }: {
      item: Appointment;
    }) => {
      const appointmentDate =
        new Date(
          item.dateTime
        );
      const formattedDate =
        appointmentDate.toLocaleDateString(
          "en-GB",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        );
      const formattedTime =
        appointmentDate.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        );
      return (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname:
                "/tabs/screen/appoinment/appointmentDetails",
              params: {
                id: item.id,
              },
            })
          }
        >
          <View style={styles.appointmentCard}>
            <View
              style={styles.appointmentIcon}
            >
              <CalendarDays
                size={24}
                color={PRIMARY}
              />
            </View>
            <View
              style={styles.appointmentInfo}
            >
              <View
                style={styles.titleRow}
              >
                <Text
                  style={styles.appointmentTitle}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
              <View
                style={styles.dateRow}
              >
                <Clock3
                  size={14}
                  color="#9997A5"
                />
                <Text
                  style={styles.appointmentDate}
                >
                  {formattedDate}
                  {"  •  "}
                  {formattedTime}
                </Text>
              </View>
              <View
                style={styles.bottomRow}
              >
                <View
                  style={styles.typeBadge}
                >
                  <Text
                    style={styles.typeText}
                  >
                    {item.type}
                  </Text>

                </View>


                {item.status && (

                  <Text
                    style={styles.statusText}
                  >
                    {item.status}
                  </Text>

                )}

              </View>

            </View>
            <ChevronRight
              size={21}
              color="#A4A1AD"
            />

          </View>

        </TouchableOpacity>

      );
    };

  if (loading) {

    return (

      <SafeAreaView
        style={styles.loadingContainer}
      >

        <ActivityIndicator
          size="large"
          color={PRIMARY}
        />

        <Text
          style={styles.loadingText}
        >
          Loading appointments...
        </Text>

      </SafeAreaView>

    );
  }
  return (

    <SafeAreaView
      style={styles.safeArea}
    >

      <View
        style={styles.container}
      >

        <View
          style={styles.header}
        >

          <View>

            <Text
              style={styles.headerTitle}
            >
              Appointments
            </Text>

            <Text
              style={styles.headerSubtitle}
            >
              {appointments.length}{" "}
              {appointments.length === 1
                ? "appointment"
                : "appointments"}{" "}
              in your schedule
            </Text>

          </View>


          <TouchableOpacity
            style={styles.addButton}
            onPress={
              openAddAppointment
            }
            activeOpacity={0.8}
          >

            <Plus
              size={20}
              color="#FFFFFF"
            />

            <Text
              style={styles.addButtonText}
            >
              Add
            </Text>

          </TouchableOpacity>

        </View>

        <View
          style={styles.tabs}
        >

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

          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.tabButton,

              tab === "Past" &&
              styles.activeTab,
            ]}
            onPress={() =>
              setTab("Past")
            }
            activeOpacity={0.8}
          >

            <Text
              style={[
                styles.tabText,

                tab === "Past" &&
                styles.activeTabText,
              ]}
            >
              Past
            </Text>

          </TouchableOpacity>

        </View>

        <FlatList
          data={
            filteredAppointments
          }

          keyExtractor={
            (item) => item.id
          }

          renderItem={
            renderItem
          }

          showsVerticalScrollIndicator={
            false
          }

          contentContainerStyle={
            styles.listContent
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

          ListEmptyComponent={

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

                <CalendarDays
                  size={42}
                  color={PRIMARY}
                />

              </View>


              <Text
                style={
                  styles.emptyTitle
                }
              >
                No{" "}
                {tab === "Upcoming"
                  ? "Upcoming"
                  : "Past"}{" "}
                Appointments
              </Text>


              <Text
                style={
                  styles.emptyText
                }
              >
                {tab === "Upcoming"
                  ? "Schedule an appointment to keep track of your pet's health and care."
                  : "Your past appointments will appear here."}
              </Text>


              {tab === "Upcoming" && (

                <TouchableOpacity
                  style={
                    styles.emptyButton
                  }
                  onPress={
                    openAddAppointment
                  }
                  activeOpacity={0.85}
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
                    Add Appointment
                  </Text>

                </TouchableOpacity>

              )}

            </View>

          }

        />

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
              <View
                style={
                  styles.modalHandle
                }
              />
              <View
                style={
                  styles.modalHeader
                }
              >

                <View
                  style={
                    styles.modalHeaderText
                  }
                >

                  <Text
                    style={
                      styles.modalTitle
                    }
                  >
                    {editingAppointment
                      ? "Edit Appointment"
                      : "Add Appointment"}
                  </Text>


                  <Text
                    style={
                      styles.modalSubtitle
                    }
                  >
                    {editingAppointment
                      ? "Update your appointment details"
                      : "Schedule a new appointment for your pet"}
                  </Text>

                </View>


                <TouchableOpacity
                  style={
                    styles.closeButton
                  }
                  onPress={
                    closeModal
                  }
                  disabled={
                    saving
                  }
                  activeOpacity={
                    0.7
                  }
                >

                  <X
                    size={20}
                    color="#777582"
                  />

                </TouchableOpacity>

              </View>

              <View
                style={
                  styles.formContainer
                }
              >

                <AppointmentForm

                  buttonTitle={
                    editingAppointment
                      ? "Save Changes"
                      : "Create Appointment"
                  }

                  loading={
                    saving
                  }

                  initialValues={
                    editingAppointment
                      ? {
                        title:
                          editingAppointment.title,

                        petId:
                          editingAppointment.petId,

                        type:
                          editingAppointment.type,

                        date:
                          editingAppointment.dateTime
                            ? new Date(
                              editingAppointment.dateTime
                            )
                              .toISOString()
                              .split("T")[0]
                            : "",

                        time:
                          editingAppointment.dateTime
                            ? new Date(
                              editingAppointment.dateTime
                            )
                              .toTimeString()
                              .slice(0, 5)
                            : "",

                        notes:
                          editingAppointment.notes ||
                          "",

                        reminderEnabled:
                          editingAppointment.reminderEnabled ??
                          true,

                        status:
                          editingAppointment.status ||
                          "upcoming",
                      }
                      : undefined
                  }

                  onSubmit={
                    handleSaveAppointment
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

const styles =
  StyleSheet.create({
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
      justifyContent: "center",

      backgroundColor: PRIMARY,

      paddingHorizontal: 16,

      height: 48,

      borderRadius: 15,

      gap: 6,

      shadowColor: PRIMARY,
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

    tabs: {
      flexDirection: "row",

      backgroundColor: "#FFFFFF",

      borderRadius: 16,

      borderWidth: 1,
      borderColor: "#E8E6EF",

      padding: 4,

      marginBottom: 18,
    },

    tabButton: {
      flex: 1,

      height: 44,

      borderRadius: 12,

      alignItems: "center",
      justifyContent: "center",
    },

    activeTab: {
      backgroundColor: "#F0EDFF",
    },

    tabText: {
      fontSize: 14,

      fontWeight: "700",

      color: "#9694A2",
    },

    activeTabText: {
      color: PRIMARY,
    },

    listContent: {
      paddingBottom: 120,
    },

    appointmentCard: {
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


    appointmentIcon: {
      width: 62,
      height: 62,

      borderRadius: 18,

      backgroundColor: "#EFECFB",

      alignItems: "center",
      justifyContent: "center",
    },


    appointmentInfo: {
      flex: 1,

      marginLeft: 14,

      marginRight: 8,
    },


    titleRow: {
      flexDirection: "row",

      alignItems: "center",

      marginBottom: 5,
    },


    appointmentTitle: {
      flex: 1,

      fontSize: 17,

      fontWeight: "800",

      color: "#292735",
    },


    dateRow: {
      flexDirection: "row",

      alignItems: "center",
    },


    appointmentDate: {
      fontSize: 12,

      color: "#9997A5",

      marginLeft: 5,

      fontWeight: "600",
    },


    bottomRow: {
      flexDirection: "row",

      alignItems: "center",

      marginTop: 8,
    },


    typeBadge: {
      backgroundColor: "#F0EDFF",

      paddingHorizontal: 9,

      paddingVertical: 4,

      borderRadius: 10,
    },


    typeText: {
      fontSize: 10,

      fontWeight: "700",

      color: PRIMARY,

      textTransform: "capitalize",
    },


    statusText: {
      fontSize: 10,

      fontWeight: "700",

      color: "#9997A5",

      textTransform: "capitalize",

      marginLeft: 9,
    },
    emptyContainer: {
      alignItems: "center",

      justifyContent: "center",

      paddingTop: 80,

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
      fontSize: 21,

      fontWeight: "800",

      color: "#292735",

      textAlign: "center",
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

      backgroundColor: PRIMARY,

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
    modalOverlay: {
      flex: 1,

      justifyContent: "flex-end",

      backgroundColor:
        "rgba(20,18,35,0.45)",
    },


    modalContainer: {
      backgroundColor: "#FFFFFF",

      height: "88%",

      borderTopLeftRadius: 28,

      borderTopRightRadius: 28,

      overflow: "hidden",
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

      paddingBottom: 15,

      borderBottomWidth: 1,

      borderBottomColor: "#F0EEF4",
    },


    modalHeaderText: {
      flex: 1,
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


    formContainer: {
      flex: 1,
    },

  });