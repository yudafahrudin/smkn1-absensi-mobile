import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TabNav from '../routes/tabNavigation'
import AuthLoadingScreen from '../screens/AuthLoading/authLoadingScreen'
import LoginScreen from '../screens/Login/loginScreen';

const Stack = createStackNavigator();

const StackNavigation = () => (
    <Stack.Navigator initialRouteName="AuthLoading">
        <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={() => ({
            headerShown: false
        })} />
        <Stack.Screen name="Login" component={LoginScreen} options={() => ({
            headerShown: false
        })} />
        <Stack.Screen name="TabNav" component={TabNav} options={() => ({
            headerShown: false
        })} />
    </Stack.Navigator>
);

export default StackNavigation;
