import React from 'react';
import {
    View, Image, useWindowDimensions, StyleSheet
} from 'react-native';

import { defaultSize } from '../../config';

const Top = (props) => {
    const { height, width } = useWindowDimensions();

    return (
        <View style={[styles.imageContainerStyle, {width: width * .225, height: height * .125, top: height * .004}]}>
            <Image source={props.image} style={styles.imageStyle} resizeMode='cover' />
        </View>
    )
}

const styles = StyleSheet.create({
    imageContainerStyle: {
        position: 'absolute',
        opacity: .15,
        right: - defaultSize * 3,
    },
    imageStyle: {
        width: '100%',
        height: '100%'
    }
})

export default Top;