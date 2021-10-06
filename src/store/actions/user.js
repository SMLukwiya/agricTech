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
    UPLOAD_AVATAR, UPLOAD_AVATAR_FAILED, UPLOAD_AVATAR_SUCCESSFUL,
    UPDATE_USER_INFO, UPDATE_USER_INFO_SUCCESSFUL, UPDATE_USER_INFO_FAILED,
    UPDATE_PASSWORD, UPDATE_PASSWORD_FAILED, UPDATE_PASSWORD_SUCCESSFUL,
    UPDATE_GENDER,
    SEND_PASSWORD_RESET, SEND_PASSWORD_RESET_FAILED, SEND_PASSWORD_RESET_SUCCESSFUL,
    UPDATE_USER_EMAIL, UPDATE_USER_EMAIL_SUCCESSFUL, UPDATE_USER_EMAIL_FAILED,
    PHONE_SIGIN, PHONE_SIGNIN_FAILED, PHONE_SIGNIN_SUCCESSFUL
 } from './types';
import {baseUri} from '../../config';

 export const resetLoaders = () => {
     return ({type: RESET_LOADERS});
 }

 export const updateUser = (values) => {
     return {type: UPDATE_USER, payload: values}
 }

 export const updateGender = (values) => {
     return {type: UPDATE_GENDER, payload: values}
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
            let error = ''
            if (err.code === 'auth/email-already-in-use') {
                error = 'Email is already in use'
            } else if (err.code === 'auth/user-not-found') {
                error = 'This user does not exist'
            } else if (err.code === 'auth/wrong-password') {
                error = 'Password does not match'
            } else {
                error = err.response.data.error
            }

            dispatch({
                type: USER_EMAIL_SIGNUP_FAILED,
                payload: error
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
            console.log('Err', err)
            dispatch({
                type: USER_GOOGLE_SIGNUP_FAILED,
                payload: 'err'
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
            let error = ''
            if (err.code === 'auth/email-already-in-use') {
                error = 'Email is already in use'
            } else if (err.code === 'auth/user-not-found') {
                error = 'This user does not exist'
            } else if (err.code === 'auth/wrong-password') {
                error = 'Password does not match'
            } else {
                error = err.response.data.error
            }
            dispatch({
                type: LOGIN_EMAIL_FAILED,
                payload: error
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

export const phoneLogin = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {emailorphonenumber, password} = values;

    return async dispatch => {
        dispatch({type: PHONE_SIGIN});

        try {
            const res = await axios.post(`${baseUri}users-retrieveUser`, {phoneNumber: emailorphonenumber});
            const {data: {response: {email }}} = res;

            const response = await auth().signInWithEmailAndPassword(email, password);
            const idToken = await auth().currentUser.getIdToken();
            
            dispatch({
                type: PHONE_SIGNIN_SUCCESSFUL,
                payload: {response, idToken}
            })
            onSuccess()
        } catch (err) {
            dispatch({
                type: PHONE_SIGNIN_FAILED,
                payload: err.code
            });
            onFailure(err)
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

export const updateUserInfo = (uid, values, onSuccess = () => {}, onFailure = () => {}) => {
    const { fullName, phone, location, gender, about } = values;

    return async dispatch => {
        dispatch({type: UPDATE_USER_INFO});

        try {
            const response = await axios.post(`${baseUri}users-updateProfile`, {
                uid, fullName, phone, location, gender, about
            })
            dispatch({
                type: UPDATE_USER_INFO_SUCCESSFUL
            })
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_USER_INFO_FAILED});
            onFailure(err);
        }
    }
}

export const updatePassword = (uid, password, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_PASSWORD});

        try {
            const response = await axios.post(`${baseUri}users-changePassword`, {
                uid, password
            });
            dispatch({type: UPDATE_PASSWORD_SUCCESSFUL});
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_PASSWORD_FAILED});
            onFailure(err)
        }
    }
}

export const sendPasswordReset = (email, onSuccess = () => {}, onFailure = () => {}) => {

    const actionCodeSettings = {
        url: 'https://agro-waste-mobile-app.firebaseapp.com',
        iOS: {
          bundleId: 'com.metajua.metajua'
        },
        android: {
          packageName: 'com.metajua.metajua',
          installApp: true,
          minimumVersion: '1'
        },
        handleCodeInApp: false,
        dynamicLinkDomain: 'metajua.page.link'
      }

    return async dispatch => {
        dispatch({type: SEND_PASSWORD_RESET});

        try {
            await auth().sendPasswordResetEmail(email, actionCodeSettings)
            dispatch({type: SEND_PASSWORD_RESET_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: SEND_PASSWORD_RESET_FAILED});
            onFailure(err);
        }
    }
}

export const updateUserEmail = (userID, email, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_USER_EMAIL});

        try {
            await axios.post(`${baseUri}users-updateUserEmail`, {userID, email})
            dispatch({type: UPDATE_USER_EMAIL_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_USER_EMAIL_FAILED});
            onFailure(err);
        }
    }
}