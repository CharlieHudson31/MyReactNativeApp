import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import React from 'react';

const get_full_name = (animal) => {
  if (animal == 'cat'){
    return 'Spidey'
  }
  else{
    return 'Bob'
  }
}
const Cat = () => {
  const name = 'spidey';
  return (
    <View style={styles.container}>
    <Text>Hello, I am your cat {get_full_name('cat')}!</Text>
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
});
