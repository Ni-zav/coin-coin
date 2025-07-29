import { Colors } from '@/constants/Colors';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useTransactions } from '../../context/TransactionContext';

const quickAdds: { label: string; type: 'income' | 'expense' | null; description: string }[] = [
  { label: '+ Salary', type: 'income', description: 'Salary' },
  { label: '- Grocery', type: 'expense', description: 'Grocery' },
  { label: '- Rent', type: 'expense', description: 'Rent' },
  { label: '- Transport', type: 'expense', description: 'Transport' },
  { label: '+ Bonus', type: 'income', description: 'Bonus' },
  { label: 'Other', type: null, description: '' },
];

const AddTransactionScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  const { addTransaction, loading, error } = useTransactions();
  const colorScheme = 'dark';

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleQuickAdd = (qa: { label: string; type: 'income' | 'expense' | null; description: string }) => {
    if (qa.type) setType(qa.type);
    setDescription(qa.description);
  };

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

  // Simple floating date picker modal
  const handleDatePick = (newDate: string) => {
    setDate(newDate);
    setDatePickerVisible(false);
  };

  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Add transaction screen"
    >
      <Text style={styles.title} accessibilityRole="header">Add Transaction</Text>
      {formError ? <Text style={{ color: 'red' }}>{formError}</Text> : null}
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={[styles.radioBtn, type === 'income' && styles.radioSelected]}
          onPress={() => setType('income')}
        >
          <Text style={{ color: type === 'income' ? Colors[colorScheme].income : Colors[colorScheme].text }}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioBtn, type === 'expense' && styles.radioSelected]}
          onPress={() => setType('expense')}
        >
          <Text style={{ color: type === 'expense' ? Colors[colorScheme].expense : Colors[colorScheme].text }}>Expense</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickRow}>
        {quickAdds.map((qa, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.quickBtn}
            onPress={() => handleQuickAdd(qa)}
          >
            <Text style={{ color: Colors[colorScheme].tint }}>{qa.label}</Text>
          </TouchableOpacity>
        ))}
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
      <TouchableOpacity style={styles.input} onPress={() => setDatePickerVisible(true)}>
        <Text style={{ color: Colors[colorScheme].tint }}>Date: {date}</Text>
      </TouchableOpacity>
      <Modal visible={datePickerVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={{ color: Colors[colorScheme].tint, marginBottom: 8 }}>Pick a date</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
            />
            <Button title="Set Date" onPress={() => handleDatePick(date)} />
            <Button title="Cancel" onPress={() => setDatePickerVisible(false)} color="gray" />
          </View>
        </View>
      </Modal>
      <View style={styles.row}>
        {submitting || loading ? (
          <ActivityIndicator size="small" color={Colors[colorScheme].tint} />
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
    backgroundColor: Colors.dark.background,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: Colors.dark.text,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ff9800',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
  },
  radioRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    justifyContent: 'center',
  },
  radioBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.dark.card,
    borderWidth: 2,
    borderColor: '#444',
    minWidth: 80,
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#ff9800',
    backgroundColor: '#222',
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  quickBtn: {
    backgroundColor: '#232323',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    justifyContent: 'center',
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    padding: 24,
    borderRadius: 12,
    width: 300,
    alignItems: 'center',
  },
});

export default AddTransactionScreen;
