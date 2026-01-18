import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';

import { ThemedButton } from '@/components/themed-button';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';


export default function HomeScreen() {
    //   const buttonColors = [
    //   '#C0C0C0', // Silver
    //   '#2ecc71', // Green
    //   '#8e44ad', // Purple
    //   '#f1c40f', // Yellow
    //   '#3498db', // Blue
    //   '#e74c3c', // Red
    //   '#FFA500', // Orange
    // ];

  // const amounts = ['R2', 'R5', 'R10', 'R20', 'R50', 'R100', 'R200'];
  return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: 'black', dark: 'black' }}
        headerImage={
          <Image/>
        }
      >
      <ThemedView style={[styles.stepContainer, { backgroundColor: 'black' }]}>
      </ThemedView>
        <Image
        source={require('@/assets/images/TipyTap-Logo.png')}
        style={styles.reactLogo}></Image>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Please Tip your car guard</ThemedText>

        <ThemedButton
          title="R2"
          backgroundImage={require('@/assets/images/R2-coin.jpg')}
        />

        <ThemedButton
          title="R5"
          backgroundImage={require('@/assets/images/R5-coin.jpg')}
        />

        <ThemedButton
          title="R10"
          backgroundImage={require('@/assets/images/R10-note.jpg')}
        />

        <ThemedButton
          title="R20"
          backgroundImage={require('@/assets/images/R20-note.jpg')}
        />

        <ThemedButton
          title="R50"
          backgroundImage={require('@/assets/images/R50-note.jpg')}
        />

        <ThemedButton
          title="R100"
          backgroundImage={require('@/assets/images/R100-note.jpg')}
        />

        <ThemedButton
          title="R200"
          backgroundImage={require('@/assets/images/R200-note.jpg')}
        />

        <ThemedButton
          title="Enter own Amount"
          backgroundImage={require('@/assets/images/blackbox.png')}
        />

      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

      </ThemedView>
      <ThemedView style={styles.stepContainer}>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: 'black',
    },

    stepContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
      backgroundColor: 'black',
    },

    reactLogo: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    resizeMode: 'contain',
  }, 
});
