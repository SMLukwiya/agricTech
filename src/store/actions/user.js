import auth from '@react-native-firebase/auth';
import axios from 'axios';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    USER_GOOGLE_SIGNUP, USER_GOOGLE_SIGNUP_FAILED, USER_GOOGLE_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    USER_GOOGLE_LOGIN, USER_GOOGLE_LOGIN_FAILED, USER_GOOGLE_LOGIN_SUCCESSFUL,
    LOGOUT,LOGOUT_SUCCESSFUL, LOGOUT_FAILED,
    RESET_LOADERS, UPDATE_USER,
    UPLOAD_AVATAR, UPLOAD_AVATAR_FAILED, UPLOAD_AVATAR_SUCCESSFUL
 } from './types';
import {baseUri} from '../../config';
import { ref } from 'yup';

 export const resetLoaders = () => {
     return ({type: RESET_LOADERS});
 }

 export const updateUser = (values) => {
     return {type: UPDATE_USER, payload: values}
 }

export const userEmailSignup = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {email, password, fullName, phoneNumber} = values;

    return async dispatch => {
        dispatch({type: USER_EMAIL_SIGNUP});

        try {
            const response = await auth().createUserWithEmailAndPassword(email.trim(), password.trim());
            const { user: {uid} } = response;
            const idToken = await auth().currentUser.getIdToken();
            await axios.post(`${baseUri}users-createUser`, {
                uid, fullName, email, phone: phoneNumber
            })

            dispatch({
                type: USER_EMAIL_SIGNUP_SUCCESSFUL,
                payload: {response, idToken}
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: USER_EMAIL_SIGNUP_FAILED,
                payload: err.code ? err.code : err
            })
            onFailure(err);
        }
    }
}

export const googleSignup = (values) => {
    const {uid, fullName, email, phone, idToken} = values;

    return async dispatch => {
        dispatch({type: USER_GOOGLE_SIGNUP});

        try {
            await axios.post(`${baseUri}users-createUser`, {
                uid, fullName, email, phone: phone ? phone : ''
            })

            dispatch({
                type: USER_GOOGLE_SIGNUP_SUCCESSFUL,
                payload: {uid, email, idToken}
            });
            
        } catch (err) {
            dispatch({
                type: USER_GOOGLE_SIGNUP_FAILED,
                payload: err
            });
        }
    }
}

export const loginEmail = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {emailorphonenumber, password} = values;

    return async dispatch => {
        dispatch({type: LOGIN_EMAIL});

        try {
            const response = await auth().signInWithEmailAndPassword(emailorphonenumber, password);
            const idToken = await auth().currentUser.getIdToken();

            dispatch({
                type: LOGIN_EMAIL_SUCCESSFUL,
                payload: {response, idToken}
            });
            onSuccess();

        } catch (err) {
            dispatch({
                type: LOGIN_EMAIL_FAILED,
                payload: err.code
            });
            onFailure(err);
        }
    }
}

export const logout = (_, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: LOGOUT});

        try {
            const response = await auth().signOut()
            dispatch({ type: LOGOUT_SUCCESSFUL });
            onSuccess();
        } catch (err) {
            dispatch({ type: LOGOUT_FAILED });
            onFailure(err);
        }
    }
}

export const updateProfileImage = (image, uid, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: UPLOAD_AVATAR})
        const fileName = Date.now() + '.' + image.fileName.split('.')[1];

        try {
            const reference = storage().ref(`userAvatars/${fileName}`);
            const response = await reference.putFile(image.uri);

            const imageUrl = await reference.getDownloadURL();
            await firestore().collection('users').doc(uid).update({ imageUrl })

            dispatch({
                type: UPLOAD_AVATAR_SUCCESSFUL,
                payload: image
            })
            onSuccess();
        } catch (err) {
            dispatch({type: UPLOAD_AVATAR_FAILED})
            onFailure(err);
        }
    }
}