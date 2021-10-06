import React from 'react';
import { View, Image, StyleSheet, useWindowDimensions, Text } from 'react-native';

import { defaultSize, colors, images } from '../../config';

const PageLogo = () => {
    const {height, width} = useWindowDimensions();

    return (
        <View style={[styles.container, {width: width * .185, height: width * .085, left: (width - width * .185) * .5}]}>
            <Image source={images.logoDots} style={styles.imageStyle} resizeMode='contain' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: defaultSize * 2.25,
        // paddingBottom: defaultSize * .4,
        // backgroundColor: 'red'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
    }
})

export default PageLogo;