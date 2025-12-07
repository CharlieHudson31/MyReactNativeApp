import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, Text, ActivityIndicator, Button, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import styles from './styles';
import Constants from 'expo-constants';
import { getPathsStartingFromBar } from './paths_db'; // Firestore helper

const GOOGLE_MAPS_KEY = Constants.expoConfig.extra.googleMapsKey;

async function fetchNearestBars(lat, lng) {
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=bar&key=${GOOGLE_MAPS_KEY}`;
  try {
    const response = await fetch(url);
    const json = await response.json();
    if (json.status === 'OK' && json.results.length > 0) {
      return json.results.slice(0, 5);
    }
    console.warn('No bars found or API error:', json.status, json.error_message);
    return [];
  } catch (error) {
    console.error('Error fetching places:', error);
    return [];
  }
}

function getDistanceMiles(lat1, lon1, lat2, lon2) {
  const latDist = (lat2 - lat1) * 69;
  const lonDist = (lon2 - lon1) * 69 * Math.cos((lat1 * Math.PI) / 180);
  return Math.sqrt(latDist ** 2 + lonDist ** 2);
}

export default function Map() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [nearestBars, setNearestBars] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [activePath, setActivePath] = useState([]);
  const [pathActive, setPathActive] = useState(false);
  const [visitedBars, setVisitedBars] = useState([]);
  const [pathCompleted, setPathCompleted] = useState(false);
  const [stored_barPaths, setStoredBarPaths] = useState([]);
  const [selectedBar, setSelectedBar] = useState(null);
  
  const [showPathList, setShowPathList] = useState(false);

  
  const MAX_DISTANCE = 40; // miles

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

  useEffect(() => {
    updateLocationAndBars();
  }, [updateLocationAndBars]);

  const handleShowPaths = async () => {
    if (!selectedBar) {
      Alert.alert("No bar selected", "Tap a bar first before showing paths.");
      return;
    }

    try {
      const allPaths = await getPathsStartingFromBar(selectedBar.place_id);
      if (!allPaths || allPaths.length === 0) {
        Alert.alert("No paths found", `No paths start from ${selectedBar.name}`);
        return;
      }

      const pathsToShow = allPaths.slice(0, 3); // 3 nearest paths
      const colors = ["#FF0000", "#00AA00", "#0000FF"];
      const formattedPaths = pathsToShow.map((p, i) => ({
        coordinates: p.coordinates,
        color: colors[i % colors.length],
        id: p.id,
      }));

      setStoredBarPaths(formattedPaths);
      Alert.alert("Paths loaded", `Loaded ${formattedPaths.length} paths from ${selectedBar.name}`);
    } catch (error) {
      console.error("Error fetching paths:", error);
      Alert.alert("Error", "Failed to fetch paths from Firestore.");
    }
  };

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
        onPress={() => {
          setSelectedBar(null);
          setStoredBarPaths([]);
        }}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title="You are here"
          pinColor="blue"
        />

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
            onPress={(e) => {
              e.stopPropagation(); // prevents map onPress from firing
              setSelectedBar(bar);

              const distance = getDistanceMiles(
                location.latitude,
                location.longitude,
                bar.geometry.location.lat,
                bar.geometry.location.lng
              );

              if (distance <= MAX_DISTANCE && pathActive) {
                if (!visitedBars.find((b) => b.place_id === bar.place_id)) {
                  setVisitedBars([...visitedBars, bar]);
                }
              } else {
                if (distance <= MAX_DISTANCE){

                }
                else{
                  Alert.alert("Too far!", "You must be closer to mark this bar as visited.");
                }
                
              }
            }}
          />
        ))}

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

        {pathActive && visitedBars.length > 0 && (
          <Polyline
            coordinates={visitedBars.map((bar) => ({
              latitude: bar.geometry.location.lat,
              longitude: bar.geometry.location.lng,
            }))}
            strokeColor="#8888FF"
            strokeWidth={2}
            lineDashPattern={[5, 5]}
          />
        )}

        {activePath.length > 0 && <Polyline coordinates={activePath} strokeColor="#00AAFF" strokeWidth={3} />}

        {stored_barPaths.map((path, index) => (
          <Polyline
            key={path.id || index}
            coordinates={path.coordinates}
            strokeColor={path.color || "#FF0000"}
            strokeWidth={3}
          />
        ))}
      </MapView>

      {/* Main buttons */}
      <View style={{ position: 'absolute', top: 40, left: 10, right: 10, alignItems: 'center' }}>
        <Button title="Refresh Location & Bars" onPress={updateLocationAndBars} disabled={loading} />
      </View>

      <View style={{ position: 'absolute', top: 80, left: 10, right: 10, alignItems: 'center' }}>
        <Button
          title="Start New Path"
          onPress={() => {
            setActivePath([]);
            setVisitedBars([]);     // clear old visited bars
            setPathActive(true);   // stop showing the purple dotted line
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

        <Button
          title="Reset Path"
          onPress={()=>{
            setActivePath([]);
            setVisitedBars([]);
            setPathActive(false);
            setPathCompleted(false);
          }}
        />
      

        <Button
          title="Edit Path"
          onPress={() =>
            navigation.navigate('ViewPaths', {
              path: activePath,
              onSave: (updatedPath) => setActivePath(updatedPath),
            })}
          disabled={!pathCompleted}
        />
      </View>

{/* Show Path List button */}
{selectedBar && (
  <View style={{ position: 'absolute', bottom: 90, left: 10, right: 10, alignItems: 'center' }}>
    <Button
  title="Show Path List"
  onPress={async () => {
    if (stored_barPaths.length === 0) {
      await handleShowPaths(); // loads them automatically
    }
    setShowPathList(true);
  }}
/>
  </View>
)}



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


      {showPathList && stored_barPaths.length > 0 && (
  <View
    style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40%',
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 15,
      elevation: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 6,
    }}
  >
    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
      Paths from {selectedBar?.name}
    </Text>

    <ScrollView style={{ flex: 1 }}>
      {stored_barPaths.map((path, index) => (
        <View key={path.id || index} style={{ marginBottom: 15 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
            {index + 1}. Path {index + 1}
          </Text>

          <View style={{ marginTop: 5, marginLeft: 10 }}>
            {path.coordinates.map((node, i) => (
              <Text key={i} style={{ fontSize: 14 }}>
                {i + 1}. {node.name ?? "(no name)"}
              </Text>
            ))}
          </View>
        </View>
      ))}
    </ScrollView>

    <Button title="Close" onPress={() => {
      setShowPathList(false);
      setStoredBarPaths([]);
      setSelectedBar(null);
    }
      } />
  </View>
)}


    </View>
  );
}
