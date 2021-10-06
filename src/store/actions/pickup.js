import axios from 'axios';

import {
    PICKUP, PICKUP_FAILED, PICKUP_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const createPickup = (values, userID, onSucess = () => {}, onFailure = () => {}) => {
    const { customer, email, phone } = values;
    const dummyEmail = 'wastecustomer1@gmail.com'

    return async dispatch => {
        dispatch({ type: PICKUP })

        try {
            await axios.post(`${baseUri}pickup-pickup`, { customer, email: dummyEmail, phone, userID })
            dispatch({type: PICKUP_SUCCESSFUL});
            onSucess()
        } catch (err) {
            dispatch({type: PICKUP_FAILED});
            onFailure(err);
        }
    }
}