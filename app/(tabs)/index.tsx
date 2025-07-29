import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useFinance } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { getTotalBalance, getTotalIncome, getTotalExpenses, transactions, loading } = useFinance();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const balance = getTotalBalance();
  const income = getTotalIncome();
  const expenses = getTotalExpenses();

  // Chart data for last 7 days
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const dailyData = last7Days.map(date => {
      const dayTransactions = transactions.filter(t => t.date === date);
      const dayIncome = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const dayExpenses = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return dayIncome - dayExpenses;
    });

    return {
      labels: last7Days.map(date => new Date(date).getDate().toString()),
      datasets: [
        {
          data: dailyData.length > 0 ? dailyData : [0],
          color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
          strokeWidth: 3,
        },
      ],
    };
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning!</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <DollarSign size={24} color="#2563EB" />
            <Text style={styles.balanceLabel}>Total Balance</Text>
          </View>
          <Text style={[styles.balanceAmount, { color: balance >= 0 ? '#059669' : '#DC2626' }]}>
            ${Math.abs(balance).toFixed(2)}
          </Text>
          {balance < 0 && <Text style={styles.negativeIndicator}>Negative Balance</Text>}
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.incomeCard]}>
            <View style={styles.statHeader}>
              <TrendingUp size={20} color="#059669" />
              <Text style={styles.statLabel}>Income</Text>
            </View>
            <Text style={[styles.statAmount, { color: '#059669' }]}>
              ${income.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.statCard, styles.expenseCard]}>
            <View style={styles.statHeader}>
              <TrendingDown size={20} color="#DC2626" />
              <Text style={styles.statLabel}>Expenses</Text>
            </View>
            <Text style={[styles.statAmount, { color: '#DC2626' }]}>
              ${expenses.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Chart Section */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Activity size={20} color="#2563EB" />
            <Text style={styles.chartTitle}>7-Day Trend</Text>
          </View>
          
          {transactions.length > 0 ? (
            <LineChart
              data={getChartData()}
              width={Dimensions.get('window').width - 64}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#2563EB',
                },
              }}
              bezier
              style={styles.chart}
            />
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>No transactions yet</Text>
              <Text style={styles.emptyChartSubtext}>Add your first transaction to see the chart</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/add')}
          >
            <Text style={styles.actionButtonText}>Add Transaction</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push('/transactions')}
          >
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View All</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  balanceCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    marginBottom: 4,
  },
  negativeIndicator: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  statAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptyChartSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 32,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    color: '#2563EB',
  },
});