import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { logout, submitNotificationTokenLocal } from '../../actions/session';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const afterSuccess = (navigation) => {
    navigation.navigate('Login');
}

const ProfileScree = (props) => {

    const { user, notificationToken } = props;
    const [token, setToken] = useState(notificationToken);

    const onPressLogout = (props) => {
        const { actions, navigation, notificationToken } = props;
        setToken(notificationToken);
        actions.logout();
        actions.submitNotificationTokenLocal(token);
        setTimeout(() => afterSuccess(navigation), 500);
    };


    if (user) {
        return (
            <View style={
                {
                    height: '100%',
                    padding: 10, justifyContent: 'center',
                    backgroundColor: '#f0f0f0'
                }}
            >
                <Card>
                    <Card.Title style={{ fontSize: 20, fontWeight: '400' }}>
                        Selamat Datang
                    </Card.Title>
                    <Card.Divider />
                    <View style={{ alignItems: 'center' }}>
                        <Icon name={"user-circle-o"} color={"#f0f0f0"} size={100} />

                        <Text style={{ fontSize: 20, margin: 10 }}>
                            {props.user.name}
                        </Text>
                        <Button title="Logout" buttonStyle={{ backgroundColor: '#3b5998' }} onPress={() => onPressLogout(props)} />
                    </View>
                </Card>
            </View>
        )
    } else {
        return (
            <View style={
                {
                    height: '100%',
                    padding: 10, justifyContent: 'center',
                    backgroundColor: '#f0f0f0'
                }}
            >
                <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Clear data...</Text>
            </View>
        )
    }

};

const mapStateToProps = (state) => ({
    user: _.get(state.session, 'user'),
    notificationToken: _.get(state.session, 'notificationToken'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            logout,
            submitNotificationTokenLocal
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScree);


