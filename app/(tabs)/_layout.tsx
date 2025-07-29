import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
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
        tabBarActiveTintColor: Colors.dark.tint,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 0,
          marginBottom: 0,
          fontFamily: 'SpaceMono',
          textAlign: 'center',
          alignSelf: 'center',
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          display: 'flex',
        },
        tabBarStyle: {
          height: 74,
          backgroundColor: '#000',
          borderTopWidth: 0,
          elevation: 0,
          paddingTop: 8,
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