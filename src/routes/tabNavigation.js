import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import { getHome, getAbsent } from '../actions/teacher';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HomeScreen from '../screens/Home/HomeScreen';
import AbsentScreen from '../screens/Absent/AbsentScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const IndexNavigation = (props) => (
    <Tab.Navigator initialRouteName="Main"
        tabBarOptions={{ showLabel: false }} screenOptions={({ route }) => ({
            tabBarIcon: ({ focused }) => {
                let iconName, coloring;

                if (route.name === 'Main') {
                    iconName = 'home';
                    coloring = focused
                        ? '#b6c4e2'
                        : '#3b5998';
                } else if (route.name === 'Profile') {
                    iconName = 'user-circle-o';
                    coloring = focused
                        ? '#b6c4e2'
                        : '#3b5998';
                } else if (route.name === 'Absensi') {
                    iconName = 'file';
                    coloring = focused
                        ? '#b6c4e2'
                        : '#3b5998';
                }

                return <Icon
                    name={iconName}
                    type={'simple-line-icon'}
                    color={coloring}
                    size={30}
                />
            }
        })} >
        <Tab.Screen name="Main"
            listeners={() => ({
                tabPress: async () => {
                    const { actions } = props;
                    await actions.getHome();
                },
            })}
            children={() => <HomeScreen {...props} />} />
        <Tab.Screen name="Absensi"
            listeners={() => ({
                tabPress: async () => {
                    const { actions } = props;
                    await actions.getAbsent();
                },
            })}
            children={() => <AbsentScreen {...props} />} />
        <Tab.Screen name="Profile" children={() => <ProfileScreen {...props} />} />
    </Tab.Navigator >
);

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getHome, getAbsent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexNavigation);


