import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';
import {loginEmail} from '../../../store/actions';

const { white, green, blue, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../common/button'));
const Input = lazy(() => import('../../common/input'));

const Login = (props) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();

    // redux
    const reduxState = useSelector(state => state.user);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { emailorphonenumber: '', password: '' },
        validationSchema: Yup.object({
            emailorphonenumber: Yup.string().required('Email or phone number is required'),
            password: Yup.string().min(6, 'Must be atleast 6 characters').required('Password is required')
        }),
        onSubmit: values => {
            dispatch(loginEmail(values,
                () => props.navigation.navigate('dashboard'),
                err => console.log(err)
            ));
        }
    });

    const createAccountHandler = () => props.navigation.navigate('signup');

    // google signin
    const googleSigninHandler = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const user = await GoogleSignin.signIn();
            console.log('GOogle user ', user)
        } catch (err) {
            if (err.code === statusCodes.SIGN_IN_CANCELLED) console.log('user cancalled sign in process')
            else if (err.code === statusCodes.IN_PROGRESS) console.log('sign in process still in progress')
            else if (err.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) console.log('Play services not available')
            else console.log('Something went wrong')
        }
    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={reduxState.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <ScrollView contentContainerStyle={{alignItems: 'center'}} showsVerticalScrollIndicator={false}>
                    <View style={styles.logoContainer}>
                        <View>
                            <Image source={images.logo} />
                        </View>
                    </View>
                    <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                        <KeyboardAvoidingView>
                            <Input
                                placeholder="Email/Phone Number"
                                error={errors.emailorphonenumber}
                                value={values.emailorphonenumber}
                                rightComponent={false}
                                onChangeText={handleChange('emailorphonenumber')}
                                onBlur={(handleBlur('emailorphonenumber'))}
                                touched={touched.emailorphonenumber}
                                keyboardType='default'
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
                        </KeyboardAvoidingView>
                        <View>
                            <Button
                                title='Sign in'
                                backgroundColor={green}
                                borderColor={green}
                                color={white}
                                enabled onPress={handleSubmit}
                            />
                            <Text style={styles.forgotPasswordTextStyle}>Forgot password</Text>
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
                        <Button
                            title='Continue with facebook'
                            backgroundColor={white}
                            borderColor={darkGray}
                            color={darkGray}
                            leftComponent={<Icons name='facebook' color={blue} size={25} />}
                        />
                        <Button
                            title='Continue with Google'
                            backgroundColor={white}
                            borderColor={darkGray}
                            color={darkGray}
                            leftComponent={<Image source={images.googleIcon} height={30} width={30} />}
                            enabled onPress={googleSigninHandler}
                        />
                    </View>
                </ScrollView>
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
        marginTop: defaultSize * 4
    },
    inputContainerStyle: {
        marginTop: defaultSize * 5
    },
    forgotPasswordTextStyle: {
        fontSize: defaultSize * .7,
        color: darkGray,
        marginLeft: defaultSize
    },
    createAccountContainerStyle: {
        marginTop: defaultSize * 2,
        marginBottom: defaultSize * 1.5
    }
});

export default Login;