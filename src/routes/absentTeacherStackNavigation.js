import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AbsentScreen from '../screens/Absent/AbsentScreen'
import AbsentDetailScreen from '../screens/AbsentDetail/AbsentDetailScreen'

const Stack = createStackNavigator();

const StackNavigation = () => (
    <Stack.Navigator initialRouteName="AbsentScreen">
        <Stack.Screen name="AbsentScreen" component={AbsentScreen} options={() => ({
            headerShown: false
        })} />
        <Stack.Screen name="AbsentDetailScreen" component={AbsentDetailScreen} options={() => ({
            title: 'DETAIL ABSENSI',
            headerTintColor: '#fff',
            headerStyle: {
                backgroundColor: '#3b5998',
            }
        })
        } />
    </Stack.Navigator>
);

export default StackNavigation;
