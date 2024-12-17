import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import React from 'react';

const Cat = () => {
  const [name, setName] = React.useState('Spidey');
  //const [text, onChangeText] = React.useState('Useless Text');
  return (
    <View style={styles.container}>
    <TextInput
    style= {styles.input}
      onChangeText={(t) => {
        console.log('Text input changed to:', t)
        setName(t)}
      }
      defaultValue="Enter name here"
    />
    <Text>Hello, I am your cat {name}!</Text>
  </View>
  );
};

export default Cat;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
