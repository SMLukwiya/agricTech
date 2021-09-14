import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import RootNavigator from './routes';
import { resetLoaders } from './store/actions';

const App = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(resetLoaders());
    }, []);

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    )
}

export default App;