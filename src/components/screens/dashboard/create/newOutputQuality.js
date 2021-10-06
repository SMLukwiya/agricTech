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

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createOutputQuality, deleteOutputQuality, updateOutputQuality } from '../../../../store/actions';

const { white, green, extraLightGreen, lightGreen, darkGray, red } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));
const PageLogo = lazy(() =>import('../../../common/pageLogo'));

const OutputQuality = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '', name: '', outputQualityID: '', type: '' });
    const [outputquality, setoutputQuality] = useState({value: '', error: '', touched: false })

    // redux
    const {outputQualities, loading, product, subProduct, quality} = useSelector(state => state.product);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { outputQualityName: '' },
        validationSchema: Yup.object({
            outputQualityName: Yup.string().required('Enter output quality')
        }),
        onSubmit: values => {
            setState({...state, modalVisible: true});
        }
    });

    // close modal
    const closeModal = () => {
        setState({...state, modalVisible: false, error: '' })
    }

    // check and get subproduct name
    let inputQualityNameID = '', inputQualityTitle = '', fromScreenName = ''
    if (props.route.params) {
        const { route: { params: {inputQualityCat, name, fromScreen} }} = props;
        inputQualityNameID = inputQualityCat
        inputQualityTitle = name
        fromScreenName = fromScreen;
    }

    // go back button
    const goBack = () => {
        if (fromScreenName) {
            props.navigation.navigate(fromScreenName)
        } else {
            props.navigation.goBack();
        }
    }

    const onEditHandler = (id, type, name) => {
        setState({...state, modalVisible: true, subProductID: id, type, name})
    }

    const onChangeText = (value) => {
        setoutputQuality({
            ...outputquality,
            value,
            touched: true
        })
    }
    
    const updateQualityHandler = () => {
        if (!outputquality.value) return setoutputQuality({...outputquality, error: 'Output quality is required'});
        
        closeModal();
        dispatch(updateOutputQuality(outputquality.value, state.outputQualityID,
            () => {},
            (err) => {}))
    }

    const onDeleteOutputQuality = () => {
        closeModal();
        dispatch(deleteOutputQuality(state.outputQualityID,
            () => {},
            err => {console.log(err)}))
    }

    // create quality output
    const confirmHandler = () => {
        closeModal();
        dispatch(createOutputQuality({inputQuality: quality, name: values.outputQualityName},
            () => {props.navigation.navigate('products')},
            err => {console.log(err)}))
    }

    const qualityComponent = ({item: {id, name}}) => 
        <TouchableOpacity activeOpacity={.8} 
            style={[styles.newProductTextContainerStyle, {width}]}
            onPress={() => {}}
            >
            <View style={[styles.inputQualtyComponentContainer, {width: width * .8}]}>
                <Text style={styles.newProductTextStyle}>{name}</Text>
                <FeatherIcon name='edit' size={20} color={green} onPress={() => onEditHandler(id, 'edit outputquality', name)} />
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
                <Text>Input Quality</Text>
                <Text>{quality}</Text>
            </View>
            <View style={styles.textContainerStyle}>
                <Text>Output Quality</Text>
                <Text>{values.outputQualityName}</Text>
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

    const updateOutputQualityComponent = () =>
        <View style={[styles.modalContainerStyle, {width: width * .8}]}>
            <Text style={styles.modalTextStyle}>{state.name}</Text>
            <Input 
                placeholder='Update Output Quality'
                error={outputquality.error}
                value={outputquality.value}
                onChangeText={onChangeText}
                keyboardType='default' 
                touched={outputquality.touched}
            />
            <Button
                title='Edit output quality'
                backgroundColor={green}
                borderColor={green}
                color={white} 
                enabled onPress={updateQualityHandler}
            />
            <Button
                title='Delete'
                backgroundColor={red}
                borderColor={red}
                color={white} 
                enabled onPress={onDeleteOutputQuality}
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
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new Output Quality</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Output Quality List {inputQualityTitle ? `(${inputQualityTitle})`: ''}</Text>
                    <View style={{height: height * .575}}>
                        {outputQualities.length === 0 ? <EmptyComponent title='No output qualities added' /> : 
                        <FlatList
                            data={inputQualityNameID ? outputQualities.filter(item => item.inputQuality === inputQualityNameID) : outputQualities}
                            key={item => item.id}
                            renderItem={qualityComponent}
                            contentContainerStyle={styles.scrollViewStyle}
                        />
                        }
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                <Input
                        placeholder="Enter new output quality"
                        error={errors.outputQualityName}
                        value={values.outputQualityName}
                        onChangeText={handleChange('outputQualityName')}
                        onBlur={handleBlur('outputQualityName')}
                        touched={touched.outputQualityName}
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
                    {state.type === 'edit outputquality' ? 
                            updateOutputQualityComponent() :
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
        marginVertical: defaultSize * .725
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

export default OutputQuality;