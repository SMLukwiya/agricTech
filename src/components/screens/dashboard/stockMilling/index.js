import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, UIManager, LayoutAnimation, ScrollView, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveBatchMillData } from '../../../../store/actions';

const { white, green, blue, darkGray, lightGray } = colors;
const Select = lazy(() => import('../../../common/select'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Input = lazy(() => import('../../../common/input'));

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const StockMilling = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const { products, subProducts, qualities } = useSelector(state => state.product)
    const {selectedMill} = useSelector(state => state.miller);

    // state
    const [modal, setModal] = useState({modalVisible: false});
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45), name: 'Sub Product', open: false});
    const [inputQuality, setInputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Input Quality', open: false})
    const [outputQuality, setOutputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Output Quality', open: false});

    // input
    const [defaultInputWeight, setDefaultInputWeight] = useState({value: '0', error: ''});
    const [addedInputWeight, setAddedInputWeight] = useState({visible: false, value: '0', error: ''});

    // output
    const [defaultOutputWeight, setDefaultOutputWeight] = useState({value: '0', error: ''});
    const [addedOutputWeight, setAddedOutputWeight] = useState({visible: false, value: '0', error: ''});

    const [totalWeightInput, setTotalWeightInput] = useState({value: ''});
    const [totalWeightOutput, setTotalWeightOutput] = useState({value: ''});

    const goBack = () => props.navigation.navigate('home');

    const closeModal = () => {
        setModal({...modal, modalVisible: false})
    }

    const onStockMillingContinue = () => {
        setModal({...modal, modalVisible: !modal.modalVisible})
    }

    const onChangeText = (value, type) => {
        if (type === 'defaultInput') setDefaultInputWeight({...defaultInputWeight, value})
        else if (type === 'addedInput') setAddedInputWeight({...addedInputWeight, value})
        else if (type === 'defaultOutput') setDefaultOutputWeight({...defaultOutputWeight, value})
        else setAddedOutputWeight({...addedOutputWeight, value})
    }

    const onAddWeightInputHandler = (type) => {
        if (type === 'addInputWeight') {
            setAddedInputWeight({...addedInputWeight, visible: true});
        } else {
            setAddedOutputWeight({...addedOutputWeight, visible: true});
        }
    }

    // total  input weight
    const addTotalInputWeight = () => {
        setTotalWeightInput({...totalWeightInput, value: `${parseInt(defaultInputWeight.value === '' ? '0' : defaultInputWeight.value) + parseInt(addedInputWeight.value === '' ? '0' : addedInputWeight.value)}`})
    }
    // total  output weight
    const addTotalOutputWeight = () => {
        setTotalWeightOutput({...totalWeightOutput, value: `${parseInt(defaultOutputWeight.value === '' ? '0' : defaultOutputWeight.value) + parseInt(addedOutputWeight.value === '' ? '0' : addedOutputWeight.value)}`})
    }

    useEffect(() => {
        addTotalInputWeight();
        addTotalOutputWeight();
    }, [defaultInputWeight.value, addedInputWeight.value, defaultOutputWeight.value, addedOutputWeight.value]);

    const onCreateHandler = (type) => {
        closeModal();
        props.navigation.navigate(type === 'product' ? 'createnewproduct' : type === 'subproduct' ? 'createnewsubproduct' : 'createnewquality')
    }

    // toggle product
    const onToggleSelector = (id, name) => {
        LayoutAnimation.configureNext(transition);
        if (id === 'product') {
            setProduct({...product, open: !product.open, name });
            Animated.timing(product.progress, {
                toValue: product.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'subproduct') {
            setSubProduct({...subProduct, open: !subProduct.open, name });
            Animated.timing(subProduct.progress, {
                toValue: subProduct.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'quality') {
            setInputQuality({...inputQuality, open: !inputQuality.open, name });
            Animated.timing(inputQuality.progress, {
                toValue: inputQuality.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setOutputQuality({...outputQuality, open: !outputQuality.open, name });
            Animated.timing(outputQuality.progress, {
                toValue: outputQuality.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        }  
    }

    // select product
    const onProductSelect = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        if (type === 'product') {
            setProduct({...product, id: id === product.id ? '' : id, name, open: false });
            Animated.timing(product.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (type === 'subproduct') {
            setSubProduct({...subProduct, id: id === subProduct.id ? '' : id, name, open: false });
            Animated.timing(subProduct.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (type === 'quality') {
            setInputQuality({...inputQuality, id: id === inputQuality.id ? '' : id, name, open: false });
            Animated.timing(inputQuality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
    }

    // seperate second input quality field for now
    const selectQualityHandler = (type, id, name) => {
        setOutputQuality({...outputQuality, id: id === outputQuality.id ? '' : id, name, open: false });
            Animated.timing(outputQuality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
    }

    const onAddNewQualityHandler = () => {
        closeModal();
        props.navigation.navigate('createnewquality');
    }

    // continue

    const saveData = () => {
        dispatch(saveBatchMillData({
            date: dayjs().format('YYYY-DD-MM-H:M'),
            product: product.name,
            subProduct: subProduct.name,
            mill: selectedMill.name,
            inputQuality: inputQuality.name,
            inputQuantity1: defaultInputWeight.value,
            inputQuantity2: addedInputWeight.value, 
            totalInput: totalWeightInput.value, 
            outputQuality: outputQuality.name, 
            outputQuantity1: defaultOutputWeight.value, 
            outputQuantity2: addedOutputWeight.value, 
            totalOutput: totalWeightOutput.value,
        }))
    }

    const onContinueHandler = () => {
        closeModal();
        saveData();
        props.navigation.navigate('batchsummary')
    }
    
    let enabled1 = product.name !== 'Product' && subProduct.name !== 'Sub Product';
    let enabled = product.name !== 'Product' && subProduct.name !== 'Sub Product' && inputQuality.name !== 'Input Quality' && outputQuality.name !== 'Output Quality'

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.createAccountHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createAccountHeaderTextStyle}>Stock Milling</Text>
                    </View>
                </View>
                <View style={[styles.stockSelectContainerStyle, {width: width * .8}]}>
                    <Text style={styles.stockMillingTextStyle}>Select a product from your stocks</Text>
                    <Select
                        height={product.progress}
                        onToggleSelector={() => onToggleSelector('product', 'Select Product')}
                        productName={product.name}
                        isProductOpen={product.open}
                        productList={products}
                        onProductSelect={onProductSelect}
                        buttonTitle='Create new Product'
                        onCreateHandler={() => onCreateHandler('product')}
                    />
                    <Text style={styles.stockMillingTextStyle}>Select Sub product from your stock</Text>
                    <Select
                        height={subProduct.progress}
                        onToggleSelector={() => onToggleSelector('subproduct', 'Select Sub product')}
                        productName={subProduct.name}
                        isProductOpen={subProduct.open}
                        productList={subProducts}
                        onProductSelect={onProductSelect}
                        buttonTitle='Create new Sub product'
                        onCreateHandler={() => onCreateHandler('subProduct')}
                    />
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled1}
                        onPress={onStockMillingContinue}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <Text style={styles.modalTitleTextStyle}>Product Details</Text>
                <View style={[styles.modalSelectContainer, {width: width * .8, height: height * .65}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <Select
                            height={inputQuality.progress}
                            onToggleSelector={() => onToggleSelector('quality', 'Input Quality')}
                            productName={inputQuality.name}
                            isProductOpen={inputQuality.open}
                            productList={qualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Input Quality'
                            onCreateHandler={() => onCreateHandler('inputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Input weight</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={defaultInputWeight.value}
                                    error={defaultInputWeight.error}
                                    onChangeText={(value) => onChangeText(value, 'defaultInput')}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        {addedInputWeight.visible && 
                            <View style={styles.modalWeightContainerStyle}>
                                <Text>Input weight</Text>
                                <View style={{width: '50%'}}>
                                    <Input
                                        value={addedInputWeight.value}
                                        error={addedInputWeight.error}
                                        onChangeText={(value) => onChangeText(value, 'addedInput')}
                                        keyboardType='number-pad'
                                    />
                                </View>
                            </View>
                        }
                        {!addedInputWeight.visible &&
                            <View style={styles.modalButtonIndicatorContainerStyle}>
                                <Button
                                    title='Add weight input'
                                    backgroundColor={white}
                                    borderColor={lightGray}
                                    color={darkGray}
                                    enabled onPress={() => onAddWeightInputHandler('addInputWeight')}
                                    rightComponent={<Icons name='add' size={25} color={green} />}
                                />
                            </View>
                        }
                        <Select
                            height={outputQuality.progress}
                            onToggleSelector={() => onToggleSelector('outputquality', 'Output Quality')}
                            productName={outputQuality.name}
                            isProductOpen={outputQuality.open}
                            productList={qualities}
                            onProductSelect={selectQualityHandler}
                            buttonTitle='Create new Output Quality'
                            onCreateHandler={() => onCreateHandler('outputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Output Weight</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={defaultOutputWeight.value}
                                    error={defaultOutputWeight.value}
                                    onChangeText={(value) => onChangeText(value, 'defaultOutput')}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        {addedOutputWeight.visible &&
                            <View style={styles.modalWeightContainerStyle}>
                                <Text>Output Weight</Text>
                                <View style={{width: '50%'}}>
                                    <Input
                                        value={addedOutputWeight.value}
                                        error={addedOutputWeight.value}
                                        onChangeText={(value) => onChangeText(value, 'addedOutput')}
                                        keyboardType='number-pad'
                                    />
                                </View>
                            </View>
                        }
                        {!addedOutputWeight.visible && 
                            <View style={styles.modalButtonIndicatorContainerStyle}>
                                <Button
                                    title='Add weight input'
                                    backgroundColor={white}
                                    borderColor={lightGray}
                                    color={darkGray}
                                    enabled onPress={() => onAddWeightInputHandler('addOnputWeight')}
                                    rightComponent={<Icons name='add' size={25} color={green} />}
                                />
                            </View>
                        }
                        <View style={styles.totalWeightContainerStyle}>
                            <Text>Total input weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{totalWeightInput.value}</Text>
                            </View>
                        </View>
                        <View style={styles.totalWeightContainerStyle}>
                            <Text>Total output weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{totalWeightOutput.value}</Text>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.addQualityContainerStyle, {width: width * .8}]}>
                    <TouchableOpacity style={styles.addQualityButtonContainerStyle} activeOpacity={.8} onPress={onAddNewQualityHandler}>
                        <Icons name='add' color={green} size={27.5} />
                    </TouchableOpacity>
                    <Text style={styles.addQualityTextStyle}>Add New Quality</Text>
                </View>
                <View style={[styles.modalButtonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled} onPress={onContinueHandler}
                    />
                </View>
            </RNModal>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    createAccountHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    createAccountHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    stockSelectContainerStyle: {
        marginTop: defaultSize * 2
    },
    stockMillingTextStyle: {
        fontSize: defaultSize * .8,
        marginVertical: defaultSize * 1.5
    },
    buttonContainerStyle: {
        position: 'absolute',
        bottom: defaultSize * 2
    },
    modalSelectContainer: {
        backgroundColor: white,
        borderRadius: defaultSize * 1.25,
        overflow: 'hidden',
        paddingHorizontal: defaultSize,
        paddingVertical: defaultSize * 2,
        justifyContent: 'space-around'
    },
    modalTitleTextStyle: {
        fontSize: defaultSize * 1.25,
        color: white,
        fontWeight: 'bold',
        marginBottom: defaultSize
    },
    modalWeightContainerStyle: {
        marginVertical: defaultSize * .5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalButtonIndicatorContainerStyle: {
        marginVertical: defaultSize * .5
    },
    modalButtonContainerStyle: {
        marginTop: defaultSize
    },
    totalWeightContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginVertical: defaultSize * .45
    },
    totalWeightTextContainerStyle: {
        width: '45%',
        height: defaultSize * 2,
        borderWidth: 1,
        borderColor: green,
        borderRadius: defaultSize,
        overflow: 'hidden',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: defaultSize
    },
    addQualityContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: defaultSize * 2
    },
    addQualityButtonContainerStyle: {
        height: defaultSize * 3,
        width: defaultSize * 3,
        borderRadius: (defaultSize * 3) * .5,
        overflow: 'hidden',
        backgroundColor: white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addQualityTextStyle: {
        color: white,
        fontSize: defaultSize * .85,
        marginLeft: defaultSize
    },
});

export default StockMilling;