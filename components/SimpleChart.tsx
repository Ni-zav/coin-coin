import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SimpleChartProps {
  income: number;
  expenses: number;
}

const { width } = Dimensions.get('window');

export default function SimpleChart({ income, expenses }: SimpleChartProps) {
  const total = income + expenses;
  const incomePercentage = total > 0 ? (income / total) * 100 : 50;
  const expensePercentage = total > 0 ? (expenses / total) * 100 : 50;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Income vs Expenses</Text>
      
      <View style={styles.chartContainer}>
        <View style={styles.barContainer}>
          <View style={styles.bar}>
            <View 
              style={[
                styles.incomeBar, 
                { width: `${incomePercentage}%` }
              ]} 
            />
            <View 
              style={[
                styles.expenseBar, 
                { width: `${expensePercentage}%` }
              ]} 
            />
          </View>
        </View>
        
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Income: {formatCurrency(income)}</Text>
          </View>
          
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Expenses: {formatCurrency(expenses)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
  barContainer: {
    width: '100%',
    marginBottom: 20,
  },
  bar: {
    height: 8,
    backgroundColor: '#333333',
    borderRadius: 4,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  incomeBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  expenseBar: {
    height: '100%',
    backgroundColor: '#F44336',
  },
  legendContainer: {
    alignItems: 'flex-start',
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
});