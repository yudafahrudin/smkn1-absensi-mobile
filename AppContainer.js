import React, { useEffect } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import { submitNotificationTokenLocal } from './src/actions/session'
import StackNavigation from './src/routes/stackNavigation';
import { Alert } from 'react-native';

// const Drawer = createDrawerNavigator();
const AppContainer = (props) => {
  const { user } = props;

  useEffect(() => {

    requestUserPermission();

    // when open notif
    messaging().onNotificationOpenedApp(async remoteMessage => {
      // navigation.navigate(remoteMessage.data.type);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    // on message reicive
    messaging().onMessage(async remoteMessage => {
      if (user) {
        if (user.type == 'siswa') {
          Alert.alert('PEMBERITAHUAN', remoteMessage.notification.body);
        }
      }
    });

  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    }
  }

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      props.actions.submitNotificationTokenLocal(fcmToken);
    } else {
      Alert.alert('Failed', 'No Token Received');
    }
  }


  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  )
}

const mapStateToProps = (state) => ({
  user: _.get(state.session, 'user'),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    submitNotificationTokenLocal
  }, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
