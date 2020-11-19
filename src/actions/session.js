import { Alert } from 'react-native';
import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { USER } from '../constants/actionTypes';

export const login = (username, password, type, navigateSucces) => (
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
      console.log(response);
      const { data } = response;
      const { message } = data;
      if (message) {
      } else {
        dispatch({
          type: USER,
          payload: {
            user: data.user,
            token: data.access_token,
          },
        });
        setTimeout(() => navigateSucces(), 0);
      }
    },
  );
};

export const register = (
  {
    name,
    password,
    email,
    type,
    address,
    nama_kios,
    district_id,
    village_id,
    telp,
    latitude,
    longitude,
    jam_buka,
  },
  navigateSucces,
) => (dispatch, getState) => {
  const params = {
    name,
    password,
    email,
    address,
    type,
    district_id,
    village_id,
    nama_kios,
    telp,
    latitude,
    longitude,
    jam_buka,
  };
  return api(getState, dispatch, EndPoints.register, 'post', params)
    .then((response) => {
      console.log('inside session js', response);
      const { data } = response;
      const { msg } = data;
      if (msg) {
        Alert.alert('Error', response.data.msg);
      } else {
        Alert.alert('Berhasil', 'Berhasil mendaftarkan akun anda', [
          { text: 'OK', onPress: () => navigateSucces() },
        ]);
      }
    })
    .catch((err) => {
      Alert.alert('Error', JSON.stringify(err));
    });
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

export const logout = () => ({
  type: 'RESET_STATE',
});
