import React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import AuthLoadingScreen from '../screens/AuthLoading/authLoadingScreen'
import LoginScreen from '../screens/Login/loginScreen';

// function LoginScreen(props) {
//     const { navigation } = props;
//     return (
//         <View style={{ backgroundColor: '#f0f0f0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Login!</Text>
//             <Button title={'Login'} onPress={() => navigation.navigate('Main')} />
//         </View>
//     );
// }

const Stack = createStackNavigator();

const StackNavigation = () => (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Home" component={AuthLoadingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
    </NavigationContainer>
);

export default StackNavigation;
