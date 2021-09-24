import { UPDATE_REMOTE_CONFIGS } from '../actions/types';

const INITIAL_STATE = {
    values: {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case UPDATE_REMOTE_CONFIGS:
            return {
                ...state,
                values: action.payload
            }

        default:
            return {...state}
    }
}