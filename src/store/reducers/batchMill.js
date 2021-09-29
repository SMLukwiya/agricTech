import {
    SAVE_BATCHMILL_DATA, CLEAR_BATCHMILL_DATA,
    CREATE_BATCH_MILL, CREATE_BATCH_MILL_FAILED, CREATE_BATCH_MILL_SUCCESSFUL,
    SAVE_BATCHMILL_QUALITY_DATA
} from '../actions/types';

const INITIAL_STATE = {
    date: '',
    product: '',
    subProduct: '',
    mill: '',
    inputQualities: {},
    totalInput: '',
    outputQualities: {},
    totalOutput: '',
    loading: false
}

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case SAVE_BATCHMILL_QUALITY_DATA:
            let newInputQualitiesPerProduct = {...state.inputQualities}
            let id = `${action.payload.inputQuality}-${action.payload.outputQuality}`
            newInputQualitiesPerProduct[id] = {
                quality: action.payload.inputQuality,
                totalInput: action.payload.totalInput
            }

            let newOutputQualitiesPerProduct = {...state.outputQualities}
            newOutputQualitiesPerProduct[id] = {
                quality: action.payload.outputQuality,
                totalOutput: action.payload.totalOutput
            }

            let existsInput = state.inputQualities[id];
            let existsOuput = state.outputQualities[id];

            return {
                ...state,
                inputQualities: newInputQualitiesPerProduct,
                totalInput: `${parseInt(state.totalInput === '' ? '0' : state.totalInput) - parseInt((existsInput && existsInput.totalInput) ? existsInput.totalInput : '0') + parseInt(action.payload.totalInput)}`,
                outputQualities: newOutputQualitiesPerProduct,
                totalOutput: `${parseInt(state.totalOutput === '' ? '0' : state.totalOutput) - parseInt((existsOuput && exists.totalOutput) ? existsOuput.totalOutput : '0') + parseInt(action.payload.totalOutput)}`
            }

        case SAVE_BATCHMILL_DATA:
            let newInputQualities = {...state.inputQualities}
            let itemId = `${action.payload.inputQuality}-${action.payload.outputQuality}`
            newInputQualities[itemId] = {
                quality: action.payload.inputQuality,
                totalInput: action.payload.totalInput
            }

            let newOutputQualities = {...state.outputQualities}
            newOutputQualities[itemId] = {
                quality: action.payload.outputQuality,
                totalOutput: action.payload.totalOutput
            }

            let existInp = state.inputQualities[itemId];
            let existOut = state.outputQualities[itemId];

            console.log(existsInput)
            return {
                ...state,
                date: action.payload.date,
                product: action.payload.product,
                subProduct: action.payload.subProduct,
                mill: action.payload.mill,
                inputQualities: newInputQualities,
                totalInput: `${parseInt(state.totalInput === '' ? '0' : state.totalInput) - parseInt((existInp && existInp.totalInput) ? existInp.totalInput : '0') + parseInt(action.payload.totalInput)}`,
                outputQualities: newOutputQualities,
                totalOutput: `${parseInt(state.totalOutput === '' ? '0' : state.totalOutput) - parseInt((existOut && existOut.totalOutput) ? existOut.totalOutput : '0') + parseInt(action.payload.totalOutput)}`
            }

        case CLEAR_BATCHMILL_DATA:
            return {
                ...state,
                date: '',
                product: '',
                subProduct: '',
                mill: '',
                inputQuality: {},
                totalInput: '',
                outputQuality: {},
                totalOutput: ''
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