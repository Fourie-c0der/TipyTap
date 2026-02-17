// PIN Setup & Login Screen
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import storageService from '../../src/services/storageService';

export default function PinScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode: 'setup' | 'login' }>();

  const [step, setStep] = useState<'create' | 'confirm'>('create');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const isSetup = mode === 'setup';
  const currentPin = step === 'create' ? pin : confirmPin;

  const handleDigit = (digit: string) => {
    setError('');

    if (isSetup) {
      // ── SETUP MODE ──
      if (step === 'create') {
        const newPin = pin + digit;
        setPin(newPin);
        if (newPin.length === 4) setTimeout(() => setStep('confirm'), 150);
      } else {
        const newConfirm = confirmPin + digit;
        setConfirmPin(newConfirm);
        if (newConfirm.length === 4) setTimeout(() => savePin(pin, newConfirm), 150);
      }
    } else {
      // ── LOGIN MODE ──
      const newPin = pin + digit;
      setPin(newPin);
      if (newPin.length === 4) setTimeout(() => verifyPin(newPin), 150);
    }
  };

  const handleDelete = () => {
    setError('');
    if (isSetup) {
      if (step === 'create') setPin(p => p.slice(0, -1));
      else setConfirmPin(p => p.slice(0, -1));
    } else {
      setPin(p => p.slice(0, -1));
    }
  };

  const savePin = async (newPin: string, confirmed: string) => {
    if (newPin !== confirmed) {
      setError("PINs don't match. Try again.");
      setStep('create');
      setPin('');
      setConfirmPin('');
      return;
    }
    try {
      await storageService.set('@carguard_pin', newPin);
      await storageService.set('@carguard_pin_enabled', 'true');
      Alert.alert('✅ PIN Set!', 'Your PIN is now your default login.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch {
      Alert.alert('Error', 'Could not save PIN. Try again.');
    }
  };

  const verifyPin = async (enteredPin: string) => {
    try {
      const savedPin = await storageService.get<string>('@carguard_pin');
      if (enteredPin === savedPin) {
        router.replace('/(tabs)');
      } else {
        setError('Incorrect PIN. Try again.');
        setPin('');
      }
    } catch {
      setError('Something went wrong. Try again.');
      setPin('');
    }
  };

  const getTitle = () => {
    if (!isSetup) return 'Enter your PIN';
    return step === 'create' ? 'Create a PIN' : 'Confirm your PIN';
  };

  const getSubtitle = () => {
    if (!isSetup) return 'Use your 4-digit PIN to login';
    return step === 'create'
      ? 'Choose a 4-digit PIN for quick login'
      : 'Enter the same PIN again';
  };

  return (
    <View style={styles.container}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Lock icon */}
      <View style={styles.iconWrapper}>
        <Ionicons name="keypad" size={56} color="#FF8C00" />
      </View>

      {/* Title */}
      <Text style={styles.title}>{getTitle()}</Text>
      <Text style={styles.subtitle}>{getSubtitle()}</Text>

      {/* PIN dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentPin.length && styles.dotFilled,
            ]}
          />
        ))}
      </View>

      {/* Error message */}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {/* Keypad */}
      <View style={styles.keypad}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((key, i) => {
          const isEmpty = key === '';
          const isBack = key === '⌫';
          return (
            <TouchableOpacity
              key={i}
              style={[styles.key, isEmpty && styles.keyInvisible]}
              onPress={() => {
                if (isBack) handleDelete();
                else if (!isEmpty) handleDigit(key);
              }}
              disabled={isEmpty}
              activeOpacity={0.6}
            >
              {isBack ? (
                <Ionicons name="backspace-outline" size={26} color="#FF8C00" />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Password fallback (login mode only) */}
      {!isSetup && (
        <TouchableOpacity
          style={styles.fallback}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.fallbackText}>Use password instead</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 40,
  },
  backBtn: {
    position: 'absolute',
    top: 54,
    left: 20,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF8C0015',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#FF8C0040',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FF8C00',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#FF8C00',
  },
  error: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 280,
    marginTop: 24,
    gap: 16,
  },
  key: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  keyInvisible: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  keyText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFF',
  },
  fallback: {
    marginTop: 32,
  },
  fallbackText: {
    color: '#FF8C00',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});