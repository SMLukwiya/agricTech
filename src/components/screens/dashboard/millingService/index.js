import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, Platform, ScrollView, TouchableOpacity, Alert, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

import { colors, defaultSize, formatDecNumber, formatNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveMillData, setProductName, setSubProductName, setInputQualityName, saveMillQualityData } from '../../../../store/actions';

const { white, green, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Select = lazy(() => import('../../../common/select'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Input = lazy(() => import('../../../common/input'));

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const MillingService = (props) => {
    const dispatch = useDispatch();
    const { width, height } = useWindowDimensions();
    
    // redux
    const {products, subProducts, categories, qualities, outputQualities} = useSelector(state => state.product);
    const {suppliers} = useSelector(state => state.supplier);
    const { selectedMill} = useSelector(state => state.miller);
    const remote = useSelector(state => state.remoteConfigs)
    const {
        inputWeightTextLabel, outputWeightTextLabel
    } = remote.values;

    // state
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Sub Product', open: false});
    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Category', open: false});
    const [supplier, setSupplier] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Supplier', open: false});
    const [inputQuality, setInputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Input Quality', open: false});
    const [outputQuality, setOutputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Output Quality', open: false});

    const [modal, setModal] = useState({modalVisible: false});

    // input
    const [defaultInputWeight, setDefaultInputWeight] = useState({value: '', decValue: '', error: ''});
    const [addedInputWeight, setAddedInputWeight] = useState({inputs: {}, inputCount: 0, total: ''});

    // output
    const [defaultOutputWeight, setDefaultOutputWeight] = useState({value: '', decValue: '', error: ''});
    const [addedOutputWeight, setAddedOutputWeight] = useState({inputs: {}, inputCount: 0, total: ''});

    const [totalWeightInput, setTotalWeightInput] = useState({value: ''});
    const [totalWeightOutput, setTotalWeightOutput] = useState({value: ''});
    const [millingFee, setMillingFee] = useState({value: '', decValue: '', error: ''});
    const [totalPayable, setTotalPayable] = useState({value: ''});

    const goBack = () => props.navigation.navigate('home');

    const closeModal = () => {
        setModal({...modal, modalVisible: false})
    }

    // change default input texts
    const onChangeText = (value, type) => {
        if (type === 'defaultInput') setDefaultInputWeight({...defaultInputWeight, value, decValue: value})
        else if (type === 'defaultOutput') setDefaultOutputWeight({...defaultOutputWeight, value, decValue: value})
        else if (type === 'millingfee') setMillingFee({...millingFee, value, decValue: value})
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

    // dynamic output array
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
        setInputQuality({...inputQuality, name: ' Input Quality'});
        setOutputQuality({...outputQuality, name: 'Output Quality'})
        setDefaultInputWeight({value: '', decValue: ''})
        setDefaultOutputWeight({value: '', decValue: ''})
        setAddedInputWeight({...addedInputWeight, inputs: {}, inputCount: 0, total: ''})
        setAddedOutputWeight({...addedOutputWeight, inputs: {}, inputCount: 0, total: ''})
        setTotalWeightInput({value: ''})
        setTotalWeightOutput({value: ''})
        setMillingFee({...millingFee, value: '', decValue: ''})
        setTotalPayable({...totalPayable, value: ''})
    }

    const onMillingServiceContinue = () => {
        setModal({...modal, modalVisible: !modal.modalVisible})
    }

    // toggle product
    const onToggleSelector = (id, name) => {
        LayoutAnimation.configureNext(transition);
        if (id === 'product') {
            setProduct({...product, open: !product.open, name });
            Animated.timing(product.progress, {
                toValue: product.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'subproduct') {
            setSubProduct({...subProduct, open: !subProduct.open, name });
            Animated.timing(subProduct.progress, {
                toValue: subProduct.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'supplier') {
            setSupplier({...supplier, open: !supplier.open, name });
            Animated.timing(supplier.progress, {
                toValue: supplier.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'inputquality') {
            setInputQuality({...inputQuality, open: !inputQuality.open, name });
            Animated.timing(inputQuality.progress, {
                toValue: inputQuality.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'outputquality') {
            setOutputQuality({...outputQuality, open: !outputQuality.open, name });
            Animated.timing(outputQuality.progress, {
                toValue: outputQuality.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setCategory({...category, open: !category.open, name });
            Animated.timing(category.progress, {
                toValue: category.open ? 45 : 175,
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
        } else if (type === 'supplier') {
            setSupplier({...supplier, id: id === supplier.id ? '' : id, name, open: false });
            Animated.timing(supplier.progress, {
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
        } else if (type === 'category') {
            setCategory({...category, id: id === category.id ? '' : id, name, open: false });
            Animated.timing(category.progress, {
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

    // create item for different categories
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
        } else if (type === 'supplier') {
            props.navigation.navigate('addsupplier')
        } else {
            if (inputQuality.name === 'Input Quality') return Alert.alert('Please select an input quality');
            dispatch(setProductName(product.name));
            dispatch(setSubProductName(subProduct.name));
            dispatch(setInputQualityName(inputQuality.name));
            props.navigation.navigate('createnewoutputquality')
        }
    }

    // save quality information per product and add more
    const saveMillQualityHandler = () => {
        dispatch(saveMillQualityData({
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

    // add new quality button
    const onAddNewQualityHandler = () => {
        closeModal();
        saveMillQualityHandler();
    }

    // save data
    const saveData = () => {
        dispatch(saveMillData({
            date: dayjs().format('YYYY-DD-MM:H:M'),
            product: product.name,
            subProduct: subProduct.name,
            category: category.name,
            individual: supplier.name,
            mill: selectedMill.name,
            inputQuality: inputQuality.name,
            totalInput: totalWeightInput.value, 
            outputQuality: outputQuality.name, 
            totalOutput: totalWeightOutput.value,
            pricePerUnit: millingFee.value,
            totalPayable: totalPayable.value,
        }))
    }

    // save and continue to summary screen
    const onContinueHandler = () => {
        closeModal();
        saveData();
        props.navigation.navigate('millingsummary')
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

    // calculate total payable
    const addTotalPayable = () => {
        setTotalPayable({
            ...totalPayable,
            value: `${parseInt(totalWeightInput.value === '' ? '0' : totalWeightInput.value) * parseInt(millingFee.value === '' ? '0' : millingFee.value)}`
        });
    }

    // update weights and total
    useEffect(() => {
        addTotalInputWeight();
        addTotalOutputWeight();
        addTotalPayable();
    }, [defaultInputWeight.value, addedInputWeight.total, defaultOutputWeight.value, addedOutputWeight.total, millingFee.value, totalWeightInput.value]);

    let enabled1 = product.name !== 'Product' && subProduct.name !== 'Sub Product' && category.name !== 'Category' && supplier.name !== 'Supplier';
    let enabled = product.name !== 'Product' && subProduct.name !== 'Sub Product' && inputQuality.name !== 'Input Quality' && outputQuality.name !== 'Output Quality'

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width, height}]} edges={['bottom']}>
                <View style={[styles.buyHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.buyHeaderTextStyle}>Milling Service</Text>
                    </View>
                </View>
                <View style={[styles.buyContainerStyle, {width: width * .8}]}>
                    <Text style={styles.selectProductItemTextStyle}>Select a product</Text>
                    <View>
                        <Select
                            height={product.progress}
                            onToggleSelector={() => onToggleSelector('product', 'Product')}
                            productName={product.name}
                            isProductOpen={product.open}
                            productList={products}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new product'
                            onCreateHandler={() => onCreateHandler('product')}
                        />
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>Select a Sub product</Text>
                    <View>
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
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>Select a cusomer/supplier category</Text>
                    <View>
                        <Select
                            height={category.progress}
                            onToggleSelector={() => onToggleSelector('category', 'Category')}
                            productName={category.name}
                            isProductOpen={category.open}
                            productList={categories}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new category'
                            onCreateHandler={() => onCreateHandler('category')}
                        />
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>Select a cusomer/supplier</Text>
                    <View>
                        <Select
                            height={supplier.progress}
                            onToggleSelector={() => onToggleSelector('supplier', 'Supplier')}
                            productName={supplier.name}
                            isProductOpen={supplier.open}
                            productList={category.name !== 'Category' ? suppliers.filter(item => item.category === category.name) : suppliers}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new supplier'
                            onCreateHandler={() => onCreateHandler('supplier')}
                        />
                    </View>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled1}
                        onPress={onMillingServiceContinue}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <Text style={styles.modalTitleTextStyle}>Product Details</Text>
                <View style={[styles.modalSelectContainer, {width: width * .8, height: height * .65}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <Select
                            height={inputQuality.progress}
                            onToggleSelector={() => onToggleSelector('inputquality', 'Select Input Quality')}
                            productName={inputQuality.name}
                            isProductOpen={inputQuality.open}
                            productList={subProduct.name !== 'Sub Product' ? qualities.filter(item => item.subproduct === subProduct.name) : qualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Input Quality'
                            onCreateHandler={() => onCreateHandler('inputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Input weight</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={defaultInputWeight.decValue}
                                    error={defaultInputWeight.error}
                                    onChangeText={(value) => onChangeText(value, 'defaultInput')}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setDefaultInputWeight({...defaultInputWeight, decValue: formatDecNumber(defaultInputWeight.decValue)})}
                                />
                            </View>
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
                        <View style={styles.totalWeightContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total input weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{formatDecNumber(totalWeightInput.value)}</Text>
                            </View>
                        </View>
                        <Select
                            height={outputQuality.progress}
                            onToggleSelector={() => onToggleSelector('outputquality', 'Select Output Quality')}
                            productName={outputQuality.name}
                            isProductOpen={outputQuality.open}
                            productList={inputQuality.name !== 'Input Quality' ? outputQualities.filter(item => item.inputQuality === inputQuality.name) : outputQualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Output Quality'
                            onCreateHandler={() => onCreateHandler('outputQuality')}
                        />
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Output Weight</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={defaultOutputWeight.decValue}
                                    error={defaultOutputWeight.value}
                                    onChangeText={(value) => onChangeText(value, 'defaultOutput')}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setDefaultOutputWeight({...defaultOutputWeight, decValue: formatDecNumber(defaultOutputWeight.decValue)})}
                                />
                            </View>
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
                            <Text style={styles.modalTextBoldStyle}>Total output weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{formatDecNumber(totalWeightOutput.value)}</Text>
                            </View>
                        </View>
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Milling fee per unit</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={millingFee.decValue}
                                    error={'error'}
                                    onChangeText={(value) => onChangeText(value, 'millingfee')}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setMillingFee({...millingFee, decValue: formatNumber(millingFee.decValue)})}
                                />
                            </View>
                        </View>
                        <View style={styles.modalWeightContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total Payable</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{formatNumber(totalPayable.value)}</Text>
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
                        enabled={enabled}
                        onPress={onContinueHandler}
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
        backgroundColor: 'white'
    },
    buyHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    buyHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    buyContainerStyle: {
        marginTop: defaultSize * 2
    },
    selectProductItemTextStyle: {
        fontSize: defaultSize * .85,
        marginVertical: defaultSize,
        marginLeft: defaultSize * .85
    },
    placeholderTextStyle: {
        fontSize: defaultSize * .85,
        marginLeft: defaultSize,
        marginTop: defaultSize * .65,
    },
    productNameContainerStyle: {
        height: 1,
        backgroundColor: lightGray
    },
    buttonContainerStyle: {
        position: 'absolute',
        bottom: defaultSize * 3
    },
    modalTitleTextStyle: {
        fontSize: defaultSize * 1.25,
        color: white,
        fontWeight: 'bold',
        marginBottom: defaultSize
    },
    modalSelectContainer: {
        backgroundColor: white,
        borderRadius: defaultSize * 1.25,
        overflow: 'hidden',
        paddingHorizontal: defaultSize,
        paddingVertical: defaultSize * 2,
        justifyContent: 'space-around'
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
        marginTop: defaultSize
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
    modalTextBoldStyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold'
    },
    modalButtonContainerStyle: {
        marginTop: defaultSize
    },
});

export default MillingService;