/* eslint-disable arrow-parens */
import _ from 'lodash';
import axios from 'axios';
import { Alert } from 'react-native';
import EndPoints from '../constants/endPoints';

const insertFormData = (formData, key, value) => {
  if (_.isPlainObject(value)) {
    if (value.uri && value.type) {
      formData.append(key, value);
    } else {
      _.forEach(value, (v2, k2) => {
        insertFormData(formData, `${key}[${k2}]`, v2);
      });
    }
  } else if (_.isArray(value)) {
    _.forEach(value, (v2) => {
      insertFormData(formData, `${key}[]`, v2);
    });
  } else {
    formData.append(key, value);
  }
};

const transformFormData = (data) => {
  const form = new FormData();
  _.forEach(data, (v, k) => {
    insertFormData(form, k, v);
  });
  return form;
};

const api = (getState, dispatch, endPoint, method = 'get', params, headers) => {
  let headersData = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (getState) {
    const { token } = getState().session;
    headersData = {
      Authorization: token ? `Bearer ${token}` : '',
      ...headersData,
    };
  }

  const optionData = {
    method,
    url: `${EndPoints.BASE_URL}${endPoint}`,
    headers: {
      'Content-Type': 'application/json',
      ...headersData,
    },

    params: method === 'get' ? params : {},
    data: method === 'post' || method === 'put' ? params : undefined,
    transformRequest: [
      (requestData, requestHeaders) => {
        if (requestHeaders['Content-Type'] === 'multipart/form-data') {
          return transformFormData(requestData);
        }
        return JSON.stringify(params);
      },
    ],
  };

  console.log('option data', optionData);

  return axios(optionData)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      const { response } = error;
      Alert.alert('error', JSON.stringify(response.data.message));
      return response;
    });
};

export default api;
