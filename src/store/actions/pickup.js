import axios from 'axios';

import {
    PICKUP, PICKUP_FAILED, PICKUP_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const createPickup = (customer, onSucess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({ type: PICKUP })

        try {
            await axios.post(`${baseUri}pickup-pickup`, { customer })
            dispatch({type: PICKUP_SUCCESSFUL});
            onSucess()
        } catch (err) {
            dispatch({type: PICKUP_FAILED});
            onFailure(err);
        }
    }
}