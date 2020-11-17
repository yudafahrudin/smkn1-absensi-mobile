import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from '../reducers';
import api from '../services/api';

    // setting presist data for reducer
const reducer = persistReducer({
    key: 'root',
    storage: AsyncStorage,
  }, rootReducer);

const configureStore = (initialState = {}) => {
  const middlewares = [thunk.withExtraArgument(api)];
    // for debuging redux ini development
  if (process.env.NODE_ENV === 'development') {
    middlewares.push(logger);
  }

  const enhancer = compose(applyMiddleware(...middlewares));

  return createStore(reducer, initialState, enhancer);
};

const store = configureStore();
const persistor = persistStore(store);
export { store, persistor };
