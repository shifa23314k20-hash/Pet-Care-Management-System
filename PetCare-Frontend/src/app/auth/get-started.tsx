import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function GetStarted() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("/auth/register");
  };

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F9F8FD"
      />

      {/* =========================
          HEADER
      ========================== */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo1.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.brandName}>
          Pet<Text style={styles.brandPurple}>Care</Text>
        </Text>
      </View>

      {/* =========================
          HEADING
      ========================== */}
      <View style={styles.headingContainer}>
        <Text style={styles.title}>
          Smart care for{"\n"}your pet.
        </Text>

        <Text style={styles.description}>
          Manage your pet's health, records and
          everyday care — all in one place.
        </Text>
      </View>

      {/* =========================
          PET IMAGE
      ========================== */}
      <View style={styles.heroContainer}>
        <View style={styles.mainBlob} />

        <View style={styles.smallBlobTop} />

        <View style={styles.smallBlobBottom} />

        <Ionicons
          name="sparkles"
          size={19}
          color="#B9B0EA"
          style={styles.sparkleOne}
        />

        <Ionicons
          name="sparkles"
          size={14}
          color="#CEC8EF"
          style={styles.sparkleTwo}
        />

        <Image
          source={require("@/assets/images/get-started.png")}
          style={styles.petImage}
          resizeMode="contain"
        />
      </View>

      {/* =========================
          FEATURES
      ========================== */}
      <View style={styles.featuresContainer}>
        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons
              name="heart-outline"
              size={18}
              color="#6C5DD3"
            />
          </View>

          <Text style={styles.featureTitle}>
            Health
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons
              name="calendar-outline"
              size={18}
              color="#6C5DD3"
            />
          </View>

          <Text style={styles.featureTitle}>
            Reminders
          </Text>
        </View>

        <View style={styles.feature}>
          <View style={styles.featureIconContainer}>
            <Ionicons
              name="sparkles-outline"
              size={18}
              color="#6C5DD3"
            />
          </View>

          <Text style={styles.featureTitle}>
            AI Care
          </Text>
        </View>
      </View>

      {/* =========================
          BUTTON
      ========================== */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={handleGetStarted}
        activeOpacity={0.85}
      >
        <Text style={styles.getStartedText}>
          Get Started
        </Text>

        <Ionicons
          name="arrow-forward"
          size={20}
          color="#FFFFFF"
        />
      </TouchableOpacity>

      {/* =========================
          LOGIN
      ========================== */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
        </Text>

        <TouchableOpacity
          onPress={handleLogin}
          activeOpacity={0.7}
        >
          <Text style={styles.loginLink}>
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /* =========================
     SCREEN
  ========================== */
  container: {
    flex: 1,
    backgroundColor: "#F9F8FD",
    paddingHorizontal: 22,
    paddingTop: height < 700 ? 18 : 26,
    paddingBottom: height < 700 ? 10 : 14,
    justifyContent: "space-between",
  },

  /* =========================
   HEADER
========================= */

  header: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },

  logo: {
    width: 72,
    height: 58,
  },

  brandName: {
    fontSize: 35,
    fontWeight: "800",
    color: "#242435",
    letterSpacing: -0.7,
    marginTop: -4,
  },

  brandPurple: {
    color: "#6C5DD3",
  },

  /* =========================
     HEADING
  ========================= */

  headingContainer: {
    alignItems: "center",
  },

  title: {
    textAlign: "center",
    fontSize: 23,
    lineHeight: 29,
    fontWeight: "700",
    color: "#1D1E2C",
    letterSpacing: -0.4,
  },

  description: {
    textAlign: "center",
    fontSize: 12.5,
    lineHeight: 19,
    color: "#898897",
    marginTop: 7,
    paddingHorizontal: 12,
  },

  /* =========================
     HERO
  ========================== */

  heroContainer: {
    width: width - 44,
    height: height < 700
      ? height * 0.30
      : height * 0.32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 2,
  },

  mainBlob: {
    position: "absolute",

    width: width * 0.68,
    height: width * 0.68,

    maxWidth: 285,
    maxHeight: 285,

    borderRadius: 180,

    backgroundColor: "#EEEBFA",

    transform: [
      {
        scaleX: 1.08,
      },
    ],
  },

  smallBlobTop: {
    position: "absolute",

    width: 42,
    height: 42,

    borderRadius: 30,

    backgroundColor: "#E5E0F8",

    top: height < 700 ? 8 : 14,
    right: width * 0.13,
  },

  smallBlobBottom: {
    position: "absolute",

    width: 25,
    height: 25,

    borderRadius: 20,

    backgroundColor: "#DDD7F4",

    bottom: height < 700 ? 10 : 18,
    left: width * 0.16,
  },

  petImage: {
    width: width * 0.87,
    height: "100%",
    zIndex: 2,
  },

  sparkleOne: {
    position: "absolute",

    top: height < 700 ? 18 : 24,
    left: width * 0.17,

    zIndex: 3,
  },

  sparkleTwo: {
    position: "absolute",

    bottom: height < 700 ? 28 : 34,
    right: width * 0.16,

    zIndex: 3,
  },

  /* =========================
     FEATURES
  ========================== */

  featuresContainer: {
    flexDirection: "row",

    width: "100%",

    justifyContent: "space-between",
    alignItems: "flex-start",

    marginTop: 0,
  },

  feature: {
    flex: 1,
    alignItems: "center",
  },

  featureIconContainer: {
    width: 38,
    height: 38,

    borderRadius: 12,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 5,
  },

  featureTitle: {
    fontSize: 11.5,
    fontWeight: "700",
    color: "#2A2938",
  },

  featureSubtitle: {
    fontSize: 9.5,
    color: "#9695A4",
    marginTop: 2,
  },

  /* =========================
     GET STARTED BUTTON
  ========================== */

  getStartedButton: {
    height: 54,

    width: "100%",

    borderRadius: 14,

    backgroundColor: "#6C5DD3",

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#6C5DD3",

    shadowOffset: {
      width: 0,
      height: 7,
    },

    shadowOpacity: 0.25,

    shadowRadius: 10,

    elevation: 5,

    marginTop: 1,
  },

  getStartedText: {
    color: "#FFFFFF",

    fontSize: 15.5,

    fontWeight: "700",

    marginRight: 10,
  },

  /* =========================
     LOGIN
  ========================== */

  loginContainer: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    marginTop: 0,
  },

  loginText: {
    fontSize: 12.5,
    color: "#898897",
  },

  loginLink: {
    fontSize: 12.5,

    color: "#6C5DD3",

    fontWeight: "700",
  },
});