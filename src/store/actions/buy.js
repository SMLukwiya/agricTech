import axios from 'axios';

import {
    FETCH_PURCHASES,
    BUY, BUY_SUCCESSFUL, BUY_FAILED, SAVE_BUY_QUALITY,
    SAVE_BUY_DATA, SAVE_BUY_METHOD, CLEAR_BUY_DATA
} from './types'
import {baseUri} from '../../config'

export const buy = (values, onSuccess = () => {}, onFailure = () =>{}) => {
    const { date, individual , category, product, subproduct, quality, quantity1, quantity2, pricePerUnit, totalWeight, totalAmount, paymentMethod } = values;

    return async dispatch => {
        dispatch({type: BUY});

        try {
            await axios.post(`${baseUri}buy-buyAgro`, {
                date, individual , category, product, subproduct, quality, quantity1, quantity2, pricePerUnit, totalWeight, totalAmount, paymentMethod
            });

            dispatch({type: BUY_SUCCESSFUL});
            onSuccess();
        } catch (err) {
            dispatch({type: BUY_FAILED});
            onFailure(err)
        }
    }
}

export const saveBuyQuality = (values) => {
    return {
        type: SAVE_BUY_QUALITY,
        payload: values
    }
}

export const saveBuyData = (values) => {
    return {
        type: SAVE_BUY_DATA,
        payload: values
    }
}

export const saveBuyMethod = (value) => {
    return {
        type: SAVE_BUY_METHOD,
        payload: value
    }
}

export const fetchPurchases = (value) => {
    return {
        type: FETCH_PURCHASES,
        payload: value
    }
}

export const clearBuyState = () => {
    return {type: CLEAR_BUY_DATA}
}