import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthLoadingScreen from '../screens/AuthLoading/authLoadingScreen'
import LoginScreen from '../screens/Login/loginScreen';

const Stack = createStackNavigator();

const StackNavigation = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={AuthLoadingScreen} options={() => ({
                headerShown: false
            })} />
            <Stack.Screen name="Login" component={LoginScreen} options={() => ({
                headerLeft: null
            })} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default StackNavigation;
