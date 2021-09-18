import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    LOGOUT, LOGOUT_FAILED, LOGOUT_SUCCESSFUL,
    RESET_LOADERS,
    USER_GOOGLE_LOGIN,
    USER_GOOGLE_LOGIN_FAILED,
    USER_GOOGLE_LOGIN_SUCCESSFUL,
    USER_GOOGLE_SIGNUP_SUCCESSFUL,
    USER_GOOGLE_SIGNUP,
    USER_GOOGLE_SIGNUP_FAILED
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
                loading: false,
                error: ''
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
                loading: false,
                error: action.payload
            }

        case USER_GOOGLE_SIGNUP:
            return {
                ...state,
                loading: true
            }

        case USER_GOOGLE_SIGNUP_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                userID: action.payload.uid,
                userEmail: action.payload.email,
                userToken: action.payload.idToken
            }

        case USER_GOOGLE_SIGNUP_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
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
                loading: false,
                error: action.payload
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