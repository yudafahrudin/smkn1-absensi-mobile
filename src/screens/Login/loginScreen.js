import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    StatusBar,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
// import { login } from '../../actions/session';
import Icon from 'react-native-vector-icons/AntDesign';
import { Button, Text, Input, Card } from 'react-native-elements';
import FormInput from './Components/formInput';

usernameInput = null;
passwordInput = null;

const LoginScreen = (prop) => {

    const [username, setUsername] = useState(0);
    const [password, setPassword] = useState(0);
    const [usernameValid, setUsernameValid] = useState(1);
    const [passwordValid, setpasswordValid] = useState(1);

    return (
        <KeyboardAvoidingView>
            <Card>
                <Card.Title>SMKN1 Absensi</Card.Title>
                <Card.Divider />
                <FormInput
                    refInput={(input) => (usernameInput = input)}
                    icon="user"
                    value={username}
                    onChangeText={(username) => setUsername(username)}
                    placeholder="Username"
                    returnKeyType="next"
                    errorMessage={
                        usernameValid ? null : "Your username can't be blank"
                    }
                    onSubmitEditing={() => {
                        this.validateUsername();
                        this.emailInput.focus();
                    }}
                />
                <FormInput
                    refInput={(input) => (passwordInput = input)}
                    icon="lock"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    placeholder="Password"
                    secureTextEntry
                    returnKeyType="next"
                    errorMessage={
                        passwordValid ? null : 'Please enter at least 8 characters'
                    }
                    onSubmitEditing={() => {
                        this.validatePassword();
                        this.confirmationPasswordInput.focus();
                    }}
                />
                <Button title={'MASUK'} />
            </Card>
        </KeyboardAvoidingView>
    );
}

export default LoginScreen;