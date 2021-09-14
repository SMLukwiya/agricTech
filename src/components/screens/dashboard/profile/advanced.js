import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { white, green, red, lightGray } = colors;
const Button = lazy(() => import('../../../common/button'));

const AdvancedProfile = (props) => {
    const { width } = useWindowDimensions();

    const CloseAdvancedProfile = () => props.navigation.navigate('home');

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={styles.profileCloseIconStyle}>
                    <Icons name='close' size={30} color={white} onPress={CloseAdvancedProfile} />
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <View style={[styles.avatarImageContainerStyle, {marginRight: -width * .5}]}>
                    <Image source={images.avatar} height='100%' width='100%' resizeMode='stretch' />
                </View>
                <View></View>
            </SafeAreaView>
        </Suspense>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        // justifyContent: 'space-around',
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    profileCloseIconStyle: {
        position: 'absolute',
        height: defaultSize * 3,
        width: defaultSize * 3,
        top: defaultSize * 2.5,
        left: defaultSize * 2,
        zIndex: 9
    },
    topBarStyle: {
        height: defaultSize * 6,
        backgroundColor: green
    },
    imageCurveStyle: {
        height: defaultSize * 9,
        tintColor: green
    },
    avatarImageContainerStyle: {
        height: defaultSize * 5,
        width: defaultSize * 5,
        borderRadius: (defaultSize * 5) * .5,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: green,
        marginTop: -defaultSize * 7.5,
    },
})

export default AdvancedProfile;