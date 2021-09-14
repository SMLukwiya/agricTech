import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, blue, darkGray } = colors;
const Input = lazy(() => import('../../common/input'));
const Button = lazy(() => import('../../common/button'));

const SetupMill = (props) => {
    const { width } = useWindowDimensions();

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { millName: '', millLocation: '', millCapacity: '' },
        validationSchema: Yup.object({
            millName: Yup.string().required('Name of the mill is required'),
            millLocation: Yup.string().required('Location of mill is required'),
            millCapacity: Yup.string().required('Capacity of mill is required')
        }),
        onSubmit: values => {
            props.navigation.navigate('selectmill')
        }
    });

    const goBack = () => props.navigation.navigate('home');

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.setupMillHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.setupMillHeaderTextStyle}>Setup New Mill</Text>
                    </View>
                </View>
                <View style={[styles.setupMillContainerStyle, {width: width * .8}]}>
                    <KeyboardAvoidingView>
                        <Input
                            placeholder="Name of mill"
                            error={errors.millName}
                            value={values.millName}
                            rightComponent={false}
                            onChangeText={handleChange('millName')}
                            onBlur={handleBlur('millName')}
                            touched={touched.millName}
                        />
                        <Input
                            placeholder="Location of mill"
                            error={errors.millLocation}
                            value={values.millLocation}
                            rightComponent={false}
                            onChangeText={handleChange('millLocation')}
                            onBlur={handleBlur('millLocation')}
                            touched={touched.millLocation}
                        />
                        <Input
                            placeholder="Mill capacity"
                            error={errors.millCapacity}
                            value={values.millCapacity}
                            rightComponent={false}
                            onChangeText={handleChange('millCapacity')}
                            onBlur={handleBlur('millCapacity')}
                            touched={touched.millCapacity}
                        />
                     </KeyboardAvoidingView>
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