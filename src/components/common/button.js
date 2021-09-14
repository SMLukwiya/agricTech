import React from 'react';
import {
    View, StyleSheet, TouchableOpacity, Text
} from 'react-native';
import { defaultSize } from '../../config'


const Button = (props) => {
    const {color, backgroundColor, onPress, title, enabled, leftComponent, rightComponent, borderColor} = props;

    return (
        <View style={[styles.container]}>
            {leftComponent && <View style={styles.leftComponentStyle}>{leftComponent}</View>}
            <TouchableOpacity
                style={[
                    styles.buttonStyle, 
                    {
                        backgroundColor, borderColor,
                        justifyContent: leftComponent || rightComponent ? 'space-between' : 'center',
                        paddingRight: leftComponent || rightComponent ? defaultSize : 0
                    }
                ]}
                activeOpacity={.8}
                onPress={enabled ? onPress : () => {}}
             >
                <Text style={[
                    styles.buttonTextStyle, 
                    {
                        color, 
                        textAlign: leftComponent || rightComponent ? 'left' : 'center', 
                        paddingLeft: leftComponent || rightComponent ? defaultSize * 3 : 0,
                    }
                ]}>
                    {title}
                </Text>
                {rightComponent && <View style={styles.rightComponentStyle}>{rightComponent}</View>}
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: defaultSize * .45,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    leftComponentStyle: {
        position: 'absolute',
        left: 7.5,
        zIndex: 9
    },
    buttonStyle: {
        borderRadius: defaultSize * 1.35,
        overflow: 'hidden',
        width: '100%',
        height: defaultSize * 2.75,
        borderWidth: .5,
        flexDirection: 'row',
        alignItems: 'center'
    },
    buttonTextStyle: {
        fontSize: defaultSize * .8,
    },
    rightComponentStyle: {}
});

export default Button;