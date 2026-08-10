import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { CalendarDays, CirclePlus, CheckCircle2 } from "lucide-react-native";

import VaccinationForm from "@/components/vaccinationForm";
import {
  deleteVaccination,
  getAllVaccinations,
  getVaccinationsByUserId
} from "@/services/vaccination";
import { useFocusEffect } from "expo-router";

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

export default function VaccinationManagement({
  userId,
}: { userId: string }) {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [tab, setTab] = useState<TabType>("Upcoming");

  const [modalVisible, setModalVisible] = useState(false);

  const [selectedVaccination, setSelectedVaccination] =
    useState<Vaccination | null>(null);

  const fetchVaccinations = async () => {
    try {
      setLoading(true);

      const response = await getVaccinationsByUserId(userId);

      if (response.success) {
        setVaccinations(response.vaccinations);
      } else {
        setVaccinations([]);
      }
    } catch (error) {
      console.log("Fetch vaccinations error:", error);

      Alert.alert(
        "Error",
        "Failed to fetch vaccinations."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (userId) {
        fetchVaccinations();
      }
    }, [userId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchVaccinations();
  };

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const upcomingVaccinations = useMemo(() => {
    return vaccinations.filter((item) => {
      if (!item.nextDueDate) return false;

      const due = new Date(item.nextDueDate);

      due.setHours(0, 0, 0, 0);

      return due >= today;
    });
  }, [vaccinations]);

  const historyVaccinations = useMemo(() => {
    return vaccinations.filter((item) => {
      if (!item.nextDueDate) return true;

      const due = new Date(item.nextDueDate);

      due.setHours(0, 0, 0, 0);

      return due < today;
    });
  }, [vaccinations]);

  const data =
    tab === "Upcoming"
      ? upcomingVaccinations
      : historyVaccinations;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatus = (date?: string | null) => {
    if (!date) return "Completed";

    const due = new Date(date);

    due.setHours(0, 0, 0, 0);

    const difference =
      Math.ceil(
        (due.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
      );

    if (difference <= 7) return "Due Soon";

    return "Upcoming";
  };

  const openAddModal = () => {
    setSelectedVaccination(null);
    setModalVisible(true);
  };

  const openEditModal = (item: Vaccination) => {
    setSelectedVaccination(item);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
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
              await deleteVaccination(id);

              fetchVaccinations();
            } catch {
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
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <>

      <View style={styles.container}>
        {/* Header */}

        <View style={styles.header}>
          <Text style={styles.headerTitle}>Vaccinations</Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={openAddModal}
          >
            <CirclePlus size={24} color="#6C63FF" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}

        <View style={styles.tabContainer}>
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
                tab === "Upcoming" && styles.activeTabText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              tab === "History" && styles.activeTab,
            ]}
            onPress={() => setTab("History")}
          >
            <Text
              style={[
                styles.tabText,
                tab === "History" && styles.activeTabText,
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
        </View>

        {/* List */}

        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <CalendarDays
                size={55}
                color="#C5C5D2"
              />

              <Text style={styles.emptyTitle}>
                No Vaccinations
              </Text>

              <Text style={styles.emptySubtitle}>
                Add your pet's vaccination records.
              </Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.card}
              onPress={() => openEditModal(item)}
              onLongPress={() => handleDelete(item.id)}
            >
              <View style={styles.iconContainer}>
                {tab === "Upcoming" ? (
                  <CalendarDays
                    size={22}
                    color="#6C63FF"
                  />
                ) : (
                  <CheckCircle2
                    size={22}
                    color="#22C55E"
                  />
                )}
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.vaccineName}>
                  {item.vaccineName}
                </Text>

                <Text style={styles.dateText}>
                  {tab === "Upcoming"
                    ? formatDate(
                      item.nextDueDate ??
                      item.dateGiven
                    )
                    : formatDate(item.dateGiven)}
                </Text>
              </View>

              {tab === "Upcoming" ? (
                <View
                  style={[
                    styles.statusBadge,
                    getStatus(item.nextDueDate) ===
                      "Due Soon"
                      ? styles.dueSoonBadge
                      : styles.upcomingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      getStatus(item.nextDueDate) ===
                        "Due Soon"
                        ? styles.dueSoonText
                        : styles.upcomingText,
                    ]}
                  >
                    {getStatus(item.nextDueDate)}
                  </Text>
                </View>
              ) : (
                <CheckCircle2
                  size={22}
                  color="#22C55E"
                />
              )}
            </TouchableOpacity>
          )}
          ListFooterComponent={
            tab === "Upcoming" &&
              historyVaccinations.length > 0 ? (
              <>
                <Text style={styles.completedHeading}>
                  Completed
                </Text>

                {historyVaccinations.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={styles.card}
                    onPress={() =>
                      openEditModal(item)
                    }
                    onLongPress={() =>
                      handleDelete(item.id)
                    }
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            "#EAFBF2",
                        },
                      ]}
                    >
                      <CheckCircle2
                        size={22}
                        color="#22C55E"
                      />
                    </View>

                    <View style={styles.cardContent}>
                      <Text
                        style={styles.vaccineName}
                      >
                        {item.vaccineName}
                      </Text>

                      <Text
                        style={styles.dateText}
                      >
                        {formatDate(item.dateGiven)}
                      </Text>
                    </View>

                    <CheckCircle2
                      size={22}
                      color="#22C55E"
                    />
                  </TouchableOpacity>
                ))}
              </>
            ) : null
          }
        />
      </View>

      {/* Add / Edit Modal */}

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setModalVisible(false)
        }
      >
        <VaccinationForm
  vaccination={selectedVaccination}
  userId={userId}
  onClose={() => {
    setModalVisible(false);
    fetchVaccinations();
  }}
/>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F6FB",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F6FB",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F2937",
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F1FF",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 4,
    marginBottom: 22,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#6C63FF",
  },

  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#8B8B9A",
  },

  activeTabText: {
    color: "#FFFFFF",
  },

  listContent: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F1FF",
    marginRight: 14,
  },

  cardContent: {
    flex: 1,
  },

  vaccineName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },

  dateText: {
    fontSize: 14,
    color: "#7C7C89",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  dueSoonBadge: {
    backgroundColor: "#FFF3D6",
  },

  upcomingBadge: {
    backgroundColor: "#EEF2FF",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  dueSoonText: {
    color: "#D97706",
  },

  upcomingText: {
    color: "#4F46E5",
  },

  completedHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
    marginBottom: 14,
  },

  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 80,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
    marginTop: 18,
  },

  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
});