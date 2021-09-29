import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, UIManager, LayoutAnimation, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { colors, defaultSize, formatNumber, formatDecNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveBatchMillData, saveBatchQualityData, setProductName, setSubProductName, setInputQualityName } from '../../../../store/actions';

const { white, green, darkGray, lightGray } = colors;
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
    const { products, subProducts, qualities, outputQualities } = useSelector(state => state.product)
    const {selectedMill} = useSelector(state => state.miller);
    const remote = useSelector(state => state.remoteConfigs);
    const {
        inputWeightTextLabel, outputWeightTextLabel
    } = remote.values

    // state
    const [modal, setModal] = useState({modalVisible: false});
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45), name: 'Sub Product', open: false});
    const [inputQuality, setInputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Input Quality', open: false})
    const [outputQuality, setOutputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Output Quality', open: false});

    // input
    const [defaultInputWeight, setDefaultInputWeight] = useState({value: '', decValue: '', error: ''});
    const [addedInputWeight, setAddedInputWeight] = useState({inputs: {}, inputCount: 0, total: ''});

    // output
    const [defaultOutputWeight, setDefaultOutputWeight] = useState({value: '', decValue: '', error: ''});
    const [addedOutputWeight, setAddedOutputWeight] = useState({inputs: {}, inputCount: 0, total: ''});

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
        if (type === 'defaultInput') setDefaultInputWeight({...defaultInputWeight, value, decValue: value})
        else if (type === 'defaultOutput') setDefaultOutputWeight({...defaultOutputWeight, value, decValue: value})
    }

    // add input weight dynamically
    const onAddWeightInputHandler = () => {
        let id = `${addedInputWeight.inputCount}`;
        let newInputs = { ...addedInputWeight.inputs};
            newInputs[id] = {
            value: '', decValue: ''
        }

        setAddedInputWeight({
            ...addedInputWeight, 
            inputs: newInputs, 
            inputCount: addedInputWeight.inputCount+1
        })
    }

    // dynamic input array
    let inputArray = [];
    for (key in addedInputWeight.inputs) {
        inputArray.push({id: key, ...addedInputWeight.inputs[key]})
    }

    // change the value of dynamic input dynamically
    const changeAddedInputText = (id, value) => {
        setAddedInputWeight({
            ...addedInputWeight,
            inputs: {
                ...addedInputWeight.inputs,
                [id]: {
                    ...addedInputWeight.inputs[id],
                    value: value,
                    decValue: value
                }
            },
            total: `${(parseInt(addedInputWeight.total === '' ? '0' : addedInputWeight.total) - parseInt(addedInputWeight.inputs[id].value === '' ? '0' : addedInputWeight.inputs[id].value)) + parseInt(value === '' ? '0' : value)}` // check for empty strings and asign 0
        })
    }

    // format dynamic input values toLocaleString 2 decimal places
    const formatDynamicInputValues = (id) => {
        setAddedInputWeight({
            ...addedInputWeight,
            inputs: {
                ...addedInputWeight.inputs,
                [id]: {
                    ...addedInputWeight.inputs[id],
                    decValue: formatDecNumber(addedInputWeight.inputs[id].value)
                }
            }
        })
    }

    // add output inputs dynamically
    const onAddWeightOutputHandler = () => {
        let id = `${addedOutputWeight.inputCount}`;
        let newInputs = { ...addedOutputWeight.inputs};
            newInputs[id] = {
            value: '', decValue: ''
        }

        setAddedOutputWeight({
            ...addedOutputWeight, 
            inputs: newInputs, 
            inputCount: addedOutputWeight.inputCount+1
        })
    }

    let outputArray = [];
    for (key in addedOutputWeight.inputs) {
        outputArray.push({id: key, ...addedOutputWeight.inputs[key]})
    }
    
    // change the value of dynamic output dynamically
    const changeAddedOutputText = (id, value) => {
        setAddedOutputWeight({
            ...addedOutputWeight,
            inputs: {
                ...addedOutputWeight.inputs,
                [id]: {
                    ...addedOutputWeight.inputs[id],
                    value: value,
                    decValue: value
                }
            },
            total: `${(parseInt(addedOutputWeight.total === '' ? '0' : addedOutputWeight.total) - parseInt(addedOutputWeight.inputs[id].value === '' ? '0' : addedOutputWeight.inputs[id].value)) + parseInt(value === '' ? '0' : value)}` // check for empty strings and asign 0
        })
    }

    // format dynamic output values toLocaleString 2 decimal places
    const formatDynamicOutputValues = (id) => {
        setAddedOutputWeight({
            ...addedOutputWeight,
            inputs: {
                ...addedOutputWeight.inputs,
                [id]: {
                    ...addedOutputWeight.inputs[id],
                    decValue: formatDecNumber(addedOutputWeight.inputs[id].value)
                }
            }
        })
    }

    // clear quality information
    const clearQualityInformation = () => {
        setInputQuality({...inputQuality, name: 'Quality'});
        setOutputQuality({...outputQuality, name: 'Output Quality'})
        setDefaultInputWeight({value: '', decValue: ''})
        setDefaultOutputWeight({value: '', decValue: ''})
        setAddedInputWeight({...addedInputWeight, inputs: {}, inputCount: 0, total: ''})
        setAddedOutputWeight({...addedOutputWeight, inputs: {}, inputCount: 0, total: ''})
        setTotalWeightInput({value: ''})
        setTotalWeightOutput({value: ''})
    }

    const onCreateHandler = (type) => {
        closeModal();
        if (type === 'product') {
            props.navigation.navigate('createnewproduct')
        } else if (type === 'subproduct') {
            if (product.name === 'Product') return Alert.alert('Please select a product');
            dispatch(setProductName(product.name));
            props.navigation.navigate('createnewsubproduct')
        } else if (type === 'inputQuality') {
            dispatch(setProductName(product.name));
            dispatch(setSubProductName(subProduct.name));
            props.navigation.navigate('createnewquality')
        } else {
            if (inputQuality.name === 'Input Quality') return Alert.alert('Please select an input quality');
            dispatch(setProductName(product.name));
            dispatch(setSubProductName(subProduct.name));
            dispatch(setInputQualityName(inputQuality.name));
            props.navigation.navigate('createnewoutputquality')
        }
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
        } else {
            setOutputQuality({...outputQuality, id: id === outputQuality.id ? '' : id, name, open: false });
            Animated.timing(outputQuality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
    }

    // save quality information per product and add more
    const saveQualityHandler = () => {
        dispatch(saveBatchQualityData({
            inputQuality: inputQuality.name, 
            totalInput: totalWeightInput.value,
            outputQuality: outputQuality.name,
            totalOutput: totalWeightOutput.value,
        }));
        setTimeout(() => {
            clearQualityInformation();
        }, 50);
        setTimeout(() => {
            setModal({...modal, modalVisible: true})
        }, 100);
    }

    const onAddNewQualityHandler = () => {
        closeModal();
        saveQualityHandler();
    }

    // continue
    const saveData = () => {
        dispatch(saveBatchMillData({
            date: dayjs().format('YYYY-DD-MM:H:M'),
            product: product.name,
            subProduct: subProduct.name,
            mill: selectedMill.name,
            inputQuality: inputQuality.name, 
            totalInput: totalWeightInput.value,
            outputQuality: outputQuality.name,
            totalOutput: totalWeightOutput.value,
        }))
    }

    const onContinueHandler = () => {
        closeModal();
        saveData();
        props.navigation.navigate('batchsummary')
    }

    // total  input weight
    const addTotalInputWeight = () => {
        setTotalWeightInput({
            ...totalWeightInput, 
            value: `${parseInt(defaultInputWeight.value === '' ? '0' : defaultInputWeight.value) + parseInt(addedInputWeight.total === '' ? '0' : addedInputWeight.total)}`
        })
    }

    // total  output weight
    const addTotalOutputWeight = () => {
        setTotalWeightOutput({
            ...totalWeightOutput, 
            value: `${parseInt(defaultOutputWeight.value === '' ? '0' : defaultOutputWeight.value) + parseInt(addedOutputWeight.total === '' ? '0' : addedOutputWeight.total)}`
        })
    }

    useEffect(() => {
        addTotalInputWeight();
        addTotalOutputWeight();
    }, [defaultInputWeight.value, addedInputWeight.total, defaultOutputWeight.value, addedOutputWeight.total]);
    
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
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <Text style={styles.stockMillingTextStyle}>Select a product from your stocks</Text>
                        <Select
                            height={product.progress}
                            onToggleSelector={() => onToggleSelector('product', 'Product')}
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
                            onToggleSelector={() => onToggleSelector('subproduct', 'Sub Product')}
                            productName={subProduct.name}
                            isProductOpen={subProduct.open}
                            productList={product.name !== 'Product' ? subProducts.filter(item => item.product === product.name) : subProducts}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Sub product'
                            onCreateHandler={() => onCreateHandler('subproduct')}
                        />
                    </ScrollView>
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
                            productList={subProduct.name !== 'Sub Product' ? qualities.filter(item => item.subproduct === subProduct.name) : qualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Input Quality'
                            onCreateHandler={() => onCreateHandler('inputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Input weight</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input
                                    value={defaultInputWeight.decValue}
                                    error={defaultInputWeight.error}
                                    onChangeText={(value) => onChangeText(value, 'defaultInput')}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setDefaultInputWeight({...defaultInputWeight, decValue: formatDecNumber(defaultInputWeight.decValue)})}
                                />
                            </KeyboardAvoidingView>
                        </View>
                        {
                            inputArray.map(({id, value, decValue}) => 
                            <View style={styles.modalInputContainerStyle} key={id}>
                                <Text>{inputWeightTextLabel}</Text>
                                <KeyboardAvoidingView style={styles.modalViewStyle}>
                                    <Input 
                                        key={id}
                                        error={'some'}
                                        value={decValue}
                                        onChangeText={(value) => changeAddedInputText(id, value)}
                                        keyboardType='number-pad'
                                        textAlign='right'
                                        onBlur={() => formatDynamicInputValues(id)}
                                    />
                                </KeyboardAvoidingView>
                            </View>
                        )}
                        {addedInputWeight.inputCount < 50 &&
                            <View style={styles.modalButtonIndicatorContainerStyle}>
                                <Button
                                    title='Add weight input'
                                    backgroundColor={white}
                                    borderColor={lightGray}
                                    color={darkGray}
                                    enabled onPress={onAddWeightInputHandler}
                                    rightComponent={<Icons name='add' size={25} color={green} />}
                                />
                            </View>
                        }
                        <Select
                            height={outputQuality.progress}
                            onToggleSelector={() => onToggleSelector('outputquality', 'Output Quality')}
                            productName={outputQuality.name}
                            isProductOpen={outputQuality.open}
                            productList={inputQuality.name !== 'Input Quality' ? outputQualities.filter(item => item.inputQuality === inputQuality.name) : outputQualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Output Quality'
                            onCreateHandler={() => onCreateHandler('outputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Output Weight</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input
                                    value={defaultOutputWeight.decValue}
                                    error={'error'}
                                    onChangeText={(value) => onChangeText(value, 'defaultOutput')}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setDefaultOutputWeight({...defaultOutputWeight, decValue: formatDecNumber(defaultOutputWeight.decValue)})}
                                />
                            </KeyboardAvoidingView>
                        </View>
                        {
                            outputArray.map(({id, value, decValue}) => 
                            <View style={styles.modalInputContainerStyle} key={id}>
                                <Text>{outputWeightTextLabel}</Text>
                                <KeyboardAvoidingView style={styles.modalViewStyle}>
                                    <Input 
                                        key={id}
                                        error={'error'}
                                        value={decValue}
                                        onChangeText={(value) => changeAddedOutputText(id, value)}
                                        keyboardType='number-pad'
                                        textAlign='right'
                                        onBlur={() => formatDynamicOutputValues(id)}
                                    />
                                </KeyboardAvoidingView>
                            </View>
                        )}
                        {addedOutputWeight.inputCount < 50 && 
                            <View style={styles.modalButtonIndicatorContainerStyle}>
                                <Button
                                    title='Add weight input'
                                    backgroundColor={white}
                                    borderColor={lightGray}
                                    color={darkGray}
                                    enabled onPress={onAddWeightOutputHandler}
                                    rightComponent={<Icons name='add' size={25} color={green} />}
                                />
                            </View>
                        }
                        <View style={styles.totalWeightContainerStyle}>
                            <Text>Total input weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{formatDecNumber(totalWeightInput.value)}</Text>
                            </View>
                        </View>
                        <View style={styles.totalWeightContainerStyle}>
                            <Text>Total output weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{formatDecNumber(totalWeightOutput.value)}</Text>
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
    modalInputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalViewStyle: {
        width: '50%',
        marginHorizontal: defaultSize,
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
        alignItems: 'flex-end',
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