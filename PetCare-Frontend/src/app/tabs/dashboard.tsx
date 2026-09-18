import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  Bell,
  Bot,
  BookOpen,
  Calendar,
  ChevronRight,
  FileText,
  HeartPulse,
  Plus,
  Sparkles,
  Syringe,
} from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getDashboard } from "@/services/dashboard";
import { getPetsByUserId } from "@/services/pet";
const PURPLE = "#6C5DD3";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const loadDashboard = async () => {
    try {
      setError("");
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        router.replace("/auth/login");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const [dashboardResponse, petsResponse] = await Promise.all([
        getDashboard(),
        getPetsByUserId(),
      ]);
      console.log("Dashboard:", dashboardResponse);
      console.log("Pets:", petsResponse);
      if (dashboardResponse?.success) {
        setDashboard(dashboardResponse.dashboard);
      }
      if (Array.isArray(petsResponse)) {
        setPets(petsResponse);
      } else if (Array.isArray(petsResponse?.pets)) {
        setPets(petsResponse.pets);
      } else if (Array.isArray(petsResponse?.data)) {
        setPets(petsResponse.data);
      } else {
        setPets([]);
      }
    } catch (err: any) {
      console.log("DASHBOARD FRONTEND ERROR:", err);
      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/auth/login");
        return;
      }
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  useEffect(() => {
    loadDashboard();
  }, []);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard();
  }, []);
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  };
  const getPetAge = (pet: any) => {
    if (!pet) return "";
    if (pet.age !== undefined && pet.age !== null && pet.age !== "") {
      return `${pet.age} Years`;
    }
    if (pet.dateOfBirth) {
      const birthDate = new Date(pet.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return `${Math.max(age, 0)} Years`;
    }
    return "";
  };
  const getPetImage = (pet: any) => {
    if (pet?.image?.url) return pet.image.url;
    if (pet?.profileImage) return pet.profileImage;
    if (typeof pet?.image === "string") return pet.image;
    return null;
  };
  const getPetId = (pet: any) => {
    if (!pet) return null;
    return pet.petId || pet.id || pet._id;
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIcon}>
            <Sparkles size={25} color={PURPLE} />
          </View>
          <ActivityIndicator size="small" color={PURPLE} />
          <Text style={styles.loadingText}>Preparing your dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }
  const firstPet = pets.length > 0 ? pets[0] : null;
  const upcomingVaccinations =
    dashboard?.upcomingVaccinations?.length || 0;
  const upcomingAppointments =
    dashboard?.upcomingAppointments?.length || 0;
  const totalHealthRecords =
    dashboard?.healthHighlights?.totalHealthRecords || 0;
  const petImage = getPetImage(firstPet);
  const upcomingVaccine =
    dashboard?.upcomingVaccinations?.[0] || null;
  const upcomingAppointment =
    dashboard?.upcomingAppointments?.[0] || null;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.dashboardScroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={PURPLE}
            />
          }
        >
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <View style={styles.welcomeRow}>
                <Text style={styles.welcomeText}>
                  Hi, {user?.name || "Pet Parent"}
                </Text>
                <Text style={styles.waveEmoji}>👋</Text>
              </View>
              <Text style={styles.subText}>
                Good {getGreeting()}! Let's take care of your pet.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.8}
            >
              <Bell size={20} color="#343344" />
              {upcomingAppointments + upcomingVaccinations > 0 && (
                <View style={styles.notificationDot} />
              )}
            </TouchableOpacity>
          </View>
          {error ? (
            <TouchableOpacity
              style={styles.errorCard}
              onPress={loadDashboard}
              activeOpacity={0.8}
            >
              <Text style={styles.errorTitle}>Something went wrong</Text>
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          ) : null}
          <View style={styles.petSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>My Pet</Text>
                <Text style={styles.sectionSubtitle}>
                  Your little one's profile
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => router.push("/tabs/pets")}
              >
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {firstPet ? (
              <TouchableOpacity
                style={styles.petCard}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: "/tabs/screen/pets/petProfile",
                    params: {
                      id: getPetId(firstPet),
                    },
                  })
                }
              >
                <View style={styles.petInfo}>
                  {petImage ? (
                    <Image
                      source={{ uri: petImage }}
                      style={styles.petAvatar}
                    />
                  ) : (
                    <View style={styles.petAvatarPlaceholder}>
                      <HeartPulse size={27} color={PURPLE} />
                    </View>
                  )}
                  <View style={styles.petDetails}>
                    <Text style={styles.petName}>
                      {firstPet.name || "My Pet"}
                    </Text>
                    <Text style={styles.petBreed}>
                      {firstPet.breed || firstPet.species || firstPet.type || "Pet"}
                    </Text>
                    <View style={styles.petMetaRow}>
                      {getPetAge(firstPet) ? (
                        <Text style={styles.petMeta}>
                          {getPetAge(firstPet)}
                        </Text>
                      ) : null}
                      {firstPet.weight ? (
                        <Text style={styles.petMeta}>
                          {getPetAge(firstPet) ? " • " : ""}
                          {firstPet.weight} kg
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
                <View style={styles.arrowCircle}>
                  <ChevronRight size={18} color={PURPLE} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.emptyPetCard}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/pets")}
              >
                <View style={styles.emptyPetIcon}>
                  <Plus size={24} color={PURPLE} />
                </View>
                <View style={styles.emptyPetText}>
                  <Text style={styles.emptyPetTitle}>
                    Add your first pet
                  </Text>
                  <Text style={styles.emptyPetSubtitle}>
                    Start managing your pet's health and care
                  </Text>
                </View>
                <ChevronRight size={20} color="#A4A2B2" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Health Overview</Text>
                <Text style={styles.sectionSubtitle}>
                  Keep track of important care
                </Text>
              </View>
            </View>
            <View style={styles.overviewGrid}>
              <TouchableOpacity
                style={styles.overviewCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(
                    "/tabs/screen/healthRecords/healthRecords"
                  )
                }
              >
                <View style={styles.overviewIcon}>
                  <HeartPulse size={19} color={PURPLE} />
                </View>
                <Text style={styles.overviewNumber}>
                  {totalHealthRecords}
                </Text>
                <Text style={styles.overviewLabel}>
                  Health{"\n"}Records
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.overviewCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(
                    "/tabs/screen/vaccination/vaccinationManagement"
                  )
                }
              >
                <View style={styles.overviewIcon}>
                  <Syringe size={19} color={PURPLE} />
                </View>
                <Text style={styles.overviewNumber}>
                  {upcomingVaccinations}
                </Text>
                <Text style={styles.overviewLabel}>
                  Upcoming{"\n"}Vaccines
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.overviewCard}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/appointment")}
              >
                <View style={styles.overviewIcon}>
                  <Calendar size={19} color={PURPLE} />
                </View>
                <Text style={styles.overviewNumber}>
                  {upcomingAppointments}
                </Text>
                <Text style={styles.overviewLabel}>
                  Upcoming{"\n"}Appointments
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Upcoming Care</Text>
                <Text style={styles.sectionSubtitle}>
                  Don't miss your pet's important care
                </Text>
              </View>
            </View>
            {upcomingVaccine || upcomingAppointment ? (
              <View>
                {upcomingVaccine ? (
                  <TouchableOpacity
                    style={styles.careCard}
                    activeOpacity={0.82}
                    onPress={() =>
                      router.push(
                        "/tabs/screen/vaccination/vaccinationManagement"
                      )
                    }
                  >
                    <View style={styles.careIcon}>
                      <Syringe size={21} color={PURPLE} />
                    </View>
                    <View style={styles.careContent}>
                      <Text style={styles.careType}>
                        VACCINATION
                      </Text>
                      <Text style={styles.careTitle}>
                        {upcomingVaccine.name ||
                          upcomingVaccine.vaccineName ||
                          upcomingVaccine.title ||
                          "Upcoming Vaccine"}
                      </Text>
                      <Text style={styles.careDate}>
                        {upcomingVaccine.date ||
                          upcomingVaccine.dueDate ||
                          "Check vaccination schedule"}
                      </Text>
                    </View>
                    <ChevronRight size={19} color="#A4A2B2" />
                  </TouchableOpacity>
                ) : null}
                {upcomingAppointment ? (
                  <TouchableOpacity
                    style={styles.careCard}
                    activeOpacity={0.82}
                    onPress={() => router.push("/tabs/appointment")}
                  >
                    <View style={styles.careIcon}>
                      <Calendar size={21} color={PURPLE} />
                    </View>
                    <View style={styles.careContent}>
                      <Text style={styles.careType}>
                        APPOINTMENT
                      </Text>
                      <Text style={styles.careTitle}>
                        {upcomingAppointment.title ||
                          upcomingAppointment.reason ||
                          upcomingAppointment.doctorName ||
                          "Upcoming Appointment"}
                      </Text>
                      <Text style={styles.careDate}>
                        {upcomingAppointment.date ||
                          upcomingAppointment.appointmentDate ||
                          "Check appointment details"}
                      </Text>
                    </View>
                    <ChevronRight size={19} color="#A4A2B2" />
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : (
              <View style={styles.noCareCard}>
                <View style={styles.noCareIcon}>
                  <HeartPulse size={22} color={PURPLE} />
                </View>
                <View style={styles.noCareContent}>
                  <Text style={styles.noCareTitle}>
                    You're all caught up! 🐾
                  </Text>
                  <Text style={styles.noCareText}>
                    No upcoming vaccinations or appointments right now.
                  </Text>
                </View>
              </View>
            )}
          </View>
          <View style={styles.section}>
            <View style={styles.aiBanner}>
              <View style={styles.aiGlowCircle} />
              <View style={styles.aiTopRow}>
                <View style={styles.aiTitleRow}>
                  <View style={styles.aiIcon}>
                    <Sparkles size={16} color="#FFFFFF" />
                  </View>
                  <Text style={styles.aiTitle}>PetPal AI</Text>
                </View>
                <Bot size={27} color="#DDD8FA" />
              </View>
              <Text style={styles.aiHeading}>
                Your pet's smart care companion
              </Text>
              <Text style={styles.aiDescription}>
                Get health guidance, care recommendations, vaccination help
                and more with PetPal.
              </Text>
              <TouchableOpacity
                style={styles.aiButton}
                activeOpacity={0.85}
                onPress={() => router.push("/tabs/ai")}
              >
                <Sparkles size={15} color={PURPLE} />
                <Text style={styles.aiButtonText}>
                  Talk to PetPal
                </Text>
                <ChevronRight size={16} color={PURPLE} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Care Tips</Text>
                <Text style={styles.sectionSubtitle}>
                  Helpful information for better pet care
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.careTipsCard}
              activeOpacity={0.85}
              onPress={() =>
                router.push("/tabs/screen/blogs/blogs")
              }
            >
              <View style={styles.careTipsIcon}>
                <BookOpen size={24} color={PURPLE} />
              </View>
              <View style={styles.careTipsContent}>
                <Text style={styles.careTipsTitle}>
                  Explore Pet Care Tips
                </Text>
                <Text
                  style={styles.careTipsDescription}
                  numberOfLines={2}
                >
                  Learn helpful tips about health, grooming, nutrition and
                  everyday pet care.
                </Text>
              </View>
              <View style={styles.arrowCircle}>
                <ChevronRight size={18} color={PURPLE} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <Text style={styles.sectionSubtitle}>
                  Everything you need, right here
                </Text>
              </View>
            </View>
            <View style={styles.quickGrid}>
              <TouchableOpacity
                style={styles.quickItem}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/pets")}
              >
                <View style={styles.quickIcon}>
                  <Plus size={21} color={PURPLE} />
                </View>
                <Text style={styles.quickText}>Add Pet</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickItem}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/appointment")}
              >
                <View style={styles.quickIcon}>
                  <Calendar size={21} color={PURPLE} />
                </View>
                <Text style={styles.quickText}>Appointment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickItem}
                activeOpacity={0.8}
                onPress={() =>
                  router.push(
                    "/tabs/screen/healthRecords/healthRecords"
                  )
                }
              >
                <View style={styles.quickIcon}>
                  <FileText size={21} color={PURPLE} />
                </View>
                <Text style={styles.quickText}>Health Record</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickItem}
                activeOpacity={0.8}
                onPress={() => router.push("/tabs/ai")}
              >
                <View style={styles.quickIcon}>
                  <Bot size={21} color={PURPLE} />
                </View>
                <Text style={styles.quickText}>PetPal AI</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomMessage}>
            <Sparkles size={15} color="#A3A1AF" />
            <Text style={styles.bottomMessageText}>
              PetCare helps you keep your pet's health and care organized.
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9F8FD",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9F8FD",
  },
  dashboardScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 5,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 10,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 15,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1D1E2C",
  },
  waveEmoji: {
    fontSize: 19,
    marginLeft: 5,
  },
  subText: {
    fontSize: 12.5,
    color: "#8B8A99",
    marginTop: 5,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  notificationDot: {
    position: "absolute",
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: PURPLE,
  },
  petSection: {
    paddingHorizontal: 22,
    marginTop: 15,
  },
  section: {
    paddingHorizontal: 22,
    marginTop: 22,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 11,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#242435",
  },
  sectionSubtitle: {
    fontSize: 10.5,
    color: "#9A98A7",
    marginTop: 3,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "700",
    color: PURPLE,
    marginTop: 3,
  },
  petCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ECEAF3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  petInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  petAvatar: {
    width: 65,
    height: 65,
    borderRadius: 19,
    backgroundColor: "#EFECFB",
  },
  petAvatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 19,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
  },
  petDetails: {
    marginLeft: 13,
    flex: 1,
  },
  petName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#242435",
  },
  petBreed: {
    fontSize: 12,
    color: "#737281",
    marginTop: 3,
  },
  petMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  petMeta: {
    fontSize: 10.5,
    color: "#A09EAC",
  },
  arrowCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F2F0FF",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  emptyPetIcon: {
    width: 53,
    height: 53,
    borderRadius: 16,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyPetText: {
    flex: 1,
    marginLeft: 13,
  },
  emptyPetTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242435",
  },
  emptyPetSubtitle: {
    fontSize: 10.5,
    color: "#9694A3",
    marginTop: 4,
  },
  overviewGrid: {
    flexDirection: "row",
    gap: 9,
  },
  overviewCard: {
    flex: 1,
    minHeight: 118,
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  overviewIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 7,
  },
  overviewNumber: {
    fontSize: 23,
    fontWeight: "900",
    color: PURPLE,
  },
  overviewLabel: {
    fontSize: 10,
    lineHeight: 14,
    color: "#696775",
    marginTop: 3,
  },
  careCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  careIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  careContent: {
    flex: 1,
  },
  careType: {
    fontSize: 8.5,
    fontWeight: "800",
    color: PURPLE,
    letterSpacing: 0.7,
    marginBottom: 3,
  },
  careTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#292936",
  },
  careDate: {
    fontSize: 10.5,
    color: "#8B8998",
    marginTop: 3,
  },
  noCareCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  noCareIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  noCareContent: {
    flex: 1,
  },
  noCareTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#292936",
  },
  noCareText: {
    fontSize: 10.5,
    lineHeight: 16,
    color: "#8B8998",
    marginTop: 3,
  },
  aiBanner: {
    backgroundColor: PURPLE,
    borderRadius: 21,
    padding: 18,
    overflow: "hidden",
  },
  aiGlowCircle: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(255,255,255,0.06)",
    right: -45,
    top: -55,
  },
  aiTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  aiTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aiIcon: {
    width: 29,
    height: 29,
    borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  aiTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  aiHeading: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 15,
  },
  aiDescription: {
    fontSize: 11.5,
    lineHeight: 17,
    color: "#F1EFFF",
    marginTop: 6,
    marginBottom: 15,
  },
  aiButton: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  aiButtonText: {
    fontSize: 11.5,
    fontWeight: "800",
    color: PURPLE,
    marginHorizontal: 5,
  },
  careTipsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ECEAF3",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  careTipsIcon: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  careTipsContent: {
    flex: 1,
  },
  careTipsTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242435",
  },
  careTipsDescription: {
    fontSize: 10.5,
    lineHeight: 16,
    color: "#8B8998",
    marginTop: 4,
  },
  quickGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: "#ECEAF3",
  },
  quickItem: {
    flex: 1,
    alignItems: "center",
  },
  quickIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  quickText: {
    fontSize: 9.5,
    fontWeight: "600",
    color: "#656371",
    textAlign: "center",
  },
  bottomMessage: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 35,
    marginTop: 25,
  },
  bottomMessageText: {
    fontSize: 9.5,
    color: "#A3A1AF",
    marginLeft: 6,
    textAlign: "center",
  },
  errorCard: {
    marginHorizontal: 22,
    marginTop: 10,
    padding: 14,
    borderRadius: 15,
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#F4D5D5",
  },
  errorTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#B42318",
  },
  errorText: {
    fontSize: 11,
    color: "#8A3333",
    marginTop: 3,
  },
  retryText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#B42318",
    marginTop: 6,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingIcon: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: "#EFECFB",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 12,
    color: "#898897",
    marginTop: 10,
  },
});