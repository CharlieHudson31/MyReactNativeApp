import React from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import styles from './styles'
export default function Map() {
    return (
      <View style={styles.map_container}>
        <MapView style={styles.map} />
      </View>
    );
  }
  