import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

const TransactionListScreen = () => {
  const { width } = useWindowDimensions();
  const isTablet = width > 600;
  return (
    <View
      style={[styles.container, { paddingHorizontal: isTablet ? 48 : 16 }]}
      accessible
      accessibilityLabel="Transaction history screen"
    >
      <Text style={styles.title} accessibilityRole="header">Transaction History</Text>
      {/* transaction list will be rendered here */}
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

export default TransactionListScreen;
