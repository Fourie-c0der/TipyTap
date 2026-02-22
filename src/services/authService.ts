// Authentication service with Supabase
import { User } from '../types';
import storageService from './storageService';
import { config } from '../constants/config';
import { supabase } from '../services/supabase';

class AuthService {

  // -------------------------
  // LOGIN
  // -------------------------
  async login(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Login failed');
    }

    // Fetch profile from public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || '',
      name: profile.name,
      phoneNumber: profile.phone_number,
      userType: profile.user_type || 'tipper',
      createdAt: new Date(data.user.created_at),
    };

    await storageService.saveUser(user);
    await storageService.saveToken(data.session?.access_token || '');

    await this.initializeWallet(user.id);

    return user;
  }

  // -------------------------
  // REGISTER
  // -------------------------
  async register(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error('All fields are required');
    }

    // Only create auth user.
    // Trigger will create public.users row automatically.
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name, // passed to trigger via metadata
        },
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message || 'Registration failed');
    }

    // Fetch profile (created by trigger)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile creation failed');
    }

    const user: User = {
      id: data.user.id,
      email: data.user.email || email,
      name: profile.name,
      userType: profile.user_type || 'tipper',
      createdAt: new Date(data.user.created_at),
    };

    await storageService.saveUser(user);
    await storageService.saveToken(data.session?.access_token || '');

    await this.initializeWallet(user.id);

    return user;
  }

  // -------------------------
  // LOGOUT
  // -------------------------
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    await storageService.removeUser();
    await storageService.removeToken();
    await storageService.remove('@carguard_wallet');
  }

  // -------------------------
  // GET CURRENT USER
  // -------------------------
  async getCurrentUser(): Promise<User | null> {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) return null;

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
      userType: profile.user_type || 'tipper',
      createdAt: new Date(data.user.created_at),
    };

    await storageService.saveUser(user);

    return user;
  }

  // SESSION CHECKS

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  }

  async validateToken(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();
    return !error && !!data.session;
  }

  async refreshSession(): Promise<boolean> {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) return false;

    await storageService.saveToken(data.session.access_token);
    return true;
  }

  // Wallet init (LOCAL)
  private async initializeWallet(userId: string): Promise<void> {
    const wallet = {
      userId,
      balance: 0,
      currency: config.CURRENCY,
      lastUpdated: new Date(),
    };

    await storageService.saveWallet(wallet);
  }
}

export default new AuthService();