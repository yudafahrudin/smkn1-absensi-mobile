import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import AppContainer from './AppContainer';
import { store, persistor } from './src/store';

const App: () => React$Node = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContainer />
      </PersistGate>
    </Provider>

  );
};

export default App;
