import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, images, defaultSize } from '../../../../config';
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
                    console.log('Err', err);
                }
            ))
        }, 200);
    }

    const onClosePaymentModal = () => {
        closeModal();
        goBack()
    }

    const onConfirmPayment = (method) => {
        dispatch(saveBuyMethod(method));
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
            <Spinner visible={buyState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
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
                        <Text>{buyState.farmer}</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Product</Text>
                        <Text>{buyState.product}, {buyState.subproduct}</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Weight</Text>
                        <Text>Price per unit</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <View>
                            <Text>Q1</Text>
                            <Text>{buyState.quantity1} Kg</Text>
                        </View>
                        <Text>900UGX</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <View>
                            <Text>Q2</Text>
                            <Text>{buyState.quantity2} Kg</Text>
                        </View>
                        <Text>500UGX</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Total Weight</Text>
                        <Text>{buyState.totalWeight} Kg</Text>
                    </View>
                    <View style={styles.summaryContainerStyle}>
                        <Text>Total Amount</Text>
                        <Text>{buyState.totalAmount} UGX</Text>
                    </View>
                </View>
                
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Modify Transaction'
                        backgroundColor={red}
                        borderColor={red}
                        color={white}
                        enabled onPress={() => props.navigation.goBack()}
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
                        onCreateHandler={() => onConfirmPayment('cash')}
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