// Amount button component for tip selection
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ImageBackground } from 'react-native';
import { config } from '../constants/config';

// Tip Amount Button Imgs
import R2Img from '../assets/images/R2-coin.jpg';
import R5Img from '../assets/images/R5-coin.jpg';
import R10Img from '../assets/images/R10-note.jpg';
import R20Img from '../assets/images/R20-note.jpg';
import R50Img from '../assets/images/R50-note.jpg';
import R100Img from '../assets/images/R100-note.jpg';
import R200Img from '../assets/images/R200-note.jpg';

interface AmountButtonProps {
  amount: number | 'custom';
  onPress: () => void;
  selected?: boolean;
}

// Get background color for each amount (using South African currency colors)
const getBackground = (amount: number | 'custom') => {
  if (amount === 'custom') return '#1A1A1A';
  
  const Map: { [key: number]: string } = {
    2: R2Img,  // Copper (R2 coin)
    5: R5Img,  // Silver (R5 coin)
    10: R10Img,  // Dark gold (R10 coin)
    20: R20Img, // Saddle brown (R20 note)
    50: R50Img, // Crimson (R50 note)
    100: R100Img, // Royal blue (R100 note)
    200: R200Img, // Dark orange (R200 note)
  };
  
  return Map[amount as number] || '#FF8C00';
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