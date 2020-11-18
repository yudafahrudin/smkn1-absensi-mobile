import React from 'react';
import { StatusBar } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { bindActionCreators } from 'redux';
import TabNavigation from './src/routes/tabNavigation';
import StackNavigation from './src/routes/stackNavigation';

const AppContainer = (props) => {
  const { user } = props;
  return (
    <>
      <StatusBar barStyle="dark-content" />
      {user ? <TabNavigation /> : <StackNavigation />}
    </>
  );
}

const mapStateToProps = (state) => ({
  user: _.get(state.session, 'user'),
});

const mapDispatchToProps = dispatch => ({ actions: bindActionCreators({}, dispatch) });

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppContainer);
