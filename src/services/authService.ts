// Authentication service
import { User } from '../types';
import storageService from './storageService';
import { config } from '../constants/config';

class AuthService {
  private baseUrl = config.API_URL;

  // Mock login - Replace with actual API call
  async login(email: string, password: string): Promise<User> {
    try {
      // Simulate API call
      await this.delay(1000);
      
      // Mock validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Mock user data
      const user: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: email.split('@')[0],
        userType: 'tipper',
        createdAt: new Date(),
      };

      // Save user and token
      const token = 'mock_token_' + Date.now();
      await storageService.saveUser(user);
      await storageService.saveToken(token);

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Mock register - Replace with actual API call
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      await this.delay(1000);

      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      const user: User = {
        id: 'user_' + Date.now(),
        email: email,
        name: name,
        userType: 'tipper',
        createdAt: new Date(),
      };

      const token = 'mock_token_' + Date.now();
      await storageService.saveUser(user);
      await storageService.saveToken(token);

      // Initialize wallet
      const wallet = {
        userId: user.id,
        balance: 0,
        currency: config.CURRENCY,
        lastUpdated: new Date(),
      };
      await storageService.saveWallet(wallet);

      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await storageService.removeUser();
      await storageService.removeToken();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      return await storageService.getUser();
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await storageService.getToken();
    return !!token;
  }

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      const token = await storageService.getToken();
      if (!token) return false;
      
      // Mock validation - Replace with actual API call
      return true;
    } catch (error) {
      return false;
    }
  }

  // Helper delay function
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AuthService();