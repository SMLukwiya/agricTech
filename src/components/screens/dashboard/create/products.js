import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { colors, defaultSize, images } from '../../../../config';
import Fallback from '../../../common/fallback';
import { updateProduct, deleteProduct, setProductName } from '../../../../store/actions';

const { white, green, darkGray, red } = colors;
const Button = lazy(() => import('../../../common/button'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const TopCornerImage = lazy(() => import('../../../common/topCornerComponent'));
const HeaderRight = lazy(() => import('../../../common/secondHeader'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));
const Input = lazy(() => import('../../../common/input'));
const PageLogo = lazy(() => import('../../../common/pageLogo'));

const Products = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ modalVisible: false, error: '', productID: '', name: '', cat: '' })

    // redux
    const {products} = useSelector(state => state.product);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { productName: '' },
        validationSchema: Yup.object({
            productName: Yup.string().required('Product name is required'),
        }),
        onSubmit: values => {
            closeModal();
            dispatch(updateProduct(values.productName, state.productID,
                () => {
                    
                },
                err => {console.log(err)}))
        }
    });

    const goBack = () => props.navigation.navigate('home');

    const closeModal = () => {
        setState({...state, modalVisible: false, error: ''})
    }

    const onEditHandler = (id) => {
        setState({...state, modalVisible: true, productID: id, name: products.find(item => item.id === id).name, cat: products.find(item => item.id === id).cat});
    }

    const addProductHandler = () => {
        props.navigation.navigate('createnewproduct');
    }

    const editSubproduct = () => {
        closeModal();
        dispatch(setProductName(state.name));
        props.navigation.navigate('createnewsubproduct', {productCat: state.cat, name: state.name});
    }

    const onDeleteProductHandler = () => {
        closeModal();
        dispatch(deleteProduct(state.productID,
            () => {},
            err => {console.log(err)}))
    }

    const productName = ({item: {id, name}}) =>
        <View style={styles.productContainerStyle}>
            <Text style={styles.productNameStyle}>{name}</Text>
            <FeatherIcon name='edit' size={20} color={green} onPress={() => onEditHandler(id)} />
        </View>


    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.createAccountHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '90%'}}>
                        <Text style={styles.createAccountHeaderTextStyle}>Products</Text>
                    </View>
                    <TopCornerImage image={images.orderIcon} />
                    <HeaderRight navigation={props.navigation} />
                </View>
                <View style={[styles.flatlistContainerStyle, {width: width * .8, height: height * .725}]}>
                    {products.length === 0 ? <EmptyComponent title='No Products added' /> :
                    <FlatList
                        data={products}
                        key={(item) => item.id}
                        renderItem={productName}
                        showsVerticalScrollIndicator={false}
                    />
                    }
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Add a product'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
                        onPress={addProductHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={state.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <View style={[styles.modalContainerStyle, {width: width * .8}]}>
                    <Text style={styles.modalTextStyle}>{state.name}</Text>
                    <Input 
                        placeholder='Update product name'
                        error={errors.productName}
                        value={values.productName}
                        onChangeText={handleChange('productName')}
                        keyboardType='default' 
                        onBlur={handleBlur('productName')}
                        touched={touched.productName}
                    />
                    <Button
                        title='Update product'
                        backgroundColor={green}
                        borderColor={green}
                        color={white} 
                        enabled onPress={handleSubmit}
                    />
                    <Button
                        title='Edit sub products'
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
                        enabled onPress={onDeleteProductHandler}
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
        marginTop: defaultSize * 4.5,
        width: '100%',
        alignItems: 'center'
    },
    createAccountHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    flatlistContainerStyle: {
        marginTop: defaultSize * 3
    },
    buttonContainerStyle: {
        position: 'absolute',
        bottom: defaultSize * 2
    },
    productContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: darkGray,
        borderBottomWidth: 1,
        marginVertical: defaultSize
    },
    productNameStyle: {
        fontSize: defaultSize
    },
    emptyProductContainerStyle: {
        alignItems: 'center'
    },
    emptyProductTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold'
    },
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

export default Products;