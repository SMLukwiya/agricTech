import {
    SAVE_MILL_DATA, CLEAR_MILL_DATA,
    CREATE_MILL, CREATE_MILL_SUCCESSFUL, CREATE_MILL_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    date: '',
    product: '',
    subProduct: '',
    category: '',
    individual: '',
    mill: 'Miller 1',
    inputQuality: '',
    inputQuantity1: '',
    inputQuantity2: '', 
    totalInput: '', 
    outputQuality: '', 
    outputQuantity1: '', 
    outputQuantity2: '', 
    totalOutput: '',
    pricePerUnit: '',
    totalPayable: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SAVE_MILL_DATA:
            return {
                ...state,
                date: action.payload.date,
                product: action.payload.product,
                subProduct: action.payload.subProduct,
                category: action.payload.category,
                individual: action.payload.individual,
                inputQuality: action.payload.inputQuality,
                inputQuantity1: action.payload.inputQuantity1,
                inputQuantity2: action.payload.inputQuantity2, 
                totalInput: action.payload.totalInput, 
                outputQuality: action.payload.outputQuality,
                outputQuantity1: action.payload.outputQuantity1,
                outputQuantity2: action.payload.outputQuantity2,
                totalOutput: action.payload.totalOutput,
                pricePerUnit: action.payload.pricePerUnit,
                totalPayable: action.payload.totalPayable,
            }

        case CLEAR_MILL_DATA:
            return {
                ...state,
                date: '',
                product: '',
                subProduct: '',
                category: '',
                individual: '',
                inputQuality: '',
                inputQuantity1: '',
                inputQuantity2: '', 
                totalInput: '', 
                outputQuality: '', 
                outputQuantity1: '', 
                outputQuantity2: '', 
                totalOutput: '',
                pricePerUnit: '',
                totalPayable: '',
            }
    

        case CREATE_MILL:
            return {
                ...state,
                loading: true
            }

        case CREATE_MILL_SUCCESSFUL:
            return {
                ...state,
                loading: false
            }

        case CREATE_MILL_FAILED:
            return {
                ...state,
                loading: false
            }

        default:
            return {...state}
    }
}