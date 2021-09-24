import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { batch, useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize, formatDecNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createBatchMill, clearBatchData } from '../../../../store/actions';

const { white, green, blue, darkGray, red } = colors;
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const Stocks = (props) => {
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();

    // redux
    const batchState = useSelector(state => state.batchMill);

    // state
    const [modal, setModal] = useState(false)

    const goBack = () => props.navigation.navigate('home');

    const onModifyBatchMill = () => props.navigation.goBack();

    const onConfirmBatch = () => {
        dispatch(createBatchMill(batchState,
            () => {
                setModal(true);
            },
            err => {console.log(err)}))
    }

    const closeModal = () => {
        setModal(false)
        props.navigation.navigate('home');
    };

    const onConfirmBatchClose = () => {
        closeModal();
    }

    let inputQualityArray = [];
    for (key in batchState.inputQualities) {
        inputQualityArray.push({quality: key, ...batchState.inputQualities[key]})
    }

    let outputQualityArray = [];
    for (key in batchState.outputQualities) {
        outputQualityArray.push({quality: key, ...batchState.outputQualities[key]})
    }

    console.log(batchState.date)

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={batchState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
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
                            <Text style={styles.summaryTextStyle}>{batchState.date}</Text>
                        </View>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text>Mill</Text>
                        <Text style={styles.summaryTextStyle}>{batchState.mill}</Text>
                    </View>
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text>Product</Text>
                        <Text style={styles.summaryTextStyle}>{batchState.product}, {batchState.subProduct} </Text>
                    </View>
                    <Text style={styles.summaryTotalTextTitleStyle}>Total Weight</Text>
                    <Text>Input Weight</Text>
                    {
                        inputQualityArray.map(({quality, totalInput}) =>
                        <View style={styles.summaryComponentSimpleContainerStyle} key={quality}>
                            <Text>{quality}</Text>
                            <View>
                                <Text>{formatDecNumber(totalInput)} kg</Text>
                            </View>
                        </View> 
                        )
                    }
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text style={styles.summaryTextStyle}>Total input</Text>
                        <Text style={styles.summaryTextStyle}>{formatDecNumber(batchState.totalInput)} kg</Text>
                    </View>
                    <Text>Output Weight</Text>
                    {
                        outputQualityArray.map(({quality, totalOutput}) =>
                        <View style={styles.summaryComponentSimpleContainerStyle} key={quality}>
                            <Text>{quality}</Text>
                            <View>
                                <Text>{formatDecNumber(totalOutput)} kg</Text>
                            </View>
                        </View>
                        )
                    }
                    
                    <View style={styles.summaryComponentContainerStyle}>
                        <Text style={styles.summaryTextStyle}>Total output</Text>
                        <Text style={styles.summaryTextStyle}>{formatDecNumber(batchState.totalOutput)} kg</Text>
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
                <View style={[styles.modalContainerStyle, {width: width * .8}]}>
                    <Text style={styles.modalTextStyle}>Batch Confirmed</Text>
                    <View style={styles.modalButtonContainerStyle}>
                        <Button
                            title='Close'
                            backgroundColor={green}
                            borderColor={green}
                            color={white}
                            enabled onPress={onConfirmBatchClose}
                        />
                    </View>
                </View>
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
        alignItems: 'center'
    },
    modalTextStyle: {
        fontSize: defaultSize * .85,
        marginVertical: defaultSize,
        textAlign: 'center'
    },
    modalButtonContainerStyle: {
        width: '80%',
        marginTop: defaultSize * 2
    }
});

export default Stocks;