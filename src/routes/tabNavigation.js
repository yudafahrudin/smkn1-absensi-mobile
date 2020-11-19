import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from 'react-native-elements';

import { logout } from '../actions/session';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

function HomeScreen(props) {
    const { actions } = props;
    return (
        <View style={{ backgroundColor: '#f0f0f0', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home!</Text>
            <Button onPress={() => actions.logout()} title="Logout" />
        </View>
    );
}

function SettingsScreen() {
    return (
        <View style={{ backgroundColor: 'blue', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Settings!</Text>
        </View>
    );
}

const Tab = createBottomTabNavigator();

const IndexNavigation = (props) => (
    <NavigationContainer>
        <Tab.Navigator>
            <Tab.Screen name="Home" children={() => <HomeScreen {...props} />} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
    </NavigationContainer>
);

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            logout,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexNavigation);


