import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, Platform, ScrollView, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../common/button'));
const Select = lazy(() => import('../../common/select'));
const RNModal = lazy(() => import('../../common/rnModal'));
const Input = lazy(() => import('../../common/input'));

const products = [
    {type: 'product', id: 'one', name: 'Coffee'},
    {type: 'product', id: 'two', name: 'Maize'}
]
const subProducts = [
    {type: 'subproduct', id: 'one', name: 'Coffee'},
    {type: 'subproduct', id: 'two', name: 'Maize'}
]

const categories = [
    {type: 'category', id: '1', name: 'Farmer'},
    {type: 'category', id: '2', name: 'Trader'}
]

const suppliers = [
    {type: 'supplier', id: 'one', name: 'Ben Kiwanuka'},
    {type: 'supplier', id: 'two', name: 'Kizito Lule'}
]

const inputQualities = [
    {type: 'inputquality', id: 1, name: 'Q1'},
    {type: 'inputquality', id: 2, name: 'Q2'}
]

const outputQualities = [
    {type: 'outputquality', id: 1, name: 'Q1'},
    {type: 'outputquality', id: 2, name: 'Q2'}
]

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const MillingService = (props) => {
    const { width, height } = useWindowDimensions();

    // state
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Sub Product', open: false});
    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Category', open: false});
    const [supplier, setSupplier] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Supplier', open: false});
    const [inputQuality, setInputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Input Quality', open: false});
    const [outputQuality, setOutputQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Output Quality', open: false});

    const [modal, setModal] = useState({modalVisible: false});

    // input
    const [defaultInputWeight, setDefaultInputWeight] = useState({value: '0', error: ''});
    const [addedInputWeight, setAddedInputWeight] = useState({visible: false, value: '0', error: ''});

    // output
    const [defaultOutputWeight, setDefaultOutputWeight] = useState({value: '0', error: ''});
    const [addedOutputWeight, setAddedOutputWeight] = useState({visible: false, value: '0', error: ''});

    const [totalWeightInput, setTotalWeightInput] = useState({value: ''});
    const [totalWeightOutput, setTotalWeightOutput] = useState({value: ''});
    const [millingFee, setMillingFee] = useState({value: '0', error: ''});
    const [totalPayable, setTotalPayable] = useState({value: ''});

    const closeModal = () => {
        setModal({...modal, modalVisible: false})
    }

    const onChangeText = (value, type) => {
        if (type === 'defaultInput') setDefaultInputWeight({...defaultInputWeight, value})
        else if (type === 'addedInput') setAddedInputWeight({...addedInputWeight, value})
        else if (type === 'defaultOutput') setDefaultOutputWeight({...defaultOutputWeight, value})
        else if (type === 'millingfee') setMillingFee({...millingFee, value})
        else setAddedOutputWeight({...addedOutputWeight, value})
    }

    const onAddWeightInputHandler = (type) => {
        if (type === 'addInputWeight') {
            setAddedInputWeight({...addedInputWeight, visible: true});
        } else {
            setAddedOutputWeight({...addedOutputWeight, visible: true});
        }
    }

    const goBack = () => props.navigation.navigate('home');

    // total  input weight
    const addTotalInputWeight = () => {
        setTotalWeightInput({...totalWeightInput, value: `${parseInt(defaultInputWeight.value === '' ? '0' : defaultInputWeight.value) + parseInt(addedInputWeight.value === '' ? '0' : addedInputWeight.value)}`})
    }
    // total  output weight
    const addTotalOutputWeight = () => {
        setTotalWeightOutput({...totalWeightOutput, value: `${parseInt(defaultOutputWeight.value === '' ? '0' : defaultOutputWeight.value) + parseInt(addedOutputWeight.value === '' ? '0' : addedOutputWeight.value)}`})
    }

    const addTotalPayable = () => {
        setTotalPayable({...totalPayable, value: `${parseInt(totalWeightInput.value === '' ? '0' : totalWeightInput.value) * parseInt(millingFee.value === '' ? '0' : millingFee.value)}`});
    }

    useEffect(() => {
        addTotalInputWeight();
        addTotalOutputWeight();
        addTotalPayable();
    }, [defaultInputWeight.value, addedInputWeight.value, defaultOutputWeight.value, addedOutputWeight.value]);

    const onMillingServiceContinue = () => {
        setModal({...modal, modalVisible: !modal.modalVisible})
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
        } else if (id === 'supplier') {
            setSupplier({...supplier, open: !supplier.open, name });
            Animated.timing(supplier.progress, {
                toValue: supplier.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'inputquality') {
            setInputQuality({...inputQuality, open: !inputQuality.open, name });
            Animated.timing(inputQuality.progress, {
                toValue: inputQuality.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (id === 'outputquality') {
            setOutputQuality({...outputQuality, open: !outputQuality.open, name });
            Animated.timing(outputQuality.progress, {
                toValue: outputQuality.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setCategory({...category, open: !category.open, name });
            Animated.timing(category.progress, {
                toValue: category.open ? 45 : 150,
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
        } else if (type === 'inputquality') {
            setInputQuality({...inputQuality, id: id === inputQuality.id ? '' : id, name, open: false });
            Animated.timing(inputQuality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else if (type === 'outputquality') {
            setOutputQuality({...outputQuality, id: id === outputQuality.id ? '' : id, name, open: false });
            Animated.timing(outputQuality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setCategory({...category, id: id === category.id ? '' : id, name, open: false });
            Animated.timing(category.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
        
    }

    const onCreateHandler = (type) => {
        props.navigation.navigate(type === 'product' ? 'createnewproduct' : type === 'subproduct' ? 'createnewsubproduct' : 'createnewsubproduct')
    }
    const onAddNewQualityHandler = () => {
        closeModal();
        props.navigation.navigate('createnewquality');
    }

    const onContinueHandler = () => {
        closeModal();
        props.navigation.navigate('millingsummary')
    }

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
                            onToggleSelector={() => onToggleSelector('product', 'Your Product')}
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
                            onToggleSelector={() => onToggleSelector('subproduct', 'Your Sub Product')}
                            productName={subProduct.name}
                            isProductOpen={subProduct.open}
                            productList={subProducts}
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
                            buttonTitle='Create new product'
                            onCreateHandler={() => onCreateHandler('category')}
                        />
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>Select a cusomer/supplier</Text>
                    <View>
                        <Select
                            height={supplier.progress}
                            onToggleSelector={() => onToggleSelector('supplier', 'Your Supplier')}
                            productName={supplier.name}
                            isProductOpen={supplier.open}
                            productList={suppliers}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new product'
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
                        enabled onPress={onMillingServiceContinue}
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
                            productList={inputQualities}
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
                        <View style={styles.totalWeightContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total input weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{totalWeightInput.value}</Text>
                            </View>
                        </View>
                        <Select
                            height={outputQuality.progress}
                            onToggleSelector={() => onToggleSelector('outputquality', 'Select Output Quality')}
                            productName={outputQuality.name}
                            isProductOpen={outputQuality.open}
                            productList={outputQualities}
                            onProductSelect={onProductSelect}
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
                            <Text style={styles.modalTextBoldStyle}>Total output weight</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{totalWeightOutput.value}</Text>
                            </View>
                        </View>
                        <View style={styles.modalWeightContainerStyle}>
                            <Text>Milling fee per unit</Text>
                            <View style={{width: '50%'}}>
                                <Input
                                    value={millingFee.value}
                                    error={millingFee.value}
                                    onChangeText={(value) => onChangeText(value, 'millingfee')}
                                    keyboardType='number-pad'
                                />
                            </View>
                        </View>
                        <View style={styles.modalWeightContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total Payable</Text>
                            <View style={styles.totalWeightTextContainerStyle}>
                                <Text>{totalPayable.value}</Text>
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
                        enabled onPress={onContinueHandler}
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
        alignItems: 'flex-start',
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