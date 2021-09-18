import {
    FETCH_PURCHASES,
    SAVE_BUY_DATA, SAVE_BUY_METHOD,
    BUY, BUY_FAILED, BUY_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    purchases: [],
    farmer: "",
    category: "",
    product: "",
    subproduct: "",
    quality: "",
    quantity1: "",
    quantity2: "",
    totalWeight: "",
    totalAmount: "",
    paymentMethod: "cash",
    error: "",
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case FETCH_PURCHASES:
            return {
                ...state,
                purchases: action.payload
            }

        case BUY:
            return {
                ...state,
                loading: true
            }

        case BUY_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case BUY_FAILED:
            return {
                ...state,
                loading: false
            }

        case SAVE_BUY_DATA:
            return {
                ...state,
                farmer: action.payload.individual,
                category: action.payload.category,
                product: action.payload.product,
                subproduct: action.payload.subProduct,
                quality: action.payload.quality,
                quantity1: action.payload.quantity1,
                quantity2: action.payload.quantity2,
                totalWeight: action.payload.totalWeight,
                totalAmount: action.payload.totalAmount
            }

        case SAVE_BUY_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            }

        default:
            return {...state}
    }
}