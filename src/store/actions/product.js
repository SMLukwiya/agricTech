import axios from 'axios';

import {
    FETCH_PRODUCTS, FETCH_SUBPRODUCTS, FETCH_QUALITIES, FETCH_CATEGORIES, FETCH_OUTPUT_QUALITIES,
    CREATE_PRODUCT, CREATE_PRODUCT_SUCCESSFUL, CREATE_PRODUCT_FAILED,
    CREATE_SUBPRODUCT, CREATE_SUBPRODUCT_SUCCESSFUL, CREATE_SUBPRODUCT_FAILED,
    CREATE_QUALITY, CREATE_QUALITY_SUCCESSFUL, CREATE_QUALITY_FAILED,
    CREATE_OUTPUT_QUALITY, CREATE_OUTPUT_QUALITY_FAILED, CREATE_OUTPUT_QUALITY_SUCCESSFUL,
    DELETE_PRODUCT, DELETE_PRODUCT_FAILED, DELETE_PRODUCT_SUCCESSFUL,
    SET_PRODUCT, SET_SUBPRODUCT, SET_QUALITY_NAME, FETCH_STOCKIN, FETCH_STOCKOUT
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

    return async dispatch => {
        dispatch({type: CREATE_PRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createProduct`, { name })
            dispatch({
                type: CREATE_PRODUCT_SUCCESSFUL,
                payload: response.data.name
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

    return async dispatch => {
        dispatch({type: CREATE_SUBPRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createSubproduct`, { product, name })
            dispatch({
                type: CREATE_SUBPRODUCT_SUCCESSFUL,
                payload: response.data.name
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_SUBPRODUCT_FAILED})
            onFailure(err);
        }
    }

}

export const createQuality = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {subproduct, name} = values;

    return async dispatch => {
        dispatch({type: CREATE_QUALITY});

        try {
            const response = await axios.post(`${baseUri}product-createQuality`, { subproduct, name })
            dispatch({
                type: CREATE_QUALITY_SUCCESSFUL,
                payload: name
            })
            onSuccess();
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

