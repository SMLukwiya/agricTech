import {
    FETCH_PRODUCTS, FETCH_SUBPRODUCTS, FETCH_QUALITIES, FETCH_CATEGORIES, FETCH_OUTPUT_QUALITIES,
    CREATE_PRODUCT, CREATE_PRODUCT_SUCCESSFUL, CREATE_PRODUCT_FAILED,
    CREATE_SUBPRODUCT, CREATE_SUBPRODUCT_SUCCESSFUL, CREATE_SUBPRODUCT_FAILED,
    CREATE_QUALITY, CREATE_QUALITY_SUCCESSFUL, CREATE_QUALITY_FAILED,
    CREATE_OUTPUT_QUALITY, CREATE_OUTPUT_QUALITY_FAILED, CREATE_OUTPUT_QUALITY_SUCCESSFUL,
    DELETE_PRODUCT, DELETE_PRODUCT_FAILED, DELETE_PRODUCT_SUCCESSFUL,
    SET_PRODUCT, SET_SUBPRODUCT, SET_QUALITY_NAME, FETCH_STOCKIN, FETCH_STOCKOUT,
    UPDATE_PRODUCT, UPDATE_PRODUCT_SUCCESSFUL, UPDATE_PRODUCT_FAILED,
    UPDATE_SUBPRODUCT, UPDATE_SUBPRODUCT_SUCCESSFUL, UPDATE_SUBPRODUCT_FAILED,
    UPDATE_INPUT_QUALITY,UPDATE_INPUT_QUALITY_SUCCESSFUL, UPDATE_INPUT_QUALITY_FAILED,
    UPDATE_OUTPUT_QUALITY, UPDATE_OUTPUT_QUALITY_SUCCESSFUL, UPDATE_OUTPUT_QUALITY_FAILED,
    DELETE_SUBPRODUCT, DELETE_SUBPRODUCT_SUCCESSFUL, DELETE_SUBPRODUCT_FAILED,
    DELETE_INPUT_QUALITY, DELETE_INPUT_QUALITY_SUCCESSFUL, DELETE_INPUT_QUALITY_FAILED,
    DELETE_OUTPUT_QUALITY, DELETE_OUTPUT_QUALITY_SUCCESSFUL, DELETE_OUTPUT_QUALITY_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    products: [],
    subProducts: [],
    qualities: [],
    outputQualities: [],
    categories: [],
    stockIn: [],
    stockOut: [],
    product: '',
    subProduct: '',
    quality: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_PRODUCTS:
            return {
                ...state,
                products: action.payload
            }

        case FETCH_SUBPRODUCTS:
            return {
                ...state,
                subProducts: action.payload
            }

        case FETCH_QUALITIES:
            return {
                ...state,
                qualities: action.payload
            }

        case FETCH_OUTPUT_QUALITIES:
            return {
                ...state,
                outputQualities: action.payload
            }

        case FETCH_CATEGORIES:
            return {
                ...state,
                categories: action.payload
            }

        case CREATE_PRODUCT:
            return {
                ...state,
                loading: true
            }

        case CREATE_PRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                product: action.payload
            }

        case CREATE_PRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case CREATE_SUBPRODUCT:
            return {
                ...state,
                loading: true
            }

        case CREATE_SUBPRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                subProduct: action.payload
            }

        case CREATE_SUBPRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case CREATE_QUALITY:
            return {
                ...state,
                loading: true
            }

        case CREATE_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false,
                quality: action.payload
            }

        case CREATE_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }

        case CREATE_OUTPUT_QUALITY:
            return {
                ...state,
                loading: true
            }

        case CREATE_OUTPUT_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case CREATE_OUTPUT_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_PRODUCT:
            return {
                ...state,
                loading: true
            }

        case DELETE_PRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_PRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case SET_PRODUCT:
            return {
                ...state,
                product: action.payload
            }

        case SET_SUBPRODUCT:
            return {
                ...state,
                subProduct: action.payload
            }

        case SET_QUALITY_NAME:
            return {
                ...state,
                quality: action.payload
            }

        case FETCH_STOCKIN:
            return {
                ...state,
                stockIn: action.payload
            }

        case FETCH_STOCKOUT:
            return {
                ...state,
                stockOut: action.payload
            }

        case UPDATE_PRODUCT:
            return {
                ...state,
                loading: true
            }

        case UPDATE_PRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_PRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_SUBPRODUCT:
            return {
                ...state,
                loading: true
            }

        case UPDATE_SUBPRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_SUBPRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_INPUT_QUALITY:
            return {
                ...state,
                loading: true
            }

        case UPDATE_INPUT_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_INPUT_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }

        case UPDATE_OUTPUT_QUALITY:
            return {
                ...state,
                loading: true
            }

        case UPDATE_OUTPUT_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case UPDATE_OUTPUT_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_SUBPRODUCT:
            return {
                ...state,
                loading: true
            }

        case DELETE_SUBPRODUCT_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_SUBPRODUCT_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_INPUT_QUALITY:
            return {
                ...state,
                loading: true
            }

        case DELETE_INPUT_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_INPUT_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }

        case DELETE_OUTPUT_QUALITY:
            return {
                ...state,
                loading: true
            }

        case DELETE_OUTPUT_QUALITY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case DELETE_OUTPUT_QUALITY_FAILED:
            return {
                ...state,
                loading: false
            }
        
        default:
            return {...state}
    }
}