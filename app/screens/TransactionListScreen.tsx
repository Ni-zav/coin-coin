import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

const TransactionListScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions, loading, error } = useTransactions();

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 32 : 16 }]}
      accessible
      accessibilityLabel="Transaction history screen"
    >
      <Text style={styles.header} accessibilityRole="header">Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.item, { borderLeftColor: item.type === 'income' ? Colors.dark.income : Colors.dark.expense }]}> 
              <Text style={styles.amount}>{item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No transactions yet.</Text>}
        />
      )}
    </View>
  );
}

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
  error: {
    color: Colors.dark.expense,
    textAlign: 'center',
    marginBottom: 8,
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
    fontFamily: 'SpaceMono',
  },
  desc: {
    fontSize: 16,
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
  },
  date: {
    fontSize: 14,
    color: '#888',
    fontFamily: 'SpaceMono',
  },
  empty: {
    color: Colors.dark.icon,
    textAlign: 'center',
    fontFamily: 'SpaceMono',
    marginTop: 16,
  },
});

export default TransactionListScreen;
