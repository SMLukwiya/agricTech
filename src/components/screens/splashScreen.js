import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';

import Fallback from '../common/fallback';

const Splash = (props) => {
    const [initializing, setInitializing] = useState(true);

    const onAuthStateChanged = (user) => {
        if (initializing) setInitializing(false);

        const navigateTo = (routeName) => props.navigation.dispatch(
            CommonActions.reset({
                type: 'stack',
                index: 0,
                routes: [{name: routeName}]
            })
        );

        navigateTo(user ? 'dashboard' : 'auth');
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);

        return subscriber;
    }, []);

    if (initializing) {
        return <Fallback />
    }

    return <Fallback /> 
}

export default Splash;