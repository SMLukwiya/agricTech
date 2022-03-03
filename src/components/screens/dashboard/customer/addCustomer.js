import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, Animated, LayoutAnimation, UIManager, ScrollView, Alert, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

import { colors, images, defaultSize, googlePlacesUrl, googlePlacesDetailsUrl, phoneRegex } from '../../../../config';
import Fallback from '../../../common/fallback';
import { createCustomer } from '../../../../store/actions'

const { white, green, blue, darkGray } = colors;
const Select = lazy(() => import('../../../common/select'));
const Input = lazy(() => import('../../../common/input'));
const Button = lazy(() => import('../../../common/button'));
const HeaderRight = lazy(() => import('../../../common/secondHeader'));
const PageLogo = lazy(() => import('../../../common/pageLogo'));

const categories = [
    {type: 'category', id: 1, name: 'Farmer'},
    {type: 'category', id: 2, name: 'Trader'}
]

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const AddCustomer = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    // redux
    const {loading} = useSelector(state => state.customer);
    const {userID} = useSelector(state => state.user);

    const [category, setCategory] = useState({id: 'none', progress: new Animated.Value(45), name: 'Category', open: false});

    const { handleChange, values, handleSubmit, errors, handleBlur, touched } = useFormik({
        initialValues: { name: '', phone: '', email: '' },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            phone: Yup.string().min(13, 'Please enter valid phone number').max(13, 'Please enter valid phone number').required('Phone is required'),
            email: Yup.string().email('Please enter valid email').required('Email is required')
        }),
        onSubmit: values => {
            if (!search.placePrediction) return Alert.alert('Please choose a location');
            if (!phoneRegex.test(values.phone)) return Alert('Enter valid phone number');
            dispatch(createCustomer({values, location: search.placePrediction, category: category.name, userID},
                () => {
                    props.navigation.navigate('customers')
                },
                err => console.log(err)
            ))
        }
    });

     // state
     const [search, setSearch] = useState({value: '', placePrediction: {}, predictionSet: false, error: '', touch: false})
     const [predictions, setPredictions] = useState([]);

    const goBack = () => props.navigation.navigate('home');

     // set search text
     const onChangeText = (value) => {
        setSearch({...search, value, predictionSet: true})
    }

    // run on every search value change
    const onChangeMapText = async () => {
        if (search.value.trim() === '') return;
        try {
            const results = await axios.get(`${googlePlacesUrl}key=${process.env.googleApiKey}&input=${search.value}`);
            const {data: {predictions}} = results;
            setPredictions(predictions);
        } catch (err) {
            console.log(err);
        }
    }

    const onPreditionTapped = async (id, description) => {
        try {
            const results = await axios.get(`${googlePlacesDetailsUrl}key=${process.env.googleApiKey}&place_id=${id}`)
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

    const onToggleCategory = () => {
        LayoutAnimation.configureNext(transition);
        setCategory({...category, open: !category.open});
        Animated.timing(category.progress, {
            toValue: category.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const onCategorySelect = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        setCategory({...category, id, name, open: false});
        Animated.timing(category.progress, {
            toValue: category.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    const enabled = category.name !== 'Category';

    useEffect(() => {
        onChangeMapText()
    }, [search.value])

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <Spinner visible={loading} textContent={'Loading'} textStyle={{color: white}} overlayColor='rgba(0,0,0,0.5)' animation='fade' color={white} />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.supplierHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '90%'}}>
                        <Text style={styles.supplierHeaderTextStyle}>Add a customer</Text>
                    </View>
                    <HeaderRight navigation={props.navigation} />
                </View>
                <View style={[styles.addSupplierContainerStyle, {width: width * .8}]}>
                    <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                        <View>
                            <Text style={styles.selectCategoryStyle}>Select a customer category</Text>
                            <Select
                                height={category.progress}
                                onToggleSelector={() => onToggleCategory()}
                                productName={category.name}
                                isProductOpen={category.open}
                                productList={categories}
                                onProductSelect={onCategorySelect}
                                buttonTitle={category.name}
                                onCreateHandler={() => onCreateHandler()}
                            />
                        </View>
                        <View style={styles.addSupplierInputContainerStyle}>
                            <Text style={styles.enterSupplierTextStyle}>Enter customer</Text>
                            <Input
                                placeholder="name"
                                error={errors.name}
                                value={values.name}
                                rightComponent={false}
                                onChangeText={handleChange('name')}
                                onBlur={handleBlur('name')}
                                touched={touched.name}
                            />
                            <Input
                                placeholder="phone"
                                error={errors.phone}
                                value={values.phone}
                                rightComponent={false}
                                onChangeText={handleChange('phone')}
                                onBlur={handleBlur('phone')}
                                touched={touched.phone}
                                keyboardType='phone-pad'
                                label='+2567....'
                            />
                            <Input
                                placeholder="email"
                                error={errors.email}
                                value={values.email}
                                rightComponent={false}
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                touched={touched.email}
                            />
                             <Input
                                placeholder="location"
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
                        </View>
                    </ScrollView>
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title='Save & Continue'
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled={enabled}
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
        justifyContent: 'space-around',
        backgroundColor: 'white'
    },
    supplierHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4.5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    supplierHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    addSupplierContainerStyle: {
        marginTop: defaultSize * 2
    },
    addSupplierInputContainerStyle: {
        marginTop: defaultSize * 2,
    },
    selectCategoryStyle: {
        fontSize: defaultSize * .85,
        marginBottom: defaultSize
    },
    addSupplierContainerStyle: {
        marginTop: defaultSize * 2
    },
    enterSupplierTextStyle: {
        fontSize: defaultSize * .8,
        marginBottom: defaultSize
    },
    buttonContainerStyle: {
        marginTop: defaultSize * 4
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

export default AddCustomer;