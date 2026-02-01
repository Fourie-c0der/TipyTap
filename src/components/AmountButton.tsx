// Amount button component for tip selection
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ImageBackground } from 'react-native';
import { config } from '../constants/config';

import backgroundR2 from '../assets/images/R2-coin.jpg';
import backgroundR5 from '../assets/images/R5-coin.jpg';
import backgroundR10 from '../assets/images/R10-note.jpg';
import backgroundR20 from '../assets/images/R20-note.jpg';
import backgroundR50 from '../assets/images/R50-note.jpg';
import backgroundR100 from '../assets/images/R100-note.jpg';
import backgroundR200 from '../assets/images/R200-note.jpg';

interface AmountButtonProps {
  amount: number | 'custom';
  onPress: () => void;
  selected?: boolean;
}

// Get background color for each amount (using South African currency colors)
const getBackground = (amount: number | 'custom') => {
  if (amount === 'custom') return '#1A1A1A';
  
  const colorMap: { [key: number]: string } = {
    2: require('../assets/images/R2-coin.jpg'),  // Copper (R2 coin)
    5: require('../assets/images/R5-coin.jpg'),  // Silver (R5 coin)
    10: require('../assets/images/R10-note.jpg'),  // Dark gold (R10 coin)
    20: require('../assets/images/R20-note.jpg'), // Saddle brown (R20 note)
    50: require('../assets/images/R50-note.jpg'), // Crimson (R50 note)
    100: require('../assets/images/R100-note.jpg'), // Royal blue (R100 note)
    200: require('../assets/images/R200-note.jpg'), // Dark orange (R200 note)
  };
  
  return colorMap[amount as number] || '#FF8C00';
};

export const AmountButton: React.FC<AmountButtonProps> = ({ amount, onPress, selected }) => {
  const isCustom = amount === 'custom';
  const displayText = isCustom ? 'Own Amount' : `${config.CURRENCY_SYMBOL}${amount}`;
  const backgroundImg = getBackground(amount);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      
      <ImageBackground source={backgroundImg} style={styles.img}>

        <View style={[
          styles.button,
          selected && styles.selected
        ]}>
          <View style={styles.overlay}>
            <Text style={styles.amount}>{displayText}</Text>
            {!isCustom && <Text style={styles.label}>Tap to tip</Text>}
          </View>

        </View>

      </ImageBackground>

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
  img: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    // removed semi-transparent overlay to avoid extra compositing work
  },
  selected: {
    borderWidth: 4,
    borderColor: '#FF8C00',
  },
  amount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E8E8E8', // Orange text
    // removed text shadow for faster rendering
  },
  label: {
    fontSize: 16,
    color: '#E8E8E8'
  },
});

export default AmountButton;