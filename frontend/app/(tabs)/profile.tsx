import React, { useState } from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useStateContext } from '../context/context'; // Import the hook
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const { sharedState, setSharedState } = useStateContext();  // Access the context
  const [progress, setProgress] = useState(0.1);
  const [level, setLevel] = useState(1);

  return (
    <ThemedView style={styles.container}>

        <Image
            // url
            source={{ uri: 'https://randomuser.me/api/portraits/men/22.jpg' }}
            style={styles.image}
        />
        <ThemedText type="title" style={styles.text}>SCORE: {sharedState}</ThemedText>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
    <ProgressBar progress={progress} style={styles.progressBar} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    text: {
        color: 'white',
        fontFamily: 'DMSans',
        fontSize: 24,
        fontWeight: 'bold',
    },
    progressBar: {
        borderRadius: 5,
        width: '100%',
        height: 20,
      backgroundColor: '#e0e0e0',
      marginVertical: 20,
      padding: 0,
    },
    input: {
      borderWidth: 1,
      borderColor: '#cccccc',
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      marginTop: 15,
      width: '100%',
    },
    // Optional image styling (if you add an image later)
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignSelf: 'center',
      marginVertical: 20,
      backgroundColor: '#f0f0f0',
    }
  });