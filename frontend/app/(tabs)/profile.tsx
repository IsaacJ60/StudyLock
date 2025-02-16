import React, { useEffect, useState } from 'react';
import { View, Image, TextInput, StyleSheet } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { ThemedView } from '@/components/ThemedView';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useStateContext } from '../context/context'; // Import the hook
import { ThemedText } from '@/components/ThemedText';
import IronRank from "../../assets/images/ranks/Iron_1_Rank.png";
import BronzeRank from "../../assets/images/ranks/Bronze_1_Rank.png";
import SilverRank from "../../assets/images/ranks/Silver_1_Rank.png";
import GoldRank from "../../assets/images/ranks/Gold_1_Rank.png";
import PlatinumRank from "../../assets/images/ranks/Platinum_1_Rank.png";
import DiamondRank from "../../assets/images/ranks/Diamond_1_Rank.png";
import AscendantRank from "../../assets/images/ranks/Ascendant_1_Rank.png";
import ImmortalRank from "../../assets/images/ranks/Immortal_1_Rank.png";
import {ImageBackground} from 'react-native';

export default function ProfileScreen() {
  const BackgroundImage = {uri: 'https://i.imgur.com/gX2L2IW.png'};
  const [name, setName] = useState('');
  const { sharedState, setSharedState } = useStateContext();  // Access the context
  const { phoneNumber, setPhoneNumber } = useStateContext();  // Access the context
  const [progress, setProgress] = useState(0.0);
  const [level, setLevel] = useState(1);
  const rankImages = [ IronRank, BronzeRank, SilverRank, GoldRank, PlatinumRank, DiamondRank, AscendantRank, ImmortalRank ];

  useEffect(() => {
    console.log(phoneNumber);
    setProgress((sharedState % 10) / 10);
    if (sharedState >= level * 10) {
      setLevel(level + 1);
    } else if (sharedState < (level-1) * 10) {
      setLevel(level - 1);
    }
  }
    , [sharedState]);


  return (
    <ImageBackground source={BackgroundImage} style={styles.background}>
    <ThemedView style={styles.container}>
      
        <Image
            // url
            source={rankImages[level - 1]}
            style={styles.image}
        />
        <ThemedText type="title" style={styles.score}>Score: {sharedState}</ThemedText>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber} // Updates shared state
        placeholder="PHONE NUMBER"
        keyboardType="phone-pad"
        style={styles.phonenumberinput}
      />
    <ProgressBar progress={progress} color={'#0073ff'} style={styles.progressBar} />
    </ThemedView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        padding: 200,
        paddingTop: 350,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'DMSans',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    score: {
        color: 'white',
        fontFamily: 'DMSans',
        fontSize: 48,
        fontWeight: 'bold',
        marginTop: 0,
        marginBottom: 40,
    },
    text: {
        color: 'white',
        fontFamily: 'DMSans',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignContent: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        fontFamily: 'DMSans',
    },
    phonenumberinput: {
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        marginTop: 15,
        marginBottom: 20,
        fontFamily: 'DMSans',
        backgroundColor: '#e0e0e0',
    },
    progressBar: {
        borderRadius: 5,
        width: '100%',
        height: 30,
      backgroundColor: '#e0e0e0',
      marginVertical: 20,
      padding: 0,
      fontFamily: 'DMSans',
    },
    input: {
      borderWidth: 1,
      borderColor: '#cccccc',
      borderRadius: 8,
      padding: 15,
      fontSize: 16,
      marginTop: 15,
      width: '100%',
      fontFamily: 'DMSans',
    },
    // Optional image styling (if you add an image later)
    image: {
      width: 150,
      height: 150,
      borderRadius: 75,
      alignSelf: 'center',
      marginVertical: 20,
      fontFamily: 'DMSans',
      marginBottom: 40,
    }
  });