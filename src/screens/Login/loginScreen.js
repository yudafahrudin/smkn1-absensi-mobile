import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
    View,
    ActivityIndicator,
    KeyboardAvoidingView,
    ImageBackground,
} from 'react-native';
import _ from 'lodash';
import { login } from '../../actions/session';
import { Picker } from '@react-native-picker/picker';
import { Button, Overlay, Card, Text } from 'react-native-elements';
import FormInput from './Components/formInput';

usernameInput = null;
passwordInput = null;

const LoginScreen = (props) => {
    const bgImage = require('../../assets/images/classroom.jpg');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [type, setType] = useState("siswa");
    const [usernameValid, setUsernameValid] = useState(true);
    const [passwordValid, setpasswordValid] = useState(true);
    const [overlayActive, setOverlay] = useState(false);

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

    const afterSuccess = (navigation) => {
        navigation.navigate('TabNav');
        setOverlay(false)
    }

    const onPressLogin = async (props) => {
        const { actions, navigation } = props;

        validateUsername(username);
        validatePassword(password);

        if (username && password) {
            setOverlay(true);
            await actions.login(
                username,
                password,
                type,
                () => afterSuccess(navigation)
            ).catch(() => {
                setTimeout(() => setOverlay(false), 500)
            });
        }
    };

    return (
        <KeyboardAvoidingView>
            <ImageBackground
                source={bgImage}
                style={{ height: '100%', justifyContent: 'center' }}
            >
                <Overlay isVisible={overlayActive}>
                    <View>
                        <ActivityIndicator size="small" color="grey" />
                        <Text>Tunggu...</Text>
                    </View>
                </Overlay>
                <Card containerStyle={{ borderRadius: 10 }}>
                    <Card.Title style={{ fontSize: 25 }}>SMKN1 Absensi</Card.Title>
                    <Card.Divider />
                    <FormInput
                        refInput={(input) => (usernameInput = input)}
                        icon="user"
                        value={username}
                        onChangeText={(username) => setUsername(username)}
                        placeholder="NIS / NIP"
                        returnKeyType="next"
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
                        errorMessage={
                            passwordValid ? null : 'Please enter at least 8 characters'
                        }
                        onSubmitEditing={() => {
                            onPressLogin(props);
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

                    <Button
                        title={'MASUK'}
                        containerStyle={{ borderRadius: 30 }}
                        buttonStyle={{ backgroundColor: '#3b5998' }}
                        onPress={() => {
                            onPressLogin(props);
                        }} />
                </Card>
            </ImageBackground>
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