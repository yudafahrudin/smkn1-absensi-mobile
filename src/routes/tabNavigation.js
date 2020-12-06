import React, { } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

import { getHomeTeacher, getAbsentTeacher } from '../actions/teacher';
import { getHomeParent } from '../actions/parent';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import HomeStackNavigation from '../routes/homeStackNavigation'
import FormAbsentScreen from '../screens/FormAbsent/FormAbsentScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import AbsentScreen from '../screens/Absent/AbsentScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

const IndexNavigation = (props) => {
    const { user } = props;

    if (!_.isEmpty(user) && user.type == 'siswa') {
        return (
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
                        } else if (route.name === 'Ajukan Izin') {
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
                            await actions.getHomeParent();
                        },
                    })}
                    children={() => <HomeStackNavigation {...props} />} />
                <Tab.Screen name="Ajukan Izin"
                    listeners={() => ({
                        tabPress: async () => {
                            const { actions } = props;
                            await actions.getHomeParent();
                        },
                    })}
                    children={() => <FormAbsentScreen {...props} />} />
                <Tab.Screen name="Profile" children={() => <ProfileScreen {...props} />} />
            </Tab.Navigator >
        )
    }

    if (!_.isEmpty(user) && user.type == 'guru') {
        return (
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
                            await actions.getHomeTeacher();
                        },
                    })}
                    children={() => <HomeScreen {...props} />} />
                <Tab.Screen name="Absensi"
                    listeners={() => ({
                        tabPress: async () => {
                            const { actions } = props;
                            await actions.getAbsentTeacher();
                        },
                    })}
                    children={() => <AbsentScreen {...props} />} />
                <Tab.Screen name="Profile" children={() => <ProfileScreen {...props} />} />
            </Tab.Navigator >
        )
    }
    return (<></>);
}

const mapStateToProps = (state) => ({
    user: _.get(state.session, 'user')
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            getHomeTeacher, getAbsentTeacher, getHomeParent
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexNavigation);


