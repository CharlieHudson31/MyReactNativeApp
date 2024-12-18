import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Page1 = () => {
    const [name, setName] = React.useState('Spidey');
    const navigation = useNavigation();
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
      <Button 
        title="View Map"
        onPress={() => navigation.navigate('Page2')}
      />
    </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    container2: {
      flex: 1,
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    map:{
        width: '100%',
        height: '100%',
    }
  });
export default Page1