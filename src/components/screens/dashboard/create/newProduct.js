import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, ScrollView, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, extraLightGreen, lightGreen } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const products = [
    {id: '1', name: 'Product1'},{id: '2', name: 'Product2'},
    {id: '3', name: 'Product3'},{id: '4', name: 'Product4'},
    {id: '5', name: 'Product5'},{id: '6', name: 'Product6'},
    {id: '7', name: 'Product7'},{id: '8', name: 'Product8'},
    {id: '9', name: 'Product9'},{id: '10', name: 'Product10'},
]

const NewProduct = (props) => {
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ productId: '', productName: '', modalVisible: false });

    const goBack = () => props.navigation.navigate('buy');

    const onContinueHandler = () => {
        setState({...state, modalVisible: true})
    }

    const closeModal = () => {
        setState({...state, modalVisible: false })
    }

    const createQualityHandler = () => {
        closeModal();
        props.navigation.navigate('createnewquality');
    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new product</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Product List</Text>
                    <View style={{height: height * .475}}>
                    <ScrollView
                        bounces={false}
                        contentContainerStyle={[styles.scrollViewStyle]}
                        >
                        {products.map(({id, name}) => 
                            <TouchableOpacity 
                                key={id} activeOpacity={.8} 
                                style={[styles.newProductTextContainerStyle, {width}]}
                                onPress={() => {}}
                                >
                                <View style={{width: width * .8}}>
                                    <Text style={styles.newProductTextStyle}>{name}</Text>
                                </View>
                            </TouchableOpacity>
                        )}           
                    </ScrollView>
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                    <Input
                        placeholder="Enter new product"
                        error={'none'}
                        value={''}
                        rightComponent={false}
                        onChangeText={() => {}}
                        onBlur={() => {}}
                        touched={false}
                    />
                    <Button
                        title='Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
                        onPress={onContinueHandler}
                    />
                    </View>
            </SafeAreaView>
            <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <View style={[styles.createQualityContainerStyle, {height: height * .35, width: width * .75}]}>
                    <Text style={styles.createQualityTextStyle}>Create quality for product</Text>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            title='Create quality'
                            backgroundColor={green}
                            borderColor={green}
                            color={white}
                            enabled
                            onPress={createQualityHandler}
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
    createNewProductHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    createNewProductHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    productContainerStyle: {
        marginTop: defaultSize * 3.5
    },
    productListTitleTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize,
        marginVertical: defaultSize * .75
    },
    scrollViewStyle: {
        alignItems: 'center',
        backgroundColor: extraLightGreen
    },
    newProductTextContainerStyle: {
        alignItems: 'center',
        backgroundColor: lightGreen,
        marginVertical: defaultSize * .5
    },
    inputContainerStyle: {
        marginTop: defaultSize,
        marginBottom: defaultSize
    },
    newProductTextStyle: {
        fontSize: defaultSize * .8,
        paddingVertical: defaultSize * .8,
    },
    createQualityContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize,
        justifyContent: 'space-between',
        paddingVertical: defaultSize * 1.5,
        alignItems: 'center'
    },
    createQualityTextStyle: {
        textAlign: 'center',
        marginTop: defaultSize* 2.5,
        fontSize: defaultSize * .85
    },
    buttonContainerStyle: {
        width: '80%'
    }
});

export default NewProduct;