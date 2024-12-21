import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import addToFireStore from './firestore.js'
import styles from './styles.js'
const Page1 = () => {
    const navigation = useNavigation();
    //const [text, onChangeText] = React.useState('Useless Text');
    return (
      <View style={styles.container}>
      <Text>Beer App</Text>
      <Button 
        title="View Map"
        onPress={() => navigation.navigate('Page2')}
      />
    </View>
    );
  };

export default Page1