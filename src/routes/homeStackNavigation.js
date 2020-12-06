import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeParentScreen from '../screens/HomeParent/HomeParentScreen'
import AllRecapitulation from '../screens/AllRecapitulation/AllRecapitulationScreen'
import { color } from 'react-native-reanimated';

const Stack = createStackNavigator();

const StackNavigation = () => (
    <Stack.Navigator initialRouteName="HomeParentScreen">
        <Stack.Screen name="HomeParentScreen" component={HomeParentScreen} options={() => ({
            headerShown: false
        })} />
        <Stack.Screen name="AllRecapitulation" component={AllRecapitulation} options={() => ({
            title: 'SEMUA REKAPITULASI',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#3b5998',
            }
        })
        } />
    </Stack.Navigator>
);

export default StackNavigation;
