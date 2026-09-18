import { Tabs, usePathname } from 'expo-router';
import {
    Home,
    PawPrintIcon,
    Calendar,
    User,
    Sparkles,
} from 'lucide-react-native';
import {
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

export default function TabLayout() {
    const pathname = usePathname();

    // Hide bottom navigation on PetPal inner pages
    const hideTabBar = pathname.includes('/screen/ai/');

    return (
        <Tabs
            screenOptions={{
                headerShown: false,

                // Hide bottom navigation for AI inner screens
                tabBarStyle: hideTabBar
                    ? { display: 'none' }
                    : styles.bottomNav,

                tabBarActiveTintColor: '#6C5DD3',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: styles.navText,
            }}
        >

            {/* =========================
                HOME
            ========================= */}
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',

                    tabBarIcon: ({ color, size }) => (
                        <Home
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* =========================
                MY PETS
            ========================= */}
            <Tabs.Screen
                name="pets"
                options={{
                    title: 'My Pets',

                    tabBarIcon: ({ color, size }) => (
                        <PawPrintIcon
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* =========================
                PETPAL AI CENTER BUTTON
            ========================= */}
            <Tabs.Screen
                name="ai"
                options={{
                    title: '',

                    tabBarButton: (props: any) => (
                        <TouchableOpacity
                            {...props}
                            activeOpacity={0.85}
                            style={styles.floatingButtonWrapper}
                        >
                            <View
                                style={
                                    styles.floatingButtonContainer
                                }
                            >
                                <View
                                    style={styles.floatingButton}
                                >
                                    <Sparkles
                                        size={26}
                                        color="#FFFFFF"
                                        strokeWidth={2.5}
                                    />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />

            {/* =========================
                APPOINTMENT
            ========================= */}
            <Tabs.Screen
                name="appointment"
                options={{
                    title: 'Appointment',

                    tabBarIcon: ({ color, size }) => (
                        <Calendar
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* =========================
                PROFILE
            ========================= */}
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',

                    tabBarIcon: ({ color, size }) => (
                        <User
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            {/* =========================
                HIDDEN SCREEN ROUTE
            ========================= */}
            <Tabs.Screen
                name="screen"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    // =========================
    // BOTTOM NAVIGATION
    // =========================
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,

        backgroundColor: '#FFFFFF',

        borderTopWidth: 1,
        borderColor: '#F3F4F6',

        height: 65,

        paddingBottom: 8,
        paddingTop: 8,

        elevation: 0,
    },

    navText: {
        fontSize: 10,
        fontWeight: '500',
    },

    // =========================
    // CENTER PETPAL BUTTON
    // =========================
    floatingButtonWrapper: {
        flex: 1,

        alignItems: 'center',
        justifyContent: 'center',
    },

    floatingButtonContainer: {
        position: 'absolute',

        top: -18,

        alignItems: 'center',
        justifyContent: 'center',
    },

    floatingButton: {
        width: 48,
        height: 48,

        borderRadius: 24,

        backgroundColor: '#6C5DD3',

        alignItems: 'center',
        justifyContent: 'center',

        shadowColor: '#6C5DD3',

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.3,
        shadowRadius: 4,

        elevation: 6,
    },
});