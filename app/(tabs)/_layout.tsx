import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';
import React from 'react';

function getIconName(routeName: string) {
  switch (routeName) {
    case 'HomeScreen':
      return 'home';
    case 'TransactionListScreen':
      return 'money';
    case 'AddTransactionScreen':
      return 'plus';
    case 'StatsScreen':
      return 'bar-chart';
    default:
      return 'circle';
  }
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        tabBarLabelStyle: {
          fontSize: 15,
          fontWeight: 'bold',
          marginTop: 2,
          marginBottom: 8,
          fontFamily: 'SpaceMono',
        },
        tabBarStyle: {
          height: 74,
          backgroundColor: '#000',
          borderTopWidth: 0,
          elevation: 0,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="home" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="transactions"
        options={{
          title: 'History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <IconSymbol name="money" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => <IconSymbol name="plus" color={color} size={28} />,
        }}
      />
      <Tabs.Screen
        name="StatsScreen"
        options={{
          title: 'Stats',
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color }) => <IconSymbol name="bar-chart" color={color} size={28} />,
        }}
      />
    </Tabs>
  );
}
