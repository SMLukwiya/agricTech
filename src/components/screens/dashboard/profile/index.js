import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView, PermissionsAndroid, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, red, lightGray, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Input = lazy(() => import('../../../common/input'));
const RNModal = lazy(() => import('../../../common/rnModal'));

const Profile = (props) => {
    const { height, width } = useWindowDimensions();

    // state
    const [state, setState] = useState({ 
        image: {},
        name: { value : 'John Mukoma'},
        phone: {value: '+256702496123'},
        location: {value: 'Wandegeya'},
        gender: {value: 'Male'},
        password: {value: ''},
        modal: {visible: false, type: ''}
    })

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
                    setState({ ...state, image: imageSrc, modal: {...state.modal, visible: false } });
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
                    setState({ ...state, image: imageSrc, modal: {...state.modal, visible: false } });
                }
            })
        }
    }

    const onChangeProfilePicHandler = (type) => {
        if ('granted' === PermissionsAndroid.RESULTS.GRANTED) {
            setState({...state, modal: {...state.modal, visible: true, type: 'image'}});
        } else {
            requsetCameraPermissions();
        }
    }

    const onChangeProfileInfo = (type) => {
        setState({...state, modal: {...state.modal, visible: true, type }})
    }

    const onChangeText = (value, type) => {
        setState({...state, [type]: {...state[type], value}});
    }

    const onChangeHandler = () => {
        
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

    const ProfileComponent = (type) => 
        <View style={[styles.changeProfileContainerStyle, {width}]}>
            <Text>Change {type}</Text>
            <View style={{width: width * .8}}>
                <Input
                    placeholder=""
                    onChangeText={(value) => onChangeText(value, type)}
                    value={state[type].value}
                    error=''
                />
            </View>
            <View style={[styles.profileChangeButtonContainerStyle, {width: width * .6}]}>
                <Button
                    title='Save'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={() => {}}
                />
            </View>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={styles.profileCloseIconStyle}>
                    <Icons name='close' size={30} color={white} onPress={CloseProfile} />
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <TouchableOpacity activeOpacity={.8} style={[styles.avatarImageContainerStyle]} onPress={onChangeProfilePicHandler}>
                    <Image source={state.image.uri ? {uri: state.image.uri} : images.avatar} style={styles.profileImageStyle} resizeMode='cover' />
                </TouchableOpacity>
                <View style={[styles.profileInfoContainer, {width: width * .8, height: height * .55}]}>
                    <View style={styles.profileTitleContainerStyle}>
                        <Text style={styles.profileNameStyle}>{state.name.value}</Text>
                        <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('name')} />
                    </View>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View>
                            <Text style={styles.profileAboutTitleTextStyle}>ABOUT</Text>
                            <Text style={styles.profileDescriptionTextStyle}>Lorem ipsum dolor sit amet elit. Integer et fringilla felis, id mauris. Nullam iaculis quam a justo porta</Text>
                        </View>
                        <View>
                            <Text style={styles.profileAboutTitleTextStyle}>PRIVATE INFORMATION</Text>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='mail' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{state.name.value}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('phone')} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='phone-enabled' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{state.phone.value}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Icons name='location-on' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{state.location.value}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('location')} />
                            </View>
                            <View style={styles.profilePrivateInfoContainerStyle}>
                                <View style={styles.profilePrivateLeftComponent}>
                                    <Ionicons name='ios-male-female-outline' size={25} color={darkGray} />
                                    <Text style={styles.privateProfileTextStyle}>{state.gender.value}</Text>
                                </View>
                                <Icon name='edit' size={20} color={green} onPress={() => onChangeProfileInfo('gender')} />
                            </View>
                            <View style={styles.profileChangePasswordTextStyle}>
                                <Text style={styles.profileChangeTitleTextStyle}>CHANGE PASSWORD</Text>
                                <TouchableOpacity activeOpacity={.8} style={styles.enterNewPasswordStyle} onPress={() => onChangeProfileInfo('password')}>
                                    <Ionicons name='lock-open' size={25} color={darkGray} />
                                    <Text style={styles.enterNewPasswordTextStyle}>Enter New Password</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                            <Button
                                title='Save'
                                backgroundColor={green}
                                borderColor={green}
                                color={white}
                                enabled onPress={() => {}}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Advanced Profile'
                        backgroundColor={white}
                        borderColor={green}
                        color={green}
                        enabled onPress={() => {}}
                    />
                </View>
            </SafeAreaView>
            <RNModal visible={state.modal.visible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {state.modal.type === 'image' ?
                    ImageComponent() :
                    state.modal.type === 'name' ?
                    ProfileComponent('name') :
                    state.modal.type === 'phone' ?
                    ProfileComponent('phone') :
                    state.modal.type === 'location' ?
                    ProfileComponent('location') :
                    state.modal.type === 'gender' ?
                    ProfileComponent('gender') :
                    ProfileComponent('password')
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
    }
})

export default Profile;