import React, { Suspense, lazy } from 'react';
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

const subproducts = [
    {id: '1', name: 'Product1'},{id: '2', name: 'Product2'},
    {id: '3', name: 'Product3'},{id: '4', name: 'Product4'},
    {id: '5', name: 'Product5'},{id: '6', name: 'Product6'},
    {id: '7', name: 'Product7'},{id: '8', name: 'Product8'},
    {id: '9', name: 'Product9'},{id: '10', name: 'Product10'},
]

const NewSubProduct = (props) => {
    const { height, width } = useWindowDimensions();

    const goBack = () => props.navigation.navigate('buy');

    const onSubProductSelectHandler = () => {
        props.navigation.navigate('createnewquality')
    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new sub product</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Sub product List</Text>
                    <View style={{height: height * .475}}>
                    <ScrollView
                        bounces={false}
                        contentContainerStyle={[styles.scrollViewStyle]}
                        >
                        {subproducts.map(({id, name}) => 
                            <TouchableOpacity 
                                key={id} activeOpacity={.8} 
                                style={[styles.newProductTextContainerStyle, {width}]}
                                onPress={onSubProductSelectHandler}
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
                        placeholder="Enter new sub product"
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
                        onPress={() => {}}
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
        marginTop: defaultSize * 4,
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
        
    }
});

export default NewSubProduct;