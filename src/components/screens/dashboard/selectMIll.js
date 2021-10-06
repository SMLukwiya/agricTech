import React, { Suspense, lazy, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, TouchableOpacity, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';

import { colors, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';
import { 
    fetchSuppliers, fetchCustomers, fetchPurchases, fetchProducts, fetchSubproducts, fetchQualities , fetchCategories,
    updateUser, updateMill, setSelectedMill, updateLocations, updateGender, fetchOutputQualities, fetchStockIn, fetchStockOut
} from '../../../store/actions';

const { white, green, darkGray } = colors;
const PageLogo = lazy(() => import('../../../components/common/pageLogo'));

const SelectMill = (props) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();

    const user = useSelector(state => state.user);
    console.log(user)
    const {millers} = useSelector(state => state.miller);
    const remote = useSelector(state => state.remoteConfigs);
    const {setupMillLabel, setupMillDescriptionLabel, selectMillTextLabel} = remote.values;

    const onSelectMillHandler = (id, name, capacity, location) => {
        dispatch(setSelectedMill({id, name, capacity, location}));
        setTimeout(() => {
            props.navigation.navigate('home');
        }, 150);
    }

    const onsetupNewMillHandler = () => {
        props.navigation.navigate('setupmill');
    }

    // update User
    const updateUserProfile = () => {
        firestore()
            .collection('users')
            .doc(user.userID)
            .onSnapshot(querySnapshot => {
                dispatch(updateUser({...querySnapshot._data}));
            }, err => {
                console.log('user error ', err)
            })
    }

    // suppliers
    const updateSuppliers = () =>
        firestore()
            .collection('suppliers')
            .where('userID', '==', user.userID)
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
            .where('userID', '==', user.userID)
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
            .where('userID', '==', user.userID)
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

    const updateOutputQualities = () =>
            firestore()
                .collection('outputQualities')
                .onSnapshot(querySnapshot => {
                    let qualities = [];
                    querySnapshot.forEach(doc => {
                        qualities.push({id: doc.id, ...doc.data(), type: 'outputQuality'})
                    })
                    dispatch(fetchOutputQualities(qualities))
                }, err => {
                    console.log('Output quality err ', err)
                })

    // categories
    const updateCategories = () =>
        firestore()
            .collection('categories')
            .onSnapshot(querySnapshot => {
                let categories = [];
                querySnapshot.forEach(doc => {
                    categories.push({id: doc.id, ...doc.data(), type: 'category'})
                })
                dispatch(fetchCategories(categories))
            }, err => {
                console.log('Category error ', err)
            })

    // millers
    const updateMillers = () =>
        firestore()
            .collection('millers')
            .where('userID', '==', user.userID)
            .onSnapshot(querySnapshot => {
                let millers = [];
                querySnapshot.forEach(doc => {
                    millers.push({id: doc.id, ...doc.data(), type: 'miller'})
                })
                dispatch(updateMill(millers))
            }, err => {
                console.log('Miller error ', err)
            })

    // locations
    const fetchLocations = () =>
        firestore()
            .collection('locations')
            .onSnapshot(querySnapshot => {
                let locations = [];
                querySnapshot.forEach(doc => {
                    locations.push({id: doc.id, ...doc.data(), type: 'location'})
                })
                dispatch(updateLocations(locations))
            }, err => {
                console.log('Miller error ', err)
            })

        // locations
    const fetchGender = () =>
        firestore()
            .collection('gender')
            .onSnapshot(querySnapshot => {
                let gender = [];
                querySnapshot.forEach(doc => {
                    gender.push({id: doc.id, ...doc.data(), type: 'gender'})
                })
                dispatch(updateGender(gender))
            }, err => {
                console.log('Gender error ', err)
            })

    // stock In
    const updateStockIn = () => 
        firestore()
            .collection('stockIn')
            .onSnapshot(querySnapshot => {
                let stock = [];
                querySnapshot.forEach(doc => {
                    // put product data under product name
                    category = doc.data().name
                    stock.push({id: doc.id, name: category, [category]: {...doc.data()}, type: 'stockIn'})
                })
                dispatch(fetchStockIn(stock));
            }, err => {
                console.log('Stock in ', err)
            })

    const updateStockOut = () => 
        firestore()
            .collection('stockOut')
            .onSnapshot(querySnapshot => {
                let stock = [];
                querySnapshot.forEach(doc => {
                    category = doc.data().name
                    stock.push({id: doc.id, name: category, [category]: {...doc.data()}, type: 'stockOut'})
                })
                dispatch(fetchStockOut(stock));
            }, err => {
                console.log('stock out ', err)
            })

    useEffect(() => {
        updateSuppliers();
        updateCustomer();
        updatePurchases();
        updateProducts();
        updateSubproducts();
        updateQualities();
        updateCategories();
        updateUserProfile();
        updateMillers();
        fetchLocations();
        fetchGender();
        updateOutputQualities();
        updateStockIn();
        updateStockOut();
    }, [])

    const millComponent = ({item: {id, name, location, capacity}}) => 
        <TouchableOpacity activeOpacity={.8} onPress={() => onSelectMillHandler(id, name, capacity, location)} style={[styles.millComponentContainerStyle, {width: width * .8}]}>
            <Text style={styles.millComponentTitleHeaderStyle}>{name}</Text>
            <Text style={styles.millComponentTextStyle}>{location.name}</Text>
        </TouchableOpacity>

    const setupMillComponent = () => 
        <TouchableOpacity activeOpacity={.8} onPress={onsetupNewMillHandler} style={styles.setupNewMillContainerStyle}>
            <View>
                <Text style={styles.setupMillTitleHeaderStyle}>{setupMillLabel}</Text>
                <Text style={styles.setupMillComponentTextStyle}>{setupMillDescriptionLabel}</Text>
            </View>
            <Icons name='add-circle' size={35} color={green} />
        </TouchableOpacity>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.selectMillHeaderStyle, {width: width * .8}]}>
                    <View style={{width: '100%'}}>
                        <Text style={styles.selectMillHeaderTextStyle}>{selectMillTextLabel}</Text>
                    </View>
                </View>
                <View style={[styles.millContainerStyle, {width: width * .8}]}>
                    <View style={{/*height: height * .65*/}}>
                        <FlatList
                            data={millers}
                            keyExtractor={item => item.id}
                            renderItem={millComponent}
                            contentContainerStyle={{}}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
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
        marginTop: defaultSize * 4.5,
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