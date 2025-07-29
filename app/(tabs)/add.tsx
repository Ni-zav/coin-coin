import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { DollarSign, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';

export default function AddTransactionScreen() {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; type?: string }>({});

  const validateForm = () => {
    const newErrors: { amount?: string; type?: string } = {};

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await addTransaction({
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        date: date.toISOString().split('T')[0],
      });

      Alert.alert(
        'Success',
        'Transaction added successfully!',
        [
          {
            text: 'Add Another',
            onPress: () => {
              setAmount('');
              setDescription('');
              setDate(new Date());
            }
          },
          {
            text: 'View Transactions',
            onPress: () => router.push('/transactions')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Add Transaction</Text>
          <Text style={styles.subtitle}>Track your income and expenses</Text>

          {/* Transaction Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.typeContainer}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'income' && styles.typeButtonActive,
                  type === 'income' && styles.incomeButton,
                ]}
                onPress={() => setType('income')}
              >
                <TrendingUp
                  size={20}
                  color={type === 'income' ? 'white' : '#059669'}
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'income' && styles.typeButtonTextActive,
                ]}>
                  Income
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.typeButton,
                  type === 'expense' && styles.typeButtonActive,
                  type === 'expense' && styles.expenseButton,
                ]}
                onPress={() => setType('expense')}
              >
                <TrendingDown
                  size={20}
                  color={type === 'expense' ? 'white' : '#DC2626'}
                />
                <Text style={[
                  styles.typeButtonText,
                  type === 'expense' && styles.typeButtonTextActive,
                ]}>
                  Expense
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.section}>
            <Text style={styles.label}>
              Amount <Text style={styles.required}>*</Text>
            </Text>
            <View style={[styles.inputContainer, errors.amount && styles.inputError]}>
              <DollarSign size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  if (errors.amount) {
                    setErrors(prev => ({ ...prev, amount: undefined }));
                  }
                }}
                placeholder="0.00"
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount}</Text>
            )}
          </View>

          {/* Description Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <View style={styles.inputContainer}>
              <FileText size={20} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Optional description..."
                returnKeyType="done"
                multiline={true}
                numberOfLines={2}
              />
            </View>
          </View>

          {/* Date Input */}
          <View style={styles.section}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.inputContainer}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#6B7280" style={styles.inputIcon} />
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              type === 'income' ? styles.incomeSubmit : styles.expenseSubmit,
              loading && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Adding...' : 'Add Transaction'}
            </Text>
          </TouchableOpacity>

          {/* Preview Card */}
          {amount && (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>Preview</Text>
              <View style={styles.previewContent}>
                <View style={styles.previewType}>
                  {type === 'income' ? (
                    <TrendingUp size={16} color="#059669" />
                  ) : (
                    <TrendingDown size={16} color="#DC2626" />
                  )}
                  <Text style={[
                    styles.previewTypeText,
                    { color: type === 'income' ? '#059669' : '#DC2626' }
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </View>
                <Text style={[
                  styles.previewAmount,
                  { color: type === 'income' ? '#059669' : '#DC2626' }
                ]}>
                  {type === 'income' ? '+' : '-'}${parseFloat(amount || '0').toFixed(2)}
                </Text>
              </View>
              {description && (
                <Text style={styles.previewDescription}>{description}</Text>
              )}
              <Text style={styles.previewDate}>{formatDate(date)}</Text>
            </View>
          )}
        </ScrollView>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  required: {
    color: '#DC2626',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  typeButtonActive: {
    borderColor: 'transparent',
  },
  incomeButton: {
    backgroundColor: '#059669',
  },
  expenseButton: {
    backgroundColor: '#DC2626',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  typeButtonTextActive: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    marginTop: 4,
  },
  submitButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  incomeSubmit: {
    backgroundColor: '#059669',
  },
  expenseSubmit: {
    backgroundColor: '#DC2626',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  previewCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 32,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  previewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  previewAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  previewDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});