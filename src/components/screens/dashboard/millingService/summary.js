import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize, formatDecNumber, formatNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createMill, clearMillData } from '../../../../store/actions';

const { white, green, darkGray, red } = colors;
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Select = lazy(() => import('../../../common/select'));

const paymentMethods = [
    {id: 1, name: 'Cash'}
]

const Stocks = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const millState = useSelector(state => state.millingService);
    const {userID} = useSelector(state => state.user);

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
        closeModal();
        dispatch(createMill(millState, userID,
            () => {
                setPaymentMethod({...payment, payment: 'success'});
                setTimeout(() => {
                    setModal(true);
                }, 350);
                clearMillData()
            },
            err => {console.log(err)}))
    }

    let inputQualityArray = [];
    for (key in millState.inputQualities) {
        inputQualityArray.push({id: key, ...millState.inputQualities[key]})
    }

    let outputQualityArray = [];
    for (key in millState.outputQualities) {
        outputQualityArray.push({id: key, ...millState.outputQualities[key]})
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
            <Spinner visible={millState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.summaryHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.summaryHeaderTextStyle}>Batch Summary</Text>
                    </View>
                </View>
                <View style={[styles.summaryContainerStyle, {width: width * .8}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text>Date & Time</Text>
                            <View style={styles.dateContainerStyle}>
                                <Text style={styles.summaryTextStyle}>{millState.date}</Text>
                            </View>
                        </View>
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text>Mill</Text>
                            <Text style={styles.summaryTextStyle}>{millState.mill}</Text>
                        </View>
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text>Product</Text>
                            <Text style={styles.summaryTextStyle}>{millState.product}, {millState.subProduct}</Text>
                        </View>
                        <View style={styles.millQualityContainerStyle}>
                            <Text>Input Weight</Text>
                            <Text>Mill cost per unit</Text>
                        </View>
                        {
                            inputQualityArray.map(({id, quality, pricePerUnit, totalInput}) =>
                            <View style={styles.summaryComponentSimpleContainerStyle} key={id}>
                                <Text>{quality}</Text>
                                <View style={styles.inputQualityContainerStyle}>
                                    <Text>{formatDecNumber(totalInput)} kg</Text>
                                    <Text>{formatNumber(pricePerUnit)} UGX</Text>
                                </View>
                            </View> 
                            )
                        }
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text style={styles.summaryTextStyle}>Total</Text>
                            <View>
                                <Text style={styles.summaryTextStyle}>{millState.totalInput} kg</Text>
                            </View>
                        </View>
                        <Text style={{marginBottom : defaultSize * .5}}>Output Weight</Text>
                        {
                            outputQualityArray.map(({id, quality, totalOutput, }) =>
                            <View style={styles.summaryComponentSimpleContainerStyle} key={id}>
                                <Text>{quality}</Text>
                                <View>
                                    <Text>{formatDecNumber(totalOutput)} kg</Text>
                                </View>
                            </View>
                            )
                        }
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text style={styles.summaryTextStyle}>Total output</Text>
                            <Text style={styles.summaryTextStyle}>{millState.totalOutput}kg</Text>
                        </View>
                        <View style={styles.summaryComponentContainerStyle}>
                            <Text style={styles.summaryTextStyle}>Total Payable</Text>
                            <Text style={styles.summaryTextStyle}>{formatNumber(millState.totalPayable)}UGX</Text>
                        </View>
                    </ScrollView>
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
    millQualityContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: defaultSize * .5
    },
    summaryComponentSimpleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    inputQualityContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '60%',
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