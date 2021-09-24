import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize, formatNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveBuyMethod, buy } from '../../../../store/actions'

const { white, green, red, darkGray } = colors;
const Select = lazy(() => import('../../../common/select'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const paymentMethods = [
    {id: 1, name: 'Cash'}
]

const Summary = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const buyState = useSelector(state => state.buy);
    const remote = useSelector(state => state.remoteConfigs);
    const {
        confirmCashPaymentTextLabel, confirmationSuccessfulTextLabel, summaryTextLabel, farmerTextLabel,
        productTextLabel, weightTextLabel, quantity1TextLabel, quantity2TextLabel, totalAmountTextLabel,
        totalWeightTextLabel, pricePerUnitTextLabel, continueButtonTextLabel, modifyTransactionButtonTextLabel,
        closeTextLabel, confirmPaymentTextLabel, paymentMethodTextLabel
    } = remote.values;

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

    // confirm and buy
    const confirmPaymentHandler = () => {
        closeModal();
        setTimeout(() => {
            dispatch(buy(buyState,
                () => {
                    setPaymentMethod({...payment, payment: 'success'});
                    setTimeout(() => {
                        setModal({...modal, modalVisible: true});
                    }, 150);
                },
                (err) => {
                    console.log('Err ',err);
                }
            ))
        }, 200);
    }

    // close payment modal
    const onClosePaymentModal = () => {
        closeModal();
        goBack()
    }

    // confirm payment and save payment method
    const onConfirmPayment = (method) => {
        dispatch(saveBuyMethod(method));
    }

    // qualities array
    let diffQualities = [];
    for (key in buyState.qualities) {
        diffQualities.push({quality: key, ...buyState.qualities[key]})
    }

    // reduce totalWeight
    const weight = diffQualities.reduce((prev, curr) => parseInt(prev.totalWeight) + parseInt(curr.totalWeight))
    // reduce totalAmount
    const total = diffQualities.reduce((prev, curr) => parseInt(prev.totalAmount) + parseInt(curr.totalAmount))

    const paymentComponent = () => 
    <>
        <View style={[styles.modalContainerStyle, {width: width * .75, height: height * .35}]}>
        <Text style={styles.cashTextStyle}>{confirmCashPaymentTextLabel}</Text>
            <View style={[styles.buttonContainerStyle, {width: '80%'}]}>
                <Button
                    title={confirmPaymentTextLabel}
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={confirmPaymentHandler}
                />
            </View>
        </View>
    </>

    console.log(buyState.qualities)

    const successComponent = () => 
    <>
        <View style={[styles.modalContainerStyle, {width: width * .75, height: height * .35}]}>
        <Text style={styles.cashTextStyle}>{confirmationSuccessfulTextLabel}</Text>
            <View style={[styles.buttonContainerStyle, {width: '80%'}]}>
                <Button
                    title={closeTextLabel}
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
            <Spinner visible={buyState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.summaryHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.summaryHeaderTextStyle}>{summaryTextLabel}</Text>
                    </View>
                </View>
                <View style={{width: width * .8}}>
                    <ScrollView>
                    <View style={styles.summaryContainerStyle}>
                        <Text>{farmerTextLabel}</Text>
                        <Text>{buyState.individual}</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>{productTextLabel}</Text>
                        <Text>{buyState.product}, {buyState.subproduct}</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text style={styles.qualityTextStyle}>{weightTextLabel}</Text>
                        <Text style={styles.qualityTextStyle}>{pricePerUnitTextLabel}</Text>
                    </View>
                    {diffQualities.map(({quality, totalWeight, pricePerUnit}) =>
                        <View style={styles.summaryContainerStyle} key={quality}>
                            <View>
                                <Text style={styles.qualityTextStyle}>{quality}</Text>
                                <Text>{totalWeight} Kg</Text>
                            </View>
                            <Text>{pricePerUnit} UGX</Text>
                        </View>
                    )}
                    <View style={styles.summaryContainerStyle}>
                        <Text>{totalWeightTextLabel}</Text>
                        <Text>{formatNumber(Math.round(`${buyState.totalWeight}` * 100 / 100).toFixed(2))} Kg</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>{totalAmountTextLabel}</Text>
                        <Text>{formatNumber(`${total}`)} UGX</Text>
                    </View>
                    </ScrollView>
                </View>
                
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title={modifyTransactionButtonTextLabel}
                        backgroundColor={red}
                        borderColor={red}
                        color={white}
                        enabled onPress={() => props.navigation.goBack()}
                    />
                </View>
                <View style={{width: width * .8, marginVertical: defaultSize}}>
                    <Text style={styles.paymentTitleStyles}>{paymentMethodTextLabel}</Text>
                    <Select
                        height={payment.progress}
                        onToggleSelector={() => {}}
                        productName={'Cash'}
                        isProductOpen={payment.open}
                        productList={paymentMethods}
                        onProductSelect={() => {}}
                        buttonTitle='Cash'
                        onCreateHandler={() => onConfirmPayment('cash')}
                    />
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title={continueButtonTextLabel}
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
    qualityTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold'
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