import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, Platform, ScrollView, TouchableOpacity, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';

import { colors, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { saveBuyData } from '../../../../store/actions';

const { white, green, lightGray, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Select = lazy(() => import('../../../common/select'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Input = lazy(() => import('../../../common/input'));

const categories = [
    {type: 'category', id: 1, name: 'Farmer'},
    {type: 'category', id: 2, name: 'Trader'}
]

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
    const {products, subProducts, qualities} = useSelector(state => state.product);
    const {suppliers} = useSelector(state => state.supplier)

    // state
    const [product, setProduct] = useState({id: 'none', progress: new Animated.Value(45) , name: 'Product', open: false});
    const [subProduct, setSubProduct] = useState({id: 'none', progress: new Animated.Value(45), name: 'Sub Product', open: false});
    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45), name: 'Category', open: false});
    const [supplier, setSupplier] = useState({id: 'none', progress: new Animated.Value(45), name: 'Supplier', open: false});
    const [quality, setQuality] = useState({id: 'none', progress: new Animated.Value(45), name: 'Quality', open: false});
    // input
    const [defaultWeight, setDefaultWeight] = useState({value: '0', error: ''});
    const [weighInput, setWeightInput] = useState({visible: false, value: '0', error: ''});
    const [pricePerUnit, setPricePerUnit] = useState({value: '0', error: ''});

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
        } else if (id === 'category') {
            setCategory({...category, open: !category.open, name });
            Animated.timing(category.progress, {
                toValue: category.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setQuality({...quality, open: !quality.open, name });
            Animated.timing(quality.progress, {
                toValue: quality.open ? 45 : 150,
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
        } else if (type === 'category') {
            setCategory({...category, id: id === category.id ? '' : id, name, open: false });
            Animated.timing(category.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setQuality({...quality, id: id === quality.id ? '' : id, name, open: false });
            Animated.timing(quality.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
        
    }

    const onCreateHandler = (type) => {
        closeModal()
        props.navigation.navigate(type === 'product' ? 'createnewproduct' : type === 'subproduct' ? 'createnewsubproduct' : 'createnewquality')
    }

    // close modal
    const closeModal = () => {
        setModal({ ...modal, modalVisible: false });
        setWeightInput({...weighInput, visible: false, value: ''})
    }

    const onBuyHandler = () => {
        setModal({...modal, modalVisible: true})
    }

    const onModalContainer = () => {
        closeModal();
        saveDataHandler();
        props.navigation.navigate('summary')
    }

    const onAddNewQualityHandler = () => {
        closeModal();
        props.navigation.navigate('createnewquality');
    }

    const onAddWeightInputHandler = () => {
        setWeightInput({...weighInput, visible: true})
    }

    const onChangeText = (type, value) => {
        if (type === 'default') setDefaultWeight({...defaultWeight, value})
        else if (type === 'weighted') setWeightInput({...weighInput, value})
        else setPricePerUnit({...pricePerUnit, value})
    }

    // total weight
    const addWeightHandler = () => {
        setTotalWeight({...totalWeight, value: `${parseInt(defaultWeight.value === '' ? '0' : defaultWeight.value) + parseInt(weighInput.value === '' ? '0' : weighInput.value)}`})
    }

    const addTotalHandler = () => {
        setTotalPayable({...totalPayable, value: `${parseInt(totalWeight.value === '' ? '0' : totalWeight.value) * parseInt(pricePerUnit.value === '' ? '0' : pricePerUnit.value)}`})
    }

    useEffect(() => {
        addWeightHandler();
        addTotalHandler();
    }, [defaultWeight.value, weighInput.value, pricePerUnit.value])

    const saveDataHandler = () => {
        dispatch(saveBuyData({
            product: product.name,
            subProduct: subProduct.name,
            category: category.name,
            individual: supplier.name,
            quality: quality.name,
            quantity1: defaultWeight.value,
            quantity2: weighInput.value,
            totalWeight: totalWeight.value,
            totalAmount: totalPayable.value
        }))

    }

    let enabled = product.name !== 'Product' && subProduct.name !== 'Sub Product' && category.name !== 'Category' && supplier.name !== 'Supplier' && quality.name !== 'Quality'

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width, height}]} edges={['bottom']}>
                <View style={[styles.buyHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.buyHeaderTextStyle}>Buy</Text>
                    </View>
                </View>
                <View style={[styles.buyContainerStyle, {width: width * .8}]}>
                    <Text style={styles.selectProductItemTextStyle}>Please select a product</Text>
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
                    <Text style={styles.selectProductItemTextStyle}>Please select a Sub product</Text>
                    <View>
                        <Select
                            height={subProduct.progress}
                            onToggleSelector={() => onToggleSelector('subproduct', 'Sub Product')}
                            productName={subProduct.name}
                            isProductOpen={subProduct.open}
                            productList={subProducts}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Sub product'
                            onCreateHandler={() => onCreateHandler('subproduct')}
                        />
                    </View>
                    <Text style={styles.selectProductItemTextStyle}>Please select a customer/supplier category</Text>
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
                    <Text style={styles.selectProductItemTextStyle}>Please select a supplier</Text>
                    <View>
                        <Select
                            height={supplier.progress}
                            onToggleSelector={() => onToggleSelector('supplier', 'Supplier')}
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
                        enabled onPress={onBuyHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <Text style={styles.productDetailsTitleText}>Product Details</Text>
                <View style={[styles.modalContainerStyle, {height: height * .55, width: width * .8}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <Select
                            height={quality.progress}
                            onToggleSelector={() => onToggleSelector('quality', 'Select Quality')}
                            productName={quality.name}
                            isProductOpen={quality.open}
                            productList={qualities}
                            onProductSelect={onProductSelect}
                            buttonTitle='Create new Quantity'
                            onCreateHandler={() => onCreateHandler('quality')}
                        />
                        <View style={styles.modalInputContainerStyle}>
                            <Text>Input weight</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input 
                                    error={defaultWeight.error}
                                    value={defaultWeight.value}
                                    onChangeText={(value) => onChangeText('default', value)}
                                    keyboardType='number-pad'
                                />
                            </KeyboardAvoidingView>
                        </View>
                        {weighInput.visible &&
                            <View style={styles.modalInputContainerStyle}>
                                <Text>Input weight</Text>
                                <KeyboardAvoidingView style={styles.modalViewStyle}>
                                    <Input 
                                        error={weighInput.error}
                                        value={weighInput.value}
                                        onChangeText={value => onChangeText('weighted', value)}
                                        keyboardType='number-pad'
                                    />
                                </KeyboardAvoidingView>
                            </View>
                        }
                        {!weighInput.visible && <View>
                            <Button
                                title='Add weight input'
                                backgroundColor={white}
                                borderColor={darkGray}
                                color={darkGray}
                                enabled onPress={onAddWeightInputHandler}
                                rightComponent={<Icons name='add' size={25} color={green} />}
                            />
                        </View>}
                        <View style={styles.modalInputContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total weight</Text>
                            <View style={styles.totalWeightmodalViewStyle}>
                                <Text>{totalWeight.value}</Text>
                            </View>
                        </View>
                        <View style={styles.modalInputContainerStyle}>
                            <Text>Price per unit</Text>
                            <KeyboardAvoidingView style={styles.modalViewStyle}>
                                <Input 
                                    error={pricePerUnit.error}
                                    value={pricePerUnit.value}
                                    onChangeText={value => onChangeText('', value)}
                                    keyboardType='number-pad'
                                />
                            </KeyboardAvoidingView>
                        </View>
                        <View style={styles.modalInputContainerStyle}>
                            <Text style={styles.modalTextBoldStyle}>Total Payable</Text>
                            <View style={styles.totalWeightmodalViewStyle}>
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
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='continue'
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
        paddingHorizontal: defaultSize
    },
    modalTextBoldStyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold'
    }
});

export default Buy;