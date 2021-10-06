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
import { createSubProduct, setSubProductName, updateSubProduct, deleteSubproduct } from '../../../../store/actions';

const { white, green, extraLightGreen, lightGreen, red, darkGray } = colors;
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));
const PageLogo = lazy(() => import('../../../common/pageLogo'));

const NewSubProduct = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '', subProductID: '', name: '', cat: '', type: '' });
    const [subproduct, setsubProduct] = useState({value: '', error: '', touched: false })

    // redux
    const {subProducts, loading, product} = useSelector(state => state.product);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { subProductName: '' },
        validationSchema: Yup.object({
            subProductName: Yup.string().required('Enter sub product name')
        }),
        onSubmit: values => {
            setState({...state, modalVisible: true})
        }
    });

    // check and get product ID
    let productNameID = '', productTitle = '', fromScreenName = ''
    if (props.route.params) {
        const { 
            route: { 
                params: { productCat, name, fromScreen } 
            }
        } = props;
        productNameID = productCat
        productTitle = name
        fromScreenName = fromScreen
    }

    // go back button
    const goBack = () => {
        if(fromScreenName) {
            props.navigation.navigate(fromScreenName)
        } else {
            props.navigation.goBack()
        }
    };

    // close modal
    const closeModal = () => {
        setState({...state, modalVisible: false, error: '' })
    }

    // create subnproduct and return to products
    const onContinueHandler = () => {
        closeModal();
        setTimeout(() => {
            dispatch(createSubProduct({product, name: values.subProductName},
                () => {props.navigation.navigate('products')},
                err => {console.log(err)}))
        }, 200);
    }

    // create subnproducts and proceed to create input quality
    const onCreateSubproductHandler = () => {
        closeModal();
        setTimeout(() => {
            dispatch(createSubProduct({product, name: values.subProductName},
                (name, cat) => {props.navigation.navigate('createnewquality', {subProductCat: cat, name: name})},
                err => {console.log(err)}))
        }, 200);
    }

    const onEditHandler = (id, type, name, cat) => {
        setState({...state, modalVisible: true, subProductID: id, type, name, cat})
    }

    const onChangeText = (value) => {
        setsubProduct({
            ...subproduct,
            value,
            touched: true
        })
    }

    const editSubproduct = () => {
        closeModal();
        dispatch(setSubProductName(state.name));
        props.navigation.navigate('createnewquality', {subProductCat: state.cat, name: state.name})
    }
    
    const updateProductHandler = () => {
        if (!subproduct.value) return setsubProduct({...subproduct, error: 'Sub product name is required'});
        
        closeModal();
        dispatch(updateSubProduct(subproduct.value, state.subProductID,
            () => {},
            err => {}))
    }

    const onDeleteSubProductHandler = () => {
        closeModal();
        dispatch(deleteSubproduct(state.subProductID,
            () => {},
            err => {console.log(err)}))
    }

    const subProductComponent = ({item: {id, name, cat}}) => 
        <TouchableOpacity activeOpacity={.8} 
            style={[styles.newProductTextContainerStyle, {width}]}
            onPress={() => {}}
            >
            <View style={[styles.subProductComponentContainer, {width: width * .8}]}>
                <Text style={styles.newProductTextStyle}>{name}</Text>
                <FeatherIcon name='edit' size={20} color={green} onPress={() => onEditHandler(id, 'edit subproduct', name, cat)} />
            </View>
        </TouchableOpacity>

    const addSubProductComponent = () => 
        <View style={[styles.createQualityContainerStyle, {width: width * .75}]}>
            <Text style={styles.createQualityTextStyle}>Create quality for product</Text>
            <View style={styles.buttonContainerStyle}>
                <View style={styles.textContainerStyle}>
                    <Text>Product</Text>
                    <Text>{product}</Text>
                </View>
                <Button
                    title='Confirm and go back'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled
                    onPress={onContinueHandler}
                />
                <Button
                    title='Confirm and create input quality'
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

        const updateSubproductComponent = () =>
            <View style={[styles.modalContainerStyle, {width: width * .8}]}>
                <Text style={styles.modalTextStyle}>{state.name}</Text>
                <Input 
                    placeholder='Update product name'
                    error={subproduct.error}
                    value={subproduct.value}
                    onChangeText={onChangeText}
                    keyboardType='default' 
                    touched={subproduct.touched}
                />
                <Button
                    title='Update Sub product'
                    backgroundColor={green}
                    borderColor={green}
                    color={white} 
                    enabled onPress={updateProductHandler}
                />
                <Button
                    title='Edit input quality'
                    backgroundColor={green}
                    borderColor={green}
                    color={white} 
                    enabled onPress={editSubproduct}
                />
                <Button
                    title='Delete'
                    backgroundColor={red}
                    borderColor={red}
                    color={white} 
                    enabled onPress={onDeleteSubProductHandler}
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
                        <Text style={styles.createNewProductHeaderTextStyle}>Create new sub product</Text>
                    </View>
                </View>
                <View style={[styles.productContainerStyle, {width}]}>
                    <Text style={styles.productListTitleTextStyle}>Sub product List {productTitle ? `(${productTitle})` : ''}</Text>
                    <View style={{height: height * .575}}>
                        {subProducts.length === 0 ? <EmptyComponent title='No Sub products added' /> : 
                        <FlatList
                            data={productNameID ? subProducts.filter(item => item.product === productNameID) : subProducts}
                            key={item => item.id}
                            renderItem={subProductComponent}
                            contentContainerStyle={styles.scrollViewStyle}
                        />
                        }
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                    <Input
                        placeholder="Enter new sub product"
                        error={errors.subProductName}
                        value={values.subProductName}
                        onChangeText={handleChange('subProductName')}
                        onBlur={handleBlur('subProductName')}
                        touched={touched.subProductName}
                    />
                    <Button
                        title='Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={values.subProductName !== ''}
                        onPress={handleSubmit}
                    />
                    </View>
            </SafeAreaView>
            <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {state.type === 'edit subproduct' ? 
                    updateSubproductComponent() :
                    addSubProductComponent()
                }
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
    subProductComponentContainer: {
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
    emptyProductContainerStyle: {
        alignItems: 'center'
    },
    emptyProductTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold'
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
    // 
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

export default NewSubProduct;