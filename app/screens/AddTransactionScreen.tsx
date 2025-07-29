import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, TextInput, Button, ActivityIndicator } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

const AddTransactionScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { addTransaction, loading, error } = useTransactions();

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setFormError('');
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setFormError('Please enter a valid amount');
      return;
    }
    if (!description) {
      setFormError('Please enter a description');
      return;
    }
    setSubmitting(true);
    try {
      await addTransaction({ type, amount: Number(amount), description, date });
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
    } catch (e) {
      setFormError('Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Add transaction screen"
    >
      <Text style={styles.title} accessibilityRole="header">Add Transaction</Text>
      {formError ? <Text style={{ color: 'red' }}>{formError}</Text> : null}
      <View style={styles.row}>
        <Button title={type === 'income' ? 'Income' : 'Expense'} onPress={() => setType(type === 'income' ? 'expense' : 'income')} color={type === 'income' ? 'green' : 'red'} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        accessibilityLabel="Amount input"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        accessibilityLabel="Description input"
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        accessibilityLabel="Date input"
      />
      <View style={styles.row}>
        {submitting || loading ? (
          <ActivityIndicator size="small" color={Colors.light.tint} />
        ) : (
          <Button title="Add Transaction" onPress={handleSubmit} />
        )}
      </View>
      {error && <Text style={{ color: 'red' }}>{error}</Text>}
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
});

export default AddTransactionScreen;
