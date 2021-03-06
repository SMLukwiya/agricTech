import { 
    USER_EMAIL_SIGNUP, USER_EMAIL_SIGNUP_FAILED, USER_EMAIL_SIGNUP_SUCCESSFUL,
    LOGIN_EMAIL, LOGIN_EMAIL_FAILED, LOGIN_EMAIL_SUCCESSFUL,
    LOGOUT, LOGOUT_FAILED, LOGOUT_SUCCESSFUL,
    RESET_LOADERS, UPDATE_USER,
    USER_GOOGLE_LOGIN, USER_GOOGLE_LOGIN_FAILED, USER_GOOGLE_LOGIN_SUCCESSFUL,
    USER_GOOGLE_SIGNUP_SUCCESSFUL, USER_GOOGLE_SIGNUP, USER_GOOGLE_SIGNUP_FAILED,
    UPLOAD_AVATAR, UPLOAD_AVATAR_FAILED, UPLOAD_AVATAR_SUCCESSFUL,
    UPDATE_USER_INFO, UPDATE_USER_INFO_SUCCESSFUL, UPDATE_USER_INFO_FAILED,
    UPDATE_PASSWORD, UPDATE_PASSWORD_FAILED, UPDATE_PASSWORD_SUCCESSFUL,
    UPDATE_GENDER,
    SEND_PASSWORD_RESET, SEND_PASSWORD_RESET_FAILED, SEND_PASSWORD_RESET_SUCCESSFUL,
    UPDATE_USER_EMAIL, UPDATE_USER_EMAIL_SUCCESSFUL, UPDATE_USER_EMAIL_FAILED,
    PHONE_SIGIN, PHONE_SIGNIN_FAILED, PHONE_SIGNIN_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    userID: '',
    userToken: '',
    userEmail: '',
    loading: false,
    error: '',
    image: {},
    user: {},
    gender: []
};

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case RESET_LOADERS:
            return {
                ...state,
                loading: false,
                error: ''
            }

        case UPDATE_USER:
            return {
                ...state,
                user: {
                    ...action.payload
                }
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

        case UPLOAD_AVATAR:
            return {
                ...state,
                loading: true
            }

        case UPLOAD_AVATAR_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                image: {
                    ...action.payload
                }
            }

        case UPLOAD_AVATAR_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_USER_INFO:
            return {
                ...state,
                loading: true
            }

        case UPDATE_USER_INFO_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_USER_INFO_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_PASSWORD:
            return {
                ...state,
                loading: true
            }

        case UPDATE_PASSWORD_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_PASSWORD_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_GENDER: 
            return {
                ...state,
                gender: action.payload
            }

        case SEND_PASSWORD_RESET:
            return {
                ...state,
                loading: true
            }

        case SEND_PASSWORD_RESET_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case SEND_PASSWORD_RESET_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_USER_EMAIL:
            return {
                ...state,
                loading: true
            }

        case UPDATE_USER_EMAIL_SUCCESSFUL:
            return {
                ...state,
                loading: false
            } 
        
        case UPDATE_USER_EMAIL_FAILED:
            return {
                ...state,
                loading: false
            }

        case PHONE_SIGIN:
            return {
                ...state,
                loading: true
            }

        case PHONE_SIGNIN_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                userID: action.payload.response.user.uid,
                userEmail: action.payload.response.user.email,
                userToken: action.payload.idToken
            }
        case PHONE_SIGNIN_FAILED:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        default:
            return state;
    }
}