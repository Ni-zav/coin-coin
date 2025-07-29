import { Colors } from '@/constants/Colors';
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

  const formatAbbr = (value: number | string) => {
    const num = typeof value === 'string' ? Number(value) : value;
    if (isNaN(num)) return '$0.00';
    if (Math.abs(num) >= 1e12) return `$${(num/1e12).toFixed(2)}T`;
    if (Math.abs(num) >= 1e9) return `$${(num/1e9).toFixed(2)}B`;
    if (Math.abs(num) >= 1e6) return `$${(num/1e6).toFixed(2)}M`;
    if (Math.abs(num) >= 1e3) return `$${(num/1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <ScrollView style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]} contentContainerStyle={{ paddingBottom: 32 }}>
      <Text style={styles.header}>Statistics</Text>
      <View style={[styles.row, !isTablet && styles.responsiveRow]}>
        <View style={[styles.card, !isTablet && styles.responsiveCard]}>
          <Text style={styles.label}>Total Transactions</Text>
          <Text style={styles.value}>{totalTx}</Text>
        </View>
        <View style={[styles.card, !isTablet && styles.responsiveCard]}>
          <Text style={styles.label}>Avg Transaction</Text>
          <Text style={styles.value}>{formatAbbr(avgTx)}</Text>
        </View>
      </View>
      <Text style={styles.section}>Daily Balance Trend</Text>
      <LineChart
        data={{
          labels: dailyLabels.map(l => l.slice(5)),
          datasets: [{ data: dailyData }]
        }}
        width={width - (isTablet ? 96 : 32)}
        height={220}
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          color: () => Colors[colorScheme].tint,
          labelColor: () => Colors[colorScheme].text,
          formatYLabel: (yLabel: string) => formatAbbr(yLabel),
        }}
        style={{ borderRadius: 12, marginBottom: 16, backgroundColor: '#000' }}
        bezier
        withShadow
        withInnerLines
        withOuterLines
        yLabelsOffset={8}
        segments={5}
        fromZero
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
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          color: () => Colors[colorScheme].tint,
          labelColor: () => Colors[colorScheme].text,
          formatYLabel: (yLabel: string) => formatAbbr(yLabel),
        }}
        style={{ borderRadius: 12, marginBottom: 16, backgroundColor: '#000' }}
        yAxisLabel=""
        yAxisSuffix=""
      />
      <Text style={styles.section}>Finance Health</Text>
      <View style={styles.halfRow}>
        <View style={[styles.card, styles.halfCard, styles.leftCard]}>
          <Text style={styles.label}>Expense %</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].expense }]}>{expensePct.toFixed(1)}%</Text>
        </View>
        <View style={[styles.card, styles.halfCard, styles.rightCard]}>
          <Text style={styles.label}>Income %</Text>
          <Text style={[styles.value, { color: Colors[colorScheme].income }]}>{incomePct.toFixed(1)}%</Text>
        </View>
      </View>
      <View style={[styles.card, styles.savingsCard]}>
        <Text style={styles.label}>Saving Rate</Text>
        <Text style={[styles.value, { color: Colors[colorScheme].tint }]}>{savingRate.toFixed(1)}%</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  halfRow: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  halfCard: {
    width: '50%',
    minWidth: 0,
    alignSelf: 'stretch',
    borderRadius: 0,
  },
  leftCard: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightCard: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  fullWidthRow: {
    alignItems: 'stretch',
  },
  fullWidthCard: {
    width: '100%',
    minWidth: 0,
    alignSelf: 'stretch',
  },
  responsiveRow: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'stretch',
  },
  responsiveCard: {
    minWidth: 0,
    width: '100%',
    alignItems: 'center',
  },
  savingsCard: {
    marginTop: 8,
    alignSelf: 'stretch',
    width: '100%',
    minWidth: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
