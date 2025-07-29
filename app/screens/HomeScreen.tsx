import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Home screen with balance and summary"
    >
      <Text style={styles.balanceLabel} accessibilityRole="header">Total Balance</Text>
      <Text style={styles.balanceAmount} accessibilityLabel="Total balance amount">$0.00</Text>
      {/* chart/graph and summary will be added here */}
      <Text style={styles.summaryLabel}>Income/Expense Summary</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  balanceLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.light.text,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 20,
    color: Colors.light.icon,
    marginTop: 16,
  },
});

export default HomeScreen;
