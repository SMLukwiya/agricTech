import {UPDATE_REMOTE_CONFIGS} from './types';

export const updateRemoteConfigs = (values) => {
    return {
        type: UPDATE_REMOTE_CONFIGS,
        payload: values
    }
}