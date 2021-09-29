import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';

import { colors, defaultSize, googlePlacesUrl, googlePlacesDetailsUrl } from '../../../config';
import Fallback from '../../common/fallback';
import { setupMill } from '../../../store/actions';
import axios from 'axios';

const { white, green, blue, } = colors;
const Input = lazy(() => import('../../common/input'));
const Button = lazy(() => import('../../common/button'));

const SetupMill = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const {loading} = useSelector(state => state.miller)
    const {userID} = useSelector(state => state.user)

    // state
    const [search, setSearch] = useState({value: '', placePrediction: {}, predictionSet: false, error: '', touch: false})
    const [predictions, setPredictions] = useState([])

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { name: '', capacity: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name of the mill is required'),
            capacity: Yup.string().required('Capacity of mill is required')
        }),
        onSubmit: values => {
            dispatch(setupMill({...values, location: search.placePrediction}, userID,
                () => {
                    props.navigation.navigate('selectmill');
                },
                err => {console.log(err)}))
        }
    });

    const goBack = () => props.navigation.navigate('home');

    const onChangeText = (value) => {
        setSearch({...search, value, predictionSet: true})
    }

    // run on every search value change
    const onChangeMapText = async () => {
        if (search.value.trim() === '') return;
        try {
            const results = await axios.get(`${googlePlacesUrl}key=AIzaSyDmO0TPSYtgcPJw8TbBSOaIBFVqs4Ziq2Q&input=${search.value}`);
            const {data: {predictions}} = results;
            setPredictions(predictions);
        } catch (err) {
            console.log(err);
        }
    }

    // tap location
    const onPreditionTapped = async (id, description) => {
        try {
            const results = await axios.get(`${googlePlacesDetailsUrl}key=AIzaSyDmO0TPSYtgcPJw8TbBSOaIBFVqs4Ziq2Q&&place_id=${id}`)
            const {data: {result}} = results
            
            setSearch({
                ...search,
                value: description,
                predictionSet: false,
                placePrediction: {
                    ...search.placePrediction,
                    name: result.address_components[0].long_name,
                    geometry: result.geometry
                }
            })
            setPredictions([]);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        onChangeMapText()
    }, [search.value])

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
                                error={search.error}
                                value={search.value}
                                rightComponent={false}
                                onChangeText={onChangeText}
                                onBlur={() => {}}
                                touched={search.touch}
                            />
                            {search.predictionSet && 
                                <View style={{height: height * .35}}>
                                    <ScrollView>
                                        {predictions.map(({description, place_id}) => 
                                            <TouchableOpacity activeOpacity={.8} onPress={() => onPreditionTapped(place_id, description)} key={place_id} style={[styles.placesPrediction]}>
                                                <Text>{description}</Text>
                                            </TouchableOpacity>
                                        )}
                                    </ScrollView>
                                </View>
                            }
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
    },
    placesPrediction: {
        marginVertical: defaultSize * .45,
        borderWidth: 1,
        borderColor: green,
        paddingVertical: defaultSize * .2,
        borderRadius: defaultSize,
        paddingHorizontal: defaultSize * .25
    }
});

export default SetupMill;