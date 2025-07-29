import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions, ActivityIndicator, FlatList } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

const TransactionListScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { transactions, loading, error } = useTransactions();

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Transaction history screen"
    >
      <Text style={styles.title} accessibilityRole="header">Transaction History</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.tint} />
      ) : error ? (
        <Text style={{ color: 'red' }}>{error}</Text>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.item, { borderLeftColor: item.type === 'income' ? 'green' : 'red' }]}> 
              <Text style={styles.amount}>{item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}</Text>
              <Text style={styles.desc}>{item.description}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          )}
          ListEmptyComponent={<Text>No transactions yet.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.light.text,
  },
  item: {
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    fontSize: 16,
    color: '#555',
  },
  date: {
    fontSize: 14,
    color: '#888',
  },
});

export default TransactionListScreen;
