import axios from 'axios';

import {
    FETCH_SUPPLIERS,
    CREATE_SUPPLIER, CREATE_SUPPLIER_FAILED, CREATE_SUPPLIER_SUCCESSFUL,
    UPDATE_SUPPLIER, UPDATE_SUPPLIER_FAILED, UPDATE_SUPPLIER_SUCCESSFUL,
    DELETE_SUPPLIER, DELETE_SUPPLIER_FAILED, DELETE_SUPPLIER_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const fetchSuppliers = (suppliers) => {
    return {
        type: FETCH_SUPPLIERS,
        payload: suppliers
    }
}

export const createSupplier = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { category, values: {name, phone, email, address} } = values;

    return async dispatch => {
        dispatch({type: CREATE_SUPPLIER});

        try {
            await axios.post(`${baseUri}supplier-createSupplier`, {
                category, name, phone, email, address: address ? address : ''
            });
            dispatch({
                type: CREATE_SUPPLIER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: CREATE_SUPPLIER_FAILED
            });
            onFailure(err);
        }
    }
}

export const updateSupplier = (uid, values, onSuccess = () => {}, onFailure = () => {}) => {
    const {fullName, phoneNumber, email, location, category} = values;

    return async dispatch => {
        dispatch({type: UPDATE_SUPPLIER});

        try {
            await axios.post(`${baseUri}supplier-updateSupplier`, {
                uid, category, name: fullName, phone: phoneNumber, email, address: location
            });
            dispatch({
                type: UPDATE_SUPPLIER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: UPDATE_SUPPLIER_FAILED
            });
            onFailure(err);
        }
    }
}

export const deleteSupplier = (uid, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: DELETE_SUPPLIER});

        try {
            await axios.post(`${baseUri}supplier-deleteSupplier`, {
                uid
            });
            dispatch({
                type: DELETE_SUPPLIER_SUCCESSFUL
            });
            onSuccess();
        } catch (err) {
            console.log(err)
            dispatch({
                type: DELETE_SUPPLIER_FAILED
            });
            onFailure(err);
        }
    }
}