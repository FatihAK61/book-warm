import { Pressable } from 'react-native'
import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import COLORS from '@/constants/colors'
import Ionicons from '@expo/vector-icons/Ionicons'


export default function TabLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarButton: (props) => (
                <Pressable {...props} android_ripple={{ color: 'transparent' }}></Pressable>
            ),
            headerTitleStyle: {
                color: COLORS.textPrimary,
                fontWeight: '600'
            },
            headerShadowVisible: false,
            tabBarStyle: {
                backgroundColor: COLORS.cardBackground,
                borderTopWidth: 0.7,
                borderLeftWidth: 0.7,
                borderRightWidth: 0.7,
                borderTopColor: COLORS.border,
                borderLeftColor: COLORS.border,
                borderRightColor: COLORS.border,
                paddingTop: 5,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: insets.bottom,
                height: 60 + insets.bottom,
            }
        }}>
            <Tabs.Screen name='index' options={{
                title: 'Home',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='home-outline' color={color} size={size} />
                )
            }} />
            <Tabs.Screen name='create' options={{
                title: "Create",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='add-circle-outline' color={color} size={size} />
                )
            }} />
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name='person-outline' color={color} size={size} />
                )
            }} />
        </Tabs>
    )
}