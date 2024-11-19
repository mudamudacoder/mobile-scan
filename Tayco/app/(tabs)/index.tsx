import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FF9800', dark: '#333333' }}
      headerImage={
        <Image
          source={require('@/assets/images/shipping.jpg')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          Tayco!
        </ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.descriptionContainer}>
        <ThemedText style={styles.welcomeText}>
          Welcome to ALS (Automated Labelling System). Please use the designated
          in-built scanner to scan barcodes to start printing labels.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9800', // Orange color for title
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5', // Light gray background
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3, // Android shadow effect
    shadowColor: '#888', // Gray shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  welcomeText: {
    fontSize: 16,
    color: '#333333', // Dark gray for text
    marginBottom: 8,
    lineHeight: 22,
  },
  reactLogo: {
    height: 300,
    width: '100%',
    top: 0,
    left: 0,
    position: 'absolute',
  },
});
