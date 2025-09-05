import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Button } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import styles from './styles';
import Constants from 'expo-constants';

const GOOGLE_MAPS_KEY = Constants.expoConfig.extra.googleMapsKey;

async function fetchNearestBars(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=bar&key=${GOOGLE_MAPS_KEY}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === 'OK' && json.results.length > 0) {
      return json.results.slice(0, 5);
    } else {
      console.warn('No bars found or API error:', json.status, json.error_message);
      return [];
    }
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

export default function Map() {
  const [location, setLocation] = useState(null);
  const [nearestBars, setNearestBars] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePath, setActivePath] = useState([]); // only one path now
  const [pathActive, setPathActive] = useState(false); 
  // Get location + bars
  const updateLocationAndBars = useCallback(async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);

      const bars = await fetchNearestBars(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );
      setNearestBars(bars);
    } catch (error) {
      setErrorMsg('Error getting location or bars.');
      console.error(error);
    }
    setLoading(false);
  }, []);

  // On mount
  useEffect(() => {
    updateLocationAndBars();
  }, [updateLocationAndBars]);

  if (errorMsg) {
    return (
      <View style={styles.map_container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.map_container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation={true}
      >
        {/* User marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
          pinColor="blue"
        />

        {/* Bars */}
        {nearestBars.map((bar) => (
          <Marker
            key={bar.place_id}
            coordinate={{
              latitude: bar.geometry.location.lat,
              longitude: bar.geometry.location.lng,
            }}
            title={bar.name}
            description={bar.vicinity}
            pinColor="orange"
            onPress={() => {
              if (!pathActive) return;
              const newPoint = {
                latitude: bar.geometry.location.lat,
                longitude: bar.geometry.location.lng,
                name: bar.name,
              };
              setActivePath([...activePath, newPoint]);
            }}
          />
        ))}

        {/* Active path */}
        {activePath.length > 0 && (
          <Polyline coordinates={activePath} strokeColor="#00AAFF" strokeWidth={3} />
        )}
      </MapView>

      {/* Buttons */}
      <View style={{ position: 'absolute', top: 40, left: 10, right: 10, alignItems: 'center' }}>
        <Button title="Refresh Location & Bars" onPress={updateLocationAndBars} disabled={loading} />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 80,
          left: 10,
          right: 10,
          alignItems: 'center',
        }}
      >
        <Button
          title="Start New Path"
          onPress={() => {
            setActivePath([]);
            setPathActive(true);
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 120,
          left: 10,
          right: 10,
          alignItems: 'center',
        }}
      >
        <Button
          title="Stop Path"
          onPress={() => {
            setPathActive(false);
          }}
          disabled={!pathActive}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          top: 140,
          left: 10,
          right: 10,
          alignItems: 'center',
        }}
      >
        <Button title="Clear Path" onPress={() => setActivePath([])} />
      </View>

      {loading && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            backgroundColor: 'white',
            padding: 8,
            borderRadius: 4,
          }}
        >
          <Text>Loading...</Text>
        </View>
      )}
    </View>
  );
}
