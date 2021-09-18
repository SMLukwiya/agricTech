import {
    FETCH_SUPPLIERS,
    CREATE_SUPPLIER, CREATE_SUPPLIER_FAILED, CREATE_SUPPLIER_SUCCESSFUL,
    UPDATE_SUPPLIER, UPDATE_SUPPLIER_FAILED, UPDATE_SUPPLIER_SUCCESSFUL,
    DELETE_SUPPLIER, DELETE_SUPPLIER_FAILED, DELETE_SUPPLIER_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    suppliers: [],
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_SUPPLIERS:
            return {
                ...state,
                suppliers: action.payload
            }

        case CREATE_SUPPLIER:
            return {
                ...state,
                loading: true
            }

        case CREATE_SUPPLIER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case CREATE_SUPPLIER_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_SUPPLIER:
            return {
                ...state,
                loading: true
            }
        
        case UPDATE_SUPPLIER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_SUPPLIER_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_SUPPLIER:
            return {
                ...state,
                loading: true
            }

        case DELETE_SUPPLIER_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_SUPPLIER_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }
}