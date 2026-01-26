// Profile screen
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import WalletCard from '../../src/components/WalletCard';
import authService from '../../src/services/authService';
import paymentService from '../../src/services/paymentService';
import storageService from '../../src/services/storageService';
import pdfGenerator from '../../src/utils/pdfGenerator';
import Validators from '../../src/utils/validators';
import colors from '../../src/constants/colors';
import { config } from '../../src/constants/config';
import { User, Wallet } from '../../src/types';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await authService.getCurrentUser();
    const walletData = await storageService.getWallet();
    setUser(userData);
    setWallet(walletData);
  };

  const handleAddFunds = async () => {
    const parsedAmount = parseFloat(amount);
    
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await paymentService.addFunds(parsedAmount, 'mock_payment_method');
      Alert.alert('Success', `${config.CURRENCY_SYMBOL}${parsedAmount.toFixed(2)} added to your wallet`);
      setShowAddFundsModal(false);
      setAmount('');
      loadUserData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const parsedAmount = parseFloat(amount);
    
    const validation = Validators.isValidAmount(
      parsedAmount,
      config.MIN_WITHDRAWAL,
      config.MAX_WITHDRAWAL
    );

    if (!validation.valid) {
      Alert.alert('Invalid Amount', validation.message);
      return;
    }

    if (wallet && parsedAmount > wallet.balance) {
      Alert.alert('Insufficient Funds', 'You do not have enough funds to withdraw');
      return;
    }

    setLoading(true);
    try {
      await paymentService.withdrawFunds(parsedAmount, 'mock_bank_account');
      Alert.alert('Success', `${config.CURRENCY_SYMBOL}${parsedAmount.toFixed(2)} will be transferred to your bank account`);
      setShowWithdrawModal(false);
      setAmount('');
      loadUserData();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to withdraw funds');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateStatement = async () => {
    try {
      const transactions = await paymentService.getTransactionHistory();
      if (transactions.length === 0) {
        Alert.alert('No Transactions', 'You have no transactions to generate a statement');
        return;
      }

      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);

      await pdfGenerator.generateStatement(
        transactions,
        startDate,
        endDate,
        user?.name || 'User'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate statement');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await authService.logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Profile</Text>
          <Text style={styles.subtitle}>{user?.email}</Text>
        </View>
        <TouchableOpacity style={styles.avatarContainer}>
          <Ionicons name="person" size={32} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Wallet Card */}
      {wallet && (
        <WalletCard
          balance={wallet.balance}
          lastUpdated={wallet.lastUpdated}
        />
      )}

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manage Funds</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setShowAddFundsModal(true)}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
            <Ionicons name="add-circle" size={24} color={colors.success} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Add Funds</Text>
            <Text style={styles.actionSubtitle}>Top up your wallet</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => setShowWithdrawModal(true)}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="cash" size={24} color={colors.error} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Withdraw</Text>
            <Text style={styles.actionSubtitle}>Transfer to bank account</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Documents */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documents</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={handleGenerateStatement}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.info + '20' }]}>
            <Ionicons name="document-text" size={24} color={colors.info} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Generate Statement</Text>
            <Text style={styles.actionSubtitle}>Download PDF statement</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push('/(tabs)/help')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
            <Ionicons name="help-circle" size={24} color={colors.warning} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Help & Support</Text>
            <Text style={styles.actionSubtitle}>Get assistance</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.logoutCard]}
          onPress={handleLogout}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.error + '20' }]}>
            <Ionicons name="log-out" size={24} color={colors.error} />
          </View>
          <View style={styles.actionContent}>
            <Text style={[styles.actionTitle, { color: colors.error }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Add Funds Modal */}
      <Modal
        visible={showAddFundsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddFundsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Funds</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>{config.CURRENCY_SYMBOL}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddFundsModal(false);
                  setAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddFunds}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Add Funds</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        visible={showWithdrawModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowWithdrawModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Withdraw Funds</Text>
            <Text style={styles.modalSubtitle}>
              Available: {config.CURRENCY_SYMBOL}{wallet?.balance.toFixed(2) || '0.00'}
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>{config.CURRENCY_SYMBOL}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={setAmount}
                autoFocus
              />
            </View>
            <Text style={styles.modalHint}>
              Min: {config.CURRENCY_SYMBOL}{config.MIN_WITHDRAWAL}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowWithdrawModal(false);
                  setAmount('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleWithdraw}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>Withdraw</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A2A2A',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3A3A3A',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  logoutCard: {
    marginTop: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#3A3A3A',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalHint: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2A2A2A',
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});