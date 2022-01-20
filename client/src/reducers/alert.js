import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initalState = [];

function alertReducer(state = initalState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert.id !== payload);
        default:
            return state;
    }
}

export default alertReducer;
