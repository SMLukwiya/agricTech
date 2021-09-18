import axios from 'axios';

import {
    FETCH_CUSTOMERS,
    CREATE_CUSTOMER, CREATE_CUSTOMER_FAILED, CREATE_CUSTOMER_SUCCESSFUL,
    UPDATE_CUSTOMER, UPDATE_CUSTOMER_FAILED, UPDATE_CUSTOMER_SUCCESSFUL,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILED, DELETE_CUSTOMER_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const fetchCustomers = (suppliers) => {
    return {
        type: FETCH_CUSTOMERS,
        payload: suppliers
    }
}

export const createCustomer = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { category, values: {name, phone, email, address} } = values;

    return async dispatch => {
        dispatch({type: CREATE_CUSTOMER});

        try {
            await axios.post(`${baseUri}customer-createCustomer`, {
                category, name, phone, email, address: address ? address : ''
            });
            dispatch({
                type: CREATE_CUSTOMER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: CREATE_CUSTOMER_FAILED
            });
            onFailure(err);
        }
    }
}

export const updateCustomer = (uid, values, onSuccess = () => {}, onFailure = () => {}) => {
    const {fullName, phoneNumber, email, location, category} = values;

    return async dispatch => {
        dispatch({type: UPDATE_CUSTOMER});

        try {
            await axios.post(`${baseUri}customer-updateCustomer`, {
                uid, category, name: fullName, phone: phoneNumber, email, address: location
            });
            dispatch({
                type: UPDATE_CUSTOMER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: UPDATE_CUSTOMER_FAILED
            });
            onFailure(err);
        }
    }
}

export const deleteCustomer = (uid, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: DELETE_CUSTOMER});

        try {
            await axios.post(`${baseUri}customer-deleteCustomer`, {
                uid
            });
            dispatch({
                type: DELETE_CUSTOMER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            console.log(err)
            dispatch({
                type: DELETE_CUSTOMER_FAILED
            });
            onFailure(err);
        }
    }
}