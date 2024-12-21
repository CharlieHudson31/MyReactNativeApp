import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {signUp} from './firestore'
import styles from './styles'
const signup = () =>{
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('')
    navigation = useNavigation()
    return (
    <View style={styles.container}>
        <Text>Enter email:</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(t) => {
            console.log('Text input changed to:', t)
            setEmail(t)}}
        />
        <Text>Create password:</Text>
        <TextInput 
        style={styles.input}
        onChangeText={(t) => {
            setPassword(t)}}
        />
        <Button title="Submit"
        onPress={async () => {
            try{
                var uid = await signUp(email, password)
                console.log("email: " + email + "\npassword: " + password)
                console.log("uid: " + uid)
                navigation.navigate('Page1')
            }
            catch (error){
                alert("Log in failed: " + error.message)
            }}}/>
    </View>
    )
}

export default signup