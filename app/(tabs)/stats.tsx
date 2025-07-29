import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useFinance } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, Calendar, ChartPie as PieChartIcon } from 'lucide-react-native';

export default function StatsScreen() {
  const { transactions, getTotalIncome, getTotalExpenses, getTotalBalance } = useFinance();

  const screenWidth = Dimensions.get('window').width;

  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toISOString().slice(0, 7), // YYYY-MM format
        name: date.toLocaleDateString('en-US', { month: 'short' })
      };
    });

    return last6Months.map(({ month, name }) => {
      const monthTransactions = transactions.filter(t => t.date.startsWith(month));
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return { name, income, expenses };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const categories: { [key: string]: number } = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const category = t.description ? 
          (t.description.toLowerCase().includes('food') ? 'Food' :
           t.description.toLowerCase().includes('transport') ? 'Transport' :
           t.description.toLowerCase().includes('shopping') ? 'Shopping' :
           t.description.toLowerCase().includes('entertainment') ? 'Entertainment' :
           'Other') : 'Other';
        
        categories[category] = (categories[category] || 0) + t.amount;
      });

    const colors = ['#2563EB', '#059669', '#DC2626', '#F59E0B', '#8B5CF6'];
    return Object.entries(categories).map(([name, amount], index) => ({
      name,
      amount,
      color: colors[index % colors.length],
      legendFontColor: '#6B7280',
      legendFontSize: 14,
    }));
  }, [transactions]);

  const barChartData = {
    labels: monthlyData.map(d => d.name),
    datasets: [
      {
        data: monthlyData.map(d => d.income),
        color: (opacity = 1) => `rgba(5, 150, 105, ${opacity})`,
      },
      {
        data: monthlyData.map(d => d.expenses),
        color: (opacity = 1) => `rgba(220, 38, 38, ${opacity})`,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForLabels: {
      fontSize: 12,
    },
  };

  const totalIncome = getTotalIncome();
  const totalExpenses = getTotalExpenses();
  const balance = getTotalBalance();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Your financial insights</Text>

        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, styles.incomeCard]}>
            <View style={styles.summaryHeader}>
              <TrendingUp size={20} color="#059669" />
              <Text style={styles.summaryLabel}>Total Income</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: '#059669' }]}>
              ${totalIncome.toFixed(2)}
            </Text>
          </View>

          <View style={[styles.summaryCard, styles.expenseCard]}>
            <View style={styles.summaryHeader}>
              <TrendingDown size={20} color="#DC2626" />
              <Text style={styles.summaryLabel}>Total Expenses</Text>
            </View>
            <Text style={[styles.summaryAmount, { color: '#DC2626' }]}>
              ${totalExpenses.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={[styles.summaryCard, styles.balanceCard]}>
          <View style={styles.summaryHeader}>
            <Calendar size={20} color={balance >= 0 ? '#059669' : '#DC2626'} />
            <Text style={styles.summaryLabel}>Net Balance</Text>
          </View>
          <Text style={[
            styles.summaryAmount,
            styles.balanceAmount,
            { color: balance >= 0 ? '#059669' : '#DC2626' }
          ]}>
            {balance >= 0 ? '+' : '-'}${Math.abs(balance).toFixed(2)}
          </Text>
        </View>

        {/* Monthly Trend Chart */}
        {transactions.length > 0 && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Calendar size={20} color="#2563EB" />
              <Text style={styles.chartTitle}>6-Month Trend</Text>
            </View>
            <BarChart
              data={barChartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              style={styles.chart}
              showValuesOnTopOfBars={false}
              fromZero={true}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#059669' }]} />
                <Text style={styles.legendText}>Income</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#DC2626' }]} />
                <Text style={styles.legendText}>Expenses</Text>
              </View>
            </View>
          </View>
        )}

        {/* Expense Categories */}
        {categoryData.length > 0 && (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <PieChartIcon size={20} color="#2563EB" />
              <Text style={styles.chartTitle}>Expense Categories</Text>
            </View>
            <PieChart
              data={categoryData}
              width={screenWidth - 64}
              height={200}
              chartConfig={chartConfig}
              accessor="amount"
              backgroundColor="transparent"
              paddingLeft="15"
              style={styles.chart}
            />
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{transactions.length}</Text>
            <Text style={styles.statLabel}>Total Transactions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.type === 'income').length}
            </Text>
            <Text style={styles.statLabel}>Income Transactions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {transactions.filter(t => t.type === 'expense').length}
            </Text>
            <Text style={styles.statLabel}>Expense Transactions</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              ${transactions.length > 0 ? (totalExpenses / transactions.filter(t => t.type === 'expense').length || 0).toFixed(0) : '0'}
            </Text>
            <Text style={styles.statLabel}>Avg. Expense</Text>
          </View>
        </View>

        {transactions.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No data available</Text>
            <Text style={styles.emptySubtitle}>
              Add some transactions to see your statistics
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
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
  balanceCard: {
    marginHorizontal: 0,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  summaryAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  balanceAmount: {
    fontSize: 24,
  },
  chartCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});