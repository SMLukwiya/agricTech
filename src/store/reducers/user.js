import { FastField } from 'formik';
import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    LOGOUT, LOGOUT_FAILED, LOGOUT_SUCCESSFUL,
    RESET_LOADERS
} from '../actions/types';

const INITIAL_STATE = {
    userID: '',
    userToken: '',
    userEmail: '',
    loading: false,
    error: ''
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case RESET_LOADERS:
            return {
                ...state,
                loading: false
            }

        case USER_EMAIL_SIGNUP:
            return {
                ...state,
                loading: true
            }

        case USER_EMAIL_SIGNUP_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                userID: action.payload.response.user.uid,
                userEmail: action.payload.response.user.email,
                userToken: action.payload.idToken
            }

        case USER_EMAIL_SIGNUP_FAILED:
            return {
                ...state,
                loading: false
            }

        case LOGIN_EMAIL:
            return {
                ...state,
                loading: true
            }

        case LOGIN_EMAIL_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                userID: action.payload.response.user.uid,
                userEmail: action.payload.response.user.email,
                userToken: action.payload.idToken
            }

        case LOGIN_EMAIL_FAILED:
            return {
                loading: false
            }
        
        case LOGOUT:
            return {
                loading: false,
                userID: '',
                userEmail: '',
                userToken: ''
            }

        default:
            return state;
    }
}