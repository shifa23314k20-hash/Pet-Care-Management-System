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
    TextInput,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
    ScrollView,
} from "react-native";

import {
    Search,
    ArrowLeft,
    ChevronRight,
    BookOpen,
    X,
} from "lucide-react-native";

import { router, useFocusEffect } from "expo-router";

import {
    getAllBlogs,
    getBlogsByCategory,
} from "@/services/blog";


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
// CATEGORIES
// ======================================================

const categories = [
    "All",
    "Summer Care",
    "Winter Care",
    "Vaccination",
    "Grooming",
    "General",
];


// ======================================================
// MAIN SCREEN
// ======================================================

export default function BlogScreen() {

    const [blogs, setBlogs] = useState<Blog[]>([]);

    const [loading, setLoading] = useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [searchText, setSearchText] =
        useState("");


    // ======================================================
    // FETCH ALL BLOGS
    // ======================================================

    const fetchBlogs = async (
        showLoader = true
    ) => {

        try {

            if (showLoader) {
                setLoading(true);
            }

            const response = await getAllBlogs();

            console.log(
                "BLOGS RESPONSE:",
                response
            );

            if (
                response?.success &&
                Array.isArray(response?.blogs)
            ) {

                setBlogs(response.blogs);

            } else {

                setBlogs([]);

            }

        } catch (error) {

            console.log(
                "FETCH BLOGS ERROR:",
                error
            );

            setBlogs([]);

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // ======================================================
    // FETCH CATEGORY BLOGS
    // ======================================================

    const fetchCategoryBlogs = async (
        category: string
    ) => {

        try {

            setLoading(true);

            if (category === "All") {

                await fetchBlogs(false);
                return;

            }

            const response =
                await getBlogsByCategory(category);

            console.log(
                "CATEGORY BLOG RESPONSE:",
                response
            );

            if (
                response?.success &&
                Array.isArray(response?.blogs)
            ) {

                setBlogs(response.blogs);

            } else {

                setBlogs([]);

            }

        } catch (error) {

            console.log(
                "CATEGORY BLOG ERROR:",
                error
            );

            setBlogs([]);

        } finally {

            setLoading(false);
            setRefreshing(false);

        }
    };


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {

        fetchBlogs();

    }, []);


    // ======================================================
    // REFRESH WHEN SCREEN OPENS
    // ======================================================

    useFocusEffect(
        useCallback(() => {

            fetchBlogs(false);

        }, [])
    );


    // ======================================================
    // CATEGORY SELECT
    // ======================================================

    const handleCategoryChange = (
        category: string
    ) => {

        setSelectedCategory(category);

        setSearchText("");

        fetchCategoryBlogs(category);

    };


    // ======================================================
    // SEARCH
    // ======================================================

    const filteredBlogs = useMemo(() => {

        const search =
            searchText.trim().toLowerCase();

        if (!search) {
            return blogs;
        }

        return blogs.filter((blog) => {

            return (
                blog.title
                    ?.toLowerCase()
                    .includes(search) ||

                blog.category
                    ?.toLowerCase()
                    .includes(search) ||

                blog.description
                    ?.toLowerCase()
                    .includes(search)
            );

        });

    }, [blogs, searchText]);


    // ======================================================
    // REFRESH
    // ======================================================

    const handleRefresh = async () => {

        setRefreshing(true);

        if (selectedCategory === "All") {

            await fetchBlogs(false);

        } else {

            await fetchCategoryBlogs(
                selectedCategory
            );

        }
    };


    // ======================================================
    // OPEN BLOG
    // ======================================================

    const openBlog = (blog: Blog) => {

        router.push({
            pathname:
                "/tabs/screen/blogs/blogDetails",

            params: {
                id: blog.id,
            },
        });

    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading && !refreshing) {

        return (
            <View style={styles.loaderContainer}>

                <ActivityIndicator
                    size="large"
                    color={PURPLE}
                />

                <Text style={styles.loadingText}>
                    Loading care tips...
                </Text>

            </View>
        );

    }


    // ======================================================
    // BLOG CARD
    // ======================================================

    const renderBlogCard = ({
        item,
    }: {
        item: Blog;
    }) => {

        return (

            <TouchableOpacity
                style={styles.blogCard}
                activeOpacity={0.88}
                onPress={() => openBlog(item)}
            >

                {/* ==================================================
            IMAGE
        ================================================== */}

                <Image
                    source={{
                        uri:
                            item.image ||
                            "https://images.unsplash.com/photo-1450778869180-41d0601e046e",
                    }}
                    style={styles.blogImage}
                    resizeMode="cover"
                />


                {/* ==================================================
            CONTENT
        ================================================== */}

                <View style={styles.blogContent}>

                    {/* CATEGORY */}

                    <View style={styles.categoryBadge}>

                        <Text style={styles.categoryBadgeText}>
                            {item.category}
                        </Text>

                    </View>


                    {/* TITLE */}

                    <Text
                        style={styles.blogTitle}
                        numberOfLines={2}
                    >
                        {item.title}
                    </Text>


                    {/* DESCRIPTION */}

                    <Text
                        style={styles.blogDescription}
                        numberOfLines={3}
                    >
                        {item.description}
                    </Text>


                    {/* FOOTER */}

                    <View style={styles.blogFooter}>

                        <View style={styles.authorRow}>

                            <BookOpen
                                size={16}
                                color={PURPLE}
                            />

                            <Text style={styles.authorText}>
                                {item.author || "PetCare"}
                            </Text>

                        </View>


                        <View style={styles.readRow}>

                            <Text style={styles.readText}>
                                Read
                            </Text>

                            <ChevronRight
                                size={18}
                                color={PURPLE}
                            />

                        </View>

                    </View>

                </View>

            </TouchableOpacity>

        );
    };


    // ======================================================
    // EMPTY STATE
    // ======================================================

    const renderEmpty = () => {

        return (

            <View style={styles.emptyContainer}>

                <View style={styles.emptyIcon}>

                    <BookOpen
                        size={40}
                        color={PURPLE}
                    />

                </View>

                <Text style={styles.emptyTitle}>
                    No Care Tips Found
                </Text>

                <Text style={styles.emptySubtitle}>
                    Try searching for something else or
                    select another category.
                </Text>

            </View>

        );

    };


    // ======================================================
    // MAIN UI
    // ======================================================

    return (

        <View style={styles.container}>

            {/* ==================================================
          HEADER
      ================================================== */}

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >

                    <ArrowLeft
                        size={23}
                        color="#242331"
                    />

                </TouchableOpacity>


                <View style={styles.headerText}>

                    <Text style={styles.headerTitle}>
                        Care Tips
                    </Text>

                    <Text style={styles.headerSubtitle}>
                        Helpful guides for your pet's health
                    </Text>

                </View>

            </View>


            {/* ==================================================
          SEARCH
      ================================================== */}

            <View style={styles.searchContainer}>

                <Search
                    size={21}
                    color="#9A98A6"
                />

                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search care tips..."
                    placeholderTextColor="#AAA8B4"
                    style={styles.searchInput}
                />

                {searchText.length > 0 && (

                    <TouchableOpacity
                        onPress={() => setSearchText("")}
                        activeOpacity={0.7}
                    >

                        <X
                            size={19}
                            color="#9A98A6"
                        />

                    </TouchableOpacity>

                )}

            </View>


            {/* ==================================================
          CATEGORY FILTER
      ================================================== */}

            <View style={styles.categoryContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {categories.map((category) => {
                        const active = selectedCategory === category;

                        return (
                            <TouchableOpacity
                                key={category}
                                style={[
                                    styles.categoryChip,
                                    active && styles.activeCategoryChip,
                                ]}
                                onPress={() =>
                                    handleCategoryChange(category)
                                }
                                activeOpacity={0.8}
                            >
                                <Text
                                    style={[
                                        styles.categoryChipText,
                                        active &&
                                        styles.activeCategoryChipText,
                                    ]}
                                >
                                    {category}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ==================================================
          RESULT HEADER
      ================================================== */}

            <View style={styles.resultHeader}>

                <Text style={styles.resultTitle}>
                    {selectedCategory === "All"
                        ? "Latest Care Tips"
                        : selectedCategory}
                </Text>

                <Text style={styles.resultCount}>
                    {filteredBlogs.length}{" "}
                    {filteredBlogs.length === 1
                        ? "article"
                        : "articles"}
                </Text>

            </View>


            {/* ==================================================
          BLOG LIST
      ================================================== */}

            <FlatList
                data={filteredBlogs}
                keyExtractor={(item) => item.id}
                renderItem={renderBlogCard}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        tintColor={PURPLE}
                    />
                }
                contentContainerStyle={[
                    styles.listContent,
                    filteredBlogs.length === 0 &&
                    styles.emptyListContent,
                ]}
                ListEmptyComponent={renderEmpty}
            />

        </View>

    );
}


// ========================================================
// STYLES
// ========================================================

const styles = StyleSheet.create({

    // ======================================================
    // MAIN
    // ======================================================

    container: {
        flex: 1,
        backgroundColor: BACKGROUND,
        paddingHorizontal: 20,
        paddingTop: 20,
    },


    // ======================================================
    // LOADING
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
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 17,
    },

    backButton: {
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

    headerText: {
        flex: 1,
    },

    headerTitle: {
        fontSize: 30,
        fontWeight: "800",
        color: "#242331",
    },

    headerSubtitle: {
        fontSize: 13,
        color: "#92909E",
        marginTop: 2,
    },


    // ======================================================
    // SEARCH
    // ======================================================

    searchContainer: {
        height: 54,

        backgroundColor: "#FFFFFF",

        borderRadius: 16,

        borderWidth: 1,
        borderColor: "#ECEAF2",

        flexDirection: "row",
        alignItems: "center",

        paddingHorizontal: 16,

        marginBottom: 14,
    },

    searchInput: {
        flex: 1,

        height: "100%",

        marginLeft: 10,

        fontSize: 14,

        color: "#242331",
    },


    // ======================================================
    // CATEGORY CHIPS
    // ======================================================

    categoryScroll: {
        paddingTop: 2,
        paddingBottom: 6,
        paddingRight: 10,
    },
    categoryContainer: {
        height: 46,
        marginBottom: 4,
    },

    categoryChip: {
        height: 38,

        paddingHorizontal: 16,

        borderRadius: 19,

        backgroundColor: "#FFFFFF",

        borderWidth: 1,
        borderColor: "#E6E4EC",

        alignItems: "center",
        justifyContent: "center",

        marginRight: 8,
    },
    activeCategoryChip: {
        backgroundColor: PURPLE,
        borderColor: PURPLE,
    },

    categoryChipText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#777481",
    },

    activeCategoryChipText: {
        color: "#FFFFFF",
    },


    // ======================================================
    // RESULT HEADER
    // ======================================================

    resultHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 12,
        marginBottom: 12,

        minHeight: 25,
    },
    resultTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: "#242331",
    },

    resultCount: {
        fontSize: 12,
        fontWeight: "600",
        color: "#92909E",
    },


    // ======================================================
    // BLOG LIST
    // ======================================================

    listContent: {
        paddingBottom: 150,
    },

    emptyListContent: {
        flexGrow: 1,
    },


    // ======================================================
    // BLOG CARD
    // ======================================================

    blogCard: {
        backgroundColor: "#FFFFFF",

        borderRadius: 21,

        overflow: "hidden",

        marginBottom: 15,

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
    // BLOG IMAGE
    // ======================================================

    blogImage: {
        width: "100%",
        height: 175,

        backgroundColor: "#EFECFB",
    },


    // ======================================================
    // BLOG CONTENT
    // ======================================================

    blogContent: {
        padding: 16,
    },


    // ======================================================
    // CATEGORY BADGE
    // ======================================================

    categoryBadge: {
        alignSelf: "flex-start",

        backgroundColor: "#EFECFB",

        paddingHorizontal: 10,
        paddingVertical: 5,

        borderRadius: 50,

        marginBottom: 9,
    },

    categoryBadgeText: {
        fontSize: 10,
        fontWeight: "800",

        color: PURPLE,

        textTransform: "uppercase",
    },


    // ======================================================
    // TITLE
    // ======================================================

    blogTitle: {
        fontSize: 19,

        fontWeight: "800",

        color: "#242331",

        lineHeight: 25,

        marginBottom: 7,
    },


    // ======================================================
    // DESCRIPTION
    // ======================================================

    blogDescription: {
        fontSize: 13,

        color: "#777481",

        lineHeight: 20,
    },


    // ======================================================
    // FOOTER
    // ======================================================

    blogFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

        marginTop: 15,
        paddingTop: 12,

        borderTopWidth: 1,
        borderTopColor: "#F0EEF5",
    },

    authorRow: {
        flexDirection: "row",
        alignItems: "center",

        gap: 6,
    },

    authorText: {
        fontSize: 12,
        fontWeight: "700",
        color: "#777481",
    },

    readRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    readText: {
        fontSize: 12,
        fontWeight: "800",
        color: PURPLE,
    },


    // ======================================================
    // EMPTY
    // ======================================================

    emptyContainer: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",

        paddingHorizontal: 30,
        paddingBottom: 70,
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

});