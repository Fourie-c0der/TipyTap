// Storage service for local data persistence
import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '../constants/config';

class StorageService {
  // Generic get method
  async get<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error getting ${key}:`, error);
      return null;
    }
  }

  // Generic set method
  async set<T>(key: string, value: T): Promise<boolean> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      return true;
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      return false;
    }
  }

  // Remove specific key
  async remove(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  }

  // Clear all storage
  async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }

  // User-specific methods
  async saveUser(user: any): Promise<boolean> {
    return this.set(config.STORAGE_KEYS.USER, user);
  }

  async getUser(): Promise<any> {
    return this.get(config.STORAGE_KEYS.USER);
  }

  async removeUser(): Promise<boolean> {
    return this.remove(config.STORAGE_KEYS.USER);
  }

  // Token methods
  async saveToken(token: string): Promise<boolean> {
    return this.set(config.STORAGE_KEYS.TOKEN, token);
  }

  async getToken(): Promise<string | null> {
    return this.get(config.STORAGE_KEYS.TOKEN);
  }

  async removeToken(): Promise<boolean> {
    return this.remove(config.STORAGE_KEYS.TOKEN);
  }

  // Wallet methods
  async saveWallet(wallet: any): Promise<boolean> {
    return this.set(config.STORAGE_KEYS.WALLET, wallet);
  }

  async getWallet(): Promise<any> {
    return this.get(config.STORAGE_KEYS.WALLET);
  }

  // Transactions methods
  async saveTransactions(transactions: any[]): Promise<boolean> {
    return this.set(config.STORAGE_KEYS.TRANSACTIONS, transactions);
  }

  async getTransactions(): Promise<any[]> {
    const transactions = await this.get<any[]>(config.STORAGE_KEYS.TRANSACTIONS);
    return transactions || [];
  }

  async addTransaction(transaction: any): Promise<boolean> {
    const transactions = await this.getTransactions();
    transactions.unshift(transaction);
    return this.saveTransactions(transactions);
  }
}

export default new StorageService();