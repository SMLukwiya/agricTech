import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createSupplier } from '../../../../store/actions'

const { white, green, blue, darkGray } = colors;
const Select = lazy(() => import('../../../common/select'));
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));

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

const AddCustomer = (props) => {
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();

    // redux
    const supplierState = useSelector(state => state.supplier);
    const {userID} = useSelector(state => state.user);

    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45), name: 'Category', open: false});

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { name: '', phone: '', email: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().required('Phone is required'),
            email: Yup.string().email('Please enter valid email').required('Email is required')
        }),
        onSubmit: values => {
            dispatch(createSupplier({values, category: category.name, userID},
                () => {
                    props.navigation.navigate('suppliers')
                },
                err => console.log(err)
            ))
        }
    });

    const goBack = () => props.navigation.navigate('home');

    const onToggleCategory = () => {
        LayoutAnimation.configureNext(transition);
        setCategory({...category, open: !category.open});
        Animated.timing(category.progress, {
            toValue: category.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const onCategorySelect = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        setCategory({...category, id, name, open: false});
        Animated.timing(category.progress, {
            toValue: category.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const enabled = category.name !== 'Category'

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={supplierState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.supplierHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.supplierHeaderTextStyle}>Add a supplier & category</Text>
                    </View>
                </View>
                <View style={[styles.addSupplierContainerStyle, {width: width * .8}]}>
                    <ScrollView>
                        <View>
                            <Text style={styles.selectCategoryStyle}>Select a supplier category</Text>
                            <Select
                                height={category.progress}
                                onToggleSelector={() => onToggleCategory()}
                                productName={category.name}
                                isProductOpen={category.open}
                                productList={categories}
                                onProductSelect={onCategorySelect}
                                buttonTitle={category.name}
                                onCreateHandler={() => onCreateHandler()}
                            />
                        </View>
                        <View style={styles.addSupplierInputContainerStyle}>
                            <Text style={styles.enterSupplierTextStyle}>Enter supplier</Text>
                            <Input
                                placeholder="name"
                                error={errors.name}
                                value={values.name}
                                rightComponent={false}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                touched={touched.name}
                            />
                            <Input
                                placeholder="phone"
                                error={errors.phone}
                                value={values.phone}
                                rightComponent={false}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                touched={touched.phone}
                            />
                            <Input
                                placeholder="email"
                                error={errors.email}
                                value={values.email}
                                rightComponent={false}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                touched={touched.email}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Save & Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled}
                        onPress={handleSubmit}
                    />
                </View>
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
    supplierHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    supplierHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    addSupplierContainerStyle: {
        marginTop: defaultSize * 2
    },
    addSupplierInputContainerStyle: {
        marginTop: defaultSize * 2,
    },
    selectCategoryStyle: {
        fontSize: defaultSize * .85,
        marginBottom: defaultSize
    },
    addSupplierContainerStyle: {
        marginTop: defaultSize * 2
    },
    enterSupplierTextStyle: {
        fontSize: defaultSize * .8,
        marginBottom: defaultSize
    },
    buttonContainerStyle: {
        marginTop: defaultSize * 4
    }
});

export default AddCustomer;