import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarLabelPosition: 'below-icon',
      tabBarLabelStyle: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2,
        paddingBottom: 2,
      },
      tabBarItemStyle: {
        height: 80,
        paddingVertical: 8,
      },
      tabBarStyle: Platform.select({
        ios: {
          position: 'absolute',
          height: 80,
          paddingBottom: 10,
        },
        default: {
          height: 80,
          paddingBottom: 6,
        },
      }),

      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'Transactions',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="attach-money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="add" color={color} />,
        }}
      />
      <Tabs.Screen
        name="StatsScreen"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="bar-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}
