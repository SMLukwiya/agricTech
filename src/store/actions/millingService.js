import axios from 'axios'

import {
    SAVE_MILL_DATA, CLEAR_MILL_DATA,
    CREATE_MILL, CREATE_MILL_SUCCESSFUL, CREATE_MILL_FAILED
} from './types';
import { baseUri } from '../../config'

export const saveMillData = (values) => {
    return {
        type: SAVE_MILL_DATA,
        payload: values
    }
}

export const clearMillData = () => {
    return {type: CLEAR_MILL_DATA}
}

export const createMill = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {date, product, subProduct, category, individual, mill, inputQuality, inputQuantity1, inputQuantity2, totalInput, outputQuality, outputQuantity1, outputQuantity2, totalOutput, pricePerUnit, totalPayable} = values;

    return async dispatch => {
        dispatch({type: CREATE_MILL});

        try {
            const response = await axios.post(`${baseUri}milling-createMill`, {
                date, product, subProduct, category, individual, mill, inputQuality, inputQuantity1, inputQuantity2, totalInput, outputQuality, outputQuantity1, outputQuantity2, totalOutput, pricePerUnit, totalPayable
            })
            dispatch({type: CREATE_MILL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_MILL_FAILED})
            onFailure(err);
        }
    }
}