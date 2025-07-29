import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>$0.00</Text>
      {/* Chart/graph and summary will be added here */}
      <Text style={styles.summaryLabel}>Income/Expense Summary</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  balanceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 18,
    color: '#555',
    marginTop: 16,
  },
});

export default HomeScreen;
