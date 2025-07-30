import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import BalanceCard from '@/components/BalanceCard';
import SimpleChart from '@/components/SimpleChart';
import { TransactionService } from '@/services/TransactionService';

export default function HomeScreen() {
  const [balance, setBalance] = useState({ total: 0, income: 0, expenses: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadBalance = async () => {
    try {
      const balanceData = await TransactionService.getBalance();
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBalance();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadBalance();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.subtitle}>Here's your financial overview</Text>
        </View>

        <BalanceCard
          balance={balance.total}
          income={balance.income}
          expenses={balance.expenses}
        />

        <SimpleChart income={balance.income} expenses={balance.expenses} />

        <View style={styles.quickStats}>
          <Text style={styles.quickStatsTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {balance.total >= 0 ? 'Positive' : 'Negative'}
              </Text>
              <Text style={styles.statLabel}>Balance Status</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {balance.income > balance.expenses ? 'Saving' : 'Spending'}
              </Text>
              <Text style={styles.statLabel}>Trend</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  quickStats: {
    margin: 20,
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  quickStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B35',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#888888',
  },
});