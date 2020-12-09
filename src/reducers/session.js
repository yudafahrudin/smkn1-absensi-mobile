import { USER, RESET_STATE, USER_NOTIFICATION_TOKEN } from '../constants/actionTypes';

const initialState = {
  user: null,
  token: null,
  notificationToken: null
};

const reducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case USER: {
      return {
        ...state,
        user: payload.user,
        token: payload.token,
      };
    }
    case USER_NOTIFICATION_TOKEN: {
      return {
        ...state,
        notificationToken: payload.notification_token,
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
