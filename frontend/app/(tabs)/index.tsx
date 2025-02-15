import { StyleSheet, TouchableOpacity, Text, View, Platform } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useRef } from 'react';
import WebcamComponent, { WebcamComponentRef } from '@/components/WebcamComponent'; // Import the ref type
import { useStateContext } from '../context/context'; // Import the hook

export default function HomeScreen(): JSX.Element {
  const [cameraActive, setCameraActive] = useState(false); // State to toggle the camera
  const webcamRef = useRef<WebcamComponentRef | null>(null); // Reference to access WebcamComponent
  const { sharedState, setSharedState } = useStateContext();  // Access the context

  // Function to send the backend request
  const handleLockIn = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/lock-in', {
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

  const sendImage = async (image: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image }),
      });
      const data = await response.json();
      console.log('Response:', data);
  
      if (data.score === 1) {
        // Use the functional form to update the state
        setSharedState((prevState) => prevState + data.score);
        // Log the updated state (after it's been updated in the next render cycle)
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to capture the image from the webcam
  const captureImage = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getImage(); // Get the captured image from WebcamComponent
      if (image) {
        sendImage(image); // Send the captured image to the backend
      }
    }
  };

  // Function to toggle the camera state
  const toggleCamera = () => {
    setCameraActive(prevState => !prevState); // Toggle the camera state
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (cameraActive) {
      // If the camera is active, start sending requests every 5 seconds
      intervalId = setInterval(() => {
        const status = captureImage(); // Capture and send the image every 5 seconds
      }, 5000); // 5000 ms = 5 seconds
    } else {
      // If the camera is turned off, clear the interval
      if (intervalId) {
        clearInterval(intervalId);
      }
    }

    // Cleanup function to clear the interval when the component is unmounted or camera is turned off
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cameraActive]); // Only re-run effect if cameraActive state changes

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>STUDY LOCK</ThemedText>
      <ThemedText style={styles.score}> Score: {sharedState} </ThemedText>
      <TouchableOpacity style={styles.lockButton} onPress={toggleCamera}>
        <Text style={styles.toggleCameraButtonText}>
          {cameraActive ? 'STOP' : 'FOCUS'}
        </Text>
      </TouchableOpacity>
      {Platform.OS === 'web' && cameraActive ? (
        <div style={styles.webcamContainer}>
                  <WebcamComponent ref={webcamRef} />
        </div>
      ) : (
        <ThemedText style={styles.text}>Camera not active or camera access not supported on this platform.</ThemedText>
      )}
    </ThemedView>
  );
};

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
  score: {
    fontFamily: 'DMSans',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 20,
  },
  webcamContainer: {
    fontFamily: 'DMSans',
    marginTop: 20,
    height: 300,
    width: 400,
    borderRadius: 100,
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
