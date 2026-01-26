// Amount button component for tip selection
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { config } from '../constants/config';

interface AmountButtonProps {
  amount: number | 'custom';
  onPress: () => void;
  selected?: boolean;
}

// Get background color for each amount (using South African currency colors)
const getBackgroundColor = (amount: number | 'custom') => {
  if (amount === 'custom') return '#1A1A1A';
  
  const colorMap: { [key: number]: string } = {
    2: '#818181',  // Copper (R2 coin)
    5: '#C0C0C0',  // Silver (R5 coin)
    10: '#B8860B',  // Dark gold (R10 coin)
    20: '#632f0b', // Saddle brown (R20 note)
    50: '#DC143C', // Crimson (R50 note)
    100: '#4169E1', // Royal blue (R100 note)
    200: '#864a00', // Dark orange (R200 note)
  };
  
  return colorMap[amount as number] || '#FF8C00';
};

export const AmountButton: React.FC<AmountButtonProps> = ({ amount, onPress, selected }) => {
  const isCustom = amount === 'custom';
  const displayText = isCustom ? 'Own Amount' : `${config.CURRENCY_SYMBOL}${amount}`;
  const backgroundColor = getBackgroundColor(amount);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={[
        styles.button,
        { backgroundColor },
        selected && styles.selected
      ]}>
        <View style={styles.overlay}>
          <Text style={styles.amount}>{displayText}</Text>
          {!isCustom && <Text style={styles.label}>Tap to tip</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    aspectRatio: 1.5,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    // simplified shadow for better performance
    elevation: 0,
    borderWidth: 2,
    borderColor: '#FF8C00', // Orange border
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // removed semi-transparent overlay to avoid extra compositing work
  },
  selected: {
    borderWidth: 4,
    borderColor: '#FF8C00',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00', // Orange text
    // removed text shadow for faster rendering
  },
  label: {
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 4,
  },
});

export default AmountButton;