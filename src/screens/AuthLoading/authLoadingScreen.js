import React, { Component } from 'react';
import { View, Text } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        setTimeout(() => this.checkAuthentication(), 500);
    }

    checkAuthentication = () => {
        const { user, navigation } = this.props;
        if (user) {
            navigation.navigate('TabNav');
        } else {
            navigation.navigate('Login');
        }
    };

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center' }}>
                <View style={{ alignSelf: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                        Mohon Tunggu...
                    </Text>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    user: _.get(state.session, 'user'),
});

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen);
