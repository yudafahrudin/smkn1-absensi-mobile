import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { USER, USER_NOTIFICATION_TOKEN } from '../constants/actionTypes';

export const login = (username, password, type, afterSuccess, afterError) => (
  dispatch,
  getState,
) => {
  const params = {
    nip: null,
    nis: null,
    password,
    type
  };

  if (type == 'guru') {
    params.nip = username
  }
  if (type == 'siswa') {
    params.nis = username
  }

  return api(getState, dispatch, EndPoints.login, 'post', params).then(
    (response) => {
      const { data } = response;
      const { status } = data;
      if (status !== 'error') {
        dispatch({
          type: USER,
          payload: {
            user: data.user,
            token: data.access_token,
          },
        });
        setTimeout(() => afterSuccess(), 500)
      } else {
        throw new Error
      }
    },
  )
};

export const updateprofile = (data) => (dispatch, getState) => {
  return api(getState, dispatch, EndPoints.updateProfile, 'post', data).then(
    (response) => {
      const { data } = response;
      console.log(data);
      dispatch({
        type: USER,
        payload: {
          user: data.data.user,
          token: data.data.token,
        },
      });
    },
  );
};

export const submitNotificationTokenLocal = (data) => (dispatch, getState) => {
  return dispatch({
    type: USER_NOTIFICATION_TOKEN,
    payload: {
      notification_token: data,
    },
  });
};

export const submitNotificationToken = (token = null) => (dispatch, getState) => {

  const params = {
    notification_token: token
  }

  return api(getState, dispatch, EndPoints.submitNotificationToken, 'post', params).then(
    () => {
      dispatch({
        type: USER_NOTIFICATION_TOKEN,
        payload: {
          notification_token: token,
        },
      });
    },
  );
};

export const logout = () => (dispatch) => {
  dispatch({
    type: 'RESET_STATE',
  })
};
