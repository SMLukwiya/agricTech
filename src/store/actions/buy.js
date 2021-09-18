import axios from 'axios';

import {
    FETCH_PURCHASES,
    BUY, BUY_SUCCESSFUL, BUY_FAILED, 
    SAVE_BUY_DATA, SAVE_BUY_METHOD 
} from './types'
import {baseUri} from '../../config'

export const buy = (values, onSuccess = () => {}, onFailure = () =>{}) => {
    const { farmer ,category,product, subproduct, quantity1, quantity2, totalWeight, totalAmount, paymentMethod } = values;

    return async dispatch => {
        dispatch({type: BUY});

        try {
            await axios.post(`${baseUri}buy-buyAgro`, {
                farmer ,category,product, subproduct, quantity1, quantity2, totalWeight, totalAmount, paymentMethod
            });

            dispatch({type: BUY_SUCCESSFUL});
            onSuccess();
        } catch (err) {
            dispatch({type: BUY_FAILED});
            onFailure(err)
        }
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