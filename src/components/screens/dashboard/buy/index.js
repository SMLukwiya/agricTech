import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, Platform, ScrollView, TouchableOpacity, KeyboardAvoidingView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { colors, defaultSize, formatNumber } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveBuyData, saveBuyQuality, setProductName, setSubProductName } from '../../../../store/actions';

const { white, green, lightGray, darkGray } = colors;
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

const Buy = (props) => {
    const dispatch = useDispatch();
    const { width, height } = useWindowDimensions();

    // redux
    const {products, subProducts, qualities, categories} = useSelector(state => state.product);
    const {suppliers} = useSelector(state => state.supplier)
    const remote = useSelector(state => state.remoteConfigs);
    const { 
        buyTextLabel, selectProductTextLabel, selectSubProductTextLabel, selectCustomerSupplierCategoryTextLabel,
        selectsupplierTextLabel, productDetailTextLabel, inputWeightTextLabel,
        continueButtonTextLabel, addWeightInputTextLabel, totalWeightTextLabel, pricePerUnitTextLabel,
        totalPayableTextLabel, addNewQualityTextLabel
    } = remote.values;

    // state
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45), name: 'Sub Product', open: false});
    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45), name: 'Category', open: false});
    const [supplier, setSupplier] = useState({id: 'none', progress: new Animated.Value(45), name: 'Supplier', open: false});
    const [quality, setQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Quality', open: false});
    // input
    const [defaultWeight, setDefaultWeight] = useState({value: '', decValue: '', error: ''});
    const [weighInput, setWeightInput] = useState({inputs: {}, inputCount: 0, total: ''});
    const [pricePerUnit, setPricePerUnit] = useState({value: '', error: ''});

    const [totalWeight, setTotalWeight] = useState({value: ''});
    const [totalPayable, setTotalPayable] = useState({value: ''});

    const [modal, setModal] = useState({modalVisible: false});

    const goBack = () => props.navigation.navigate('home');

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
        } else if (id === 'category') {
            setCategory({...category, open: !category.open, name });
            Animated.timing(category.progress, {
                toValue: category.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setQuality({...quality, open: !quality.open, name });
            Animated.timing(quality.progress, {
                toValue: quality.open ? 45 : 175,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
        
    }

    // close product
    const closeProduct = () => {
        Animated.timing(product.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // close subproduct
    const closeSubProduct = () => {
        Animated.timing(subProduct.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // close quality
    const closeQuality = () => {
        Animated.timing(quality.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // close category
    const closeCategory = () => {
        Animated.timing(category.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // close supplier
    const closeSupplier = () => {
        Animated.timing(supplier.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // select product
    const onProductSelect = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        if (type === 'product') {
            setProduct({...product, id: id === product.id ? '' : id, name, open: false });
            closeProduct()
        } else if (type === 'subproduct') {
            setSubProduct({...subProduct, id: id === subProduct.id ? '' : id, name, open: false });
            closeSubProduct()
        } else if (type === 'supplier') {
            setSupplier({...supplier, id: id === supplier.id ? '' : id, name, open: false });
            closeSupplier()
        } else if (type === 'category') {
            setCategory({...category, id: id === category.id ? '' : id, name, open: false });
            closeCategory()
        } else {
            setQuality({...quality, id: id === quality.id ? '' : id, name, open: false });
            closeQuality()
        }
        
    }

    // create different items from the dropdown list
    const onCreateHandler = (type) => {
        closeModal();
        if (type === 'product') {
            props.navigation.navigate('createnewproduct')
        } else if (type === 'subproduct') {
            if (product.name === 'Product') return Alert.alert('Please select a product')
            dispatch(setProductName(product.name));
            closeSubProduct()
            props.navigation.navigate('createnewsubproduct')
        } else if (type === 'quality') {
            dispatch(setProductName(product.name));
            dispatch(setSubProductName(subProduct.name));
            props.navigation.navigate('createnewquality')
        } else {
            props.navigation.navigate('addsupplier')
        }
        // props.navigation.navigate(type === 'product' ? 'createnewproduct' : type === 'subproduct' ? 'createnewsubproduct' : type === 'supplier' ? 'addsupplier' : 'createnewquality')
    }

    // close modal
    const closeModal = () => {
        setModal({ ...modal, modalVisible: false });
    }

    // press buy
    const onBuyHandler = () => {
        setModal({...modal, modalVisible: true})
    }

    // save modal data and proceed to summary screen
    const onModalContainer = () => {
        closeModal();
        saveDataHandler();
        props.navigation.navigate('summary')
    }

    // add inputs dynamically
    const onAddWeightInputHandler = () => {
        let id = `${weighInput.inputCount}`;
        let newInputs = { ...weighInput.inputs};
            newInputs[id] = {
            value: '', decValue: ''
        }

        setWeightInput({
            ...weighInput, 
            inputs: newInputs, 
            inputCount: weighInput.inputCount+1
        })
    }

    // input Array for added weight inputs
    let inputArray = [];
    for (key in weighInput.inputs) {
        inputArray.push({id: key, ...weighInput.inputs[key]})
    }

    // change text inputs of default input
    const onChangeText = (type, value) => {
        if (type === 'default') setDefaultWeight({...defaultWeight, value, decValue: value})
        else setPricePerUnit({...pricePerUnit, value})
    }

    // change the value of dynamic input dynamically
    const changeAddedInputText = (id, value) => {
        setWeightInput({
            ...weighInput,
            inputs: {
                ...weighInput.inputs,
                [id]: {
                    ...weighInput.inputs[id],
                    value: value,
                    decValue: value
                }
            },
            total: `${(parseInt(weighInput.total === '' ? '0' : weighInput.total) - parseInt(weighInput.inputs[id].value === '' ? '0' : weighInput.inputs[id].value)) + parseInt(value === '' ? '0' : value)}` // check for empty strings and asign 0
        })
    }

    // format dynamic input values toLocaleString 2 decimal places
    const formatDynamicInputValues = (id) => {
        setWeightInput({
            ...weighInput,
            inputs: {
                ...weighInput.inputs,
                [id]: {
                    ...weighInput.inputs[id],
                    decValue: formatNumber((Math.round(weighInput.inputs[id].value * 100) / 100).toFixed(2))
                }
            }
        })
    }

    // calculate total weight
    const addWeightHandler = () => {
        setTotalWeight({
            ...totalWeight, 
            value: `${parseInt(defaultWeight.value === '' ? '0' : defaultWeight.value) + parseInt(weighInput.total === '' ? '0' : weighInput.total)}`
        })
    }

    // calculate total payable
    const addTotalHandler = () => {
        setTotalPayable({
            ...totalPayable, 
            value: `${parseInt(totalWeight.value === '' ? '0' : totalWeight.value) * parseInt(pricePerUnit.value === '' ? '0' : pricePerUnit.value)}`
        })
    }

    // update weight and payable on value changes
    useEffect(() => {
        addWeightHandler();
        addTotalHandler();
    }, [defaultWeight.value, weighInput.value, pricePerUnit.value, weighInput.total])

    // clear quality information
    const clearQualityInformation = () => {
        setQuality({...quality, name: 'Quality'});
        setDefaultWeight({...defaultWeight, value: '', decValue: ''})
        setTotalWeight({...totalWeight, value: ''})
        setPricePerUnit({...pricePerUnit, value: ''})
        setTotalPayable({...totalPayable, value: ''})
        setWeightInput({...weighInput, inputs: {}, inputCount: 0, total: ''})
    }

    // save quality information and add more
    const saveQualityHandler = () => {
        dispatch(saveBuyQuality({
            quality: quality.name,
            totalWeight: totalWeight.value,
            pricePerUnit: pricePerUnit.value,
            totalAmount: totalPayable.value
        }));
        closeModal();
        setTimeout(() => {
            clearQualityInformation();
        }, 50);
        setTimeout(() => {
            setModal({...modal, modalVisible: true})
        }, 100);
    }

    // add new quality information
    const onAddNewQualityHandler = () => {
        saveQualityHandler();
    }

    // save quality plus products
    const saveDataHandler = () => {
        dispatch(saveBuyData({
            date: dayjs(),
            product: product.name,
            subProduct: subProduct.name,
            category: category.name,
            individual: supplier.name,
            quality: quality.name,
            totalWeight: totalWeight.value,
            pricePerUnit: pricePerUnit.value,
            totalAmount: totalPayable.value
        }))
    }

    let enabled1 = product.name !== 'Product' && subProduct.name !== 'Sub Product' && category.name !== 'Category' && supplier.name !== 'Supplier';

    let enabled = product.name !== 'Product' && subProduct.name !== 'Sub Product' && category.name !== 'Category' && supplier.name !== 'Supplier' && quality.name !== 'Quality'

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width, height}]} edges={['bottom']}>
                <View style={[styles.buyHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.buyHeaderTextStyle}>{buyTextLabel}</Text>
                    </View>
                </View>
                <View style={[styles.buyContainerStyle, {width: width * .8, height: height * .75}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                    <Text style={styles.selectProductItemTextStyle}>{selectProductTextLabel}</Text>
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
                    <Text style={styles.selectProductItemTextStyle}>{selectSubProductTextLabel}</Text>
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
                    <Text style={styles.selectProductItemTextStyle}>{selectCustomerSupplierCategoryTextLabel}</Text>
                    <View>
                        <Select
                            height={category.progress}
                            onToggleSelector={() => onToggleSelector('category', 'Category')}
                            productName={category.name}
                            isProductOpen={category.open}
                            productList={categories}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new category'
                            onCreateHandler={() => onCreateHandler('subproduct')}
                        />
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>{selectsupplierTextLabel}</Text>
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
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title={continueButtonTextLabel}
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled1} onPress={onBuyHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <Text style={styles.productDetailsTitleText}>{productDetailTextLabel}</Text>
                <View style={[styles.modalContainerStyle, {height: height * .55, width: width * .8}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <Select
                            height={quality.progress}
                            onToggleSelector={() => onToggleSelector('quality', 'Select Quality')}
                            productName={quality.name}
                            isProductOpen={quality.open}
                            productList={subProduct.name !== 'Sub Product' ? qualities.filter(item => item.subproduct === subProduct.name) : qualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Quantity'
                            onCreateHandler={() => onCreateHandler('quality')}
                        />
                        <View style={styles.modalInputContainerStyle}>
                            <Text>{inputWeightTextLabel}</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input 
                                    error={defaultWeight.error}
                                    value={defaultWeight.decValue}
                                    onChangeText={(value) => onChangeText('default', value)}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                    onBlur={() => setDefaultWeight({...defaultWeight, decValue: formatNumber((Math.round(defaultWeight.value * 100) / 100).toFixed(2))})}
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
                        {weighInput.inputCount < 50 && <View>
                            <Button
                                title={addWeightInputTextLabel}
                                backgroundColor={white}
                                borderColor={darkGray}
                                color={darkGray}
                                enabled onPress={onAddWeightInputHandler}
                                rightComponent={<Icons name='add' size={25} color={green} />}
                            />
                        </View>}
                        <View style={styles.modalInputContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>{totalWeightTextLabel}</Text>
                            <View style={styles.totalWeightmodalViewStyle}>
                                <Text style={styles.modalTextStyle}>{formatNumber(totalWeight.value)}</Text>
                            </View>
                        </View>
                        <View style={styles.modalInputContainerStyle}>
                            <Text>{pricePerUnitTextLabel}</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input 
                                    error={pricePerUnit.error}
                                    value={pricePerUnit.value}
                                    onChangeText={value => onChangeText('', value)}
                                    keyboardType='number-pad'
                                    textAlign='right'
                                />
                            </KeyboardAvoidingView>
                        </View>
                        <View style={styles.modalInputContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>{totalPayableTextLabel}</Text>
                            <View style={styles.totalWeightmodalViewStyle}>
                                <Text>{formatNumber(totalPayable.value)}</Text>
                            </View>
                        </View>
                    </ScrollView>                  
                </View>
                <View style={[styles.addQualityContainerStyle, {width: width * .8}]}>
                    <TouchableOpacity style={styles.addQualityButtonContainerStyle} activeOpacity={.8} onPress={onAddNewQualityHandler}>
                        <Icons name='add' color={green} size={27.5} />
                    </TouchableOpacity>
                    <Text style={styles.addQualityTextStyle}>{addNewQualityTextLabel}</Text>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title={continueButtonTextLabel}
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled} onPress={onModalContainer}
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
    buttonContainerStyle: {
        position: 'absolute',
        bottom: defaultSize * 1.65
    },
    // 
    productDetailsTitleText: {
        fontSize: defaultSize * 1.25,
        color: white,
        fontWeight: 'bold',
        marginBottom: defaultSize * 2
    },
    modalContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize * 1.25,
        overflow: 'hidden',
        paddingHorizontal: defaultSize,
        paddingVertical: defaultSize * 2
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
    totalWeightmodalViewStyle: {
        width: '50%',
        height: defaultSize * 2,
        borderWidth: 1,
        borderColor: green,
        borderRadius: defaultSize,
        overflow: 'hidden',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: defaultSize,
        alignItems: 'flex-end'
    },
    modalTextStyle: {},
    modalTextBoldStyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold'
    }
});

export default Buy;