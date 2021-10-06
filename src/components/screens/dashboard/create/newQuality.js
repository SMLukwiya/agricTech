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
import FeatherIcon from 'react-native-vector-icons/Feather';

import { colors, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createQuality, setInputQualityName, updateInputQuality, deleteInputQuality } from '../../../../store/actions';

const { white, green, extraLightGreen, lightGreen, darkGray, red } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));
const PageLogo = lazy(() => import('../../../common/pageLogo'));

const NewQuality = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '', name: '', cat: '', inputQualityID: '', type: '' });
    const [inputquality, setinputQuality] = useState({value: '', error: '', touched: false })

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

    // close modal
    const closeModal = () => {
        setState({...state, modalVisible: false, error: '' })
    }

    // check and get subproduct name
    let subProductNameID = '', subProductTitle = '', fromScreenName = ''
    if (props.route.params) {
        const { route: { params: {subProductCat, name, fromScreen} }} = props;
        subProductNameID = subProductCat
        subProductTitle = name
        fromScreenName = fromScreen
    }

    // go back button
    const goBack = () => {
        if (fromScreenName) {
            props.navigation.navigate(fromScreenName)
        } else {
            props.navigation.goBack();
        }
    }

    // create inputQuality and return to subproduct
    const onContinueHandler = () => {
        closeModal();
        dispatch(createQuality({subproduct: subProduct, name: values.qualityName},
            () => {props.navigation.navigate('products')},
            err => {console.log(err)}))
    }

    // create subproduct and proceed to create input qualities
    const confirmHandler = () => {
        closeModal();
        dispatch(createQuality({subproduct: subProduct, name: values.qualityName},
            (name, cat) => {props.navigation.navigate('createnewoutputquality', {inputQualityCat: cat, fromScreen})},
            err => {console.log(err)}))
    }

    const onEditHandler = (id, type, name, cat) => {
        setState({...state, modalVisible: true, inputQualityID: id, type, name, cat})
    }

    const onChangeText = (value) => {
        setinputQuality({
            ...inputquality,
            value,
            touched: true
        })
    }

    const editInputQuality = () => {
        closeModal();
        dispatch(setInputQualityName(state.name));
        props.navigation.navigate('createnewoutputquality', {inputQualityCat: state.cat, name: state.name})
    }
    
    const updateQualityHandler = () => {
        if (!inputquality.value) return setinputQuality({...inputquality, error: 'Input Quality is required'});
        
        closeModal();
        dispatch(updateInputQuality(inputquality.value, state.inputQualityID,
            () => {},
            (err) => {}))
    }

    const onDeleteInputQuality = () => {
        closeModal();
        dispatch(deleteInputQuality(state.inputQualityID,
            () => {},
            err => {console.log(err)}))
    }

    const qualityComponent = ({item: {id, name, cat}}) => 
        <TouchableOpacity activeOpacity={.8} 
            style={[styles.newProductTextContainerStyle, {width}]}
            onPress={() => {}}
            >
            <View style={[styles.inputQualtyComponentContainer, {width: width * .8}]}>
                <Text style={styles.newProductTextStyle}>{name}</Text>
                <FeatherIcon name='edit' size={20} color={green} onPress={() => onEditHandler(id, 'edit inputquality', name, cat)} />
            </View>
        </TouchableOpacity>

    const addNewQualityComponent = () => 
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

    const updateInputQualityComponent = () =>
        <View style={[styles.modalContainerStyle, {width: width * .8}]}>
            <Text style={styles.modalTextStyle}>{state.name}</Text>
            <Input 
                placeholder='Update Input Quality'
                error={inputquality.error}
                value={inputquality.value}
                onChangeText={onChangeText}
                keyboardType='default' 
                touched={inputquality.touched}
            />
            <Button
                title='Update Input quality'
                backgroundColor={green}
                borderColor={green}
                color={white} 
                enabled onPress={updateQualityHandler}
            />
            <Button
                title='Edit output qualities'
                backgroundColor={green}
                borderColor={green}
                color={white} 
                enabled onPress={editInputQuality}
            />
            <Button
                title='Delete'
                backgroundColor={red}
                borderColor={red}
                color={white} 
                enabled onPress={onDeleteInputQuality}
            />
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.createNewProductHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '90%'}}>
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new Input Quality</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Input Quality List {subProductTitle ? `(${subProductTitle})` : ''}</Text>
                    <View style={{height: height * .575}}>
                        {qualities.length === 0 ? <EmptyComponent title='No Input qualities added' /> : 
                        <FlatList
                            data={subProductNameID ? qualities.filter(item => item.subproduct === subProductNameID) : qualities}
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
                        {state.type === 'edit inputquality' ? 
                            updateInputQualityComponent(): 
                            addNewQualityComponent()
                        }
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
        marginTop: defaultSize * 4.5,
        width: '100%',
        alignItems: 'center'
    },
    createNewProductHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    productContainerStyle: {
        marginTop: defaultSize * 2,
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
    inputQualtyComponentContainer: {
        flexDirection: 'row',
        alignItems: 'center', 
        justifyContent: 'space-between'
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
    // 
    modalContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize * 1.5,
        overflow: 'hidden',
        paddingVertical: defaultSize * 1.5,
        paddingHorizontal: defaultSize
    },
    modalTextStyle: {
        fontSize: defaultSize,
        textAlign: 'center',
        marginVertical: defaultSize
    }
});

export default NewQuality;