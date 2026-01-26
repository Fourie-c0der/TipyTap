// Transaction card component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import colors from '../constants/colors';
import { config } from '../constants/config';

interface TransactionCardProps {
  transaction: Transaction;
}

export const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
  const getIcon = () => {
    switch (transaction.type) {
      case 'tip':
        return 'gift';
      case 'deposit':
        return 'arrow-down-circle';
      case 'withdrawal':
        return 'arrow-up-circle';
      default:
        return 'cash';
    }
  };

  const getIconColor = () => {
    switch (transaction.type) {
      case 'tip':
        return colors.accent;
      case 'deposit':
        return colors.success;
      case 'withdrawal':
        return colors.error;
      default:
        return colors.primary;
    }
  };

  const isIncoming = transaction.type === 'deposit';
  const amountColor = isIncoming ? colors.success : colors.error;

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: getIconColor() + '20' }]}>
        <Ionicons name={getIcon()} size={24} color={getIconColor()} />
      </View>

      <View style={styles.details}>
        <Text style={styles.type}>{transaction.type.toUpperCase()}</Text>
        <Text style={styles.description}>
          {transaction.guardName || 
           (transaction.type === 'deposit' ? 'Money Added' : 'Bank Withdrawal')}
        </Text>
        {transaction.location && (
          <Text style={styles.location}>
            <Ionicons name="location" size={12} /> {transaction.location}
          </Text>
        )}
        <Text style={styles.date}>
          {new Date(transaction.timestamp).toLocaleString()}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncoming ? '+' : '-'}{config.CURRENCY_SYMBOL}{transaction.amount.toFixed(2)}
        </Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: transaction.status === 'completed' ? colors.success : colors.warning }
        ]}>
          <Text style={styles.statusText}>{transaction.status}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#3A3A3A',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  type: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: colors.textLight,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: '600',
  },
});

export default TransactionCard;