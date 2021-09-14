import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import SplashScreen from '../components/screens/splashScreen';
import authRoute from './auth';
import dashboardRoute from './dashboard';

const Stack = createStackNavigator();

const stackNavigator = () => (
    <Stack.Navigator
        initialRouteName="splash" 
        screenOptions={{
            headerMode: "none",
            presentation: "none"
        }}
    >
        <Stack.Screen
            name="splash"
            component={SplashScreen}
            options={() => ({ title: '', ...TransitionPresets.FadeFromBottomAndroid })}
        />
        <Stack.Screen
            name="auth"
            component={authRoute}
            options={() => ({ title: '', ...TransitionPresets.FadeFromBottomAndroid })}
        />
        <Stack.Screen
            name="dashboard"
            component={dashboardRoute}
            options={() => ({ title: '', ...TransitionPresets.FadeFromBottomAndroid })}
        />
    </Stack.Navigator>
)

export default stackNavigator;