import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView, 
    PermissionsAndroid, Platform, KeyboardAvoidingView, Animated, LayoutAnimation, UIManager, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { updateProfileImage, updateUserInfo, updatePassword } from '../../../../store/actions';

const { white, green, red, lightGray, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Input = lazy(() => import('../../../common/input'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const Select = lazy(() => import('../../../common/select'));

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const Profile = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const userState = useSelector(state => state.user);
    const {user, gender} = userState;

    // state
    const [state, setState] = useState({ 
        image: {},
        modal: {visible: false, type: '', error: ''},
        password: {value: '', error: ''}
    })

    const [userGender, setGender] = useState({progress: new Animated.Value(45), name: 'Gender', open: false});

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { fullName: user ? user.fullName : '', about: user ? user.about : '', phone: user ? user.phone : '', location: user ? user.location : '' },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Name is required'),
            about: Yup.string().required('About Information is required'),
            phone: Yup.number('Enter a valid phone number').min(10, 'Phone number must be 10 digits').required('Phone number is required'),
            location: Yup.string().required('Location is required')
        }),
        onSubmit: values => {
            if (userGender.name === 'Gender') return Alert.alert('Select gender')
            closeModal();
            setTimeout(() => {
                dispatch(updateUserInfo(userState.userID, {...values, gender: userGender.name},
                    () => {},
                    err => {
                        console.log(err)
                        // setState({...state, modal: {...state.modal, visible: true, type: 'error', error: err}})
                    }))
            }, 200);
        }
    });

    const CloseProfile = () => props.navigation.navigate('home');

    const closeModal = () => {
        setState({...state, modal: {...state.modal, visible: false, type: ''}});
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
                    setState({...state, modal: {...state.modal, visible: true, type: 'image'}});
                } else {
                    return console.log('Camera permissions denied');
                }
            } catch (err) {
                return console.error('Camera error ', err);
            }
        } else {
            setState({...state, modal: {...state.modal, visible: true, type: 'image'}});
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
                    setState({ ...state, image: imageSrc, modal: {...state.modal, visible: false, type: 'save_image' } });
                    setTimeout(() => {
                        setState({...state, modal: {...state.modal, visible: true, type: 'save_image' } })
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
                    setState({ ...state, image: imageSrc, modal: {...state.modal, visible: false, type: 'save_image' } });
                    setTimeout(() => {
                        setState({...state, modal: {...state.modal, visible: true, type: 'save_image' } })
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
            setState({...state, modal: {...state.modal, visible: true, type: 'image'}});
        } else {
            requsetCameraPermissions();
        }
    }

    const onChangeProfileInfo = (type) => {
        setState({...state, modal: {...state.modal, visible: true, type }})
    }

    const saveAvatarHandler = () => {
        closeModal();
        dispatch(updateProfileImage(state.image, userState.userID,
            () => {},
            err => {console.log(err)}))
    }

    const onChangePasswordHandler = (value) => {
        setState({...state, password: {...state.password, value}})
    }

    const updateUserPassword = () => {
        if (state.password.value.length < 6) return setState({...state, password: {...state.password, error: 'Minimum character is 6'}})
        closeModal();
        setTimeout(() => {
            dispatch(updatePassword(userState.userID, state.password.value,
                () => {
                    setState({...state, password: {...state.password, error: '', value: ''}})
                },
                err => {console.log(err)} ))
        }, 200);
    }

    // move to advanced profile
    const onAdvancedHandler = () => {
        props.navigation.navigate('advancedprofile')
    }

    // open gender select
    const onToggleGenderSelect = () => {
        LayoutAnimation.configureNext(transition);
        setGender({...userGender, open: !userGender.open });
        Animated.timing(userGender.progress, {
            toValue: userGender.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const onSelectGender = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        setGender({...userGender, name, open: false });
        Animated.timing(userGender.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
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

    const ProfileComponent = () => 
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
                placeholder="About"
                error={errors.about}
                value={values.about}
                rightComponent={false}
                onChangeText={handleChange('about')}
                onBlur={handleBlur('about')}
                touched={touched.about}
            />
            <Input
                placeholder="Phone Number"
                error={errors.phone}
                value={values.phone}
                rightComponent={false}
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                touched={touched.phone}
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
            <Select
                height={userGender.progress}
                onToggleSelector={onToggleGenderSelect}
                productName={userGender.name}
                isProductOpen={userGender.open}
                productList={gender}
                onProductSelect={onSelectGender}
                buttonTitle='Select Gender'
                onCreateHandler={() => {}}
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

    const PasswordComponent = () => 
        <View style={[styles.saveImageButtonContainerStyle, {width: width * .8}]}>
            <Input
                placeholder="New Password"
                error={state.password.error}
                value={state.password.value}
                rightComponent={false}
                onChangeText={onChangePasswordHandler}
                onBlur={() => {}}
                touched={true}
            />
            <Button
                title='Save'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled={state.password.value}
                onPress={updateUserPassword} 
            />
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={userState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={styles.profileCloseIconStyle}>
                    <Icons name='close' size={30} color={white} onPress={CloseProfile} />
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <TouchableOpacity activeOpacity={.8} style={[styles.avatarImageContainerStyle]} onPress={onChangeProfilePicHandler}>
                    <Image source={user.imageUrl ? {uri: user.imageUrl} : images.avatar} style={styles.profileImageStyle} resizeMode='cover' />
                </TouchableOpacity>
                <View style={[styles.profileInfoContainer, {width: width * .8, height: height * .55}]}>
                    <View style={styles.profileTitleContainerStyle}>
                        <Text style={styles.profileNameStyle}>{user.fullName}</Text>
                        <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('info')} />
                    </View>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View>
                            <Text style={styles.profileAboutTitleTextStyle}>ABOUT</Text>
                            <Text style={styles.profileDescriptionTextStyle}>{user.about}</Text>
                        </View>
                        <View>
                            <Text style={styles.profileAboutTitleTextStyle}>PRIVATE INFORMATION</Text>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='mail' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{user.fullName}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('info')} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='phone-enabled' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{user.phone}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='location-on' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{user.location}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('info')} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Ionicons name='ios-male-female-outline' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{user.gender}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('info')} />
                            </View>
                            <View style={styles.profileChangePasswordTextStyle}>
                                <Text style={styles.profileChangeTitleTextStyle}>CHANGE PASSWORD</Text>
                                <TouchableOpacity activeOpacity={.8} style={styles.enterNewPasswordStyle} onPress={() => onChangeProfileInfo('password')}>
                                    <Ionicons name='lock-open' size={25} color={darkGray} />
                                    <Text style={styles.enterNewPasswordTextStyle}>Enter New Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Advanced Profile'
                        backgroundColor={white}
                        borderColor={green}
                        color={green}
                        enabled onPress={onAdvancedHandler}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={state.modal.visible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <View style={{height: height * .65}}>
                    <ScrollView>
                        {state.modal.type === 'image' ?
                            ImageComponent() :
                            state.modal.type === 'info' ?
                            ProfileComponent('name') :
                            state.modal.type === 'password' ?
                            PasswordComponent() :
                            SaveImageComponent()
                        }
                    </ScrollView>
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
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    profileCloseIconStyle: {
        position: 'absolute',
        height: defaultSize * 3,
        width: defaultSize * 3,
        top: defaultSize * 2.5,
        left: defaultSize * 2,
        zIndex: 9
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
    // 
    saveImageButtonContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize,
        paddingVertical: defaultSize * 2,
        paddingHorizontal: defaultSize,
        overflow: 'hidden'
    },
    // 
    modalContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize,
        paddingHorizontal: defaultSize,
        borderRadius: defaultSize,
        overflow: 'hidden'
    }
})

export default Profile;