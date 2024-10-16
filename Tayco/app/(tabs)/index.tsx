import React from 'react';
import { Image, StyleSheet, Platform, Pressable, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title" style={styles.titleText}>
          TayCo!
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
    color: '#2C3E50',
  },
  descriptionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2, // For Android shadow effect
    shadowColor: '#000', // iOS shadow color
    shadowOffset: { width: 0, height: 1 }, // iOS shadow offset
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 1.5, // iOS shadow radius
  },
  welcomeText: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 8,
    lineHeight: 22,
  },
  navigationText: {
    fontSize: 16,
    color: '#34495E',
  },
  pressable: {
    marginLeft: 5,
    backgroundColor: '#2980B9', // Color for the button
    padding: 8,
    borderRadius: 8,
  },
  navigationLinkText: {
    color: '#FFFFFF', // Text color for the button
    fontWeight: 'bold',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
