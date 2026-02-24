import { StyleSheet, ImageBackground, View, TouchableOpacity, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import Colors from '../src/constants/colors'
import { CarGuard } from '../src/types'
import authService from '@/src/services/authService'

export default function Getqrcode() {

    const router = useRouter();

    const [guard, setGuard] = useState<CarGuard | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const loadUserData = async () => {
        const guardData = await authService.getCurrentGuard();
        setGuard(guardData);
        setLoading(false);
    };

    loadUserData();
    }, []);

    if (loading) return <Text>Loading...</Text>;

    if (!guard) return <Text>No guard profile found.</Text>;

    function handleDownload() {
        // Implement download functionality here
        alert('Download functionality not implemented yet');
    }

  return (
    <View style={styles.container}>
      <ImageBackground source={require('../src/assets/images/background.png')} style={styles.bg}>
        <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace('/(tabs)/profile')}
        >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.qrTitle}>QR Code (Preview)</Text>

        <View style={styles.qrContainer}>
            <QRCode 
                value={guard?.qrCode || 'CARGUARD_DEFAULT_QR_CODE'}
                size={200}
            />
        </View>

        <TouchableOpacity style={styles.downloadBtnConatiner} onPress={handleDownload}>
            <Text style={styles.downloadBtn}>
                Download <Ionicons name="download-outline" size={18} color="#FFF" style={{marginLeft: 5}} />
            </Text>
        </TouchableOpacity>

      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    qrContainer: {
        backgroundColor: Colors.primary,
        width: 225,
        height: 225,
        alignItems: 'center',
        justifyContent: 'center'
    },
    qrTitle: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    bg: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    backBtn: {
        position: 'absolute',
        top: 54,
        left: 20,
    },
    downloadBtnConatiner: {
        backgroundColor: Colors.warning,
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        position: 'absolute',
        bottom: 50,
        width: '100%',
    },
    downloadBtn: {
        color: Colors.text,
        fontSize: 18
    }
})