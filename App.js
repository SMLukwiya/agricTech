/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import AppEntry from './src';

// reducer
import reduxStore from './src/store';

// load fonts
Ionicons.loadFont();
MaterialCommunityIcons.loadFont();
MaterialIcons.loadFont();
Feather.loadFont();

const App = () => {
  const { store, persistor } = reduxStore;

  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppEntry />
        </PersistGate>
      </Provider>
  );
};

export default App;
