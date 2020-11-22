import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { USER } from '../constants/actionTypes';

export const login = (username, password, type, afterSuccess) => (
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
        setTimeout(() => afterSuccess(), 100)
      }
    },
  );
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

export const logout = (afterSuccess) => (dispatch) => {
  dispatch({
    type: 'RESET_STATE',
  })
  setTimeout(() => afterSuccess(), 0)
};
