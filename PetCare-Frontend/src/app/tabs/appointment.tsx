import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { CalendarDays, ChevronRight, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { createAppointment, getAllAppointments, updateAppointment } from "@/services/appointment";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentForm from "@/components/appointmentForm"
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Appointment {
  id: string;
  title: string;
  type: string;
  dateTime: string;
  status: string;
  notes?: string;
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

      console.log("Response: ", res)
      const data =
        res?.data?.appointments ||
        res?.data ||
        res?.appointments ||
        [];

      console.log("Appointments:", data);

      setAppointments(Array.isArray(data) ? data : []);
    } catch (e) {
      console.log(e);
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    return appointments.filter((item) => {
      const date = new Date(item.dateTime);
      date.setHours(0, 0, 0, 0);

      console.log("Appointments:", appointments);
      // console.log("Filtered:", filteredAppointments);

      return tab === "Upcoming"
        ? date >= today
        : date < today;
    });
  }, [appointments, tab]);

  const renderItem = ({ item }: { item: Appointment }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() =>
      router.push({
        pathname: "/tabs/screen/appoinment/appointmentDetails",
        params: {
          id: item.id,
        },
      })
    }
  >
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <CalendarDays color="#7C5CFC" size={22} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={styles.date}>
          {new Date(item.dateTime).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          {" • "}
          {new Date(item.dateTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>

        <Text
          style={{
            marginTop: 6,
            color: "#7C5CFC",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
        >
          {item.type}
        </Text>
      </View>

      <ChevronRight
        size={22}
        color="#9CA3AF"
      />
    </View>
  </TouchableOpacity>
);

  const handleSaveAppointment = async (values: any) => {
    try {
      setSaving(true);

      if (editingAppointment) {
        const response = await updateAppointment(
          editingAppointment.id,
          values
        );

        Alert.alert(
          "Success",
          response.message
        );
      } else {
        const user = await AsyncStorage.getItem("user");

        if (!user) {
          Alert.alert("User not found");
          return;
        }

        const parsedUser = JSON.parse(user);

        const payload = {
          userId: parsedUser.id,
          petId: values.petId,
          title: values.title,
          type: values.type,

          dateTime: new Date(
            `${values.date}T${values.time}:00`
          ).toISOString(),

          notes: values.notes,
          reminderEnabled: values.reminderEnabled,

          reminderTime: values.reminderEnabled
            ? new Date(
              `${values.date}T${values.time}:00`
            ).toISOString()
            : null,

          status: values.status,
        };

        console.log(payload);

        const response = await createAppointment(payload);

        Alert.alert(
          "Success",
          response.message
        );
      }

      setModalVisible(false);
      setEditingAppointment(null);

      fetchAppointments();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#7C5CFC" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Appointments</Text>

        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={() => {
            setEditingAppointment(null);
            setModalVisible(true);
          }}
        >
          <Plus size={16} color="#6C5DD3" />
          <Text style={styles.addText}>Add Appointment</Text>
        </TouchableOpacity>
      </View>
      {/* Tabs */}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            tab === "Upcoming" && styles.activeTab,
          ]}
          onPress={() => setTab("Upcoming")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "Upcoming" && styles.activeText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            tab === "Past" && styles.activeTab,
          ]}
          onPress={() => setTab("Past")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "Past" && styles.activeText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredAppointments}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: 120,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#7C5CFC"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              No appointments found
            </Text>
          </View>
        }
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        >
          <SafeAreaView
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              maxHeight: "82%",
              overflow: "hidden",
            }}
          >
            {/* Handle */}
            <View
              style={{
                width: 45,
                height: 5,
                backgroundColor: "#D1D5DB",
                borderRadius: 999,
                alignSelf: "center",
                marginTop: 10,
                marginBottom: 10,
              }}
            />

            {/* Header */}

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingBottom: 15,
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "700",
                }}
              >
                {editingAppointment
                  ? "Edit Appointment"
                  : "Add Appointment"}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  setEditingAppointment(null);
                }}
              >
                <Text
                  style={{
                    fontSize: 24,
                  }}
                >
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <AppointmentForm
              buttonTitle={
                editingAppointment
                  ? "Update Appointment"
                  : "Save Appointment"
              }
              loading={saving}
              initialValues={
                editingAppointment
                  ? {
                    title: editingAppointment.title,
                  }
                  : undefined
              }
              onSubmit={handleSaveAppointment}
            />

          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const PRIMARY = "#7C5CFC";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFC",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 16,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  addText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6C5DD3",
  },


  tabs: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },

  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: PRIMARY,
  },

  tabText: {
    color: "#888",
    fontWeight: "600",
  },

  activeText: {
    color: PRIMARY,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F2EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  date: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  empty: {
    marginTop: 80,
    alignItems: "center",
  },

  emptyTitle: {
    color: "#9CA3AF",
    fontSize: 16,
  },
});