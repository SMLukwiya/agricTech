import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, FlatList, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createQuality } from '../../../../store/actions';

const { white, green, extraLightGreen, lightGreen, darkGray, red } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const NewQuality = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '' });

    // redux
    const {qualities, loading, product, subProduct} = useSelector(state => state.product);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { qualityName: '' },
        validationSchema: Yup.object({
            qualityName: Yup.string().required('Enter quality')
        }),
        onSubmit: values => {
            setState({...state, modalVisible: true})
        }
    });

    const goBack = () => props.navigation.navigate('createnewsubproduct');

    const closeModal = () => {
        setState({...state, modalVisible: false, error: '' })
    }

    const onContinueHandler = () => {
        closeModal();
        dispatch(createQuality({subproduct: subProduct, name: values.qualityName},
            () => {props.navigation.navigate('products')},
            err => {console.log(err)}))
    }

    const confirmHandler = () => {
        closeModal();
        dispatch(createQuality({subproduct: subProduct, name: values.qualityName},
            () => {props.navigation.navigate('createnewoutputquality')},
            err => {console.log(err)}))
    }

    const qualityComponent = ({item: {name}}) => 
        <TouchableOpacity activeOpacity={.8} 
            style={[styles.newProductTextContainerStyle, {width}]}
            onPress={() => {}}
            >
            <View style={{width: width * .8}}>
                <Text style={styles.newProductTextStyle}>{name}</Text>
            </View>
        </TouchableOpacity>

    const emptyQualityComponent = () =>
        <View style={styles.emptyProductContainerStyle}>
            <Text style={styles.emptyProductTextStyle}>No Input Qualities added</Text>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new Input Quality</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Input Quality List</Text>
                    <View style={{height: height * .575}}>
                        {qualities.length === 0 ? emptyQualityComponent() : 
                        <FlatList
                            data={qualities}
                            key={item => item.id}
                            renderItem={qualityComponent}
                            contentContainerStyle={styles.scrollViewStyle}
                        />
                        }
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                <Input
                        placeholder="Enter new Input quality"
                        error={errors.qualityName}
                        value={values.qualityName}
                        onChangeText={handleChange('qualityName')}
                        onBlur={handleBlur('qualityName')}
                        touched={touched.qualityName}
                    />
                    <Button
                        title='Save'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
                        onPress={handleSubmit}
                    />
                    </View>
                    <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                        <View style={[styles.createQualityContainerStyle, {width: width * .75}]}>
                            <Text style={styles.createQualityTextStyle}>Product Summary</Text>
                            <View style={styles.textContainerStyle}>
                                <Text>Product</Text>
                                <Text>{product}</Text>
                            </View>
                            <View style={styles.textContainerStyle}>
                                <Text>Sub product</Text>
                                <Text>{subProduct}</Text>
                            </View>
                            <View style={styles.textContainerStyle}>
                                <Text>Quality</Text>
                                <Text>{values.qualityName}</Text>
                            </View>
                            <View style={styles.buttonContainerStyle}>
                                <Button
                                    title='Confirm and go back'
                                    backgroundColor={green}
                                    borderColor={green}
                                    color={white}
                                    enabled
                                    onPress={onContinueHandler}
                                />
                                <Button
                                    title='Confirm & Create output quality'
                                    backgroundColor={green}
                                    borderColor={green}
                                    color={white}
                                    enabled
                                    onPress={confirmHandler}
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
        paddingVertical: defaultSize * 2,
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
        marginVertical: defaultSize * .75,
        paddingBottom: defaultSize * .35,
        borderBottomWidth: .5,
        borderBottomColor: darkGray
    },
    buttonContainerStyle: {
        width: '80%'
    },
    // 
    emptyProductContainerStyle: {
        alignItems: 'center'
    },
    emptyProductTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold'
    },
});

export default NewQuality;