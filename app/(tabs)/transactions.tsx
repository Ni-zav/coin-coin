import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Filter } from 'lucide-react-native';
import TransactionItem from '@/components/TransactionItem';
import FilterModal from '@/components/FilterModal';
import { TransactionService } from '@/services/TransactionService';
import { Transaction, FilterOptions } from '@/types/Transaction';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({ type: 'all' });

  const loadTransactions = async () => {
    try {
      const allTransactions = await TransactionService.getAllTransactions();
      setTransactions(allTransactions);
      applyFilters(allTransactions, filters);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const applyFilters = async (transactionList: Transaction[], currentFilters: FilterOptions) => {
    try {
      const filtered = await TransactionService.getFilteredTransactions(currentFilters);
      setFilteredTransactions(filtered);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await TransactionService.deleteTransaction(id);
      await loadTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    applyFilters(transactions, newFilters);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionItem
      transaction={item}
      onDelete={handleDeleteTransaction}
    />
  );

  const getFilterText = () => {
    if (filters.type === 'all' && !filters.dateFrom && !filters.dateTo) {
      return 'All Transactions';
    }
    
    let text = '';
    if (filters.type !== 'all') {
      text += filters.type.charAt(0).toUpperCase() + filters.type.slice(1);
    }
    
    if (filters.dateFrom || filters.dateTo) {
      if (text) text += ' • ';
      text += 'Date Filtered';
    }
    
    return text || 'All Transactions';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilterModalVisible(true)}
        >
          <Filter size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterInfo}>
        <Text style={styles.filterText}>{getFilterText()}</Text>
        <Text style={styles.countText}>
          {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        style={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
            <Text style={styles.emptySubtext}>
              {filters.type !== 'all' || filters.dateFrom || filters.dateTo
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </Text>
          </View>
        }
      />

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  filterButton: {
    backgroundColor: '#FF6B35',
    padding: 12,
    borderRadius: 12,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterText: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '500',
  },
  countText: {
    fontSize: 14,
    color: '#888888',
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
  },
});