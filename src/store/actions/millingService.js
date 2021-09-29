import axios from 'axios'

import {
    SAVE_MILL_DATA, CLEAR_MILL_DATA, SAVE_MILL_QUALITY_DATA,
    CREATE_MILL, CREATE_MILL_SUCCESSFUL, CREATE_MILL_FAILED
} from './types';
import { baseUri } from '../../config'

export const saveMillData = (values) => {
    return {
        type: SAVE_MILL_DATA,
        payload: values
    }
}

export const saveMillQualityData = (values) => {
    return {
        type: SAVE_MILL_QUALITY_DATA,
        payload: values
    }
}

export const clearMillData = () => {
    return {type: CLEAR_MILL_DATA}
}

export const createMill = (values, userID, onSuccess = () => {}, onFailure = () => {}) => {
    const {date, product, subProduct, category, individual, mill, inputQualities, totalInput, outputQualities, totalOutput, totalPayable} = values;

    return async dispatch => {
        dispatch({type: CREATE_MILL});

        try {
            const response = await axios.post(`${baseUri}milling-createMill`, {
                date, product, subProduct, category, individual, mill, inputQualities, totalInput, outputQualities, totalOutput, totalPayable, userID
            })
            dispatch({type: CREATE_MILL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_MILL_FAILED})
            onFailure(err);
        }
    }
}