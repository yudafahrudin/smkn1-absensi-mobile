import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { Alert } from 'react-native';
import { PARENT_HOME, ALL_RECAP } from '../constants/actionTypes';
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

            console.log('response', data);

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
    // const params = {
    //     day: moment().format('ddd'),
    //     time: moment().format('HH:mm:ss'),
    //     date_absent: moment().format('YYYY-MM-DD')
    // };

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

export const submitAbsent = (scheduleId, userId, reasons) => (
    dispatch,
    getState,
) => {

    const params = {
        date_absent: moment().format('YYYY-MM-DD'),
        schedule_id: scheduleId,
        user_id: userId,
        reasons: reasons
    };

    return api(getState, dispatch, EndPoints.teacherAbsentSubmit, 'post', params).then(
        (response) => {
            const { data } = response;
            const { status } = data;

            console.log('post absent', response);

            if (status !== 'error') {
                Alert.alert('Berhasil', data.message);
                dispatch({
                    type: TEACHER_SUBMIT,
                    payload: { class_list: getState().teacher.absent.classToday }
                });
            }
        },
    );
};
