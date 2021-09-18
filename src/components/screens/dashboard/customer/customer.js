import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { deleteCustomer, updateCustomer } from '../../../../store/actions';

const { white, green, red, lightGray, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Input = lazy(() => import('../../../common/input'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const Customer = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    const [modal, setModal] = useState({ modalVisible: false, error: '' });

    const {customers, loading} = useSelector(state => state.customer)

    const { route: { params: {id} }} = props;
    const customer = customers.find(item => item.id === id);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { fullName: customer.name, phoneNumber: customer.phone, email: customer.email, location: customer.address, category: customer.category, supplies: customer.supplies },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Name is required'),
            phoneNumber: Yup.number('Enter a valid phone number').min(10, 'Phone number must be 10 digits').required('Phone number is required'),
            email: Yup.string().email('Enter valid email address').required('Email is required'),
            location: Yup.string().required('Password is required'),
            category: Yup.string().required('Enter Supplier Category'),
            supplies: Yup.string().required('Enter Supplier supplies')
        }),
        onSubmit: values => {
            closeModal();
            setTimeout(() => {
                dispatch(updateCustomer(customer.uid, values,
                    () => {},
                    err => setModal({...modal, error: err})))
            }, 200);
        }
    });

    const onGoBackHandler = () => {
        props.navigation.goBack();
    }

    const onEditHandler = () => {
        setModal({...modal, modalVisible: true})
    }

    const closeModal = () => {
        setModal({...modal, modalVisible: false, error: ''})
    }

    const deleteCustomerHandler = () => {
        dispatch(deleteCustomer(customer.uid,
            () => onGoBackHandler(),
            err => console.log(err)))
    }

    if (customers.length === 0) {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: defaultSize, fontWeight: 'bold'}}>No supplier added</Text>
            </View>
        )
    }

    // update component
    const updateComponent = () => 
        <View  style={[styles.modalContainerStyle, {width: width * .8}]}>
            <KeyboardAvoidingView >
                <Input
                    placeholder="Full Name"
                    error={errors.fullName}
                    value={values.fullName}
                    rightComponent={false}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    touched={touched.fullName}
                />
                <Input
                    placeholder="Phone Number"
                    error={errors.phoneNumber}
                    value={values.phoneNumber}
                    rightComponent={false}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    touched={touched.phoneNumber}
                />
                <Input
                    placeholder="Email"
                    error={errors.email}
                    value={values.email}
                    rightComponent={false}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    touched={touched.email}
                />
                <Input
                    placeholder="Location"
                    error={errors.location}
                    value={values.location}
                    rightComponent={false}
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                    touched={touched.location}
                />
                <Input
                    placeholder="Category"
                    error={errors.category}
                    value={values.category}
                    rightComponent={false}
                    onChangeText={handleChange('category')}
                    onBlur={handleBlur('category')}
                    touched={touched.category}
                />
                <Input
                    placeholder="Supplies"
                    error={errors.supplies}
                    value={values.supplies}
                    rightComponent={false}
                    onChangeText={handleChange('supplies')}
                    onBlur={handleBlur('supplies')}
                    touched={touched.supplies}
                />
             
                <View style={styles.modalButtonContainerStyle}>
                    <Button
                        title='Save changes'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled onPress={handleSubmit}
                    />
                </View>
             </KeyboardAvoidingView>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.profileCloseIconStyle, {width}]}>
                    <Icons name='arrow-back-ios' size={30} color={white} onPress={onGoBackHandler} style={{width: '5%'}} />
                    <View style={{justifyContent:'center', width: '80%'}}>
                        <Text style={styles.customerHeaderTitleStyle}>{customer.name}</Text>
                    </View>
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <TouchableOpacity activeOpacity={.8} style={[styles.avatarImageContainerStyle]}>
                    <Image source={images.avatar} style={styles.profileImageStyle} resizeMode='cover' />
                </TouchableOpacity>
                <View style={[styles.profileInfoContainer, {width: width * .8, height: height * .55}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.privateProfileNameTextStyle}>
                                    <Text style={styles.privateProfileTextStyle}>{customer.name}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='phone-enabled' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{customer.phone}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='mail' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{customer.email}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='location-on' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{customer.address}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='category' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{customer.category}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='category' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{customer.supplies}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Delete'
                        backgroundColor={red}
                        borderColor={red}
                        color={white}
                        enabled onPress={deleteCustomerHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {updateComponent()}
            </RNModal>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    profileCloseIconStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        height: defaultSize * 3,
        top: defaultSize * 2.5,
        paddingLeft: defaultSize * 2,
        zIndex: 9,
        alignItems: 'center'
    },
    customerHeaderTitleStyle: {
        fontSize: defaultSize * 1.25,
        color: white,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    topBarStyle: {
        height: defaultSize * 6,
        backgroundColor: green
    },
    imageCurveStyle: {
        height: defaultSize * 9,
        tintColor: green
    },
    avatarImageContainerStyle: {
        height: defaultSize * 7,
        width: defaultSize * 7,
        borderRadius: (defaultSize * 7) * .5,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: green,
        marginTop: -defaultSize * 7,
    },
    profileImageStyle: {
        height: '100%',
        width: '100%'
    },
    profileInfoContainer: {
        marginTop: defaultSize * .5
    },
    profileTitleContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: defaultSize * .5
    },
    profileNameStyle: {
        fontSize: defaultSize * 1.15,
        fontWeight: 'bold'
    },
    profileAboutTitleTextStyle: {
        fontSize: defaultSize * .75,
        fontWeight: 'bold',
        marginVertical: defaultSize * .5
    },
    profileDescriptionTextStyle: {
        fontSize: defaultSize * .75,
        marginVertical: defaultSize * .5
    },
    profilePrivateInfoContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: darkGray,
        borderBottomWidth: 1,
        marginVertical: defaultSize
    },
    privateProfileNameTextStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: defaultSize * 1.5,
    },
    profilePrivateLeftComponent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    privateProfileTextStyle: {
        marginLeft: defaultSize
    },
    profileChangePasswordTextStyle: {
        marginTop: defaultSize
    },
    profileChangeTitleTextStyle: {
        fontSize: defaultSize * .75,
        fontWeight: 'bold'
    },
    enterNewPasswordStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: defaultSize * .65
    },
    enterNewPasswordTextStyle: {
        fontSize: defaultSize * .85,
        marginLeft: defaultSize
    },
    buttonContainerStyle: {
        marginTop: defaultSize * .75
    },
    //
    imageComponentContainerStyle: {
        position: 'absolute',
        bottom: defaultSize
    },
    // 
    changeProfileContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize * 3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: defaultSize,
        overflow: 'hidden'
    },
    profileChangeButtonContainerStyle: {
        marginTop: defaultSize * 2
    },
    modalContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize,
        borderRadius: defaultSize,
        overflow: 'hidden',
        paddingHorizontal: defaultSize * .5,
        justifyContent: 'center'
    },
    modalButtonContainerStyle: {
        marginTop: defaultSize
    }
})

export default Customer;