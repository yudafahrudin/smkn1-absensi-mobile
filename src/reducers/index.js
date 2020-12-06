import { combineReducers } from 'redux';
import session from './session';
import teacher from './teacher';
import parent from './parent';

const rootReducer = combineReducers({
  session,
  teacher,
  parent
});

export default rootReducer;
