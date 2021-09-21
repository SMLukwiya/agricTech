import {
    SETUP_MILL, SETUP_MILL_FAILED, SETUP_MILL_SUCCESSFUL,
    UPDATE_MILL, SET_SELECTED_MILL, UPDATE_LOCATION,
    UPDATE_MILL_INFO, UPDATE_MILL_INFO_FAILED, UPDATE_MILL_INFO_SUCCESSFUL,
    ADD_MILL_LOCATION, ADD_MILL_LOCATION_FAILED, ADD_MILL_LOCATION_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    millers: [],
    locations: [],
    selectedMill: {},
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case UPDATE_MILL:
            return {
                ...state,
                millers: action.payload
            }

        case UPDATE_LOCATION:
            return {
                ...state,
                locations: action.payload
            }

        case SET_SELECTED_MILL:
            return {
                ...state,
                selectedMill: action.payload
            }

        case SETUP_MILL:
            return {
                ...state,
                loading: true
            }

        case SETUP_MILL_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case SETUP_MILL_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_MILL_INFO:
            return {
                ...state,
                loading: true
            }

        case UPDATE_MILL_INFO_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_MILL_INFO_FAILED:
            return {
                ...state,
                loading: false
            }

        case ADD_MILL_LOCATION:
            return {
                ...state,
                loading: true
            }

        case ADD_MILL_LOCATION_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case ADD_MILL_LOCATION_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }

}