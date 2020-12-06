import { TEACHER_HOME, TEACHER_ABSENT, TEACHER_SUBMIT, RESET_STATE } from '../constants/actionTypes';

const initialState = {
    home: [],
    absent: []
};

const reducer = (state = initialState, action) => {
    const { payload, type } = action;
    console.log('payload', payload);
    switch (type) {
        case TEACHER_HOME: {
            return {
                ...state,
                home: {
                    absenToday: payload.absents,
                    schedulesToday: payload.schedules
                }
            };
        }
        case TEACHER_ABSENT: {
            return {
                ...state,
                absent: {
                    scheduleToday: payload.schedule_today,
                    classToday: payload.class_list
                }
            };
        }
        case TEACHER_SUBMIT: {
            return {
                ...state,
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
