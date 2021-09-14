import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler'

import {images, defaultSize} from '../../config';

const HeaderLeft = (props) => 
    <TouchableOpacity activeOpacity={.8} onPress={() => props.navigation.openDrawer()} style={styles.headerContainerStyle}>
        <Image source={images.menuIcon} height='100%' width='100%' />
    </TouchableOpacity>

const styles = StyleSheet.create({
    headerContainerStyle: {
        marginRight: defaultSize * 1.5,
        marginTop: defaultSize * 4,
        height: 25,
        width: 25
    }
});

export default HeaderLeft;