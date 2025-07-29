import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTransactions } from '../../context/TransactionContext';

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions, loading, error } = useTransactions();
  const colorScheme = 'dark'; // For demo, use dark theme

  const totalBalance = transactions.reduce((sum, tx) => tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0);
  const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

  // Donut chart data
  const chartData = [
    {
      name: 'Income',
      amount: income,
      color: Colors[colorScheme].income,
      legendFontColor: Colors[colorScheme].income,
      legendFontSize: 14,
    },
    {
      name: 'Expense',
      amount: expense,
      color: Colors[colorScheme].expense,
      legendFontColor: Colors[colorScheme].expense,
      legendFontSize: 14,
    },
  ];

  // Daily summary
  const today = new Date().toISOString().slice(0, 10);
  const todayIncome = transactions.filter(tx => tx.type === 'income' && tx.date === today).reduce((sum, tx) => sum + tx.amount, 0);
  const todayExpense = transactions.filter(tx => tx.type === 'expense' && tx.date === today).reduce((sum, tx) => sum + tx.amount, 0);

  // Recent transactions
  const recentTx = transactions.slice(0, 5);

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Home screen with balance and summary"
    >
      <Text style={styles.balanceLabel} accessibilityRole="header">Total Balance</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme].tint} />
      ) : (
        <Text style={styles.balanceAmount} accessibilityLabel="Total balance amount">
          ${totalBalance.toFixed(2)}
        </Text>
      )}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
      <View style={styles.summaryRow}>
        <View style={styles.summaryBox}>
          <Text style={{ color: Colors[colorScheme].income, fontWeight: 'bold' }}>Income</Text>
          <Text style={{ color: Colors[colorScheme].income, fontSize: 18 }}>${income.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={{ color: Colors[colorScheme].expense, fontWeight: 'bold' }}>Expense</Text>
          <Text style={{ color: Colors[colorScheme].expense, fontSize: 18 }}>${expense.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={styles.summaryLabel}>Breakdown</Text>
      <PieChart
        data={chartData}
        width={width - (isTablet ? 96 : 32)}
        height={180}
        chartConfig={{
          color: () => Colors[colorScheme].tint,
          backgroundColor: Colors[colorScheme].background,
        }}
        accessor="amount"
        backgroundColor={Colors[colorScheme].background}
        paddingLeft={16}
        hasLegend={true}
        center={[0, 0]}
        absolute
      />
      <Text style={styles.summaryLabel}>Today's Summary</Text>
      <View style={styles.summaryRow}>
        <Text style={{ color: Colors[colorScheme].income }}>Income: ${todayIncome.toFixed(2)}</Text>
        <Text style={{ color: Colors[colorScheme].expense }}>Expense: ${todayExpense.toFixed(2)}</Text>
      </View>
      <Text style={styles.summaryLabel}>Recent Transactions</Text>
      <FlatList
        data={recentTx}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={[styles.item, { borderLeftColor: item.type === 'income' ? Colors[colorScheme].income : Colors[colorScheme].expense }]}> 
            <Text style={styles.amount}>{item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}</Text>
            <Text style={styles.desc}>{item.description}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No transactions yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.dark.text,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 20,
    color: Colors.dark.icon,
    marginTop: 16,
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 16,
  },
  summaryBox: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  desc: {
    fontSize: 16,
    color: '#ff9800',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
});

export default HomeScreen;
