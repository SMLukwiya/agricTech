import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, blue, darkGray, red } = colors;
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Select = lazy(() => import('../../../common/select'));

const paymentMethods = [
    {id: 1, name: 'Cash'}
]

const Stocks = (props) => {
    const { height, width } = useWindowDimensions();

    // state
    const [modal, setModal] = useState(false);
    const [payment, setPaymentMethod] = useState({id: 'none', progress: new Animated.Value(45), name: 'Quanity', open: false, payment: 'pending'});

    const goBack = () => props.navigation.navigate('home');

    const onModifyBatchMill = () => props.navigation.goBack();

    const onConfirmBatch = () => {
        setModal(true);
    }

    const closeModal = () => setModal(false);

    const onConfirmBatchClose = () => {
        closeModal();
        props.navigation.navigate('home');
    }

    const confirmPaymentHandler = () => {
        setPaymentMethod({...payment, payment: 'success'});
    }

    const paymentComponent = () => 
    <>
        <View style={[styles.modalContainerStyle, {width: width * .75, height: height * .35}]}>
        <Text style={styles.modalTextStyle}>Please confirm Cash Payment</Text>
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
        <Text style={styles.modalTextStyle}>Confirmation Successful</Text>
            <View style={[styles.buttonContainerStyle, {width: '80%'}]}>
                <Button
                    title='Close'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={onConfirmBatchClose}
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
                        <Text style={styles.summaryHeaderTextStyle}>Batch Summary</Text>
                    </View>
                </View>
                <View style={[styles.summaryContainerStyle, {width: width * .8}]}>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text>Date & Time</Text>
                        <View style={styles.dateContainerStyle}>
                            <Text style={styles.summaryTextStyle}>30/08/2021</Text>
                            <Text style={styles.summaryDateTextStyle}>11:45</Text>
                        </View>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text>Mill</Text>
                        <Text style={styles.summaryTextStyle}>Miller 1</Text>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text>Product</Text>
                        <Text style={styles.summaryTextStyle}>Coffee, Parchment</Text>
                    </View>
                    <Text style={styles.summaryTotalTextTitleStyle}>Total Weight</Text>
                    <Text>Input Weight</Text>
                    <View style={styles.summaryComponentSimpleContainerStyle}>
                        <Text>Q1</Text>
                        <Text>00.00 kg</Text>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text style={styles.summaryTextStyle}>Total input</Text>
                        <Text style={styles.summaryTextStyle}>.00 kg</Text>
                    </View>
                    <Text>Output Weight</Text>
                    <View style={styles.summaryComponentSimpleContainerStyle}>
                        <Text>Q1</Text>
                        <Text>00.00 kg</Text>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text style={styles.summaryTextStyle}>Total output</Text>
                        <Text style={styles.summaryTextStyle}>.00 kg</Text>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text style={styles.summaryTextStyle}>Total Payable</Text>
                        <Text style={styles.summaryTextStyle}>.00 kg</Text>
                    </View>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Modify Batch Milling'
                        backgroundColor={red}
                        borderColor={red}
                        color={white}
                        enabled onPress={onModifyBatchMill}
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
                        title='Confirm batch milling'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled onPress={onConfirmBatch}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
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
        marginTop: defaultSize * 1.5
    },
    summaryComponentContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: darkGray,
        borderBottomWidth: 1,
        paddingBottom: defaultSize * .75,
        marginVertical: defaultSize * .75
    },
    dateContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    summaryTextStyle: {
        fontWeight: 'bold'
    },
    summaryDateTextStyle: {
        fontWeight: 'bold',
        marginLeft: defaultSize * .75
    },
    summaryTotalTextTitleStyle: {
        fontWeight: 'bold',
        marginVertical: defaultSize
    },
    summaryComponentSimpleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize,
        overflow: 'hidden',
        paddingVertical: defaultSize,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    modalTextStyle: {
        fontSize: defaultSize * .85,
        marginVertical: defaultSize,
        textAlign: 'center'
    },
    modalButtonContainerStyle: {
        width: '80%',
        marginTop: defaultSize * 2
    },
    paymentTitleStyles: {
        fontSize: defaultSize * 1.15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: defaultSize
    },
});

export default Stocks;