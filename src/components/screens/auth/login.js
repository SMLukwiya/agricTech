import React, { Suspense, lazy, useEffect, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { CommonActions } from '@react-navigation/native';

import { colors, images, defaultSize, errorTextStyle } from '../../../config';
import Fallback from '../../common/fallback';
import {loginEmail, googleSignup, resetLoaders, sendPasswordReset, phoneLogin } from '../../../store/actions';

const { white, green, blue, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../common/button'));
const Input = lazy(() => import('../../common/input'));
const RNModal = lazy(() => import('../../common/rnModal'));

const Login = (props) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();

    // redux
    const reduxState = useSelector(state => state.user);

    // state
    const [modal, setModal] = useState({visible: false, type: ''})
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState({value: '', error: '', touched: false });

    // regex
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    useEffect(() => {
        // configure google sign in
        GoogleSignin.configure({
            webClientId: '400307057307-9l1g5d73rlgq4lp5klogrg9r5mhtbmpl.apps.googleusercontent.com'
        });
        dispatch(resetLoaders())
    }, [])

    const closeModal = () => setModal({...modal, visible: false});

    const passwordResetEmail = (value) => {
        setForgotPasswordEmail({
            ...forgotPasswordEmail,
            value,
            touched: true
        })
    }

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { emailorphonenumber: '', password: '' },
        validationSchema: Yup.object({
            emailorphonenumber: Yup.string().required('Email is required'),
            password: Yup.string().min(6, 'Must be atleast 6 characters').required('Password is required')
        }),
        onSubmit: values => {
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

            if (re.test(values.emailorphonenumber)) {
                dispatch(loginEmail(values,
                    () => 
                        props.navigation.dispatch(CommonActions.reset({
                        type: 'stack',
                        index: 0,
                        routes: [{name: 'dashboard'}]
                    })),
                    err => console.log(err)
                ));
            } else if (phoneRegex.test(values.emailorphonenumber)) {
                dispatch(phoneLogin(values,
                    () => 
                        props.navigation.dispatch(CommonActions.reset({
                        type: 'stack',
                        index: 0,
                        routes: [{name: 'dashboard'}]
                        })),
                    err => console.log(err)
                ));
            } else {
                Alert.alert('Enter a valid email or phone number')
            }
        }
    });

    const createAccountHandler = () => props.navigation.navigate('signup');

    // google signin
    const googleSigninHandler = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential = auth.GoogleAuthProvider.credential(idToken);
            const googleData = await auth().signInWithCredential(googleCredential);
            const {user: {displayName, email, phoneNumber, uid}} = googleData;
            await dispatch(googleSignup({idToken, email, uid, fullName: displayName, phone: phoneNumber}));

            props.navigation.dispatch(CommonActions.reset({
                type: 'stack',
                index: 0,
                routes: [{name: 'dashboard'}]
            }))
        } catch (err) {
            if (err.code === statusCodes.SIGN_IN_CANCELLED) console.log('user cancalled sign in process')
            else if (err.code === statusCodes.IN_PROGRESS) console.log('sign in process still in progress')
            else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) console.log('Play services not available')
            else console.log(err)
        }
    }

    const onForgotPasswordHandler = () => {
        setModal({...modal, visible: true, type: 'passwordreset'});
    }

    // forgot password
    const onConfirmPasswordReset = () => {
        if (!forgotPasswordEmail.value || !re.test(forgotPasswordEmail.value)) return setForgotPasswordEmail({...forgotPasswordEmail, error: 'Please enter correct email.'})
        closeModal();
        dispatch(sendPasswordReset(forgotPasswordEmail.value,
            () => {
                setModal({visible: true, type: 'passwordResetSuccess'})
            },
            (err) => {console.log(err)}));
    }

    const passwordResetComponent = () =>
        <View style={[styles.modalContainerStyle, {width: width * .8}]}>
            <Text style={styles.enterEmailTextStyle}>Enter email you used to register?</Text>
            <Input
                placeholder="Enter the email you used to register"
                error={forgotPasswordEmail.error}
                value={forgotPasswordEmail.value}
                rightComponent={false}
                onChangeText={passwordResetEmail}
                onBlur={() => {}}
                touched={forgotPasswordEmail.touched}
                keyboardType='default'
            />
            <Button
                title='Continue'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled onPress={onConfirmPasswordReset}
            />
        </View>

        const passwordResetSuccessComponent = () =>
            <View style={[styles.modalContainerStyle, {width: width * .8}]}>
                <Text style={styles.passwordResetSuccessTextStyle}>Instructions on how to change your password has been sent to your email.</Text>
                <Button
                    title='close'
                    backgroundColor={green}
                    borderColor={green}
                    color={white}
                    enabled onPress={closeModal}
                />
            </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={reduxState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <KeyboardAvoidingView behavior='padding'>
                    <View style={styles.logoContainer}>
                        <View style={[styles.logoImageContainer, {width: width * .6, height: width * .275}]}>
                            <Image source={images.logo} style={styles.logoImage}  />
                        </View>
                    </View>
                    <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                        
                            <Input
                                placeholder="Email/Phone Number"
                                error={errors.emailorphonenumber}
                                value={values.emailorphonenumber}
                                rightComponent={false}
                                onChangeText={handleChange('emailorphonenumber')}
                                onBlur={(handleBlur('emailorphonenumber'))}
                                touched={touched.emailorphonenumber}
                                keyboardType='default'
                                label='email or phone(+2567...)'
                            />
                            <Input
                                placeholder="Password"
                                error={errors.password}
                                value={values.password}
                                rightComponent={false}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                touched={touched.password}
                                secureTextEntry={true}
                            />
                        
                        {!!reduxState.error && <Text style={errorTextStyle}>{reduxState.error}</Text>}
                        <View>
                            <Button
                                title='Sign in'
                                backgroundColor={green}
                                borderColor={green}
                                color={white}
                                enabled onPress={handleSubmit}
                            />
                            <TouchableOpacity activeOpacity={.8} onPress={onForgotPasswordHandler}>
                                <Text style={styles.forgotPasswordTextStyle}>Forgot password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                
                    <View style={[styles.createAccountContainerStyle, {width: width * .8}]}>
                        <Text style={styles.forgotPasswordTextStyle}>Don't have an account?</Text>
                        <Button
                            title='Create Account'
                            backgroundColor={blue}
                            borderColor={blue}
                            color={white}
                            enabled onPress={createAccountHandler}
                        />
                        <Text style={{textAlign: 'center'}}>Or</Text>
                        {/* {<Button
                            title='Continue with facebook'
                            backgroundColor={white}
                            borderColor={darkGray}
                            color={darkGray}
                            leftComponent={<Icons name='facebook' color={blue} size={25} />}
                        />} */}
                        <Button
                            title='Continue with Google'
                            backgroundColor={white}
                            borderColor={darkGray}
                            color={darkGray}
                            leftComponent={<Image source={images.googleIcon} height={30} width={30} />}
                            enabled onPress={googleSigninHandler}
                        />
                    </View>
                    </KeyboardAvoidingView>
                <RNModal visible={modal.visible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                    {modal.type === 'passwordreset' ? 
                        passwordResetComponent() :
                        passwordResetSuccessComponent()
                    }
                </RNModal>
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
    logoContainer: {
        marginTop: defaultSize * 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImageContainer: {
        
    },
    inputContainerStyle: {
        marginTop: defaultSize * 5,
    },
    logoImage: {
        width: '100%',
        height: '100%'
    },
    forgotPasswordTextStyle: {
        fontSize: defaultSize * .7,
        color: darkGray,
        marginLeft: defaultSize
    },
    createAccountContainerStyle: {
        marginTop: defaultSize * 2,
        marginBottom: defaultSize * 1.5
    },
    modalContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize,
        paddingHorizontal: defaultSize * .5,
        borderRadius: defaultSize * 1.5,
        overflow: 'hidden'
    },
    enterEmailTextStyle: {
        textAlign:'center',
        fontSize: defaultSize * .85,
        fontWeight: 'bold'
    },
    passwordResetSuccessTextStyle: {
        textAlign: 'center'
    }
});

export default Login;