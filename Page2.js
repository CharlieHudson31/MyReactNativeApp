import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
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

// Euclidean distance approximation (miles)
function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const latDist = (lat2 - lat1) * 69; // miles per degree latitude
  const lonDist = (lon2 - lon1) * 69 * Math.cos((lat1 * Math.PI) / 180); // scale by latitude
  return Math.sqrt(latDist ** 2 + lonDist ** 2);
}

export default function Map() {
  const [location, setLocation] = useState(null);
  const [nearestBars, setNearestBars] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activePath, setActivePath] = useState([]); 
  const [pathActive, setPathActive] = useState(false); 
  const [visitedBars, setVisitedBars] = useState([]); 
  const [pathCompleted, setPathCompleted] = useState(false);
  const [stored_barPaths, setStoredBarPaths] = useState([]);

  // Get location + bars
  const updateLocationAndBars = useCallback(async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
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
  const handleShowPaths = async (bar) => {
    const paths = await getPathsStartingFromBar(bar.place_id);

    const colors = ["#FF0000", "#00AA00", "#0000FF"];
    const formatted = paths.map((p, i) => ({
      coordinates: p.coordinates,
      color: colors[i % colors.length],
    }));

    setStoredBarPaths(formatted);
  };
  const MAX_DISTANCE = 40; // miles

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
            if (!location) return;

            const distance = getDistanceMiles(
              location.latitude,
              location.longitude,
              bar.geometry.location.lat,
              bar.geometry.location.lng
            );

            if (distance <= MAX_DISTANCE) {
              if (!visitedBars.find((b) => b.place_id === bar.place_id)) {
                setVisitedBars([...visitedBars, bar]);
              }
            } else {
              Alert.alert("Too far!", "You must be closer to mark this bar as visited.");
            }
          }}
        >
          {/* Custom callout with a button */}
          <Callout onPress={() => handleShowPaths(bar)}>
            <View style={{ padding: 6 }}>
              <Text style={{ fontWeight: "bold" }}>{bar.name}</Text>
              <Text>{bar.vicinity}</Text>
              <Button title="Show Paths" onPress={() => handleShowPaths(bar)} />
            </View>
          </Callout>
        </Marker>
      ))}
        {/* Visited bars */}
        {visitedBars.map((bar) => (
          <Marker
            key={`visited-${bar.place_id}`}
            coordinate={{
              latitude: bar.geometry.location.lat,
              longitude: bar.geometry.location.lng,
            }}
            title={bar.name}
            pinColor="green"
          />
        ))}
        {/* Preview path connecting visited bars */}
        {pathActive && visitedBars.length > 0 && (
          <Polyline
            coordinates={visitedBars.map((bar) => ({
              latitude: bar.geometry.location.lat,
              longitude: bar.geometry.location.lng,
            }))}
            strokeColor="#8888FF"
            strokeWidth={2}
            lineDashPattern={[5, 5]} // creates dotted/dashed line
          />
        )}
        {/* Active path */}
        {activePath.length > 0 && (
          <Polyline coordinates={activePath} strokeColor="#00AAFF" strokeWidth={3} />
        )}

        {stored_barPaths.map((path, index) => {
        const colors = ["#FF0000", "#00FF00", "#0000FF"];
        return (
          <Polyline
            key={path.id}
            coordinates={path.coordinates}
            strokeColor={colors[index % colors.length]}
            strokeWidth={3}
          />
        );
      })}
      </MapView>

      {/* Buttons */}
      <View style={{ position: 'absolute', top: 40, left: 10, right: 10, alignItems: 'center' }}>
        <Button title="Refresh Location & Bars" onPress={updateLocationAndBars} disabled={loading} />
      </View>

      <View style={{ position: 'absolute', top: 80, left: 10, right: 10, alignItems: 'center' }}>
        <Button
          title="Start New Path"
          onPress={() => {
            setActivePath([]);
            setPathActive(true);
            setPathCompleted(false);
          }}
        />
      </View>

      <View style={{ position: 'absolute', top: 120, left: 10, right: 10, alignItems: 'center' }}>
        <Button
          title="Complete Path"
          onPress={() => {
            const newPath = visitedBars.map((bar) => ({
              latitude: bar.geometry.location.lat,
              longitude: bar.geometry.location.lng,
              name: bar.name,
              place_id: bar.place_id,
            }));
            setActivePath(newPath);
            setVisitedBars([]);
            setPathActive(true);
            setPathCompleted(true);
            
          }}
          disabled={visitedBars.length === 0}
        />
      </View>
      <View style={{ position: 'absolute', top: 20, left: 10, right: 100, alignItems: 'center' }}>
          <Button
          title="Edit Path"
          onPress={() =>
            navigation.navigate('ViewPaths', {
              path: activePath,
              onSave: (updatedPath) => setActivePath(updatedPath), // callback
            })}
          disabled={!pathCompleted}
          />

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

