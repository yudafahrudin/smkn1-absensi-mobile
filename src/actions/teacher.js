import api from '../services/api';
import EndPoints from '../constants/endPoints';
import { TEACHER_ABSENT, TEACHER_HOME } from '../constants/actionTypes';
import moment from 'moment';

export const getHome = () => (
    dispatch,
    getState,
) => {
    const params = {
        date_absent: moment().format('YYYY-MM-DD')
    };

    return api(getState, dispatch, EndPoints.teacherHome, 'post', params).then(
        (response) => {
            const { data } = response;
            const { status } = data;
            if (status !== 'error') {
                dispatch({
                    type: TEACHER_HOME,
                    payload: { ...data.data }
                });
            }
        },
    );
};

export const getAbsent = () => (
    dispatch,
    getState,
) => {
    const params = {
        day: moment().format('ddd'),
        time: moment().format('h:mm:ss')
    };

    return api(getState, dispatch, EndPoints.teacherAbsent, 'post', params).then(
        (response) => {
            const { data } = response;
            const { status } = data;
            console.log('get absent', response);
            if (status !== 'error') {
                dispatch({
                    type: TEACHER_ABSENT,
                    payload: { ...data.data }
                });
            }
        },
    );
};
