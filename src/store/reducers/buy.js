import {
    FETCH_PURCHASES,
    SAVE_BUY_DATA, SAVE_BUY_METHOD, CLEAR_BUY_DATA,
    BUY, BUY_FAILED, BUY_SUCCESSFUL, SAVE_BUY_QUALITY
} from '../actions/types';

const INITIAL_STATE = {
    purchases: [],
    date: "",
    individual: "",
    category: "",
    product: "",
    subproduct: "",
    qualities: {},
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
            let newQualities = {...state.qualities}
            newQualities[action.payload.quality] = {
                totalWeight: action.payload.totalWeight,
                pricePerUnit: action.payload.pricePerUnit,
                totalAmount: action.payload.totalAmount
            }

            let exists = state.qualities[action.payload.quality]
            let prevAmount = `${parseInt(exists && exists.totalWeight ? exists.totalWeight : '0')}` * `${parseInt(exists && exists.pricePerUnit ? exists.pricePerUnit : '0')}`
            
            return {
                ...state,
                date: action.payload.date,
                individual: action.payload.individual,
                category: action.payload.category,
                product: action.payload.product,
                subproduct: action.payload.subProduct,
                qualities: newQualities,
                totalWeight: `${parseInt(state.totalWeight === '' ? '0' : state.totalWeight) - `${parseInt(exists && exists.totalWeight ? exists.totalWeight : '0')}` + parseInt(action.payload.totalWeight)}`,
                totalAmount: `${parseInt(state.totalAmount === '' ? '0' : state.totalAmount) - prevAmount + parseInt(action.payload.totalAmount)}`
            }

        case SAVE_BUY_QUALITY:
            let newQualitiesPerProduct = {...state.qualities}
            newQualitiesPerProduct[action.payload.quality] = {
                totalWeight: action.payload.totalWeight,
                pricePerUnit: action.payload.pricePerUnit,
                totalAmount: action.payload.totalAmount
            }

            let existsInput = state.qualities[action.payload.quality]
            let prevAmountInput = `${parseInt(existsInput && existsInput.totalWeight ? existsInput.totalWeight : '0')}` * `${parseInt(existsInput && existsInput.pricePerUnit ? existsInput.pricePerUnit : '0')}`
            console.log(prevAmountInput, state.totalAmount)
            return {
                ...state,
                qualities: newQualitiesPerProduct,
                totalWeight: `${parseInt(state.totalWeight === '' ? '0' : state.totalWeight) - `${parseInt(existsInput && existsInput.totalWeight ? existsInput.totalWeight : '0')}` + parseInt(action.payload.totalWeight)}`,
                totalAmount: `${parseInt(state.totalAmount === '' ? '0' : state.totalAmount) - prevAmountInput + parseInt(action.payload.totalAmount)}`
            }

        case SAVE_BUY_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            }

        case CLEAR_BUY_DATA:
            return {
                ...state,
                date: "",
                individual: "",
                category: "",
                product: "",
                subproduct: "",
                qualities: {},
                totalWeight: "",
                totalAmount: "",
                paymentMethod: "cash",
                error: ""
            }

        default:
            return {...state}
    }
}