import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

let store = createStore(persistedReducer, {}, compose(applyMiddleware(thunk)));
let persistor = persistStore(store);

export default { store, persistor };