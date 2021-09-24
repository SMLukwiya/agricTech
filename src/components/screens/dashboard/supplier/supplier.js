import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView, PermissionsAndroid, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { deleteSupplier, updateSupplier, updateSupplierImage } from '../../../../store/actions';

const { white, green, red, lightGray, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Input = lazy(() => import('../../../common/input'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const Supplier = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    const [state, setState] = useState({ image: {} })
    const [modal, setModal] = useState({ modalVisible: false, error: '', type: '' });

    const supplierState = useSelector(state => state.supplier)
    const {userID} = useSelector(state => state.user);
    const suppliers = supplierState.suppliers.filter(item => item.userID === userID);

    const { route: { params: {id} }} = props;
    const supplier = suppliers.find(item => item.id === id);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { fullName: supplier ? supplier.name : '', phoneNumber: supplier ? supplier.phone : '', email: supplier ? supplier.email : '', location: supplier ? supplier.address : '', category: supplier ? supplier.category : '', supplies: supplier ? supplier.supplies: '' },
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
                dispatch(updateSupplier(supplier.id, values,
                    () => {},
                    err => setModal({...modal, error: err})))
            }, 200);
        }
    });

    const onGoBackHandler = () => {
        props.navigation.goBack();
    }

    const onEditHandler = () => {
        setModal({...modal, modalVisible: true, type: 'info'})
    }

    const closeModal = () => {
        setModal({...modal, modalVisible: false, error: '', type: ''})
    }

    const deleteSupplierHandler = () => {
        dispatch(deleteSupplier(supplier.id,
            () => onGoBackHandler(),
            err => console.log(err)))
    }

    if (suppliers.length === 0) {
        return (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{fontSize: defaultSize, fontWeight: 'bold'}}>No suppliers added</Text>
            </View>
        )
    }

    const options = {
        mediaType: 'photo',
        quality: 1,
        cameraType: 'front',
        saveToPhotos: true
    }

    const requsetCameraPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                    title: 'Camera Permissions',
                    message: 'Metajua would like to access camera for better experience',
                    buttonPositive: 'Okay',
                    buttonNegative: 'No'
                });

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    setModal({...state.modal, modalVisible: true, type: 'image'})
                } else {
                    return console.log('Camera permissions denied');
                }
            } catch (err) {
                return console.error('Camera error ', err);
            }
        } else {
            setModal({...state.modal, modalVisible: true, type: 'image'})
        }
    }

    const imageHandler = (type) => {
        closeModal();
        if (type === 'camera') {
            launchCamera(options, response => {
                if (response.didCancel) {
                    return console.log('Operation cancelled');
                } else if (response.errorCode) {
                    return console.log(`Operation cancelled with error code ${response.errorCode}`)
                } else {
                    const imageSrc = response.assets[0];
                    setModal({...state.modal, modalVisible: false, type: 'save_image'})
                    setState({ ...state, image: imageSrc });
                    setTimeout(() => {
                        setModal({...state.modal, modalVisible: true, type: 'save_image'})
                    }, 350);
                }
            })
        } else {
            launchImageLibrary(options, response => {
                if (response.didCancel) {
                    return console.log('Operation canceeled');
                } else if (response.errorCode) {
                    return console.log(`Operation error code ${response.errorCode}`);
                } else {
                    const imageSrc = response.assets[0];
                    setModal({...state.modal, modalVisible: false, type: 'save_image'})
                    setState({ ...state, image: imageSrc });
                    setTimeout(() => {
                        setModal({...state.modal, modalVisible: true, type: 'save_image'})
                    }, 350);
                }
            })
        }
    }

    const onChangeProfilePicHandler = (type) => {
        const granted = PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
            title: 'Camera Permissions',
            message: 'Metajua would like to access camera for better experience',
            buttonPositive: 'Okay',
            buttonNegative: 'No'
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setModal({...modal, modalVisible: true, type: 'image'})
        } else {
            requsetCameraPermissions();
        }
    }

    const saveAvatarHandler = () => {
        closeModal();
        dispatch(updateSupplierImage(state.image, supplier.id,
            () => {},
            err => {console.log(err)}))
    }

    const ImageComponent = () =>
        <View style={[styles.imageComponentContainerStyle, {width: width * .8}]}>
            <Button
                title='Choose photo'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled onPress={() => imageHandler('gallery')}
            />
            <Button
                title='Take photo'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled onPress={() => imageHandler('camera')}
            />
        </View>

    const SaveImageComponent = () => 
        <View style={[styles.saveImageButtonContainerStyle, {width: width * .8}]}>
            <Button
                title='Save Image'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled
                onPress={saveAvatarHandler} 
            />
        </View> 

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

        const errorComponent = () => 
            <View>
                <Text></Text>
            </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={supplierState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.profileCloseIconStyle, {width}]}>
                    <Icons name='arrow-back-ios' size={30} color={white} onPress={onGoBackHandler} style={{width: '7%'}} />
                    <View style={{justifyContent:'center', width: '80%'}}>
                        <Text style={styles.customerHeaderTitleStyle}>{supplier ? supplier.name : ''}</Text>
                    </View>
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <TouchableOpacity activeOpacity={.8} style={[styles.avatarImageContainerStyle]} onPress={onChangeProfilePicHandler}>
                    <Image source={ supplier && supplier.imageUrl ? {uri: supplier.imageUrl} : images.avatar} style={styles.profileImageStyle} resizeMode='cover' />
                </TouchableOpacity>
                <View style={[styles.profileInfoContainer, {width: width * .8, height: height * .55}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Text style={styles.privateProfileNameTextStyle}>{supplier ? supplier.name : ''}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='phone-enabled' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{supplier ? supplier.phone : ''}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='mail' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{supplier ? supplier.email : ''}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='location-on' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{supplier ? supplier.address : ''}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='category' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{supplier ? supplier.category : ''}</Text>
                                </View>
                                <FeatherIcons name='edit' size={20} color={green} onPress={onEditHandler} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                <Icons name='category' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{supplier ? supplier.supplies : ''}</Text>
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
                        enabled onPress={deleteSupplierHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {modal.type === 'image' ?
                    ImageComponent() :
                    modal.type === 'info' ?
                    updateComponent() :
                    SaveImageComponent()
                }
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
        paddingLeft: defaultSize,
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
        marginLeft: defaultSize * 2.5,
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
    },
    // 
    saveImageButtonContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize,
        paddingVertical: defaultSize * 2,
        paddingHorizontal: defaultSize,
        overflow: 'hidden'
    },
})

export default Supplier;