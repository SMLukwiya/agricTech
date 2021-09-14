import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Icons from 'react-native-vector-icons/Ionicons';
import {Text} from 'react-native';

// screens
import loginScreen from '../../components/screens/auth/login';
import signupScreen from '../../components/screens/auth/signup';

import {defaultSize} from '../../config';

const Stack = createStackNavigator();

const authStack = () => 
    <Stack.Navigator 
        initialRouteName="login"
        screenOptions={{
            headerMode: "screen",
            presentation: "card",

        }}>
        <Stack.Screen
            name="login"
            component={loginScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null
            })}
        />
        <Stack.Screen
            name="signup"
            component={signupScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () =>null
            })}
        />
    </Stack.Navigator>

    export default authStack;