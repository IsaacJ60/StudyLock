// TabLayout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StateProvider } from '../context/context'; // Import the StateProvider
import { Ionicons } from "@expo/vector-icons"; // For icons

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <StateProvider>  {/* Wrap with the provider */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <Ionicons name="home" size={28} color="white" />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color }) => <Ionicons name="folder" size={28} color="white" />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <Ionicons name="person" size={28} color="white" />,
          }}
        />
      </Tabs>
    </StateProvider>
  );
}
