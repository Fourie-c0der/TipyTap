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

export default function TipIndex() {
  const router = useRouter();
  const [selected, setSelected] = useState<number | null>(config.TIP_AMOUNTS[0]);

  const handleSelect = (amount: number | 'custom') => {
    if (amount === 'custom') return; // handle custom separately if needed
    setSelected(amount as number);
  };

  const handleScan = () => {
    const amount = selected ?? config.TIP_AMOUNTS[0];
    router.push(`/scanner?amount=${amount}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <WalletCard balance={123.45} lastUpdated={new Date()} />

      <Text style={styles.sectionTitle}>Choose Amount</Text>

      <View style={styles.grid}>
        {config.TIP_AMOUNTS.map((amt) => (
          <AmountButton
            key={amt}
            amount={amt}
            onPress={() => handleSelect(amt)}
            selected={selected === amt}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.scanButtonText}>Scan QR to Tip</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#000' },
  content: { paddingVertical: 20 },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
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