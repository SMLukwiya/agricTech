import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, lightBlue, darkGray, lightGray } = colors;
const Button = lazy(() => import('../../../common/button'));

const Customers = (props) => {
    const { height, width } = useWindowDimensions();

    // redux
    const customerState = useSelector(state => state.customer);
    const {userID} = useSelector(state => state.user);
    const customers = customerState.customers.filter(item => item.userID === userID)
    const {values: {
        customersTextLabel, addCustomerTextLabel
    }} = useSelector(state => state.remoteConfigs);

    const goBack = () => props.navigation.navigate('home');

    // add supplier
    const onAddSupplierHandler = () => {
        props.navigation.navigate('addcustomer')
    }

    const onCustomerHandler = (id) => {
        props.navigation.navigate('customerdetail', {id});
    }

    const customerComponent = ({item: {id, imageUrl, name, phone, category}}) => 
        <TouchableOpacity activeOpacity={.8} style={styles.supplierContainerStyle} onPress={() => onCustomerHandler(id)} key={id}>
            <View style={styles.supplierImageContainerStyle}>
                <Image source={imageUrl ? {uri: imageUrl} : images.avatar} style={styles.imageStyle} resizeMode='cover' />
            </View>
            <View style={styles.rightSupplierContainerStyle}>
                <View>
                    <Text style={styles.supplierNameTextStyle}>{name}</Text>
                    <Text style={styles.supplierPhoneTextStyle}>{phone}</Text>
                </View>
                <View style={styles.categoryContainerStyle}>
                    <Text style={styles.categoryTextStyle}>{category}</Text>
                    <View style={styles.indicatorStyle} />
                </View>
            </View>
        </TouchableOpacity>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.supplierHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.supplierHeaderTextStyle}>{customersTextLabel}</Text>
                    </View>
                </View>
                <View style={[styles.supplierOverContainerStyle,{width: width * .8, height: height * .785}]}>
                    
                    {customers.length === 0 ? <Text style={{fontSize: defaultSize, fontWeight: 'bold', textAlign: 'center'}}>No customers added</Text> : 
                        <FlatList
                            data={customers}
                            keyExtractor={item => item.id}
                            renderItem={customerComponent}
                        />
                    }
                </View>
                <View style={[styles.buttonContainerStyle, {width: width * .8}]}>
                    <Button
                        title={addCustomerTextLabel}
                        backgroundColor={green}
                        borderColor={green}
                        color={white}
                        enabled onPress={onAddSupplierHandler}
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
    supplierHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    supplierHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    supplierOverContainerStyle: {
        marginTop: defaultSize * 2,
        borderTopColor: lightGray,
        paddingTop: defaultSize,
        borderTopWidth: 1
    },
    supplierContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    supplierImageContainerStyle: {
        height: defaultSize * 3,
        width: defaultSize * 3,
        borderRadius: (defaultSize * 3) * .5,
        overflow: 'hidden',
        marginRight: defaultSize,
        marginVertical: defaultSize * .55
    },
    imageStyle: {
        width: '100%',
        height: '100%'
    },
    categoryContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightSupplierContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '75%'
    },
    supplierNameTextStyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold',
        marginBottom: defaultSize * .15
    },
    supplierPhoneTextStyle: {
        fontSize: defaultSize * .85,
        color: darkGray
    },
    categoryTextStyle: {
        fontSize: defaultSize * .8,
        color: lightBlue,
        marginRight: defaultSize
    },
    indicatorStyle: {
        width: defaultSize * .2,
        backgroundColor: green,
        height: defaultSize * 2
    },
    buttonContainerStyle: {
        marginTop: defaultSize * .5
    }
});

export default Customers;