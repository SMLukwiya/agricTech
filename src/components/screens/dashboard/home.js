import React, { Suspense } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, FlatList, Platform, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, blue, darkGray, lightGray } = colors;

const Home = (props) => {
    const { width } = useWindowDimensions();

    // redux
    const remote = useSelector(state => state.remoteConfigs);
    const { whatDoYouWantToDoTextLabel } = remote.values;

    const menuItemComponent = (title, image, onPress) => 
        <View style={styles.cardContainerStyle}>
                <TouchableOpacity activeOpacity={.8} style={styles.cardTouchableStyle} onPress={onPress}>
                    <Image source={image} height={100} width={50} />
                    <Text style={styles.menuItemTextStyle}>{title}</Text>
                </TouchableOpacity>
        </View>

    const dev = () => Alert.alert('This feature is under development')

    let menuItems = [
        {id: 'one', title: 'Stock', image: images.stockIcon, onPress: dev /*() => props.navigation.navigate('stocks')*/, order: 1},
        {id: 'two', title: 'Buy', image: images.buyIcon, onPress: () => props.navigation.navigate('buy'), order: 2},
        {id: 'three', title: 'Supplier', image: images.supplierIcon, onPress: () => props.navigation.navigate('suppliers'), order: 3},
        {id: 'four', title: 'Customers', image: images.customerIcon, onPress: () => props.navigation.navigate('customers'), order: 4},
        {id: 'five', title: 'Pick Up', image: images.pickupIcon, onPress: () => props.navigation.navigate('pickup'), order: 5},
        {id: 'seven', title: 'Transaction History', image: images.salesIcon, onPress: () => props.navigation.navigate('purchase'), order: 6},
        {id: 'eight', title: 'Products', image: images.orderIcon, onPress: () => props.navigation.navigate('products'), order: 7},
        {id: 'nine', title: 'Stock Milling', image: images.stockMillingIcon, onPress: () => props.navigation.navigate('stockmilling'), order: 8},
        {id: 'ten', title: 'Milling Services', image: images.millingServiceIcon, onPress: () => props.navigation.navigate('millingservice'), order: 9},
        {id: 'six', title: 'Bills/Expenses', image: images.billsIcon, onPress: dev, order: 10}
    ];

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <Text style={styles.headerTitleStyle}>{whatDoYouWantToDoTextLabel}</Text>
                <FlatList 
                    keyExtractor={item => item.id}
                    data={menuItems}
                    contentContainerStyle={[styles.scrollviewStyle, {width: width * .8}]} 
                    bounces={false} 
                    showsVerticalScrollIndicator={false}
                    renderItem={({item}) => menuItemComponent(item.title, item.image, item.onPress)}
                    numColumns={2}
                />
            </SafeAreaView>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerTitleStyle: {
        marginTop: defaultSize * 6,
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold',
        marginBottom: defaultSize * 1.5
    },
    scrollviewStyle: {
        alignItems: 'center',
        paddingBottom: defaultSize * 10
    },
    cardContainerStyle: {
        width: '45%',
        shadowColor: green,
        shadowOffset: { width: 0, height: 1},
        shadowOpacity: .5,
        shadowRadius: 3,
        elevation: 8,
        marginVertical: defaultSize * .65,
        marginHorizontal: '2.5%',
        borderRadius: Platform.OS === 'ios' ? defaultSize * .75 : defaultSize * .8,
    },
    cardTouchableStyle: {
        width: '100%',
        height: Platform.OS === 'ios' ? defaultSize * 7 : defaultSize * 8 ,
        borderRadius: Platform.OS === 'ios' ? defaultSize * .75 : defaultSize * .8,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: white
    },
    menuItemTextStyle: {
        fontSize: defaultSize * .85,
        marginTop: defaultSize * .4
    }
});

export default Home;