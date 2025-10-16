import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PaymentScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Payment Screen</Text>
      <Text style={styles.subText}>Task 4 will implement this</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#808080',
    fontSize: 14,
    marginTop: 8,
  },
});

export default PaymentScreen;