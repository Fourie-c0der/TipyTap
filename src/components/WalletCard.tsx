// Wallet card component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { config } from '../constants/config';

interface WalletCardProps {
  balance: number;
  lastUpdated?: Date;
}

export const WalletCard: React.FC<WalletCardProps> = ({ balance, lastUpdated }) => {
  return (
    <LinearGradient
      colors={[colors.gradient.start, colors.gradient.middle, colors.gradient.end]}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <Ionicons name="wallet" size={24} color="#FFF" />
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balance}>
          {config.CURRENCY_SYMBOL}{balance.toFixed(2)}
        </Text>
      </View>

      {lastUpdated && (
        <Text style={styles.updated}>
          Last updated: {new Date(lastUpdated).toLocaleString()}
        </Text>
      )}

      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  balanceContainer: {
    marginBottom: 12,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  balance: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFF',
  },
  updated: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.7,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    left: -20,
  },
});

export default WalletCard;