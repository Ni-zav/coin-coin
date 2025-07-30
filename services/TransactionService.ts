import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction, FilterOptions } from '@/types/Transaction';

const STORAGE_KEY = 'finance_transactions';

export class TransactionService {
  static async getAllTransactions(): Promise<Transaction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  }

  static async addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    try {
      const transactions = await this.getAllTransactions();
      const newTransaction: Transaction = {
        ...transaction,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      transactions.push(newTransaction);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      return newTransaction;
    } catch (error) {
      console.error('Error adding transaction:', error);
      throw error;
    }
  }

  static async deleteTransaction(id: string): Promise<void> {
    try {
      const transactions = await this.getAllTransactions();
      const filteredTransactions = transactions.filter(t => t.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTransactions));
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw error;
    }
  }

  static async getFilteredTransactions(filters: FilterOptions): Promise<Transaction[]> {
    try {
      const transactions = await this.getAllTransactions();
      
      return transactions.filter(transaction => {
        // Filter by type
        if (filters.type !== 'all' && transaction.type !== filters.type) {
          return false;
        }
        
        // Filter by date range
        if (filters.dateFrom && transaction.date < filters.dateFrom) {
          return false;
        }
        
        if (filters.dateTo && transaction.date > filters.dateTo) {
          return false;
        }
        
        return true;
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error filtering transactions:', error);
      return [];
    }
  }

  static async getBalance(): Promise<{ total: number; income: number; expenses: number }> {
    try {
      const transactions = await this.getAllTransactions();
      
      const income = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      return {
        total: income - expenses,
        income,
        expenses,
      };
    } catch (error) {
      console.error('Error calculating balance:', error);
      return { total: 0, income: 0, expenses: 0 };
    }
  }
}