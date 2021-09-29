import axios from 'axios';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import {
    FETCH_SUPPLIERS,
    CREATE_SUPPLIER, CREATE_SUPPLIER_FAILED, CREATE_SUPPLIER_SUCCESSFUL,
    UPDATE_SUPPLIER, UPDATE_SUPPLIER_FAILED, UPDATE_SUPPLIER_SUCCESSFUL,
    DELETE_SUPPLIER, DELETE_SUPPLIER_FAILED, DELETE_SUPPLIER_SUCCESSFUL,
    UPDATE_SUPPLIER_AVATAR, UPDATE_SUPPLIER_AVATAR_FAILED, UPDATE_SUPPLIER_AVATAR_SUCCESSFUL
} from './types';
import {baseUri} from '../../config';

export const fetchSuppliers = (suppliers) => {
    return {
        type: FETCH_SUPPLIERS,
        payload: suppliers
    }
}

export const createSupplier = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const { category, values: { name, phone, email }, userID, location } = values;

    return async dispatch => {
        dispatch({type: CREATE_SUPPLIER});

        try {
            await axios.post(`${baseUri}supplier-createSupplier`, {
                category, name, phone, email, address: location, userID
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

export const updateSupplierImage = (image, uid, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: UPDATE_SUPPLIER_AVATAR})
        const fileName = Date.now() + '.' + image.fileName.split('.')[1];

        try {
            const reference = storage().ref(`supplierAvatar/${fileName}`);
            const response = await reference.putFile(image.uri);

            const imageUrl = await reference.getDownloadURL();
            await firestore().collection('suppliers').doc(uid).update({ imageUrl })

            dispatch({
                type: UPDATE_SUPPLIER_AVATAR_SUCCESSFUL,
                payload: image
            })
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_SUPPLIER_AVATAR_FAILED})
            onFailure(err);
        }
    }
}