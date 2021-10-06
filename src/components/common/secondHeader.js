import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'

import {images, defaultSize} from '../../config';

const HeaderRight = (props) => 
    <TouchableOpacity activeOpacity={.8} onPress={() => props.navigation.openDrawer()} style={styles.headerContainerStyle}>
        <Image source={images.filter} height='100%' width='100%' />
    </TouchableOpacity>

const styles = StyleSheet.create({
    headerContainerStyle: {
        height: 25,
        width: 25
    }
});

export default HeaderRight;