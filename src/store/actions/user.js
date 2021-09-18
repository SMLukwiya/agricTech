import auth from '@react-native-firebase/auth';
import axios from 'axios';
import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    USER_GOOGLE_SIGNUP, USER_GOOGLE_SIGNUP_FAILED, USER_GOOGLE_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    USER_GOOGLE_LOGIN, USER_GOOGLE_LOGIN_FAILED, USER_GOOGLE_LOGIN_SUCCESSFUL,
    LOGOUT,LOGOUT_SUCCESSFUL, LOGOUT_FAILED,
    RESET_LOADERS
 } from './types';
import {baseUri} from '../../config';

 export const resetLoaders = () => {
     return ({type: RESET_LOADERS});
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