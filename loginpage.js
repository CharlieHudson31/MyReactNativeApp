import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import {logIn} from './firestore'
import { useNavigation } from '@react-navigation/native';
import styles from './styles'
const login = () =>{
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    const navigation = useNavigation()
    return (
    <View style={styles.container}>
        <Text>Enter email:</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(t) => {
            //console.log('Text input changed to:', t)
            setEmail(t)}}
        />
        <Text>Enter password (The one used for this app, not for your email):</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(t) => {
            setPassword(t)}}
        />
        <Button title="Submit"
        onPress={async () => {
            try{
                var uid = await logIn(email, password)
                //console.log("email: " + email + "\npassword: " + password)
                //console.log("uid: " + uid)
                navigation.navigate('Page1')
            }
            catch (error){
                alert("Log in failed: " + error.message)
            }}}/>
    </View>
    )
}

export default login