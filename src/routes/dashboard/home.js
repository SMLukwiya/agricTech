import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

import homeScreen from '../../components/screens/dashboard/home';
import StockScreen from '../../components/screens/dashboard/stocks';
import BuyScreen from '../../components/screens/dashboard/buy';
import SelectMillScreen from '../../components/screens/dashboard/selectMIll';
import SetupMillScreen from '../../components/screens/dashboard/setupMill';
import CreateNewProductScreen from '../../components/screens/dashboard/create/newProduct';
import CreateNewSubProductScreen from '../../components/screens/dashboard/create/newSubProduct';
import CreateNewQualityScreen from '../../components/screens/dashboard/create/newQuality';
import MillingServiceScreen from '../../components/screens/dashboard/millingService';
import SummaryScreen from '../../components/screens/dashboard/summary';
import SupplierScreen from '../../components/screens/dashboard/supplier';
import SupplierDetailScreen from '../../components/screens/dashboard/supplier/supplier';
import AddSupplierScreen from '../../components/screens/dashboard/supplier/addSupplier';
import CustomerScreen from '../../components/screens/dashboard/customer';
import CustomerDetailScreen from '../../components/screens/dashboard/customer/customer';
import AddCustomerScreen from '../../components/screens/dashboard/customer/addCustomer';
import PickupScreen from '../../components/screens/dashboard/pickup';
import StockMillingScreen from '../../components/screens/dashboard/stockMilling';
import ProfileScreen from '../../components/screens/dashboard/profile';
import AdvancedProfileScreen from '../../components/screens/dashboard/profile/advanced';
import BatchSummaryScreen from '../../components/screens/dashboard/batchSummary';
import MillingSummaryScreen from '../../components/screens/dashboard/stockMilling/summary';

import HeaderRight from '../../components/common/headerLeft';

const Stack = createStackNavigator();

const homeStack = () => (
    <Stack.Navigator 
        initialRouteName="selectmill" 
        screenOptions={{headerMode: "screen", presentation: "card"}}>
        <Stack.Screen
            name="selectmill"
            component={SelectMillScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="home"
            component={homeScreen}
            options={({navigation}) => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => <HeaderRight navigation={navigation} />
            })}
        />
        <Stack.Screen
            name="setupmill"
            component={SetupMillScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="stocks"
            component={StockScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="buy"
            component={BuyScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="createnewproduct"
            component={CreateNewProductScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="createnewsubproduct"
            component={CreateNewSubProductScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="createnewquality"
            component={CreateNewQualityScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="millingservice"
            component={MillingServiceScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="summary"
            component={SummaryScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="suppliers"
            component={SupplierScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="supplierdetail"
            component={SupplierDetailScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="addsupplier"
            component={AddSupplierScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="customers"
            component={CustomerScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="customerdetail"
            component={CustomerDetailScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="addcustomer"
            component={AddCustomerScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="pickup"
            component={PickupScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="stockmilling"
            component={StockMillingScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="profile"
            component={ProfileScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="advancedprofile"
            component={AdvancedProfileScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="batchsummary"
            component={BatchSummaryScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
        <Stack.Screen
            name="millingsummary"
            component={MillingSummaryScreen}
            options={() => ({
                title: '',
                ...TransitionPresets.FadeFromBottomAndroid,
                headerTransparent: true,
                headerLeft: () => null,
                headerRight: () => null
            })}
        />
    </Stack.Navigator>
);

export default homeStack;