import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddTransactionScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Transaction</Text>
      {/* Transaction form will be implemented here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default AddTransactionScreen;
