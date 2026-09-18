import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Lightbulb,
} from "lucide-react-native";

import {
  router,
  useLocalSearchParams,
} from "expo-router";

import { getBlogById } from "@/services/blog";


// ======================================================
// COLORS
// ======================================================

const PURPLE = "#6C5DD3";
const BACKGROUND = "#F9F8FD";


// ======================================================
// BLOG INTERFACE
// ======================================================

interface Blog {
  id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}


// ======================================================
// MAIN SCREEN
// ======================================================

export default function BlogDetailsScreen() {

  // ======================================================
  // ROUTE PARAM
  // ======================================================

  const params =
    useLocalSearchParams<{
      id?: string | string[];
    }>();

  const blogId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;


  // ======================================================
  // STATES
  // ======================================================

  const [blog, setBlog] =
    useState<Blog | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);


  // ======================================================
  // FETCH BLOG
  // ======================================================

  const fetchBlog = useCallback(
    async () => {

      if (!blogId) {

        setError(true);
        setLoading(false);

        return;
      }

      try {

        setLoading(true);
        setError(false);

        const response =
          await getBlogById(blogId);

        console.log(
          "BLOG DETAILS RESPONSE:",
          response
        );

        if (
          response?.success &&
          response?.blog
        ) {

          setBlog(response.blog);

        } else {

          setBlog(null);
          setError(true);

        }

      } catch (error) {

        console.log(
          "BLOG DETAILS ERROR:",
          error
        );

        setBlog(null);
        setError(true);

      } finally {

        setLoading(false);

      }

    },
    [blogId]
  );


  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    fetchBlog();

  }, [fetchBlog]);


  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (
    dateString?: string
  ) => {

    if (!dateString) {
      return "";
    }

    const date =
      new Date(dateString);

    if (isNaN(date.getTime())) {
      return "";
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


  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (
      <View style={styles.loaderContainer}>

        <ActivityIndicator
          size="large"
          color={PURPLE}
        />

        <Text style={styles.loadingText}>
          Loading article...
        </Text>

      </View>
    );

  }


  // ======================================================
  // ERROR
  // ======================================================

  if (error || !blog) {

    return (
      <View style={styles.errorContainer}>

        <View style={styles.errorIcon}>

          <BookOpen
            size={40}
            color={PURPLE}
          />

        </View>

        <Text style={styles.errorTitle}>
          Blog Not Found
        </Text>

        <Text style={styles.errorSubtitle}>
          We couldn't load this care tip.
        </Text>

        <TouchableOpacity
          style={styles.backButtonError}
          onPress={() => router.back()}
          activeOpacity={0.85}
        >

          <ArrowLeft
            size={18}
            color="#FFFFFF"
          />

          <Text style={styles.backButtonText}>
            Back to Care Tips
          </Text>

        </TouchableOpacity>

      </View>
    );

  }


  // ======================================================
  // MAIN UI
  // ======================================================

  return (

    <View style={styles.container}>

      {/* ==================================================
          FIXED HEADER
      ================================================== */}

      <View style={styles.header}>

        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >

          <ArrowLeft
            size={23}
            color="#242331"
          />

        </TouchableOpacity>


        <Text style={styles.headerTitle}>
          Care Tips
        </Text>

      </View>


      {/* ==================================================
          SCROLLABLE ARTICLE
      ================================================== */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        bounces={true}
      >

        {/* ==================================================
            COVER IMAGE
        ================================================== */}

        <Image
          source={{
            uri:
              blog.image ||
              "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
          }}
          style={styles.coverImage}
          resizeMode="cover"
        />


        {/* ==================================================
            ARTICLE CONTENT
        ================================================== */}

        <View style={styles.articleCard}>

          {/* ==================================================
              CATEGORY
          ================================================== */}

          <View style={styles.categoryBadge}>

            <Text style={styles.categoryText}>
              {blog.category}
            </Text>

          </View>


          {/* ==================================================
              TITLE
          ================================================== */}

          <Text style={styles.articleTitle}>
            {blog.title}
          </Text>


          {/* ==================================================
              META INFORMATION
          ================================================== */}

          <View style={styles.metaRow}>

            <View style={styles.metaItem}>

              <BookOpen
                size={17}
                color={PURPLE}
              />

              <Text style={styles.metaText}>
                {blog.author || "PetCare"}
              </Text>

            </View>


            {blog.createdAt ? (

              <View style={styles.metaItem}>

                <CalendarDays
                  size={17}
                  color="#92909E"
                />

                <Text style={styles.metaText}>
                  {formatDate(
                    blog.createdAt
                  )}
                </Text>

              </View>

            ) : null}

          </View>


          {/* ==================================================
              DIVIDER
          ================================================== */}

          <View style={styles.divider} />


          {/* ==================================================
              ARTICLE
          ================================================== */}

          <Text style={styles.articleText}>
            {blog.description}
          </Text>


          {/* ==================================================
              PETCARE TIP
          ================================================== */}

          <View style={styles.tipCard}>

            <View style={styles.tipIcon}>

              <Lightbulb
                size={22}
                color={PURPLE}
              />

            </View>


            <View style={styles.tipContent}>

              <Text style={styles.tipTitle}>
                PetCare Tip
              </Text>

              <Text style={styles.tipText}>
                Follow these care tips regularly
                and consult a veterinarian when
                you notice unusual or persistent
                changes in your pet's health.
              </Text>

            </View>

          </View>


          {/* ==================================================
              END OF ARTICLE
          ================================================== */}

          <View style={styles.endSection}>

            <View style={styles.endLine} />

            <Text style={styles.endText}>
              End of article
            </Text>

            <View style={styles.endLine} />

          </View>

        </View>

      </ScrollView>

    </View>

  );
}


// ========================================================
// STYLES
// ========================================================

const styles = StyleSheet.create({

  // ======================================================
  // CONTAINER
  // ======================================================

  container: {
    flex: 1,
    backgroundColor: BACKGROUND,
  },


  // ======================================================
  // LOADER
  // ======================================================

  loaderContainer: {
    flex: 1,

    backgroundColor: BACKGROUND,

    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,

    fontSize: 13,

    color: "#92909E",
  },


  // ======================================================
  // HEADER
  // ======================================================

  header: {
    height: 76,

    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: BACKGROUND,

    zIndex: 10,
  },

  headerBackButton: {
    width: 46,
    height: 46,

    borderRadius: 15,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#ECEAF2",

    marginRight: 12,
  },

  headerTitle: {
    fontSize: 22,

    fontWeight: "800",

    color: "#242331",
  },


  // ======================================================
  // SCROLL VIEW
  // ======================================================

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,

    paddingTop: 4,

    /*
      Extra bottom space is important because
      your tab navigation sits at the bottom.
    */

    paddingBottom: 180,
  },


  // ======================================================
  // COVER IMAGE
  // ======================================================

  coverImage: {
    width: "100%",

    height: 235,

    borderRadius: 24,

    backgroundColor: "#EFECFB",

    marginBottom: 14,
  },


  // ======================================================
  // ARTICLE CARD
  // ======================================================

  articleCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 24,

    padding: 20,

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


  // ======================================================
  // CATEGORY
  // ======================================================

  categoryBadge: {
    alignSelf: "flex-start",

    backgroundColor: "#EFECFB",

    paddingHorizontal: 11,
    paddingVertical: 6,

    borderRadius: 50,

    marginBottom: 13,
  },

  categoryText: {
    fontSize: 10,

    fontWeight: "800",

    color: PURPLE,

    textTransform: "uppercase",
  },


  // ======================================================
  // TITLE
  // ======================================================

  articleTitle: {
    fontSize: 27,

    fontWeight: "800",

    color: "#242331",

    lineHeight: 35,
  },


  // ======================================================
  // META
  // ======================================================

  metaRow: {
    flexDirection: "row",

    alignItems: "center",

    flexWrap: "wrap",

    gap: 17,

    marginTop: 15,
  },

  metaItem: {
    flexDirection: "row",

    alignItems: "center",

    gap: 6,
  },

  metaText: {
    fontSize: 12,

    fontWeight: "600",

    color: "#777481",
  },


  // ======================================================
  // DIVIDER
  // ======================================================

  divider: {
    height: 1,

    backgroundColor: "#ECEAF2",

    marginVertical: 19,
  },


  // ======================================================
  // ARTICLE TEXT
  // ======================================================

  articleText: {
    fontSize: 15,

    fontWeight: "500",

    color: "#55525F",

    lineHeight: 26,
  },


  // ======================================================
  // PETCARE TIP
  // ======================================================

  tipCard: {
    flexDirection: "row",

    backgroundColor: "#F3F0FF",

    borderRadius: 19,

    padding: 15,

    marginTop: 25,
  },

  tipIcon: {
    width: 44,
    height: 44,

    borderRadius: 14,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 12,
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 14,

    fontWeight: "800",

    color: "#242331",

    marginBottom: 5,
  },

  tipText: {
    fontSize: 12,

    color: "#777481",

    lineHeight: 19,
  },


  // ======================================================
  // ARTICLE END
  // ======================================================

  endSection: {
    flexDirection: "row",

    alignItems: "center",

    marginTop: 28,

    marginBottom: 5,
  },

  endLine: {
    flex: 1,

    height: 1,

    backgroundColor: "#ECEAF2",
  },

  endText: {
    fontSize: 10,

    fontWeight: "700",

    color: "#AAA7B2",

    marginHorizontal: 10,
  },


  // ======================================================
  // ERROR
  // ======================================================

  errorContainer: {
    flex: 1,

    backgroundColor: BACKGROUND,

    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: 30,
  },

  errorIcon: {
    width: 90,
    height: 90,

    borderRadius: 28,

    backgroundColor: "#EFECFB",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  errorTitle: {
    fontSize: 22,

    fontWeight: "800",

    color: "#242331",
  },

  errorSubtitle: {
    fontSize: 14,

    color: "#92909E",

    textAlign: "center",

    marginTop: 7,
  },

  backButtonError: {
    height: 50,

    paddingHorizontal: 20,

    borderRadius: 15,

    backgroundColor: PURPLE,

    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    gap: 7,

    marginTop: 20,
  },

  backButtonText: {
    fontSize: 14,

    fontWeight: "800",

    color: "#FFFFFF",
  },

});