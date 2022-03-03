import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, {Marker} from 'react-native-maps';
import _ from 'lodash';

import { colors, defaultSize, googlePlacesUrl, googlePlacesDetailsUrl, phoneRegex } from '../../../config';
import Fallback from '../../common/fallback';
import { setupMill } from '../../../store/actions';
import axios from 'axios';

const { white, green, blue, darkGray } = colors;
const Input = lazy(() => import('../../common/input'));
const Button = lazy(() => import('../../common/button'));
const RNModal = lazy(() => import('../../common/rnModal'));
const PageLogo = lazy(() => import('../../../components/common/pageLogo'));

const SetupMill = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const {loading} = useSelector(state => state.miller)
    const {userID} = useSelector(state => state.user)

    // state
    const [search, setSearch] = useState({value: '', placePrediction: {}, predictionSet: false, error: '', touch: false})
    const [predictions, setPredictions] = useState([])
    const [phone, setPhone] = useState({value: '', error: '', touched: false});
    const [modal, setModal] = useState({modalVisible: false})

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { name: '', capacity: '', surname: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name of the mill is required'),
            capacity: Yup.string().required('Capacity of mill is required'),
            surname: Yup.string().required('Surname of mill manager is required'),
        }),
        onSubmit: values => {
            if (!search.placePrediction || !search.placePrediction.name) return Alert.alert('Please choose a location');
            if ( (phone.value && !phoneRegex.test(phone.value)) || (phone.value && phone.value.length < 13) ) return setPhone({...phone, error: 'Please enter valid phone number'})
            dispatch(setupMill({...values, location: search.placePrediction, phoneNumber: phone.value}, userID,
                () => {
                    props.navigation.navigate('selectmill');
                },
                err => {console.log(err)}))
        }
    });

    const goBack = () => props.navigation.navigate('home');

    const onChangeText = (value) => {
        setSearch({...search, value, predictionSet: true, touch: true});
        debounceSearch(value)
    }

    const closeModal = () => {
        setModal({
            ...modal, modalVisible: false
        });
    }

    const onChangePhoneNumber = (value) => {
        setPhone({...phone, value: value, touched: true})
    }

    // initial location
    const initialRegion = {
        latitude: 1.3733,
        longitude: 32.2903,
        latitudeDelta: 9.322096128306335,
        longitudeDelta: 4.865864776074886,
    }

    const onChooseLocationHandler = () => {
        setModal({
            ...modal, modalVisible: true
        })
    }

    // run on every search value change
    const onChangeMapText = async (value) => {
        if (value.trim() === '') return;
        try {
            const results = await axios.get(`${googlePlacesUrl}key=${process.env.googleApiKey}&input=${value}`);
            const {data: {predictions}} = results;
            setPredictions(predictions);
        } catch (err) {
            console.log(err);
        }
    }

    const debounceSearch = _.debounce(onChangeMapText, 1000)

    // tap location
    const onPreditionTapped = async (id, description) => {
        try {
            const results = await axios.get(`${googlePlacesDetailsUrl}key=${process.env.googleApiKey}&&place_id=${id}`)
            const {data: {result}} = results
            
            setSearch({
                ...search,
                value: description,
                predictionSet: false,
                error: '',
                placePrediction: {
                    ...search.placePrediction,
                    name: result.address_components[0].long_name,
                    geometry: {
                        ...search.placePrediction.geometry,
                        latitude: result.geometry.location.lat,
                        longitude: result.geometry.location.lng,
                        latitudeDelta: 0.322096128306335,
                        longitudeDelta: 0.065864776074886,
                        name: result.geometry.name            
                    }
                }
            })
            setPredictions([]);
        } catch (err) {
            console.log(err);
        }
    }

    const onRegionChangeHandler = (region, isGesture) => {
        setSearch({
            ...search,
            placePrediction: {
                ...search.placePrediction,
                geometry: {
                    ...search.placePrediction.geometry,
                    ...region         
                }
            }
        })
    }

    const onPressLocationHandler = ({nativeEvent}) => {
        setSearch({
            ...search,
            placePrediction: {
                ...search.placePrediction,
                geometry: {
                    ...search.placePrediction.geometry,
                    ...nativeEvent.coordinate,
                    latitudeDelta: 0.322096128306335,
                    longitudeDelta: 0.065864776074886,        
                }
            }
        })
    }

    const onConfirmLocationHandler = () => {
        if (!search.placePrediction || !search.placePrediction.name || !search.placePrediction.geometry) return setSearch({...search, error: 'Please choose a location'})
        closeModal();
    }

    // useEffect(() => {
    //     onChangeMapText()
    // }, [search.value])

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent='Loading' textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.setupMillHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.setupMillHeaderTextStyle}>Setup New Mill</Text>
                    </View>
                </View>
                <View style={[styles.setupMillContainerStyle, {width: width * .8, height: height * .75}]}>
                    <KeyboardAvoidingView behavior='padding'>
                        <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
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
                                placeholder="Surname of mill manager"
                                error={errors.surname}
                                value={values.surname}
                                rightComponent={false}
                                onChangeText={handleChange('surname')}
                                onBlur={handleBlur('surname')}
                                touched={touched.surname}
                            />
                            <Input
                                placeholder="Phone of mill manager"
                                error={phone.error}
                                value={phone.value}
                                rightComponent={false}
                                onChangeText={onChangePhoneNumber}
                                onBlur={() => {}}
                                touched={phone.touched}
                                keyboardType='phone-pad'
                                label="+2567...."
                            />
                            <TouchableOpacity activeOpacity={.8} onPress={onChooseLocationHandler} style={styles.chooseLocationContainer}>
                                <Text style={styles.chooseLocationTextStyle}>Choose location</Text>
                            </TouchableOpacity>
                            {search.placePrediction && search.placePrediction.name ? 
                                <Text style={styles.placeTextStyle}>Location: {search.placePrediction.name}</Text> :
                                <React.Fragment />
                            }
                            <Input
                                placeholder="Mill capacity"
                                error={errors.capacity}
                                value={values.capacity}
                                rightComponent={false}
                                onChangeText={handleChange('capacity')}
                                onBlur={handleBlur('capacity')}
                                touched={touched.capacity}
                                keyboardType='numeric'
                                label='Kgs per hour'
                            />
                        
                        </ScrollView>
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
                <View>
            </View>
            <RNModal visible={modal.modalVisible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                <View style={[styles.searchInputContainerStyle, {width: width * .8, top: height * .125}]}>
                    <Text style={styles.searchHeaderTextStyle}>Search to narrow location</Text>
                    <Input
                        placeholder="Location of mill"
                        error={search.error}
                        value={search.value}
                        rightComponent={false}
                        onChangeText={onChangeText}
                        onBlur={() => {}}
                        touched={search.touch}
                        backgroundColor={white}
                    />
                    {search.predictionSet && 
                        <View style={{height: height * .35}}>
                            <ScrollView bounces={false}>
                                {predictions.map(({description, place_id}) => 
                                    <TouchableOpacity activeOpacity={.8} onPress={() => onPreditionTapped(place_id, description)} key={place_id} style={[styles.placesPrediction]}>
                                        <Text>{description}</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </View>
                    }
                </View>
                <MapView
                    style={{width: width, height: height * .8, marginTop: defaultSize}}
                    initialRegion={initialRegion}
                    region={search.placePrediction ? search.placePrediction.geometry : {}}
                    onRegionChangeComplete={onRegionChangeHandler}
                    onPress={onPressLocationHandler}
                    >
                    <Marker coordinate={
                        {
                            latitude : search.placePrediction && search.placePrediction.geometry ? search.placePrediction.geometry.latitude : initialRegion.latitude, 
                            longitude : search.placePrediction && search.placePrediction.geometry ? search.placePrediction.geometry.longitude : initialRegion.longitude
                        }
                    } />
                </MapView>
                <View style={styles.modalButtonContainerStyle}>
                    <Button
                        title='choose location'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled
                        onPress={onConfirmLocationHandler}
                    />
                </View>
            </RNModal>
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
        marginTop: defaultSize * 4.5,
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
        // marginVertical: defaultSize * .45,
        borderWidth: 1,
        borderColor: green,
        paddingVertical: defaultSize,
        borderRadius: defaultSize,
        paddingHorizontal: defaultSize * .3,
        backgroundColor: white
    },
    searchHeaderTextStyle: {
        color: green,
        fontSize: defaultSize,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    searchInputContainerStyle: {
        position: 'absolute',
        zIndex: 9
    },
    // 
    chooseLocationContainer: {
        marginVertical: defaultSize,
        paddingLeft: defaultSize,
        borderWidth: .5,
        borderColor: darkGray,
        paddingVertical: defaultSize * .65,
        borderRadius: defaultSize * 1.5
    },
    chooseLocationTextStyle: {
        fontSize: defaultSize * .75
    },
    modalButtonContainerStyle: {
        position: 'absolute',
        bottom: 0,
        width: '80%'
    },
    placeTextStyle: {
        marginLeft: defaultSize,
        marginTop: -defaultSize * .85,
        fontSize: defaultSize * .75,
        color: green
    }
});

export default SetupMill;