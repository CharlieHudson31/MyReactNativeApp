import React, {useState, useEffect} from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {getDocumentById} from './firestore.js'
import styles from './styles.js'
import { useAuth } from './firebaseConfig.js';
import { UserProfile } from './Page1';
const FriendsList = () => {
    const userUid = useAuth();
    const navigation = useNavigation();
    //const [text, onChangeText] = React.useState('Useless Text');
    return (
      <View style={styles.container}>
      {userUid ? <UserProfile userUid={userUid} /> : null}
    </View>
    );
  };
export default FriendsList