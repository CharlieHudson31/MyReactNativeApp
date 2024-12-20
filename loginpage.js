import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {logIn} from './firestore'
import { useNavigation } from '@react-navigation/native';
const login = () =>{
    navigation = useNavigation()
    return (
    <View style={styles.container}>
        <Text>Enter email:</Text>
        <TextInput 
        style={styles.input}
        />
        <Text>Enter password (The one used for this app, not for your email):</Text>
        <TextInput 
        style={styles.input}
        />
        <Button title="Submit"
        onPress={() => console.log("submitting log in")}
        />
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    input: {
      height: 40,
      width: 120,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
  });
export default login