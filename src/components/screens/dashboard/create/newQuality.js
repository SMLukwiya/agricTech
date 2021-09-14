import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, ScrollView, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, extraLightGreen, lightGreen, darkGray } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const quality = [
    {id: '1', name: 'Quality1'},{id: '2', name: 'Quality2'},
    {id: '3', name: 'Quality3'},{id: '4', name: 'Quality4'},
    {id: '5', name: 'Quality5'},{id: '6', name: 'Quality6'},
    {id: '7', name: 'Quality7'},{id: '8', name: 'Quality8'},
    {id: '9', name: 'Quality9'},{id: '10', name: 'Quality10'},
]

const NewQuality = (props) => {
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false });

    const goBack = () => props.navigation.navigate('createnewsubproduct');

    const onSaveQualityHandler = () => {
        setState({...state, modalVisible: true})
    }

    const closeModal = () => {
        setState({...state, modalVisible: false })
    }

    const confirmHandler = () => {
        closeModal();
        props.navigation.navigate('millingservice')
    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new Quality</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Quality List</Text>
                    <View style={{height: height * .475}}>
                    <ScrollView
                        bounces={false}
                        contentContainerStyle={[styles.scrollViewStyle]}
                        >
                        {quality.map(({id, name}) => 
                            <TouchableOpacity key={id} activeOpacity={.8} style={[styles.newProductTextContainerStyle, {width}]}>
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
                        placeholder="Enter new quality"
                        error={'none'}
                        value={''}
                        rightComponent={false}
                        onChangeText={() => {}}
                        onBlur={() => {}}
                        touched={false}
                    />
                    <Button
                        title='Save'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
                        onPress={onSaveQualityHandler}
                    />
                    </View>
                    <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                        <View style={[styles.createQualityContainerStyle, {height: height * .35, width: width * .75}]}>
                            <Text style={styles.createQualityTextStyle}>Product Summary</Text>
                            <View style={styles.textContainerStyle}>
                                <Text>Product</Text>
                                <Text>Lorem ipsum</Text>
                            </View>
                            <View style={styles.textContainerStyle}>
                                <Text>Sub product</Text>
                                <Text>Lorem ipsum</Text>
                            </View>
                            <View style={styles.textContainerStyle}>
                                <Text>Quality</Text>
                                <Text>Q1    </Text>
                            </View>
                            <View style={styles.buttonContainerStyle}>
                                <Button
                                    title='Confirm & Save'
                                    backgroundColor={green}
                                    borderColor={green}
                                    color={white}
                                    enabled
                                    onPress={confirmHandler}
                                />
                            </View>
                        </View>
                    </RNModal>
            </SafeAreaView>
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
        marginTop: defaultSize * 3,
        paddingVertical: defaultSize
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
        marginTop: defaultSize
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
        fontWeight: 'bold',
        fontSize: defaultSize * .85
    },
    textContainerStyle: {
        flexDirection: 'row',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: defaultSize,
        paddingBottom: defaultSize * .35,
        borderBottomWidth: .25,
        borderBottomColor: darkGray
    },
    buttonContainerStyle: {
        width: '80%'
    }
});

export default NewQuality;