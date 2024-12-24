import React, {useState, useEffect} from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {addToUserFriendsListByEmail, getDocumentById} from './firestore.js'
import styles from './styles.js'
import { useAuth } from './firebaseConfig.js';

export const UserProfile = ({ userUid }) => {
  const [userData, setUserData] = useState(null);  // State to store user data
  const [loading, setLoading] = useState(true);    // Loading state
  const [error, setError] = useState(null);        // Error state

  // Fetch user data function
  const fetchUserData = async () => {
      if (!userUid) return;

      try {
          setLoading(true); // Start loading when refreshing
          const data = await getDocumentById('user', userUid); // Fetch the document by ID
          setUserData(data);  // Store the data in state
          setLoading(false);  // Set loading to false once data is fetched
      } catch (err) {
          setError(err);       // Handle any errors
          setLoading(false);
      }
  };

  // useEffect to fetch the document data once when the component mounts
  useEffect(() => {
      fetchUserData();  // Call fetchUserData on component mount
  }, [userUid]);  // This will re-run if the userUid changes

  if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />; // Show loading indicator
  }

  if (error) {
      return <Text>Error loading user data: {error.message}</Text>; // Show error message
  }

  // Render the user profile data only if userData is defined
  return (
      <View>
          {userData && userData.email ? (
              <Text style={styles.subtext}>{userData.email}</Text> // Only render email if userData exists and email is present
          ) : (
              <Text>Email not available</Text>
          )}
          
          <Text style={styles.subtext}>Friends List:</Text>
          {userData && userData.friendsList && userData.friendsList.length > 0 ? (
              <Text style={styles.box}>{userData.friendsList.join(', ')}</Text>
          ) : (
              <Text style={styles.box}>No friends added yet.</Text>
          )}

          {/* Refresh Button */}
          <Button title="Refresh" onPress={fetchUserData} />
      </View>
  );
};
const FriendsList = () => {
    const [friendEmail, setFriendEmail] = React.useState('');
    const userUid = useAuth();
    const navigation = useNavigation();
    //const [text, onChangeText] = React.useState('Useless Text');
    return (
      <View style={styles.container}>
      {userUid ? <UserProfile userUid={userUid} /> : null}
      <TextInput style={styles.input}
      onChangeText={(t) => {
        setFriendEmail(t)}}></TextInput>
      <Button title="Add friend"
      onPress={()=>addToUserFriendsListByEmail(userUid, friendEmail)}/>
    </View>
    );
  };
export default FriendsList