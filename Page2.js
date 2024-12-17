import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps'
import styles from './Page1'
export default function Page2 (){
    const navigation = useNavigation();
    const MyNavigator = MyNavigator;
    return (
    <View>
        <Text>Hi</Text>
        <Button 
        title = "Go to Page1"
        onPress={() => navigation.navigate('Page1')} />
        <Map/>
    </View>
    
    )
}
const Map = () => {
    return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: 42.882004,
          longitude: 74.582748,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      />
      </View>
    );
  };
