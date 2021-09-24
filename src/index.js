import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import remoteConfiguration from '@react-native-firebase/remote-config';

import RootNavigator from './routes';
import { resetLoaders, updateRemoteConfigs } from './store/actions';
import configs from './variable.json';

const App = () => {
    const dispatch = useDispatch();
    const remoteConfig = remoteConfiguration();

    useEffect(() => {
        dispatch(resetLoaders());
        dispatch(updateRemoteConfigs(configs));

        remoteConfig
            .setDefaults(configs)
            .then(() => remoteConfig.fetchAndActivate())
            .then(fetched => {
                console.log(fetched)
                if (fetched) { return remoteConfig.getAll()}
                else {dispatch(updateRemoteConfigs(configs))}
            })
            .then(values => {
                console.log('values', values)
                let remoteValues = {}
                Object.entries(values).forEach(([key, entry]) => {
                    remoteValues[key] = entry.asString()
                })
                dispatch(updateRemoteConfigs(remoteValues))
            })
            .catch(err => {
                console.log('Config err', err);
                dispatch(updateRemoteConfigs(configs))
            })
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