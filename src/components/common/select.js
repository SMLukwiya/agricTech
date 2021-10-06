import React from 'react';
import { Animated, TouchableOpacity, Text, View, StyleSheet, Platform, ScrollView} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, defaultSize } from '../../config'

const { green, lightGray } = colors;

const ProductComponent = (props) => {
    const {height, onToggleSelector, productName, isProductOpen, productList, onProductSelect, buttonTitle, onCreateHandler} = props;

    return(
        <Animated.View style={[styles.selectProductContainer, {height: height}]}>
            <TouchableOpacity activeOpacity={.8} onPress={onToggleSelector} style={styles.selectorStyle}>
                <Text style={styles.selectProductTextStyle}>{productName}</Text>
                <Ionicons name='caret-down-sharp' size={25} color={green} />
            </TouchableOpacity>
            {isProductOpen && 
            <>
                <ScrollView bounces={false}>
                    {productList.map(({type, id, name, cat}) => 
                        <TouchableOpacity activeOpacity={.8} key={id} onPress={() => onProductSelect(type, id, name, cat)}>
                            <Text style={styles.productNameTextStyle}>{name}</Text>
                        </TouchableOpacity>
                    )}
                    
                </ScrollView>
                { productList.length && productList[0].type === 'category' || 
                        productList.length && productList[0].type === 'gender' || 
                        productList.length && productList[0].type === 'stockIn' ||
                        productList.length && productList[0].type === 'stockOut' ? 
                        <React.Fragment /> : 
                        <TouchableOpacity style={styles.createNewProductContainerStyle} activeOpacity={.8} onPress={onCreateHandler}>
                            <Text style={styles.createNewProductTextstyle}>{buttonTitle}</Text>
                            <Icons name='add' size={25} color={green} />
                        </TouchableOpacity>
                    }
                </>
            }
            
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    selectProductContainer: {
        borderRadius: defaultSize * 1.2,
        borderColor: lightGray,
        borderWidth: 1,
        overflow: 'hidden',
        justifyContent: 'center'
    },
    selectorStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: defaultSize * .65,
    },
    selectProductTextStyle: {
        fontSize: defaultSize * .85,
        marginLeft: defaultSize,
        paddingTop: Platform.OS === 'ios' ? defaultSize * .75 : defaultSize * .5,
        paddingBottom: Platform.OS === 'ios' ? defaultSize * 1.15 : defaultSize * .5
    },
    productNameTextStyle: {
        fontSize: defaultSize * .85,
        marginLeft: defaultSize,
        marginVertical: defaultSize * .5
    },
    createNewProductContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: defaultSize * .5,
        paddingBottom: defaultSize * .5,
        paddingTop: defaultSize * .35,
        borderTopColor: lightGray,
        borderTopWidth: 1
    },
    createNewProductTextstyle: {
        fontSize: defaultSize * .75,
        color: green,
        marginLeft: defaultSize * .5,
    },
});

export default ProductComponent;