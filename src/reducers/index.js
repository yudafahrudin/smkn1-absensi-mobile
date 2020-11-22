import { combineReducers } from 'redux';
import session from './session';
import teacher from './teacher';

const rootReducer = combineReducers({
  session,
  teacher
});

export default rootReducer;
