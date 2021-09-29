import axios from 'axios';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {
    FETCH_CUSTOMERS,
    CREATE_CUSTOMER, CREATE_CUSTOMER_FAILED, CREATE_CUSTOMER_SUCCESSFUL,
    UPDATE_CUSTOMER, UPDATE_CUSTOMER_FAILED, UPDATE_CUSTOMER_SUCCESSFUL,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILED, DELETE_CUSTOMER_SUCCESSFUL,
    UPDATE_CUSTOMER_AVATAR, UPDATE_CUSTOMER_AVATAR_FAILED, UPDATE_CUSTOMER_AVATAR_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const fetchCustomers = (suppliers) => {
    return {
        type: FETCH_CUSTOMERS,
        payload: suppliers
    }
}

export const createCustomer = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { category, values: {name, phone, email}, userID, location } = values;

    return async dispatch => {
        dispatch({type: CREATE_CUSTOMER});

        try {
            await axios.post(`${baseUri}customer-createCustomer`, {
                category, name, phone, email, address: location, userID
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
            dispatch({type: DELETE_CUSTOMER_SUCCESSFUL});
            onSuccess();
        } catch (err) {
            dispatch({type: DELETE_CUSTOMER_FAILED});
            onFailure(err);
        }
    }
}

export const updateCustomerImage = (image, uid, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: UPDATE_CUSTOMER_AVATAR})
        const fileName = Date.now() + '.' + image.fileName.split('.')[1];

        try {
            const reference = storage().ref(`customerAvatar/${fileName}`);
            const response = await reference.putFile(image.uri);

            const imageUrl = await reference.getDownloadURL();
            await firestore().collection('customers').doc(uid).update({ imageUrl })

            dispatch({
                type: UPDATE_CUSTOMER_AVATAR_SUCCESSFUL,
                payload: image
            })
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_CUSTOMER_AVATAR_FAILED})
            onFailure(err);
        }
    }
}