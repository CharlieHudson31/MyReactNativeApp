import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Page1 from './Page1';
import Page2 from './Page2';
import Login from './loginpage';
import Signup from './signuppage';
import Home from './home';
import FriendsList from './FriendsList';
import ViewPaths from './ViewPaths';
const Stack = createStackNavigator();

export default function MyNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="home" component={Home}/>
        <Stack.Screen name="signuppage" component={Signup}/>
        <Stack.Screen name="loginpage" component={Login}/>
        <Stack.Screen name="Page1" component={Page1} />
        <Stack.Screen name="FriendsList" component={FriendsList}/>
        <Stack.Screen name="Page2" component={Page2} />
        <Stack.Screen name="ViewPaths" component={ViewPaths} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

