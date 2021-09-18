import {
    FETCH_CUSTOMERS,
    CREATE_CUSTOMER, CREATE_CUSTOMER_FAILED, CREATE_CUSTOMER_SUCCESSFUL,
    UPDATE_CUSTOMER, UPDATE_CUSTOMER_FAILED, UPDATE_CUSTOMER_SUCCESSFUL,
    DELETE_CUSTOMER, DELETE_CUSTOMER_FAILED, DELETE_CUSTOMER_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    customers: [],
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_CUSTOMERS:
            return {
                ...state,
                customers: action.payload
            }

        case CREATE_CUSTOMER:
            return {
                ...state,
                loading: true
            }

        case CREATE_CUSTOMER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case CREATE_CUSTOMER_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_CUSTOMER:
            return {
                ...state,
                loading: true
            }
        
        case UPDATE_CUSTOMER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_CUSTOMER_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_CUSTOMER:
            return {
                ...state,
                loading: true
            }

        case DELETE_CUSTOMER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_CUSTOMER_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }
}