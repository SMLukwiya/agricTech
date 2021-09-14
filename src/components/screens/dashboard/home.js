import React, { Suspense } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, FlatList, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, images, defaultSize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, blue, darkGray, lightGray } = colors;

const Home = (props) => {
    const { width } = useWindowDimensions();

    const menuItemComponent = (title, image, onPress) => 
        <View style={styles.cardContainerStyle}>
                <TouchableOpacity activeOpacity={.8} style={styles.cardTouchableStyle} onPress={onPress}>
                    <Image source={image} height={100} width={50} />
                    <Text style={styles.menuItemTextStyle}>{title}</Text>
                </TouchableOpacity>
        </View>

    const menuItems = [
        {id: 'one', title: 'Stock', image: images.stockIcon, onPress: () => props.navigation.navigate('stocks')},
        {id: 'two', title: 'Buy', image: images.buyIcon, onPress: () => props.navigation.navigate('buy')},
        {id: 'three', title: 'Supplier', image: images.supplierIcon, onPress: () => props.navigation.navigate('suppliers')},
        {id: 'four', title: 'Customers', image: images.customerIcon, onPress: () => props.navigation.navigate('customers')},
        {id: 'five', title: 'Pick Up', image: images.pickupIcon, onPress: () => props.navigation.navigate('pickup')},
        {id: 'six', title: 'Bills/Expenses', image: images.billsIcon},
        {id: 'seven', title: 'Purchases', image: images.salesIcon},
        {id: 'eight', title: 'Products', image: images.orderIcon},
        {id: 'nine', title: 'Stock Milling', image: images.stockMillingIcon, onPress: () => props.navigation.navigate('stockmilling')},
        {id: 'ten', title: 'Milling Service', image: images.millingServiceIcon, onPress: () => props.navigation.navigate('millingservice')}
    ];

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <Text style={styles.headerTitleStyle}>What do you want to do?</Text>
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