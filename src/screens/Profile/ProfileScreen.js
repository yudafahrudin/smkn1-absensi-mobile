import React from 'react';
import { View, Text } from 'react-native';
import { Button, Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import { logout } from '../../actions/session';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const afterSuccess = (navigation) => {
    navigation.navigate('Login');
}

const onPressLogout = (props) => {
    const { actions, navigation } = props;
    actions.logout(
        () => afterSuccess(navigation)
    );
};

const ProfileScree = (props) => {
    const { user } = props;
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
        return (<></>)
    }

};

const mapStateToProps = (state) => ({
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            logout,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScree);


