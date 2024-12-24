import React, {useState, useEffect} from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles.js'
import { useAuth } from './firebaseConfig.js';

const Page1 = () => {
    //const uid = getDocumentById('user', '1q9CgZYrBBx4kSkRkO5q')
    //console.log
    const userUid = useAuth();
    console.log("user id: " + userUid)
    const navigation = useNavigation();
    //const [text, onChangeText] = React.useState('Useless Text');
    return (
      <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Button 
        title="View Map"
        onPress={() => navigation.navigate('Page2')}
      />
    <Button title="Add friends"
    onPress={() => navigation.navigate('FriendsList')}/>
    </View>
    );
  };

export default Page1