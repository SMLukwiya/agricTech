import React from 'react';
import {
    View, Text, StyleSheet
} from 'react-native';

import { defaultSize } from '../../config'

const Empty = (props) =>
        <View style={styles.emptyProductContainerStyle}>
            <Text style={styles.emptyProductTextStyle}>{props.title}</Text>
        </View>

const styles = StyleSheet.create({
    emptyProductContainerStyle: {
        alignItems: 'center'
    },
    emptyProductTextStyle: {
        fontSize: defaultSize,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default Empty;