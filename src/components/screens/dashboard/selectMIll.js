import React, { Suspense, lazy, useEffect, useDebugValue } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { useDispatch } from 'react-redux';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';
import { 
    fetchSuppliers, fetchCustomers, fetchPurchases, fetchProducts, fetchSubproducts, fetchQualities 
} from '../../../store/actions';

const { white, green, blue, darkGray } = colors;


const SelectMill = (props) => {
    const dispatch = useDispatch();
    const { width } = useWindowDimensions();

    const onSelectMillHandler = () => {
        props.navigation.navigate('home');
    }

    const onsetupNewMillHandler = () => {
        props.navigation.navigate('setupmill');
    }

    // suppliers
    const updateSuppliers = () =>
        firestore()
            .collection('suppliers')
            .onSnapshot(querySnapshot => {
                let suppliers = [];
                querySnapshot.forEach(doc => {
                    suppliers.push({id: doc.id, ...doc.data(), type: 'supplier'})
                })
                dispatch(fetchSuppliers(suppliers))
            }, err => {
                console.log('Supplier error ', err)
            })

    // customers
    const updateCustomer = () =>
        firestore()
            .collection('customers')
            .onSnapshot(querySnapshot => {
                let customers = [];
                querySnapshot.forEach(doc => {
                    customers.push({id: doc.id, ...doc.data(), type: 'customer'})
                })
                dispatch(fetchCustomers(customers))
            }, err => {
                console.log('Customer error ', err)
            })

        // purchases
    const updatePurchases = () =>
        firestore()
            .collection('sales')
            .onSnapshot(querySnapshot => {
                let purchases = [];
                querySnapshot.forEach(doc => {
                    purchases.push({id: doc.id, ...doc.data()})
                })
                dispatch(fetchPurchases(purchases))
            }, err => {
                console.log('Purchase(buy) error ', err)
            })

    // products
    const updateProducts = () =>
        firestore()
            .collection('products')
            .onSnapshot(querySnapshot => {
                let products = [];
                querySnapshot.forEach(doc => {
                    products.push({id: doc.id, ...doc.data(), type: 'product'})
                })
                dispatch(fetchProducts(products))
            }, err => {
                console.log('Products error ', err)
            })

    // sub products
    const updateSubproducts = () =>
        firestore()
            .collection('subproducts')
            .onSnapshot(querySnapshot => {
                let subproducts = [];
                querySnapshot.forEach(doc => {
                    subproducts.push({id: doc.id, ...doc.data(), type: 'subproduct'})
                })
                dispatch(fetchSubproducts(subproducts))
            }, err => {
                console.log('Products error ', err)
            })

    // qualities
    const updateQualities = () =>
        firestore()
            .collection('qualities')
            .onSnapshot(querySnapshot => {
                let qualities = [];
                querySnapshot.forEach(doc => {
                    qualities.push({id: doc.id, ...doc.data(), type: 'quality'})
                })
                dispatch(fetchQualities(qualities))
            }, err => {
                console.log('Products error ', err)
            })



    useEffect(() => {
        updateSuppliers();
        updateCustomer();
        updatePurchases();
        updateProducts();
        updateSubproducts();
        updateQualities();
    })

    const millComponent = () => 
        <TouchableOpacity activeOpacity={.8} onPress={onSelectMillHandler} style={[styles.millComponentContainerStyle, {width: width * .8}]}>
            <Text style={styles.millComponentTitleHeaderStyle}>Mukoma Millers</Text>
            <Text style={styles.millComponentTextStyle}>Lorem Ipsum</Text>
        </TouchableOpacity>

    const setupMillComponent = () => 
        <TouchableOpacity activeOpacity={.8} onPress={onsetupNewMillHandler} style={styles.setupNewMillContainerStyle}>
            <View>
                <Text style={styles.setupMillTitleHeaderStyle}>Setup new Mill</Text>
                <Text style={styles.setupMillComponentTextStyle}>Lorem Ipsum</Text>
            </View>
            <Icons name='add-circle' size={35} color={green} />
        </TouchableOpacity>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.selectMillHeaderStyle, {width: width * .8}]}>
                    <View style={{width: '100%'}}>
                        <Text style={styles.selectMillHeaderTextStyle}>Select Mill</Text>
                    </View>
                </View>
                <View style={styles.millContainerStyle}>
                    {millComponent()}
                    {setupMillComponent()}
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
    selectMillHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    selectMillHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    millContainerStyle: {
        marginTop: defaultSize * 3
    },
    millComponentContainerStyle: {
        backgroundColor: green,
        borderRadius: defaultSize * 1.15,
        overflow: 'hidden',
        height: defaultSize * 8,
        marginVertical: defaultSize
    },
    millComponentTitleHeaderStyle: {
        fontSize: defaultSize * .85,
        color: white,
        marginLeft: defaultSize,
        marginVertical: defaultSize,
        fontWeight: 'bold'
    },
    millComponentTextStyle: {
        fontSize: defaultSize * .85,
        color: white,
        marginLeft: defaultSize
    },
    setupNewMillContainerStyle: {
        backgroundColor: white,
        borderRadius: defaultSize * 1.15,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: green,
        height: defaultSize * 8,
        marginVertical: defaultSize * .5,
        paddingHorizontal: defaultSize,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    setupMillTitleHeaderStyle: {
        fontSize: defaultSize * .85,
        color: green,
        marginVertical: defaultSize,
        fontWeight: 'bold'
    },
    setupMillComponentTextStyle: {
        fontSize: defaultSize * .85,
        color: darkGray
    }
});

export default SelectMill;