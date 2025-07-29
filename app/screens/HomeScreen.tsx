import BreakdownPieChart from '@/components/BreakdownPieChart';
import { Colors } from '@/constants/Colors';
import { useTransactions } from '@/hooks/useTransactions';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
  },
  overview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
    width: '45%',
    alignItems: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  label: {
    fontSize: 13,
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
    marginBottom: 4,
  },
  valueIncome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.income,
    fontFamily: 'SpaceMono',
  },
  valueExpense: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.expense,
    fontFamily: 'SpaceMono',
  },
  section: {
    fontSize: 16,
    color: Colors.dark.tint,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    justifyContent: 'center',
  },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: Colors.dark.card,
    borderRadius: 8,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
  },
  desc: {
    fontSize: 13,
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
  },
  date: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'SpaceMono',
  },
  empty: {
    color: Colors.dark.icon,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
    marginTop: 16,
  },
  subtext: {
    fontSize: 12,
    color: Colors.dark.tint,
    marginTop: 4,
    marginLeft: 16,
    fontFamily: 'SpaceMono',
  },
  errorText: {
    color: Colors.dark.expense,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: 'SpaceMono',
  },
});

const HomeScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions, loading, error } = useTransactions();
  const colorScheme = 'dark';

  const totalBalance = transactions.reduce((sum, tx) => 
    tx.type === 'income' ? sum + tx.amount : sum - tx.amount, 0);
  const income = transactions.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const expense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  
  // Add index signature to fix TS error
  const dailyBalances = transactions.reduce<Record<string, number>>((acc, tx) => {
    const date = moment(tx.date).format('YYYY-MM-DD');
    acc[date] = (acc[date] || 0) + (tx.type === 'income' ? tx.amount : -tx.amount);
    return acc;
  }, {});

  // Recent transactions
  const recentTx = transactions.slice(0, 5);

  // Daily balance trend data
  // Prepare LineChart data
  const sortedEntries = Object.entries(dailyBalances)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
  const lineChartData = {
    labels: sortedEntries.map(([date]) => date.slice(5)), // show MM-DD
    datasets: [
      {
        data: sortedEntries.map(([, balance]) => balance),
        color: () => Colors[colorScheme].tint,
        strokeWidth: 2,
      },
    ],
  };

  // Today's summary
  const today = moment().format('YYYY-MM-DD');
  const todayIncome = transactions.filter(tx => tx.type === 'income' && tx.date === today).reduce((sum, tx) => sum + tx.amount, 0);
  const todayExpense = transactions.filter(tx => tx.type === 'expense' && tx.date === today).reduce((sum, tx) => sum + tx.amount, 0);
  const monthlyAvgExpense = transactions.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0) / moment().daysInMonth();

  return (
    <ScrollView
      style={[styles.container]}
      contentContainerStyle={{ 
        paddingTop: 16,
        paddingBottom: 32,
        paddingHorizontal: isTablet ? 32 : 16 
      }}
      accessible
      accessibilityLabel="Home screen with balance and summary"
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting} accessibilityRole="header">
          Welcome back!
        </Text>
        <Text style={styles.balance} accessibilityLabel="Total balance amount">
          ${totalBalance.toFixed(2)}
        </Text>
      </View>

      {/* Loading/Error States */}
      {loading && (
        <ActivityIndicator 
          size="large" 
          color={Colors[colorScheme].tint} 
          style={{ marginBottom: 24 }}
        />
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Breakdown Chart */}
      <Text style={styles.section}>Breakdown</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
        <BreakdownPieChart 
          chartData={[
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
          ]} 
          width={width - (isTablet ? 64 : 32)} 
          colorScheme={colorScheme} 
        />
      </View>

      {/* Daily Summary */}
      <Text style={styles.section}>Today's Summary</Text>
      <View style={styles.row}>
        <View style={styles.card}>
          <Text style={styles.label}>Income</Text>
          <Text style={styles.valueIncome}>${todayIncome.toFixed(2)}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.label}>Expense</Text>
          <Text style={styles.valueExpense}>${todayExpense.toFixed(2)}</Text>
        </View>
      </View>
      <Text style={styles.subtext}>
        Daily spend: {monthlyAvgExpense ? ((todayExpense / monthlyAvgExpense) * 100).toFixed(1) : '0'}% of monthly average
      </Text>

      {/* Balance Trend */}
      <Text style={styles.section}>Balance Trend</Text>
      <LineChart
        data={lineChartData}
        width={width - (isTablet ? 64 : 32)}
        height={180}
        chartConfig={{
          color: () => Colors[colorScheme].tint,
          backgroundColor: Colors[colorScheme].background,
          backgroundGradientFrom: Colors[colorScheme].background,
          backgroundGradientTo: Colors[colorScheme].card,
          decimalPlaces: 2,
          labelColor: () => Colors[colorScheme].text,
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 12 }}
      />

      {/* Recent Transactions */}
      <Text style={styles.section}>Recent Transactions</Text>
      <FlatList
        data={recentTx}
        keyExtractor={(item: { id: string }) => item.id}
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.item, { 
            borderLeftColor: item.type === 'income' ? Colors[colorScheme].income : Colors[colorScheme].expense 
          }]}> 
            <Feather 
              name={item.type === 'income' ? 'arrow-up' : 'arrow-down'} 
              size={20} 
              color={item.type === 'income' ? Colors[colorScheme].income : Colors[colorScheme].expense}
            />
            <View style={styles.itemContent}>
              <Text style={styles.amount}>
                {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
              </Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{moment(item.date).format('MMM D')}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.empty}>No transactions yet.</Text>
        )}
      />
    </ScrollView>
  );
};

export default HomeScreen;