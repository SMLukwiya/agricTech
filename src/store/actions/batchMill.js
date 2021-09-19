import axios from 'axios'

import {
    SAVE_BATCHMILL_DATA, CLEAR_BATCHMILL_DATA,
    CREATE_BATCH_MILL, CREATE_BATCH_MILL_FAILED, CREATE_BATCH_MILL_SUCCESSFUL
} from './types';
import { baseUri } from '../../config'

export const saveBatchMillData = (values) => {
    return {
        type: SAVE_BATCHMILL_DATA,
        payload: values
    }
}

export const clearBatchData = () => {
    return {type: CLEAR_BATCHMILL_DATA}
}

export const createBatchMill = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {date, product, subProduct, mill, inputQuality, inputQuantity1, inputQuantity2, totalInput, outputQuality, outputQuantity1, outputQuantity2, totalOutput} = values;

    return async dispatch => {
        dispatch({type: CREATE_BATCH_MILL});

        try {
            const response = await axios.post(`${baseUri}milling-createStockMill`, {
                date, product, subProduct, mill, inputQuality, inputQuantity1, inputQuantity2, totalInput, outputQuality, outputQuantity1, outputQuantity2, totalOutput
            })
            dispatch({type: CREATE_BATCH_MILL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_BATCH_MILL_FAILED})
            onFailure(err);
        }
    }
}