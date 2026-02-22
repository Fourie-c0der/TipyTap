// QR Scanner screen
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import paymentService from '../src/services/paymentService';
import colors from '../src/constants/colors';
import { config } from '../src/constants/config';

export default function ScannerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const amount = parseFloat(params.amount as string);

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);

  if (!permission) {
    return <View style={styles.container}><ActivityIndicator /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons className="camera-off" size={64} color={colors.textLight} />
        <Text style={styles.permissionText}>Camera permission required</Text>
        <Text style={styles.permissionSubtext}>
          We need camera access to scan QR codes
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || processing) return;
    
    setScanned(true);
    setProcessing(true);

    try {
      // Validate QR code
      const guard = await paymentService.validateQRCode(data);
      
      // Show confirmation
      Alert.alert(
        'Confirm Tip',
        `Tip ${config.CURRENCY_SYMBOL}${amount.toFixed(2)} to ${guard.name}?\n\nLocation: ${guard.location}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => {
              setScanned(false);
              setProcessing(false);
            },
          },
          {
            text: 'Confirm',
            onPress: async () => {
              try {
                await paymentService.processTip(amount, guard.id);
                Alert.alert(
                  'Success!',
                  `You've tipped ${config.CURRENCY_SYMBOL}${amount.toFixed(2)} to ${guard.name}`,
                  [{ text: 'OK', onPress: () => router.back() }]
                );
              } catch (error: any) {
                Alert.alert('Payment Failed', error.message);
                setScanned(false);
                setProcessing(false);
              }
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Invalid QR Code', error.message || 'This QR code is not valid');
      setScanned(false);
      setProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />

      {/* Overlay */}
      <View style={styles.overlay}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFA500" />
          </TouchableOpacity>
          <View style={styles.amountBadge}>
            <Text style={styles.amountText}>
              {config.CURRENCY_SYMBOL}{amount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanArea}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructions}>
          <Ionicons name="qr-code" size={48} color="#FFA500" />
          <Text style={styles.instructionText}>
            Scan Car Guard's QR Code
          </Text>
          <Text style={styles.instructionSubtext}>
            Position the QR code within the frame
          </Text>
        </View>

        {processing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color="#FFF" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: colors.primary,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructions: {
    alignItems: 'center',
    paddingBottom: 60,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 16,
  },
  instructionSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#2A2A2A',
  },
  permissionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 20,
  },
  permissionSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});