import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const AddTransactionScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Add transaction screen"
    >
      <Text style={styles.title} accessibilityRole="header">Add Transaction</Text>
      {/* transaction form will be implemented here */}
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
});

export default AddTransactionScreen;
