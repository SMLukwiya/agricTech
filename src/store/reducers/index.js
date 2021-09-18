import { combineReducers } from 'redux';
import user from './user';
import buy from './buy';
import supplier from './supplier';
import customer from './customer';
import pickup from './pickup';
import product from './product';

const rootReducer = combineReducers({
    user, buy, supplier, customer, pickup, product
});

export default rootReducer;