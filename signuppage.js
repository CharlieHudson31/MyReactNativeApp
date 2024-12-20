import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const signup = () =>{
    navigation = useNavigation()
    return (
        <View>
            <Text>
                This is the sign up page.
            </Text>
        </View>
    )
}
export default signup