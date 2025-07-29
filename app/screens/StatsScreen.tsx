import { Colors } from '@/constants/Colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { useTransactions } from '../../context/TransactionContext';

const StatsScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions } = useTransactions();
  const colorScheme = 'dark';

  // Total and average
  const totalTx = transactions.length;
  const avgTx = totalTx ? (transactions.reduce((sum, tx) => sum + tx.amount, 0) / totalTx) : 0;

  // Daily balance trend
  const dailyMap: { [key: string]: number } = {};
  transactions.forEach(tx => {
    dailyMap[tx.date] = (dailyMap[tx.date] || 0) + (tx.type === 'income' ? tx.amount : -tx.amount);
  });
  const dailyLabels = Object.keys(dailyMap).sort();
  const dailyData = dailyLabels.map(date => dailyMap[date]);

  // Monthly comparison
  const monthlyMap: { [key: string]: number } = {};
  transactions.forEach(tx => {
    const month = tx.date.slice(0, 7);
    monthlyMap[month] = (monthlyMap[month] || 0) + (tx.type === 'income' ? tx.amount : -tx.amount);
  });
  const monthlyLabels = Object.keys(monthlyMap).sort();
  const monthlyData = monthlyLabels.map(m => monthlyMap[m]);

  // Finance health
  const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const savingRate = totalIncome ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const expensePct = totalIncome ? (totalExpense / totalIncome) * 100 : 0;
  const incomePct = 100 - expensePct;

  return (
    <ScrollView style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.header}>Stats & Finance Health</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Total Transactions</Text>
          <Text style={styles.value}>{totalTx}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Avg Transaction</Text>
          <Text style={styles.value}>${avgTx.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={styles.section}>Daily Balance Trend</Text>
      <LineChart
        data={{
          labels: dailyLabels,
          datasets: [{ data: dailyData }],
        }}
        width={width - (isTablet ? 96 : 32)}
        height={180}
        chartConfig={{
          backgroundColor: Colors[colorScheme].background,
          backgroundGradientFrom: Colors[colorScheme].background,
          backgroundGradientTo: Colors[colorScheme].background,
          color: () => Colors[colorScheme].tint,
          labelColor: () => Colors[colorScheme].text,
        }}
        bezier
        style={{ borderRadius: 12, marginBottom: 16 }}
      />
      <Text style={styles.section}>Monthly Comparison</Text>
      <BarChart
        data={{
          labels: monthlyLabels,
          datasets: [{ data: monthlyData }],
        }}
        width={width - (isTablet ? 96 : 32)}
        height={180}
        chartConfig={{
          backgroundColor: Colors[colorScheme].background,
          backgroundGradientFrom: Colors[colorScheme].background,
          backgroundGradientTo: Colors[colorScheme].background,
          color: () => Colors[colorScheme].tint,
          labelColor: () => Colors[colorScheme].text,
        }}
        style={{ borderRadius: 12, marginBottom: 16 }}
        yAxisLabel=""
        yAxisSuffix=""
      />
      <Text style={styles.section}>Finance Health</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Expense %</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].expense }]}>{expensePct.toFixed(1)}%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Income %</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].income }]}>{incomePct.toFixed(1)}%</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Saving Rate</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].tint }]}>{savingRate.toFixed(1)}%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    paddingTop: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    marginBottom: 16,
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  section: {
    fontSize: 20,
    color: Colors.dark.tint,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 120,
    elevation: 2,
  },
  label: {
    color: Colors.dark.icon,
    fontSize: 14,
    marginBottom: 4,
    fontFamily: 'SpaceMono',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
  },
});

export default StatsScreen;
