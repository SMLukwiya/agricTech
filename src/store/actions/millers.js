import axios from "axios";

import {
    SETUP_MILL, SETUP_MILL_FAILED, SETUP_MILL_SUCCESSFUL,
    UPDATE_MILL, SET_SELECTED_MILL, UPDATE_LOCATION,
    UPDATE_MILL_INFO, UPDATE_MILL_INFO_FAILED, UPDATE_MILL_INFO_SUCCESSFUL,
    ADD_MILL_LOCATION, ADD_MILL_LOCATION_FAILED, ADD_MILL_LOCATION_SUCCESSFUL
} from './types';
import { baseUri } from '../../config';

export const updateMill = (values) => {
    return {
        type: UPDATE_MILL,
        payload: values
    }
}

export const setSelectedMill = (mill) => {
    return {
        type: SET_SELECTED_MILL,
        payload: mill
    }
}

export const updateLocations = (value) => {
    return {
        type: UPDATE_LOCATION,
        payload: value
    }
}

export const setupMill = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { name, location, capacity } = values;

    return async dispatch => {
        dispatch({type: SETUP_MILL});

        try {
            const response = await axios.post(`${baseUri}milling-setupMill`, {
                name, location, capacity
            });
            dispatch({type: SETUP_MILL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: SETUP_MILL_FAILED});
            onFailure(err);
        }
    }
}

export const updateMillInfo = (uid, values, onSuccess = () => {}, onFailure = () => {}) => {
    const { tin, certificate, capacity } = values;

    return async dispatch => {
        dispatch({type: UPDATE_MILL_INFO});

        try {
            const response = await axios.post(`${baseUri}milling-updateMill`, {
                uid, tin, certificate, capacity
            });
            dispatch({type: UPDATE_MILL_INFO_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_MILL_INFO_FAILED});
            onFailure(err);
        }
    }
}

export const addMillLocation = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { name, capacity, millID } = values;

    return async dispatch => {
        dispatch({type: ADD_MILL_LOCATION});

        try {
            const response = await axios.post(`${baseUri}milling-addLocation`, {
                name, capacity, millID
            });
            dispatch({type: ADD_MILL_LOCATION_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: ADD_MILL_LOCATION_FAILED});
            onFailure(err);
        }
    }
}

export const updateMillLocation = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { name, capacity, uid } = values;

    return async dispatch => {
        dispatch({type: ADD_MILL_LOCATION});

        try {
            const response = await axios.post(`${baseUri}milling-addLocation`, {
                name, capacity, uid
            });
            dispatch({type: ADD_MILL_LOCATION_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: ADD_MILL_LOCATION_FAILED});
            onFailure(err);
        }
    }
}