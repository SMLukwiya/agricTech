import {
    PICKUP, PICKUP_FAILED, PICKUP_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case PICKUP:
            return {
                ...state,
                loading: true
            }
        
        case PICKUP_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case PICKUP_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }
}