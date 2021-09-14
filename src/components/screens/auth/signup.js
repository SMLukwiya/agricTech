import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, ScrollView, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, images, defaultSize, spinnerStyle } from '../../../config';
import Fallback from '../../common/fallback';
import { userEmailSignup } from '../../../store/actions'

const { white, green, blue, darkGray } = colors;
const Button = lazy(() => import('../../common/button'));
const Input = lazy(() => import('../../common/input'));


const Signup = (props) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();

    // redux
    const state = useSelector(state => state.user);

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { fullName: '', phoneNumber: '', email:'', password: '' },
        validationSchema: Yup.object({
            fullName: Yup.string().required('Name is required'),
            phoneNumber: Yup.number('Enter a valid phone number').min(10, 'Phone number must be 10 digits').required('Phone number is required'),
            email: Yup.string().email('Enter valid email address').required('Email is required'),
            password: Yup.string().min(6, 'Must be atleast 6 characters').required('Password is required')
        }),
        onSubmit: values => {
            dispatch(userEmailSignup(values,
                () => props.navigation.navigate('dashboard'),
                err => console.log(err)
            ));
        }
    });

    const goBack = () => props.navigation.navigate('login');

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={state.loading} textContent={'Loading'} textStyle={{}} size='normal' overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={[styles.createAccountHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.createAccountHeaderTextStyle}>Create Your Account</Text>
                    </View>
                </View>
                <View style={[styles.inputContainerStyle, {width: width * .8}]}>
                    <KeyboardAvoidingView>
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
                            placeholder="Password"
                            error={errors.password}
                            value={values.password}
                            rightComponent={false}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            touched={touched.password}
                        />
                    </KeyboardAvoidingView>
                     <View style={styles.termsAndConditionStyle}>
                        <Text style={styles.forgotPasswordTextStyle}>By creating an account, you agree to our <Text>Terms&Conditions</Text> and <Text>PrivacyPolicy</Text></Text>
                        <Button
                            title='Sign Up'
                            backgroundColor={green}
                            borderColor={green}
                            color={white}
                            enabled onPress={handleSubmit}
                        />
                     </View>
                </View>
                <View style={[styles.createAccountContainerStyle, {width: width * .8}]}>
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
    createAccountHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    createAccountHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    inputContainerStyle: {
        marginTop: defaultSize * 3.5
    },
    termsAndConditionStyle: {
        marginTop: defaultSize * 1.75
    },
    forgotPasswordTextStyle: {
        fontSize: defaultSize * .7,
        color: darkGray,
        marginVertical: defaultSize * .5,
        textAlign: 'center'
    },
    createAccountContainerStyle: {
        marginTop: defaultSize * 2,
        marginBottom: defaultSize * 1.5
    }
});

export default Signup;