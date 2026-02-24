// Application configuration constants

export const config = {
  // API Configuration
  API_URL: process.env.API_URL || 'https://api.carguardapp.co.za',
  API_TIMEOUT: 15000,
  
  // Currency
  CURRENCY: 'ZAR',
  CURRENCY_SYMBOL: 'R',
  
  // Tip amounts
  TIP_AMOUNTS: [2, 5, 10, 20, 50, 100, 200],
  
  // Transaction limits
  MIN_TIP_AMOUNT: 2,
  MAX_TIP_AMOUNT: 500,
  MIN_WITHDRAWAL: 50,
  MAX_WITHDRAWAL: 5000,
  
  // QR Code
  QR_CODE_PREFIX: 'CARGUARD_',
  QR_SCAN_TIMEOUT: 30000,
  
  // Storage keys
  STORAGE_KEYS: {
    USER: '@carguard_user',
    TOKEN: '@carguard_token',
    WALLET: '@carguard_wallet',
    TRANSACTIONS: '@carguard_transactions'
  },
  
  // PDF Settings
  PDF: {
    PAGE_SIZE: 'A4',
    MARGIN: 20,
  },
  
  // Support
  SUPPORT_EMAIL: 'support@carguardapp.co.za',
  SUPPORT_PHONE: '+27 12 345 6789',
  
  // App Info
  APP_NAME: 'TipyTap',
  APP_VERSION: '1.0.0',
};

export default config;