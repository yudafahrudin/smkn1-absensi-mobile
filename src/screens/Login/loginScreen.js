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
import { login } from '../../actions/session';
import { Picker } from '@react-native-picker/picker';
import { Button, Text, Input, Card } from 'react-native-elements';
import FormInput from './Components/formInput';

usernameInput = null;
passwordInput = null;

const LoginScreen = (props) => {

    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [type, setType] = useState("guru");
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setpasswordValid] = useState(true);
    const [disable, setDisable] = useState(false);

    const validateUsername = (username) => {
        if (!username) {
            setUsernameValid(false);
        }
        if (username) {
            setUsernameValid(true);
        }
    }
    const validatePassword = (password) => {
        if (!password) {
            setpasswordValid(false);
        }
        if (password) {
            setPassword(null);
            setpasswordValid(true);
        }
    }

    const navigateApp = (navigation) => {
        navigation.navigate('Home');
    }

    const onPressLogin = async (props) => {
        const { actions, navigation } = props;

        validateUsername(username);
        validatePassword(password);

        if (username && password) {
            console.log(12);
            await actions
                .login(username, password, type, () => navigateApp(navigation))
                .then()
        }

    };

    return (
        <KeyboardAvoidingView>
            <View style={{ justifyContent: 'center', height: '100%', padding: 10 }}>
                <Card>
                    <Card.Title style={{ fontSize: 25 }}>SMKN1 Absensi</Card.Title>
                    <Card.Divider />
                    <FormInput
                        refInput={(input) => (usernameInput = input)}
                        icon="user"
                        value={username}
                        onChangeText={(username) => setUsername(username)}
                        placeholder="NIS / NIP"
                        returnKeyType="next"
                        disabled={disable}
                        errorMessage={
                            usernameValid ? null : "Your username can't be blank"
                        }
                    />
                    <FormInput
                        refInput={(input) => (passwordInput = input)}
                        icon="lock"
                        value={password}
                        onChangeText={(password) => setPassword(password)}
                        placeholder="Password"
                        secureTextEntry
                        returnKeyType="next"
                        disabled={disable}
                        errorMessage={
                            passwordValid ? null : 'Please enter at least 8 characters'
                        }
                        onSubmitEditing={() => {
                            this.validatePassword();
                            this.confirmationPasswordInput.focus();
                        }}
                    />

                    <View style={{
                        borderRadius: 40,
                        borderWidth: 1,
                        borderColor: 'rgba(110, 120, 170, 1)',
                        marginBottom: 30,
                        marginHorizontal: 10
                    }}>
                        <Picker
                            selectedValue={type}
                            style={{
                                height: 45,
                                width: '100%'
                            }}
                            onValueChange={(itemValue, itemIndex) => {
                                setType(itemValue)
                            }}>
                            <Picker.Item label="Guru" value="guru" />
                            <Picker.Item label="Siswa" value="siswa" />
                        </Picker>
                    </View>

                    <Button title={'MASUK'} onPress={() => {
                        onPressLogin(props);
                    }} />
                </Card>
            </View>
        </KeyboardAvoidingView>
    );
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        {
            login,
        },
        dispatch,
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);