import { combineReducers } from 'redux';
import user from './user';
import buy from './buy';
import supplier from './supplier';
import customer from './customer';
import pickup from './pickup';
import product from './product';
import batchMill from './batchMill';
import millingService from './milingService';
import miller from './millers';
import remoteConfigs from './variable';

const rootReducer = combineReducers({
    user, buy, supplier, customer, pickup, product, batchMill, millingService, miller, remoteConfigs
});

export default rootReducer;