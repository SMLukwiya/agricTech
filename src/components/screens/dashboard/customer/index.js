import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, lightBlue, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../../common/button'));

const Customers = (props) => {
    const { height, width } = useWindowDimensions();

    const goBack = () => props.navigation.navigate('home');

    // add supplier
    const onAddSupplierHandler = () => {
        props.navigation.navigate('addcustomer')
    }

    const onCustomerHandler = () => {
        props.navigation.navigate('customerdetail');
    }

    const customerComponent = () => 
        <TouchableOpacity activeOpacity={.8} style={styles.supplierContainerStyle} onPress={onCustomerHandler}>
            <View style={styles.supplierImageContainerStyle}>
                <Image source={images.avatar} width='100%' height='100%' resizeMode='contain' />
            </View>
            <View style={styles.rightSupplierContainerStyle}>
                <View>
                    <Text style={styles.supplierNameTextStyle}>Abija Manfred</Text>
                    <Text style={styles.supplierPhoneTextStyle}>0771123456</Text>
                </View>
                <View style={styles.categoryContainerStyle}>
                    <Text style={styles.categoryTextStyle}>Category</Text>
                    <View style={styles.indicatorStyle} />
                </View>
            </View>
        </TouchableOpacity>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.supplierHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.supplierHeaderTextStyle}>Customers</Text>
                    </View>
                </View>
                <View style={[styles.supplierOverContainerStyle,{width: width * .8, height: height * .785}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        {customerComponent()}
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Add a customer'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled onPress={onAddSupplierHandler}
                    />
                    </View>
            </SafeAreaView>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    supplierHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    supplierHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    supplierOverContainerStyle: {
        marginTop: defaultSize * 2,
        borderTopColor: lightGray,
        paddingTop: defaultSize,
        borderTopWidth: 1
    },
    supplierContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    supplierImageContainerStyle: {
        height: defaultSize * 3,
        width: defaultSize * 3,
        borderRadius: (defaultSize * 3) * .5,
        overflow: 'hidden',
        marginRight: defaultSize,
        marginVertical: defaultSize * .55
    },
    categoryContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightSupplierContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '75%'
    },
    supplierNameTextStyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold',
        marginBottom: defaultSize * .15
    },
    supplierPhoneTextStyle: {
        fontSize: defaultSize * .85,
        color: darkGray
    },
    categoryTextStyle: {
        fontSize: defaultSize * .8,
        color: lightBlue,
        marginRight: defaultSize
    },
    indicatorStyle: {
        width: defaultSize * .2,
        backgroundColor: green,
        height: defaultSize * 2
    },
    buttonContainerStyle: {
        marginTop: defaultSize * .5
    }
});

export default Customers;