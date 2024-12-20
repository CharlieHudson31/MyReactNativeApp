import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area'
const { window_width, window_height } = Dimensions.get('window');
const signin = () =>{
    navigation = useNavigation()
    
    return (
    <View style={styles.container}>
        <Button title="Sign up"
        onPress={() => navigation.navigate('signuppage')}/>
        <Button title="Log in"
        onPress={() => navigation.navigate('loginpage')}/>


        <Image
            style={styles.logo}
            source={require('./assets/Beer_Icon.png')}
        />
        <Button title="Skip Log in"
        onPress={(() => navigation.navigate('Page1'))}/>
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
    logo: {
        width: 200,
        height: 200,
      },
  });

export default signin