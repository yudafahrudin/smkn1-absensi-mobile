import React from 'react';
import { } from 'react-native';
import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from './src/routes/stackNavigation';

// const Drawer = createDrawerNavigator();
const AppContainer = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  )
}

const mapStateToProps = (state) => ({
  user: _.get(state.session, 'user'),
});

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({}, dispatch) });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
