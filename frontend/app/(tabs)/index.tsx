import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from 'react';
import WebcamComponent from '@/components/WebcamComponent'; // Ensure this path is correct

export default function HomeScreen(): JSX.Element {
  const [cameraActive, setCameraActive] = useState(false); // State to toggle the camera

  const handleLockIn = async (): Promise<void> => {
    try {
      const response = await fetch('https://your-backend.com/api/lock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'locked_in' }),
      });
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleCamera = () => {
    setCameraActive(prevState => !prevState); // Toggle the camera state
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>STUDY LOCK</ThemedText>
      <TouchableOpacity style={styles.lockButton} onPress={toggleCamera}>
      <Text style={styles.toggleCameraButtonText}>
          {cameraActive ? 'STOP' : 'FOCUS'}
        </Text>
      </TouchableOpacity>
      {Platform.OS === 'web' && cameraActive ? (
        <View style={styles.webcamContainer}>
          <WebcamComponent />
        </View>
      ) : (
        <Text style={styles.text}>Camera not active or camera access not supported on this platform.</Text>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'DMSans',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  title: {
    fontFamily: 'DMSans',
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 60,
  },
  lockButton: {
    fontFamily: 'DMSans',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#ff6347',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  lockButtonText: {
    fontFamily: 'DMSans',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontFamily: 'DMSans',
    color: 'white',
    marginTop: 40,
  },
  webcamContainer: {
    fontFamily: 'DMSans',
    marginTop: 20,
    width: '100%',
    height: 300,
  },
  toggleCameraButton: {
    fontFamily: 'DMSans',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  toggleCameraButtonText: {
    fontFamily: 'DMSans',
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
});
