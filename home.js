import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const signin = () =>{
    navigation = useNavigation()
    return (
    <View>
        <Button title="Sign up:"
        onPress={() => navigation.navigate('signuppage')}/>
        <Button title="Log in:"
        onPress={() => navigation.navigate('loginpage')}/>
    </View>
    )
}
export default signin