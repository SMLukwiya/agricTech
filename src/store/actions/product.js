import axios from 'axios';

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
} from './types';
import {baseUri} from '../../config'

export const fetchProducts = (value) => {
    return {
        type: FETCH_PRODUCTS,
        payload: value
    }
}

export const fetchSubproducts = (value) => {
    return {
        type: FETCH_SUBPRODUCTS,
        payload: value
    }
}

export const fetchQualities = (value) => {
    return {
        type: FETCH_QUALITIES,
        payload: value
    }
}

export const fetchOutputQualities = (value) => {
    return {
        type: FETCH_OUTPUT_QUALITIES,
        payload: value
    }
}

export const fetchCategories = (value) => {
    return {
        type: FETCH_CATEGORIES,
        payload: value
    }
}

export const setProductName = (name) => {
    return {
        type: SET_PRODUCT,
        payload: name
    }
}

export const setSubProductName = (name) => {
    return {
        type: SET_SUBPRODUCT,
        payload: name
    }
}

export const setInputQualityName = (name) => {
    return {
        type: SET_QUALITY_NAME,
        payload: name
    }
}

export const fetchStockIn = (values) => {
    return {
        type: FETCH_STOCKIN,
        payload: values
    }
}

export const fetchStockOut = (values) => {
    return {
        type: FETCH_STOCKOUT,
        payload: values
    }
}

export const createProduct = (name, onSuccess = () => {}, onFailure = () => {}) => {
    const cat = name.split(' ').join('-');

    return async dispatch => {
        dispatch({type: CREATE_PRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createProduct`, { name, cat })
            dispatch({
                type: CREATE_PRODUCT_SUCCESSFUL,
                payload: cat
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_PRODUCT_FAILED})
            onFailure(err);
        }
    }

}

export const createSubProduct = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {product, name} = values;
    const cat = name.split(' ').join('-')

    return async dispatch => {
        dispatch({type: CREATE_SUBPRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createSubproduct`, { product, name, cat })
            dispatch({
                type: CREATE_SUBPRODUCT_SUCCESSFUL,
                payload: cat
            })
            onSuccess(name, cat);
        } catch (err) {
            dispatch({type: CREATE_SUBPRODUCT_FAILED})
            onFailure(err);
        }
    }

}

export const createQuality = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {subproduct, name} = values;
    const cat = name.split(' ').join('-');

    return async dispatch => {
        dispatch({type: CREATE_QUALITY});

        try {
            const response = await axios.post(`${baseUri}product-createQuality`, { subproduct, name, cat })
            dispatch({
                type: CREATE_QUALITY_SUCCESSFUL,
                payload: cat
            })
            onSuccess(name, cat);
        } catch (err) {
            dispatch({type: CREATE_QUALITY_FAILED})
            onFailure(err);
        }
    }

}

export const createOutputQuality = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {inputQuality, name} = values;

    return async dispatch => {
        dispatch({type: CREATE_OUTPUT_QUALITY});

        try {
            const response = await axios.post(`${baseUri}product-createOutputQuality`, { inputQuality, name })
            dispatch({
                type: CREATE_OUTPUT_QUALITY_SUCCESSFUL,
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_OUTPUT_QUALITY_FAILED})
            onFailure(err);
        }
    }
}

export const deleteProduct = (uid, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: DELETE_PRODUCT})

        try {
            await axios.post(`${baseUri}product-deleteProduct`, {uid})

            dispatch({type: DELETE_PRODUCT_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: DELETE_PRODUCT_FAILED})
            onFailure(err);
        }
    }
}

export const updateProduct = (name, id, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_PRODUCT})

        try {
            await axios.post(`${baseUri}product-updateProduct`, {productName: name, uid: id})

            dispatch({type: UPDATE_PRODUCT_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_PRODUCT_FAILED})
            onFailure(err);
        }
    }
}

export const updateSubProduct = (name, id, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_SUBPRODUCT})

        try {
            await axios.post(`${baseUri}product-updateSubProduct`, {subProductName: name, uid: id})

            dispatch({type: UPDATE_SUBPRODUCT_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_SUBPRODUCT_FAILED})
            onFailure(err);
        }
    }
}

export const updateInputQuality = (name, id, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_INPUT_QUALITY})

        try {
            await axios.post(`${baseUri}product-updateInputQuality`, {inputQuality: name, uid: id})

            dispatch({type: UPDATE_INPUT_QUALITY_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_INPUT_QUALITY_FAILED})
            onFailure(err);
        }
    }
}

export const updateOutputQuality = (name, id, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: UPDATE_OUTPUT_QUALITY})

        try {
            await axios.post(`${baseUri}product-updateOutputQuality`, {outputQuality: name, uid: id})

            dispatch({type: UPDATE_OUTPUT_QUALITY_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: UPDATE_OUTPUT_QUALITY_FAILED})
            onFailure(err);
        }
    }
}

export const deleteSubproduct = (uid, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: DELETE_SUBPRODUCT})

        try {
            await axios.post(`${baseUri}product-deleteSubProduct`, {uid})

            dispatch({type: DELETE_SUBPRODUCT_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: DELETE_SUBPRODUCT_FAILED})
            onFailure(err);
        }
    }
}

export const deleteInputQuality = (uid, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: DELETE_INPUT_QUALITY})

        try {
            await axios.post(`${baseUri}product-deleteInputQuality`, {uid})

            dispatch({type: DELETE_INPUT_QUALITY_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: DELETE_INPUT_QUALITY_FAILED})
            onFailure(err);
        }
    }
}

export const deleteOutputQuality = (uid, onSuccess = () => {}, onFailure = () => {}) => {
    return async dispatch => {
        dispatch({type: DELETE_OUTPUT_QUALITY})

        try {
            await axios.post(`${baseUri}product-deleteOutputQuality`, {uid})

            dispatch({type: DELETE_OUTPUT_QUALITY_SUCCESSFUL})
            onSuccess();
        } catch (err) {
            dispatch({type: DELETE_OUTPUT_QUALITY_FAILED})
            onFailure(err);
        }
    }
}

