// Validation utilities

export class Validators {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation
  static isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain at least one number' };
    }
    return { valid: true };
  }

  // Phone number validation (South African format)
  static isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+27|0)[6-8][0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Amount validation
  static isValidAmount(amount: number, min: number, max: number): { valid: boolean; message?: string } {
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, message: 'Amount must be a positive number' };
    }
    if (amount < min) {
      return { valid: false, message: `Amount must be at least R${min}` };
    }
    if (amount > max) {
      return { valid: false, message: `Amount cannot exceed R${max}` };
    }
    return { valid: true };
  }

  // Bank account number validation
  static isValidBankAccount(accountNumber: string): boolean {
    // Remove spaces and check if it's numeric
    const cleaned = accountNumber.replace(/\s/g, '');
    return /^\d{10,11}$/.test(cleaned);
  }

  // ID number validation (South African)
  static isValidIDNumber(idNumber: string): boolean {
    if (!/^\d{13}$/.test(idNumber)) return false;
    
    // Luhn algorithm for South African ID
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      let digit = parseInt(idNumber[i]);
      if (i % 2 === 1) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === parseInt(idNumber[12]);
  }

  // Name validation
  static isValidName(name: string): boolean {
    return name.trim().length >= 2 && /^[a-zA-Z\s'-]+$/.test(name);
  }

  // QR code validation
  static isValidQRCode(qrCode: string, prefix: string): boolean {
    return qrCode.startsWith(prefix) && qrCode.length > prefix.length;
  }
}

export default Validators;