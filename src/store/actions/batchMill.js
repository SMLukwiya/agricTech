import axios from 'axios'

import {
    SAVE_BATCHMILL_DATA, CLEAR_BATCHMILL_DATA,
    CREATE_BATCH_MILL, CREATE_BATCH_MILL_FAILED, CREATE_BATCH_MILL_SUCCESSFUL,
    SAVE_BATCHMILL_QUALITY_DATA
} from './types';
import { baseUri } from '../../config'

export const saveBatchMillData = (values) => {
    return {
        type: SAVE_BATCHMILL_DATA,
        payload: values
    }
}

export const saveBatchQualityData = (values) => {
    return {
        type: SAVE_BATCHMILL_QUALITY_DATA,
        payload: values
    }
}

export const clearBatchData = () => {
    return {type: CLEAR_BATCHMILL_DATA}
}

export const createBatchMill = (values, userID, onSuccess = () => {}, onFailure = () => {}) => {
    const {date, product, subProduct, mill, inputQualities, totalInput, outputQualities, totalOutput, miller} = values;

    return async dispatch => {
        dispatch({type: CREATE_BATCH_MILL});

        try {
            const response = await axios.post(`${baseUri}milling-createStockMill`, {
                date, product, subProduct, mill, inputQualities, totalInput, outputQualities, totalOutput, userID, miller
            })
            dispatch({type: CREATE_BATCH_MILL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_BATCH_MILL_FAILED})
            onFailure(err);
        }
    }
}