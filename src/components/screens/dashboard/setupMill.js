import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';
import { setupMill } from '../../../store/actions';

const { white, green, blue, } = colors;
const Input = lazy(() => import('../../common/input'));
const Button = lazy(() => import('../../common/button'));

const SetupMill = (props) => {
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();

    // redux
    const {loading} = useSelector(state => state.miller)
    const {userID} = useSelector(state => state.user)

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { name: '', location: '', capacity: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name of the mill is required'),
            location: Yup.string().required('Location of mill is required'),
            capacity: Yup.string().required('Capacity of mill is required')
        }),
        onSubmit: values => {
            dispatch(setupMill(values, userID,
                () => {
                    props.navigation.navigate('selectmill');
                },
                err => {console.log(err)}))
        }
    });

    const goBack = () => props.navigation.navigate('home');

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.setupMillHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.setupMillHeaderTextStyle}>Setup New Mill</Text>
                    </View>
                </View>
                <View style={[styles.setupMillContainerStyle, {width: width * .8}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <KeyboardAvoidingView>
                            <Input
                                placeholder="Name of mill"
                                error={errors.name}
                                value={values.name}
                                rightComponent={false}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                touched={touched.name}
                            />
                            <Input
                                placeholder="Location of mill"
                                error={errors.location}
                                value={values.location}
                                rightComponent={false}
                                onChangeText={handleChange('location')}
                                onBlur={handleBlur('location')}
                                touched={touched.location}
                            />
                            <Input
                                placeholder="Mill capacity"
                                error={errors.capacity}
                                value={values.capacity}
                                rightComponent={false}
                                onChangeText={handleChange('capacity')}
                                onBlur={handleBlur('capacity')}
                                touched={touched.capacity}
                            />
                        </KeyboardAvoidingView>
                     </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Setup'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
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
        // justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    setupMillHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    setupMillHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    setupMillContainerStyle: {
        marginTop: defaultSize * 3
    },
    buttonContainerStyle: {
        position: 'absolute',
        bottom: defaultSize * 3
    }
});

export default SetupMill;