// Type definitions for the entire application

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  userType: 'tipper' | 'guard';
  createdAt: Date;
}

export interface Wallet {
  userId: string;
  balance: number;
  currency: string;
  lastUpdated: Date;
}

export interface Transaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'tip' | 'deposit' | 'withdrawal';
  timestamp: Date;
  guardName?: string;
  location?: string;
}

export interface CarGuard {
  id: string;
  name: string;
  qrCode: string;
  location: string;
  phoneNumber?: string;
  verified: boolean;
  rating?: number;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account';
  last4: string;
  isDefault: boolean;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: Date;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  refreshWallet: () => Promise<void>;
  addFunds: (amount: number) => Promise<void>;
  withdrawFunds: (amount: number) => Promise<void>;
}