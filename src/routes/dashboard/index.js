import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';

import homeStack from './home';

// custom drawer
import CustomDrawer from '../../components/screens/dashboard/drawer';

const Drawer = createDrawerNavigator();

const dashboardRoute = () => {
    const {width} = useWindowDimensions();

    return (
        <Drawer.Navigator
            initialRouteName="homeStack"
            screenOptions={{
                headerShown: false,
                drawerPosition: "right",
                drawerStyle: {width}
            }}
            drawerContent={(props) => <CustomDrawer {...props} />}
            >
            <Drawer.Screen
                name="homeStack"
                component={homeStack}
                options={{
                    title: "Home",
                }}
            />
        </Drawer.Navigator>
    )
}

export default dashboardRoute;