import {
    SAVE_MILL_DATA, CLEAR_MILL_DATA, SAVE_MILL_QUALITY_DATA,
    CREATE_MILL, CREATE_MILL_SUCCESSFUL, CREATE_MILL_FAILED
} from '../actions/types';

const INITIAL_STATE = {
    date: '',
    product: '',
    subProduct: '',
    category: '',
    individual: '',
    mill: '',
    inputQualities: {},
    totalInput: '', 
    outputQualities: {}, 
    totalOutput: '',
    totalPayable: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SAVE_MILL_QUALITY_DATA:
            // create unique id based on input and output quality
            let id = `${action.payload.inputQuality}-${action.payload.outputQuality}`

            let newInputQualitiesPerProduct = {...state.inputQualities}
            newInputQualitiesPerProduct[id] = {
                quality: action.payload.inputQuality,
                pricePerUnit: action.payload.pricePerUnit,
                totalInput: action.payload.totalInput,
            }

            let newOutputQualitiesPerProduct = {...state.outputQualities}
            newOutputQualitiesPerProduct[id] = {
                quality: action.payload.outputQuality,
                pricePerUnit: action.payload.pricePerUnit,
                totalOutput: action.payload.totalOutput
            }

            let existsInput = state.inputQualities[id];
            let existsOutput = state.outputQualities[id]
            let existingPay = `${parseInt((existsInput && existsInput.totalInput) ? existsInput.totalInput : '0')}` * `${parseInt(existsInput && existsInput.pricePerUnit ? existsInput.pricePerUnit : '0')}`

            return {
                ...state,
                inputQualities: newInputQualitiesPerProduct,
                totalInput: `${parseInt(state.totalInput === '' ? '0' : state.totalInput) - `${parseInt((existsInput && existsInput.totalInput) ? existsInput.totalInput : '0')}` + parseInt(action.payload.totalInput)}`,
                outputQualities: newOutputQualitiesPerProduct,
                totalOutput: `${parseInt(state.totalOutput === '' ? '0' : state.totalOutput) - `${parseInt((existsOutput && existsOutput.totalOutput) ? existsOutput.totalOutput : '0')}` + parseInt(action.payload.totalOutput)}`,
                totalPayable: `${parseInt(state.totalPayable === '' ? '0' : state.totalPayable) - existingPay + parseInt(action.payload.totalPayable)}`
            }

        case SAVE_MILL_DATA:
            let itemId = `${action.payload.inputQuality}-${action.payload.outputQuality}`

            let newInputQualities = {...state.inputQualities}
            newInputQualities[itemId] = {
                quality: action.payload.inputQuality,
                pricePerUnit: action.payload.pricePerUnit,
                totalInput: action.payload.totalInput
            }

            let newOutputQualities = {...state.outputQualities}
            newOutputQualities[itemId] = {
                quality: action.payload.outputQuality,
                pricePerUnit: action.payload.pricePerUnit,
                totalOutput: action.payload.totalOutput
            }

            let existsInp = state.inputQualities[itemId];
            let existOut = state.outputQualities[itemId];
            let existingPayable = `${parseInt((existsInp && existsInp.totalInput) ? existsInp.totalInput : '0')}` * `${parseInt(existsInp && existsInp.pricePerUnit ? existsInp.pricePerUnit : '0')}`

            return {
                ...state,
                date: action.payload.date,
                product: action.payload.product,
                subProduct: action.payload.subProduct,
                category: action.payload.category,
                individual: action.payload.individual,
                mill: action.payload.mill,
                inputQualities: newInputQualities,
                totalInput: `${parseInt(state.totalInput === '' ? '0' : state.totalInput) - `${parseInt((existsInp && existsInp.totalInput) ? existsInp.totalInput : '0')}` + parseInt(action.payload.totalInput)}`,
                outputQualities: newOutputQualities,
                totalOutput: `${parseInt(state.totalOutput === '' ? '0' : state.totalOutput) - `${parseInt((existOut && existOut.totalOutput) ? existOut.totalOutput : '0')}` + parseInt(action.payload.totalOutput)}`,
                totalPayable: `${parseInt(state.totalPayable === '' ? '0' : state.totalPayable) - existingPayable + parseInt(action.payload.totalPayable)}`
            }

        case CLEAR_MILL_DATA:
            return {
                ...state,
                date: '',
                product: '',
                subProduct: '',
                category: '',
                individual: '',
                mill: '',
                inputQuality: {},
                totalInput: '', 
                outputQuality: {},
                totalOutput: '',
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