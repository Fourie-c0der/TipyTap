// Root index - handles initial routing
import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import WalletCard from '../../src/components/WalletCard';
import AmountButton from '../../src/components/AmountButton';
import { config } from '../../src/constants/config';
import colors from '../../src/constants/colors';

import { ImageBackground } from 'react-native';

export default function TipIndex() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(config.TIP_AMOUNTS[0]);

  const handleSelect = (amount: number | 'custom') => {
    if (amount === 'custom') return; // handle custom separately if needed
    setSelected(amount as number);
  };

  const handleScan = (amount?: number) => {
    const finalAmount = amount ?? selected ?? config.TIP_AMOUNTS[0];
    router.push(`/scanner?amount=${finalAmount}`);
  };


  return (
    <ScrollView style={styles.container}>

      <ImageBackground source={require('../../src/assets/images/background.png')}>

      {/* <WalletCard balance={123.45} lastUpdated={new Date()} /> */}

      <Text style={styles.sectionTitle}>Choose Amount To Tip</Text>

      <View style={styles.grid}>
        {config.TIP_AMOUNTS.map((amt) => (
          <AmountButton
            key={amt}
            amount={amt}
            onPress={() => handleScan(amt)}
            selected={selected === amt}
          />
        ))}
      </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  grid: {
    flex: 1,
    margin: 5,
    alignItems: 'center'
  },
  scanButton: {
    backgroundColor: colors.primary,
    margin: 20,
    paddingVertical: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});