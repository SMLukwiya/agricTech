import axios from 'axios';

import {
    PICKUP, PICKUP_FAILED, PICKUP_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const createPickup = (values, onSucess = () => {}, onFailure = () => {}) => {
    const { customer, email, phone } = values;

    return async dispatch => {
        dispatch({ type: PICKUP })

        try {
            await axios.post(`${baseUri}pickup-pickup`, { customer, email, phone })
            dispatch({type: PICKUP_SUCCESSFUL});
            onSucess()
        } catch (err) {
            dispatch({type: PICKUP_FAILED});
            onFailure(err);
        }
    }
}