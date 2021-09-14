import React, { Suspense, lazy, useState } from 'react';
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
const RNModal = lazy(() => import('../../../common/rnModal'));

const Pickup = (props) => {
    const { height, width } = useWindowDimensions();

    const [state, setState] = useState({modalVisible: false, pickupConfirmed: false})

    const goBack = () => props.navigation.navigate('home');

    const onSelectPickupHandler = () => {
        setState({...state, modalVisible: true})
    }

    const closeModal = () => {
        setState({ ...state, modalVisible: false });
    }

    const onConfirmPickup = () => {
        setState({...state, pickupConfirmed: true});
    }

    const selectionSuccessfulHandler = () => {
        closeModal();
        props.navigation.navigate('home');
    }

    const customerComponent = () => 
        <TouchableOpacity activeOpacity={.8} style={styles.supplierContainerStyle} onPress={onSelectPickupHandler}>
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

    const selectionChosenComponent = () => 
        <View style={[styles.modalContainerStyle, {width: width * .8, height: height * .35}]}>
            <View>
                <Text style={styles.modalTextStyle}>You have selected Abija Manfred</Text>
                <Text style={styles.modalTextStyle}>An email will automatically be sent</Text>
            </View>
            <View style={styles.modalButtonContainerStyle}>
                <Button
                    title='Confirm selection'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={onConfirmPickup}
                />
            </View>
        </View>

    const selectionConfirmComponent = () => 
        <View style={[styles.modalContainerStyle, {width: width * .8, height: height * .35}]}>
            <Text style={styles.modalTextStyle}>Selection confirmed</Text>
            <View style={styles.modalButtonContainerStyle}>
                <Button
                    title='Close'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={selectionSuccessfulHandler}
                />
            </View>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.supplierHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.supplierHeaderTextStyle}>Pick up</Text>
                    </View>
                </View>
                <View style={[styles.supplierOverContainerStyle,{width: width * .8, height: height * .8}]}>
                    <Text style={styles.selectACustomerTextStyle}>Please select a customer</Text>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        {customerComponent()}
                    </ScrollView>
                </View>
            </SafeAreaView>
            <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {!state.pickupConfirmed ? selectionChosenComponent() : selectionConfirmComponent()}
            </RNModal>
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
    selectACustomerTextStyle: {
        fontSize: defaultSize * .9,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: defaultSize
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
    },
    modalContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize,
        overflow: 'hidden',
        paddingVertical: defaultSize * 1.5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalTextStyle: {
        fontSize: defaultSize * .85,
        textAlign: 'center',
        marginVertical: defaultSize
    },
    modalButtonContainerStyle: {
        width: '75%'
    }
});

export default Pickup;