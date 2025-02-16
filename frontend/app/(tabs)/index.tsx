import { StyleSheet, TouchableOpacity, Text, View, Platform, Image, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState, useEffect, useRef } from 'react';
import WebcamComponent, { WebcamComponentRef } from '@/components/WebcamComponent'; 
import { useStateContext } from '../context/context'; 

export default function HomeScreen(): JSX.Element {
  const BackgroundImage = { uri: 'https://i.imgur.com/pRg5NLI.png' };
  const LogoImage = { uri: 'https://i.imgur.com/ArqniGl.png' }; // Replace with your actual image URL
  const [cameraActive, setCameraActive] = useState(false); 
  const webcamRef = useRef<WebcamComponentRef | null>(null); 
  const { sharedState, setSharedState } = useStateContext();  
  const { phoneNumber, setPhoneNumber } = useStateContext(); 

  const handleLockIn = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:5000/api/lock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'locked_in' }),
      });
      const data = await response.json();
      console.log('Response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const sendImage = async (image: string, phoneNumber: string): Promise<void> => {
    console.log("PHONE NUMBER STRING IS:", phoneNumber);
    try {
      const response = await fetch('http://localhost:5000/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, phoneNumber }),
      });
      const data = await response.json();
      console.log('Response:', data);
      if (data.score !== 0) {
        setSharedState((prevState) => prevState + data.score);
        console.log('Updated state:', sharedState);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const captureImage = () => {
    if (webcamRef.current) {
      const image = webcamRef.current.getImage(); 
      if (image) {
        sendImage(image, phoneNumber); 
      }
    }
  };

  const toggleCamera = () => {
    setCameraActive(prevState => !prevState); 
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (cameraActive) {
      intervalId = setInterval(() => {
        captureImage();
      }, 2000);
    } else {
      if (intervalId) {
        clearInterval(intervalId);
      }
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cameraActive]);

  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
      <ThemedView style={styles.container}>
        {/* Replacing StudyLock Text with an Image */}
        <Image source={LogoImage} style={styles.logo} />
        
        <View style={styles.separator} />

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
          <ThemedText style={styles.text}>Click FOCUS to lock in.</ThemedText>
        )}
      </ThemedView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: 'DMSans',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  logo: {
    width: 600, // Adjust width to fit your design
    height:120, // Adjust height as needed
    resizeMode: 'cover',
    marginBottom: 0,
  },
  separator: {
    borderBottomColor: 'white',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 50,
  },
  lockButton: {
    fontFamily: 'DMSans',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#0073ff',
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
    color: '#0073ff',
    marginTop: 40,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  score: {
    fontFamily: 'DMSans',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 25,
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    fontFamily: 'DMSans',
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
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 50,
  },
});

