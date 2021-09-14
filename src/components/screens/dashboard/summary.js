import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, red, darkGray } = colors;
const Select = lazy(() => import('../../common/select'));
const Button = lazy(() => import('../../common/button'));
const RNModal = lazy(() => import('../../common/rnModal'));

const paymentMethods = [
    {id: 1, name: 'Cash'}
]

const Summary = (props) => {
    const { height, width } = useWindowDimensions();

    const [payment, setPaymentMethod] = useState({id: 'none', progress: new Animated.Value(45), name: 'Quanity', open: false, payment: 'pending'});
    const [modal, setModal] = useState({modalVisible: false})

    const goBack = () => props.navigation.navigate('home');

    const onContinuePaymentHandler = () => {
        setModal({...modal, modalVisible: true})
    } 

    // close modal
    const closeModal = () => {
        setModal({...modal, modalVisible: false})
    }

    const confirmPaymentHandler = () => {
        setPaymentMethod({...payment, payment: 'success'});
    }

    const onClosePaymentModal = () => {
        closeModal();
        props.navigation.navigate('buy');
    }

    const paymentComponent = () => 
    <>
        <View style={[styles.modalContainerStyle, {width: width * .75, height: height * .35}]}>
        <Text style={styles.cashTextStyle}>Please confirm Cash Payment</Text>
            <View style={[styles.buttonContainerStyle, {width: '80%'}]}>
                <Button
                    title='Confirm payment'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={confirmPaymentHandler}
                />
            </View>
        </View>
    </>

const successComponent = () => 
<>
    <View style={[styles.modalContainerStyle, {width: width * .75, height: height * .35}]}>
    <Text style={styles.cashTextStyle}>Confirmation Successful</Text>
        <View style={[styles.buttonContainerStyle, {width: '80%'}]}>
            <Button
                title='Close'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled onPress={onClosePaymentModal}
            />
        </View>
    </View>
</>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.summaryHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.summaryHeaderTextStyle}>Summary</Text>
                    </View>
                </View>
                <View style={{width: width * .8}}>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Farmer</Text>
                        <Text>John Mukoma</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Product</Text>
                        <Text>Coffee, Parchment</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Weight</Text>
                        <Text>Price per unit</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Q1</Text>
                        <Text>900UGX</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Q2</Text>
                        <Text>500UGX</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Total Weight</Text>
                        <Text>1100 kgs</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Total Amount</Text>
                        <Text>870,000 UGX</Text>
                    </View>
                </View>
                
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Modify Transaction'
                        backgroundColor={red}
                        borderColor={red}
                        color={white}
                        enabled onPress={() => {}}
                    />
                </View>
                <View style={{width: width * .8, marginVertical: defaultSize}}>
                    <Text style={styles.paymentTitleStyles}>Payment Method</Text>
                    <Select
                        height={payment.progress}
                        onToggleSelector={() => {}}
                        productName={'Cash'}
                        isProductOpen={payment.open}
                        productList={paymentMethods}
                        onProductSelect={() => {}}
                        buttonTitle='Cash'
                        onCreateHandler={() => {}}
                    />
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled onPress={onContinuePaymentHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {payment.payment === 'success' ? successComponent() : paymentComponent()}
            </RNModal>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    summaryHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    summaryHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    summaryContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: darkGray,
        borderBottomWidth: .5,
        paddingVertical: defaultSize * .75,
        marginVertical: defaultSize * .35
    },
    paymentTitleStyles: {
        fontSize: defaultSize * 1.15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: defaultSize
    },
    modalContainerStyle: {
        justifyContent: 'space-between',
        paddingVertical: defaultSize,
        alignItems: 'center',
        backgroundColor: white,
        borderRadius: defaultSize,
        overflow: 'hidden'
    },
    cashTextStyle: {
        fontSize: defaultSize * .8,
        marginTop: defaultSize * 2
    }
});

export default Summary;