import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Page2 (){
    const navigation = useNavigation();
    const MyNavigator = MyNavigator;
    return (
    <View>
        <Text>Hi</Text>
        <Button 
        title = "Go to Page1"
        onPress={() => navigation.navigate('Page1')} />
    </View>
    )
}