import {
    SAVE_BATCHMILL_DATA, CLEAR_BATCHMILL_DATA,
    CREATE_BATCH_MILL, CREATE_BATCH_MILL_FAILED, CREATE_BATCH_MILL_SUCCESSFUL
} from '../actions/types';

const INITIAL_STATE = {
    date: '',
    product: '',
    subProduct: '',
    mill: '',
    inputQuality: '',
    inputQuantity1: '',
    inputQuantity2: '', 
    totalInput: '', 
    outputQuality: '', 
    outputQuantity1: '', 
    outputQuantity2: '', 
    totalOutput: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SAVE_BATCHMILL_DATA:
            return {
                ...state,
                date: action.payload.date,
                product: action.payload.product,
                subProduct: action.payload.subProduct,
                mill: action.payload.mill,
                inputQuality: action.payload.inputQuality,
                inputQuantity1: action.payload.inputQuantity1,
                inputQuantity2: action.payload.inputQuantity2, 
                totalInput: action.payload.totalInput, 
                outputQuality: action.payload.outputQuality, 
                outputQuantity1: action.payload.outputQuantity1, 
                outputQuantity2: action.payload.outputQuantity2, 
                totalOutput: action.payload.totalOutput,
            }

        case CLEAR_BATCHMILL_DATA:
            return {
                ...state,
                date: '',
                product: '',
                subProduct: '',
                mill: '',
                inputQuality: '',
                inputQuantity1: '',
                inputQuantity2: '', 
                totalInput: '', 
                outputQuality: '', 
                outputQuantity1: '', 
                outputQuantity2: '', 
                totalOutput: '',
            }

        case CREATE_BATCH_MILL:
            return {
                ...state,
                loading: true
            }

        case CREATE_BATCH_MILL_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case CREATE_BATCH_MILL_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }
}