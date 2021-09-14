import auth from '@react-native-firebase/auth';
import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    LOGOUT,LOGOUT_SUCCESSFUL, LOGOUT_FAILED,
    RESET_LOADERS
 } from './types';

 export const resetLoaders = () => {
     return ({type: RESET_LOADERS});
 }

export const userEmailSignup = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {email, password, fullName, phone} = values;

    return async dispatch => {
        dispatch({type: USER_EMAIL_SIGNUP});

        try {
            const response = await auth().createUserWithEmailAndPassword(email.trim(), password.trim());
            const idToken = await auth().currentUser.getIdToken();

            dispatch({
                type: USER_EMAIL_SIGNUP_SUCCESSFUL,
                payload: {response, idToken}
            });
            onSuccess();
        } catch (err) {
            dispatch({
                type: USER_EMAIL_SIGNUP_FAILED,
                payload: err.code
            })
            onFailure();
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
            console.log('signout')
            onSuccess();
        } catch (err) {
            dispatch({ type: LOGOUT_FAILED });
            onFailure(err);
        }
    }
}