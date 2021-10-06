import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, KeyboardAvoidingView, ScrollView, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import MapView, {Marker} from 'react-native-maps';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { updateMillInfo, addMillLocation, updateMillLocation } from '../../../../store/actions';

const { white, green, blue, darkGray } = colors;
const Button = lazy(() => import('../../../common/button'));
const Input = lazy(() => import('../../../common/input'));
const RNModal = lazy(() => import('../../../common/rnModal'));
const PageLogo = lazy(() => import('../../../common/pageLogo'));

const Stocks = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const miller = useSelector(state => state.miller);
    const {selectedMill, locations} = miller;
    const mill = miller.millers.find(item => item.id === selectedMill.id)

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { tin: mill ? mill.tin : '', certificate: mill ? mill.certificate : '', capacity: mill ? mill.capacity : '' },
        validationSchema: Yup.object({
            tin: Yup.string().required('Tin number is required'),
            certificate: Yup.string().required('Certicate Information is required'),
            capacity: Yup.string().required('Enter Capacity')
        }),
        onSubmit: values => {
            closeModal();
            setTimeout(() => {
                dispatch(updateMillInfo(state.millSelected.id, values,
                    () => {},
                    err => {
                        console.log(err)
                        // setState({...state, modal: {...state.modal, visible: true, type: 'error', error: err}})
                    }))
            }, 200);
        }
    });

    const [state, setState] = useState({
        modal: {visible: false, type: '', error: ''},
        location: {name: '', capacity: ''},
        millSelected: {id: ''}
    })

    const goBack = () => props.navigation.goBack();

    const closeModal = () => {
        setState({...state, modal: {...state.modal, visible: false, type: ''}});
    }

    const onEditMillHandler = (id) => {
        setState({...state, modal: {...state.modal, visible: true, type: 'millInfo'},  millSelected: {...state.millSelected, id}});
    }

    const onChangeHandler = (value, type) => {
        setState({...state,
            location: {
                ...state.location,
                [type]: value
            }
        })
    }

    const onAddLocationHandler = () => {
        props.navigation.navigate('setupmill')
    }

    const addLocation = () => {
        const {name, capacity} = state.location;
        closeModal();
        dispatch(addMillLocation({name, capacity, millID: mill.id},
            () => {},
            err => {console.log(err)}))
    }

    const MillInfoComponent = () => 
        <View  style={[styles.modalContainerStyle, {width: width * .8}]}>
            <KeyboardAvoidingView >
                <Input
                    placeholder="Tin Number"
                    error={errors.tin}
                    value={values.tin}
                    rightComponent={false}
                    onChangeText={handleChange('tin')}
                    onBlur={handleBlur('tin')}
                    touched={touched.tin}
                    label='Tin Number'
                />
                <Input
                    placeholder="Certificate Inoformation"
                    error={errors.certificate}
                    value={values.certificate}
                    rightComponent={false}
                    onChangeText={handleChange('certificate')}
                    onBlur={handleBlur('certificate')}
                    touched={touched.certificate}
                    label='Certificate Information'
                />
                <Input
                    placeholder="Capacity"
                    error={errors.capacity}
                    value={values.capacity}
                    rightComponent={false}
                    onChangeText={handleChange('capacity')}
                    onBlur={handleBlur('capacity')}
                    touched={touched.capacity}
                    keyboardType='numeric'
                    label='Kgs per hour'
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

    const AddLocationComponent = () => 
        <View style={[styles.addLocationContainerStyle, {width: width * .8}]}>
            <Input
                placeholder="Location Name"
                error={state.location.error}
                value={state.location.name}
                rightComponent={false}
                onChangeText={(value) => onChangeHandler(value, 'name')}
                onBlur={() => {}}
                touched={true}
            />
            <Input
                placeholder="Location Capacity"
                error={state.location.error}
                value={state.location.capacity}
                rightComponent={false}
                onChangeText={(value) => onChangeHandler(value, 'capacity')}
                onBlur={() => {}}
                touched={true}
            />
            <Button
                title='Save'
                backgroundColor={green}
                borderColor={green}
                color={white}
                enabled={state.location.name && state.location.capacity}
                onPress={addLocation} 
            />
        </View>

    const millComponent = ({item: {id, name, tin, certificate, capacity, location}}) => 
        <View style={[styles.advancedProfileContainerStyle, {width: width * .8}]}>
            <Text style={styles.advancedProfileMillerTitleStyle}>{name}</Text>
            <View>
                <View style={styles.advancedProfileItemContainerStyle}>
                    <Text>TIN Number {tin}</Text>
                    <Icon name='edit' size={20} color={green} onPress={() => onEditMillHandler(id)} />
                </View>
                <Text style={styles.labelTextStyle}>Tin Number</Text>
            </View>
            <View>
                <View style={styles.advancedProfileItemContainerStyle}>
                    <Text>{certificate}</Text>
                    <Icon name='edit' size={20} color={green} onPress={() => onEditMillHandler(id)} />
                </View>
                <Text style={styles.labelTextStyle}>Certificate Information</Text>
            </View>
            <View>
                <View style={styles.advancedProfileItemContainerStyle}>
                    <Text>{capacity}</Text>
                    <Icon name='edit' size={20} color={green} onPress={() => onEditMillHandler(id)} />
                </View>
                <Text style={styles.labelTextStyle}>Kgs per hour</Text>
            </View>
            <View>
                <MapView
                    style={{width: width * .8, height: defaultSize * 15, marginTop: defaultSize}}
                    initialRegion={{
                        latitude: location.geometry.latitude,
                        longitude: location.geometry.longitude,
                        latitudeDelta: location.geometry.latitudeDelta ? location.geometry.latitudeDelta : 0.0922,
                        longitudeDelta: location.geometry.longitudeDelta ? location.geometry.longitudeDelta : 0.0421,
                    }}>
                    <Marker coordinate={{ latitude : location.geometry.latitude, longitude : location.geometry.longitude }} />
                </MapView>
            </View>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={miller.loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.createAccountHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '90%'}}>
                        <Text style={styles.createAccountHeaderTextStyle}>Advanced Profile</Text>
                    </View>
                </View>
                <View style={[{height: height * .775}]}>
                    <FlatList 
                        keyExtractor={item => item.id}
                        data={miller.millers}
                        renderItem={millComponent}
                        contentContainerStyle={{height: '100%'}}
                    />
                </View>
                <View style={[styles.addNewLocationContainerStyle, {width: width * .8}]}>
                    <Icons name='add-circle' size={45} color={darkGray} onPress={onAddLocationHandler} />
                    <Text style={styles.addNewLocationTextStyle}>Add New Location</Text>
                </View>
            </SafeAreaView>
            <RNModal visible={state.modal.visible} onRequestClose={closeModal} presentationStyle='overFullScreen' closeIconColor={white}>
                {state.modal.type === 'millInfo' ?
                    MillInfoComponent() :
                    AddLocationComponent()
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
        backgroundColor: 'white'
    },
    createAccountHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4.5,
        width: '100%',
        alignItems: 'center'
    },
    createAccountHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    advancedProfileContainerStyle: {
        marginTop: defaultSize * 2
    },
    advancedProfileMillerTitleStyle: {
        fontSize: defaultSize * 1.2,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    advancedProfileItemContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        borderBottomColor: darkGray,
        borderBottomWidth: 1,
        paddingVertical: defaultSize * .4,
        marginVertical: defaultSize
    },
    advancedProfileLocationContainerStyle: {
        marginTop: defaultSize,
    },
    advancedProfileLocationItemStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: defaultSize * .65
    },
    advancedProfileLocationItemContainerStyle: {
        flexDirection: 'row',
    },
    advancedProfileLocationTextStyle: {
        marginRight: defaultSize,
        textAlign: 'center'
    },
    capacityTextStyle: {
        borderWidth: 1,
        borderColor: darkGray,
        borderRadius: defaultSize,
        paddingVertical: defaultSize * .3,
        paddingHorizontal: defaultSize
    },
    addNewLocationContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: defaultSize
    },
    addNewLocationTextStyle: {
        marginLeft: defaultSize
    },
    // 
    modalContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize,
        paddingHorizontal: defaultSize,
        borderRadius: defaultSize,
        overflow: 'hidden'
    },
    // 
    addLocationContainerStyle: {
        backgroundColor: white,
        paddingVertical: defaultSize,
        paddingHorizontal: defaultSize,
        borderRadius: defaultSize,
        overflow: 'hidden'
    },
    labelTextStyle: {
        fontSize: defaultSize * .7,
        marginLeft: defaultSize * .15,
        marginTop: - defaultSize
    }
});

export default Stocks;