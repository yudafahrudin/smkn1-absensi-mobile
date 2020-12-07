import { PARENT_HOME, PARENT_SUBMIT, ALL_RECAP, RESET_STATE } from '../constants/actionTypes';

const initialState = {
    home: {
        absenToday: [],
    },
    allRecap: []
};

const reducer = (state = initialState, action) => {
    const { payload, type } = action;
    switch (type) {
        case PARENT_HOME: {
            return {
                ...state,
                home: {
                    absenToday: payload.schedules_absent_today,
                }
            }
        }
        case ALL_RECAP: {
            return {
                ...state,
                allRecap: payload.all_recap,
            };
        }
        case PARENT_SUBMIT: {
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
