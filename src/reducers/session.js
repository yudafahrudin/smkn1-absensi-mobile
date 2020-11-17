import { USER, RESET_STATE } from '../constants/actionTypes';

const initialState = {
  user: null,
};

const reducer = (state = initialState, action) => {
  const {payload, type} = action;
  switch (type) {
    case USER: {
      return {
        ...state,
        user: payload.user,
        token: payload.token,
      };
    }
    case RESET_STATE: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
