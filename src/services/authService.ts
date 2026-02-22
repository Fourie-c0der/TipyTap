// Authentication service with Supabase
import { User } from '../types';
import storageService from './storageService';
import { config } from '../constants/config';
import { supabase } from '../services/supabase';

class AuthService {
  // Login with email and password
  async login(email: string, password: string): Promise<User> {
    try {
      // Validate inputs
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Login failed');
      }

      // Get user profile from database
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      // Create user object
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        name: profile?.name || email.split('@')[0],
        phoneNumber: profile?.phone_number,
        userType: 'tipper',
        createdAt: new Date(data.user.created_at),
      };

      // Save user and session locally
      await storageService.saveUser(user);
      await storageService.saveToken(data.session?.access_token || '');

      // Initialize wallet if it doesn't exist
      await this.initializeWallet(user.id);

      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<User> {
    try {
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Registration failed');
      }

      // Create user profile in database
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: email,
          name: name,
          user_type: 'tipper',
          wallet_balance: 0,
          total_tipped: 0,
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
      }

      const user: User = {
        id: data.user.id,
        email: email,
        name: name,
        userType: 'tipper',
        createdAt: new Date(),
      };

      // Save locally
      await storageService.saveUser(user);
      await storageService.saveToken(data.session?.access_token || '');

      // Initialize wallet
      await this.initializeWallet(user.id);

      return user;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Initialize wallet for user
  private async initializeWallet(userId: string): Promise<void> {
    try {
      const wallet = {
        userId: userId,
        balance: 0,
        currency: config.CURRENCY,
        lastUpdated: new Date(),
      };
      await storageService.saveWallet(wallet);
    } catch (error) {
      console.error('Wallet init error:', error);
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      // Clear local storage
      await storageService.removeUser();
      await storageService.removeToken();
      await storageService.remove('@carguard_wallet');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      // Try to get from local storage first
      const localUser = await storageService.getUser();
      if (localUser) return localUser;

      // If not in local storage, get from Supabase
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        return null;
      }

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (!profile) return null;

      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: profile.name,
        phoneNumber: profile.phone_number,
        userType: 'tipper',
        createdAt: new Date(data.user.created_at),
      };

      // Save to local storage
      await storageService.saveUser(user);

      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check if PIN is enabled and valid
      const pinEnabled = await storageService.get<string>('@carguard_pin_enabled');
      if (pinEnabled === 'true') {
        // If PIN login is enabled, user is authenticated if they have a valid session
        const { data } = await supabase.auth.getSession();
        return !!data.session;
      }

      // Otherwise check for valid token
      const { data } = await supabase.auth.getSession();
      return !!data.session;
    } catch (error) {
      return false;
    }
  }

  // Validate token
  async validateToken(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return !error && !!data.session;
    } catch (error) {
      return false;
    }
  }

  // Refresh session
  async refreshSession(): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error || !data.session) {
        return false;
      }
      await storageService.saveToken(data.session.access_token);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Check if PIN is enabled
  async isPinEnabled(): Promise<boolean> {
    const pinEnabled = await storageService.get<string>('@carguard_pin_enabled');
    return pinEnabled === 'true';
  }

  // Login with PIN
  async loginWithPin(pin: string): Promise<boolean> {
    try {
      const savedPin = await storageService.get<string>('@carguard_pin');
      if (pin === savedPin) {
        // PIN is correct, check if session is still valid
        const isValid = await this.validateToken();
        if (isValid) {
          return true;
        } else {
          // Session expired, refresh it
          return await this.refreshSession();
        }
      }
      return false;
    } catch (error) {
      console.error('PIN login error:', error);
      return false;
    }
  }
}

export default new AuthService();