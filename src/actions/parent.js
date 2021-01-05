import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { Alert } from 'react-native';
import { PARENT_HOME, ALL_RECAP, PARENT_SUBMIT } from '../constants/actionTypes';
import moment from 'moment';

export const getHomeParent = () => (
    dispatch,
    getState,
) => {
    const params = {
        date: moment().format('X')
    };
    console.log(params);
    return api(getState, dispatch, EndPoints.parentHome, 'post', params).then(
        (response) => {
            const { data } = response;
            const { status } = data;
            console.log('response 1 1 1 1', data);
            if (status !== 'error') {
                dispatch({
                    type: PARENT_HOME,
                    payload: { ...data.data }
                });
            }
        },
    );
};

export const getAllRecapitulationParent = () => (
    dispatch,
    getState,
) => {
    return api(getState, dispatch, EndPoints.allRecapitulation, 'get').then(
        (response) => {
            const { data } = response;
            const { status } = data;
            console.log(data);

            if (status !== 'error') {
                dispatch({
                    type: ALL_RECAP,
                    payload: { ...data.data }
                });
            }
        },
    );
};

export const submitAbsentParent = (params) => (
    dispatch,
    getState,
) => {
    return api(
        getState,
        dispatch,
        EndPoints.parentAbsentSubmit,
        'post',
        params,
        { 'Content-Type': 'multipart/form-data' }
    ).then((response) => {

        const { data } = response;
        const { status } = data;

        if (status !== 'error') {
            Alert.alert('Berhasil', data.message);
            dispatch({
                type: PARENT_SUBMIT,
            });
        } else {
            return response;
        }
        return response;
    },
    );
};
