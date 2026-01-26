// Payment service for handling transactions
import { Transaction, CarGuard } from '../types';
import storageService from './storageService';
import { config } from '../constants/config';

class PaymentService {
  private baseUrl = config.API_URL;

  // Process tip payment
  async processTip(amount: number, guardId: string): Promise<Transaction> {
    try {
      await this.delay(1500);

      // Validate amount
      if (amount < config.MIN_TIP_AMOUNT || amount > config.MAX_TIP_AMOUNT) {
        throw new Error(`Amount must be between ${config.CURRENCY_SYMBOL}${config.MIN_TIP_AMOUNT} and ${config.CURRENCY_SYMBOL}${config.MAX_TIP_AMOUNT}`);
      }

      // Get current wallet
      const wallet = await storageService.getWallet();
      if (!wallet || wallet.balance < amount) {
        throw new Error('Insufficient funds. Please add money to your wallet.');
      }

      // Mock guard data
      const guard: CarGuard = {
        id: guardId,
        name: 'John Doe',
        qrCode: guardId,
        location: 'Sandton City',
        verified: true,
      };

      // Create transaction
      const transaction: Transaction = {
        id: 'txn_' + Date.now(),
        fromUserId: wallet.userId,
        toUserId: guardId,
        amount: amount,
        currency: config.CURRENCY,
        status: 'completed',
        type: 'tip',
        timestamp: new Date(),
        guardName: guard.name,
        location: guard.location,
      };

      // Update wallet balance
      wallet.balance -= amount;
      wallet.lastUpdated = new Date();
      await storageService.saveWallet(wallet);

      // Save transaction
      await storageService.addTransaction(transaction);

      return transaction;
    } catch (error) {
      console.error('Process tip error:', error);
      throw error;
    }
  }

  // Add funds to wallet
  async addFunds(amount: number, paymentMethodId: string): Promise<void> {
    try {
      await this.delay(2000);

      if (amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      const wallet = await storageService.getWallet();
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      // Create deposit transaction
      const transaction: Transaction = {
        id: 'txn_' + Date.now(),
        fromUserId: 'system',
        toUserId: wallet.userId,
        amount: amount,
        currency: config.CURRENCY,
        status: 'completed',
        type: 'deposit',
        timestamp: new Date(),
      };

      // Update wallet
      wallet.balance += amount;
      wallet.lastUpdated = new Date();
      await storageService.saveWallet(wallet);

      // Save transaction
      await storageService.addTransaction(transaction);
    } catch (error) {
      console.error('Add funds error:', error);
      throw error;
    }
  }

  // Withdraw funds from wallet
  async withdrawFunds(amount: number, bankAccountId: string): Promise<void> {
    try {
      await this.delay(2000);

      if (amount < config.MIN_WITHDRAWAL) {
        throw new Error(`Minimum withdrawal is ${config.CURRENCY_SYMBOL}${config.MIN_WITHDRAWAL}`);
      }

      if (amount > config.MAX_WITHDRAWAL) {
        throw new Error(`Maximum withdrawal is ${config.CURRENCY_SYMBOL}${config.MAX_WITHDRAWAL}`);
      }

      const wallet = await storageService.getWallet();
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }

      // Create withdrawal transaction
      const transaction: Transaction = {
        id: 'txn_' + Date.now(),
        fromUserId: wallet.userId,
        toUserId: 'bank',
        amount: amount,
        currency: config.CURRENCY,
        status: 'completed',
        type: 'withdrawal',
        timestamp: new Date(),
      };

      // Update wallet
      wallet.balance -= amount;
      wallet.lastUpdated = new Date();
      await storageService.saveWallet(wallet);

      // Save transaction
      await storageService.addTransaction(transaction);
    } catch (error) {
      console.error('Withdraw funds error:', error);
      throw error;
    }
  }

  // Get wallet balance
  async getWalletBalance(): Promise<number> {
    const wallet = await storageService.getWallet();
    return wallet?.balance || 0;
  }

  // Get transaction history
  async getTransactionHistory(): Promise<Transaction[]> {
    return await storageService.getTransactions();
  }

  // Validate QR code
  async validateQRCode(qrData: string): Promise<CarGuard> {
    try {
      await this.delay(500);

      if (!qrData.startsWith(config.QR_CODE_PREFIX)) {
        throw new Error('Invalid QR code format');
      }

      const guardId = qrData.replace(config.QR_CODE_PREFIX, '');

      // Mock guard data
      const guard: CarGuard = {
        id: guardId,
        name: 'John Doe',
        qrCode: qrData,
        location: 'Sandton City',
        phoneNumber: '+27 81 234 5678',
        verified: true,
        rating: 4.5,
      };

      return guard;
    } catch (error) {
      console.error('Validate QR code error:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new PaymentService();