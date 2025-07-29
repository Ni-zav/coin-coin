import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions, loading, error } = useTransactions();

  const totalBalance = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0);
  const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Home screen with balance and summary"
    >
      <Text style={styles.balanceLabel} accessibilityRole="header">Total Balance</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) : (
        <Text style={styles.balanceAmount} accessibilityLabel="Total balance amount">
          ${totalBalance.toFixed(2)}
        </Text>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <Text style={styles.summaryLabel}>Income/Expense Summary</Text>
      <Text style={{ color: Colors.light.text }}>Income: ${income.toFixed(2)}</Text>
      <Text style={{ color: Colors.light.text }}>Expense: ${expense.toFixed(2)}</Text>
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
