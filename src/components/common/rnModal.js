import React from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet, Modal, useWindowDimensions } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import {colors, defaultSize} from '../../config';

const { bgColor } = colors;

const RNModal = (props) => {
    const { height, width } = useWindowDimensions();

    const { visible, onRequestClose, presentationStyle, children, closeIconColor } = props;

    return (
        <Modal
            visible={visible}
            animationType='fade'
            onRequestClose={onRequestClose}
            statusBarTranslucent
            presentationStyle={presentationStyle}
            transparent
            animationType='fade'
        >
            <View style={[styles.modalContainer, {height, width}]}>
                <View style={styles.closeIconContainerStyle}>
                    <Icons name='close' size={35} color={closeIconColor} onPress={onRequestClose} />
                </View>
                {children}
            </View>
        </Modal>
    )
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: bgColor,
        alignItems: 'center',
        justifyContent: 'center'
    },
    closeIconContainerStyle: {
        position: 'absolute',
        top: defaultSize * 2,
        left: defaultSize * 2
    }
});

export default RNModal;