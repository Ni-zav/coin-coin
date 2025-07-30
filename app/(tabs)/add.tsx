import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { DollarSign, FileText, Calendar } from 'lucide-react-native';
import { TransactionService } from '@/services/TransactionService';

export default function AddTransactionScreen() {
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount greater than 0');
      return false;
    }

    if (!date) {
      Alert.alert('Invalid Date', 'Please select a valid date');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await TransactionService.addTransaction({
        type: transactionType,
        amount: parseFloat(amount),
        description: description.trim(),
        date,
      });

      Alert.alert(
        'Success',
        `${transactionType === 'income' ? 'Income' : 'Expense'} added successfully!`,
        [
          {
            text: 'Add Another',
            onPress: () => {
              setAmount('');
              setDescription('');
              setDate(new Date().toISOString().split('T')[0]);
            },
          },
          {
            text: 'View Transactions',
            onPress: () => router.push('/transactions'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    return numericValue;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Transaction</Text>
            <Text style={styles.subtitle}>Track your income and expenses</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.typeSelector}>
              <Text style={styles.label}>Transaction Type</Text>
              <View style={styles.typeButtons}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'income' && styles.activeTypeButton,
                  ]}
                  onPress={() => setTransactionType('income')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      transactionType === 'income' && styles.activeTypeButtonText,
                    ]}
                  >
                    Income
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    transactionType === 'expense' && styles.activeTypeButton,
                  ]}
                  onPress={() => setTransactionType('expense')}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      transactionType === 'expense' && styles.activeTypeButtonText,
                    ]}
                  >
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount *</Text>
              <View style={styles.inputContainer}>
                <DollarSign size={20} color="#888888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={amount}
                  onChangeText={(text) => setAmount(formatCurrency(text))}
                  placeholder="0.00"
                  placeholderTextColor="#666666"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color="#888888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter description (optional)"
                  placeholderTextColor="#666666"
                  multiline
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Date *</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color="#888888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Adding...' : `Add ${transactionType === 'income' ? 'Income' : 'Expense'}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
  form: {
    padding: 20,
  },
  typeSelector: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111111',
  },
  typeButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#111111',
  },
  activeTypeButton: {
    backgroundColor: '#FF6B35',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#888888',
  },
  activeTypeButtonText: {
    color: '#FFFFFF',
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333333',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});