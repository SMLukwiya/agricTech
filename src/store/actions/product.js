import axios from 'axios';

import {
    FETCH_PRODUCTS, FETCH_SUBPRODUCTS, FETCH_QUALITIES,
    CREATE_PRODUCT, CREATE_PRODUCT_SUCCESSFUL, CREATE_PRODUCT_FAILED,
    CREATE_SUBPRODUCT, CREATE_SUBPRODUCT_SUCCESSFUL, CREATE_SUBPRODUCT_FAILED,
    CREATE_QUALITY, CREATE_QUALITY_SUCCESSFUL, CREATE_QUALITY_FAILED
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

export const createProduct = (product, onSuccess = () => {}, onFailure = () => {}) => {

    return async dispatch => {
        dispatch({type: CREATE_PRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createProduct`, { product })
            dispatch({
                type: CREATE_PRODUCT_SUCCESSFUL,
                payload: response.data.product
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_PRODUCT_FAILED})
            onFailure(err);
        }
    }

}

export const createSubProduct = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {product, subproduct} = values;

    return async dispatch => {
        dispatch({type: CREATE_SUBPRODUCT});

        try {
            const response = await axios.post(`${baseUri}product-createSubproduct`, { product, subproduct })
            dispatch({
                type: CREATE_SUBPRODUCT_SUCCESSFUL,
                payload: response.data.subproduct
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_SUBPRODUCT_FAILED})
            onFailure(err);
        }
    }

}

export const createQuality = (values, onSuccess = () => {}, onFailure = () => {}) => {
    const {subproduct, quality} = values;

    return async dispatch => {
        dispatch({type: CREATE_QUALITY});

        try {
            const response = await axios.post(`${baseUri}product-createQuality`, { subproduct, quality })
            dispatch({
                type: CREATE_QUALITY_SUCCESSFUL,
            })
            onSuccess();
        } catch (err) {
            dispatch({type: CREATE_QUALITY_FAILED})
            onFailure(err);
        }
    }

}

