import { Tabs } from 'expo-router';
import { Home, PawPrintIcon, Calendar, User, PlusCircle } from 'lucide-react-native';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.bottomNav,
                tabBarActiveTintColor: '#6C5DD3',
                tabBarInactiveTintColor: '#9CA3AF',
                tabBarLabelStyle: styles.navText,
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="pets"
                options={{
                    title: 'My Pets',
                    tabBarIcon: ({ color, size }) => <PawPrintIcon size={size} color={color} />,
                }}
            />

            {/* Floating Center Action Button */}
            <Tabs.Screen
                name="add"
                options={{
                    title: '',
                    tabBarButton: (props: any) => (
                        <TouchableOpacity
                            {...props}
                            activeOpacity={0.8}
                            style={styles.floatingButtonWrapper}
                        >
                            <View style={styles.floatingButtonContainer}>
                                <View style={styles.floatingButton}>
                                    <PlusCircle size={24} color="#FFFFFF" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    ),
                }}
            />

            <Tabs.Screen
                name="appointment"
                options={{
                    title: 'Appointment',
                    tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
                }}
            />
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
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6C5DD3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 6,
    },
});