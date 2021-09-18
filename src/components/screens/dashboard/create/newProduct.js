import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createProduct } from '../../../../store/actions';

const { white, green, extraLightGreen, lightGreen, red } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const NewProduct = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '' });

    // redux
    const {products, loading} = useSelector(state => state.product);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { productName: '' },
        validationSchema: Yup.object({
            productName: Yup.string().required('Enter product name')
        }),
        onSubmit: values => {
            setState({...state, modalVisible: true})
        }
    });

    const goBack = () => props.navigation.goBack();

    const closeModal = () => {
        setState({...state, modalVisible: false, error: '' })
    }

    const onContinueHandler = () => {
        closeModal();
        setTimeout(() => {
            dispatch(createProduct(values.productName,
                () => {props.navigation.navigate('products')},
                err => {console.log(err)}))
        }, 200);
    }

    const onCreateSubproductHandler = () => {
        closeModal();
        setTimeout(() => {
            dispatch(createProduct(values.productName,
                () => {props.navigation.navigate('createnewsubproduct')},
                err => {console.log(err)}))
        }, 200);
    }

    const productComponent = ({item: {product}}) => 
        <TouchableOpacity activeOpacity={.8} 
            style={[styles.newProductTextContainerStyle, {width}]}
            onPress={() => {}}
            >
            <View style={{width: width * .8}}>
                <Text style={styles.newProductTextStyle}>{product}</Text>
            </View>
        </TouchableOpacity>

    const emptyProductComponent = () =>
        <View style={styles.emptyProductContainerStyle}>
            <Text style={styles.emptyProductTextStyle}>No Products added</Text>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new product</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Product List</Text>
                    <View style={{height: height * .575}}>
                        {products.length === 0 ? emptyProductComponent() : 
                        <FlatList
                            data={products}
                            key={item => item.id}
                            renderItem={productComponent}
                            contentContainerStyle={styles.scrollViewStyle}
                        />
                        }
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                    <Input
                        placeholder="Enter new product"
                        error={errors.productName}
                        value={values.productName}
                        onChangeText={handleChange('productName')}
                        onBlur={handleBlur('productName')}
                        touched={touched.productName}
                    />
                    <Button
                        title='Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={values.productName !== ''}
                        onPress={handleSubmit}
                    />
                    </View>
            </SafeAreaView>
            <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <View style={[styles.createQualityContainerStyle, {height: height * .375, width: width * .75}]}>
                    <Text style={styles.createQualityTextStyle}>Create sub product(s) for product</Text>
                    <View style={styles.buttonContainerStyle}>
                        <Button
                            title='Confirm and close'
                            backgroundColor={green}
                            borderColor={green}
                            color={white}
                            enabled
                            onPress={onContinueHandler}
                        />
                        <Button
                            title='Confirm and create Subproduct'
                            backgroundColor={green}
                            borderColor={green}
                            color={white}
                            enabled
                            onPress={onCreateSubproductHandler}
                        />
                        <Button
                            title='Modify'
                            backgroundColor={red}
                            borderColor={red}
                            color={white}
                            enabled
                            onPress={closeModal}
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
        marginTop: defaultSize * 2.5
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
        fontSize: defaultSize * .85,
        marginVertical: defaultSize
    },
    buttonContainerStyle: {
        width: '80%'
    },
    emptyProductContainerStyle: {
        alignItems: 'center'
    },
    emptyProductTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold'
    },
});

export default NewProduct;