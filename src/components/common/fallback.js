import React from 'react';
import {
    View, ActivityIndicator, StyleSheet
} from 'react-native';
import {colors} from '../../config';

const Fallback = () => 
    <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.green} />
    </View>

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Fallback;