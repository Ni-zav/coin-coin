import { Colors } from '@/constants/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { ActivityIndicator, Button, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';
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

  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const isWeb = Platform.OS === 'web';

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate.toISOString().slice(0, 10));
    }
  };

  return (
    <ScrollView
      style={[styles.container, isTablet ? styles.tabletPadding : styles.phonePadding]}
      contentContainerStyle={styles.contentContainer}
      accessible
      accessibilityLabel="Add transaction screen"
    >
      <Text style={styles.header} accessibilityRole="header">Add Transaction</Text>
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      <View style={styles.radioRow}>
        <TouchableOpacity
          style={[styles.radioBtn, type === 'income' && styles.radioSelected]}
          onPress={() => setType('income')}
          accessibilityRole="button"
          accessibilityLabel="Income"
        >
          <Text style={styles.radioIncome}>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioBtn, type === 'expense' && styles.radioSelected]}
          onPress={() => setType('expense')}
          accessibilityRole="button"
          accessibilityLabel="Expense"
        >
          <Text style={styles.radioExpense}>Expense</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickRow}>
        {quickAdds.map((qa, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.quickBtn}
            onPress={() => handleQuickAdd(qa)}
            accessibilityRole="button"
            accessibilityLabel={qa.label}
          >
            <Text style={styles.quickLabel}>{qa.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        accessibilityLabel="Amount input"
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#888"
        value={description}
        onChangeText={setDescription}
        accessibilityLabel="Description input"
      />
      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>Date:</Text>
        {isWeb ? (
          <View style={styles.webDateContainer}>
            <label htmlFor="transaction-date" style={styles.webDateLabel}>Transaction Date</label>
            <input
              id="transaction-date"
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={styles.webDateInput}
              aria-label="Transaction date"
            />
          </View>
        ) : (
          <>
            <TouchableOpacity 
              onPress={() => setShowDatePicker(true)} 
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select date"
              style={styles.dateInputTouchable}
            >
              <TextInput
                style={styles.dateInput}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#888"
                keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric'}
                accessibilityLabel="Date input"
                editable={false}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {showDatePicker && (
              <>
                {Platform.OS === 'ios' ? (
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <TouchableOpacity 
                          onPress={() => setShowDatePicker(false)}
                          accessibilityRole="button"
                          accessibilityLabel="Cancel date selection"
                        >
                          <Text style={styles.modalButton}>Cancel</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Select Date</Text>
                        <TouchableOpacity 
                          onPress={() => setShowDatePicker(false)}
                          accessibilityRole="button"
                          accessibilityLabel="Confirm date selection"
                        >
                          <Text style={styles.modalButton}>Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        value={new Date(date)}
                        mode="date"
                        display="spinner"
                        onChange={handleDateChange}
                        style={styles.datePicker}
                      />
                    </View>
                  </View>
                ) : (
                  <DateTimePicker
                    value={new Date(date)}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </>
            )}
          </>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {submitting || loading ? (
          <ActivityIndicator size="small" color={Colors.dark.tint} />
        ) : (
          <Button 
            title="Add Transaction" 
            onPress={handleSubmit} 
            accessibilityLabel="Add transaction button"
          />
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 16,
  },
  tabletPadding: {
    paddingHorizontal: 32,
  },
  phonePadding: {
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  header: {
    fontSize: 22,
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
    fontFamily: 'SpaceMono',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  radioSelected: {
    borderColor: Colors.dark.tint,
    backgroundColor: '#222',
  },
  radioIncome: {
    color: Colors.dark.income,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  radioExpense: {
    color: Colors.dark.expense,
    fontWeight: 'bold',
    fontFamily: 'SpaceMono',
    fontSize: 13,
  },
  quickRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
    justifyContent: 'center',
  },
  quickBtn: {
    backgroundColor: Colors.dark.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    margin: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  quickLabel: {
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 13,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateInputTouchable: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    borderRadius: 6,
    padding: 10,
    fontSize: 13,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    justifyContent: 'center',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.card,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButton: {
    color: Colors.dark.tint,
    fontFamily: 'SpaceMono',
    fontSize: 16,
  },
  datePicker: {
    width: '100%',
    backgroundColor: Colors.dark.card,
  },
  webDateContainer: {
    marginTop: 4,
  },
  webDateLabel: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    borderWidth: 0,
  },
  webDateInput: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.dark.tint,
    backgroundColor: Colors.dark.card,
    color: Colors.dark.text,
    fontFamily: 'SpaceMono',
    fontSize: 13,
    width: '100%',
  },
});

export default AddTransactionScreen;