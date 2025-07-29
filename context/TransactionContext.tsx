import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Transaction = {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
};

interface TransactionContextProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, tx: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextProps | undefined>(undefined);

const STORAGE_KEY = 'transactions';

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      setTransactions(data ? JSON.parse(data) : []);
    } catch (e) {
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const saveTransactions = async (txs: Transaction[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
      setTransactions(txs);
    } catch (e) {
      setError('Failed to save transactions');
    }
  };

  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = { ...tx, id: Date.now().toString() };
    const updated = [newTx, ...transactions];
    await saveTransactions(updated);
  };

  const updateTransaction = async (id: string, tx: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...tx } : t);
    await saveTransactions(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter(t => t.id !== id);
    await saveTransactions(updated);
  };

  return (
    <TransactionContext.Provider value={{ transactions, loading, error, addTransaction, updateTransaction, deleteTransaction, refresh: loadTransactions }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within TransactionProvider');
  return ctx;
};
