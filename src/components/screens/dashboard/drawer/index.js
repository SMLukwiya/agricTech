import React, { Suspense, lazy } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, TouchableOpacity, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CommonActions } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';

import { colors, images, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';
import { logout } from '../../../../store/actions';

const { white, green, red, lightGray } = colors;
const Button = lazy(() => import('../../../common/button'));

const CustomDrawer = (props) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();

    // redux
    const {user} = useSelector(state => state.user);

    // dummy items
    const items = [
        {id: 1, name: 'Monitor Stock', image: images.monitor, onPress:() => {}},
        {id: 2, name: 'Profile', image: images.profile, onPress: () => props.navigation.navigate('profile')},
        {id: 3, name: 'Invite friends', image: images.friends, onPress:() => {}},
        {id: 4, name: 'Preferences', image: images.preference, onPress:() => {}},
        {id: 5, name: 'About', image: images.info, onPress:() => {}},
        {id: 6, name: 'Contact Support', image: images.support, onPress:() => {}}
    ];

    const profileComponent = (id, name, image, onPress) => 
        <TouchableOpacity activeOpacity={.8} onPress={onPress} style={styles.profileComponentContainerStyle} key={id}>
            <View style={styles.leftProfileComponentStyle}>
                <View style={styles.profileImageContainerStyle}>
                    <Image source={image} height='100%' width='100%' />
                </View>
                <Text style={styles.profileNameTextStyle}>{name}</Text>
            </View>
            <Icons name='arrow-forward-ios' size={23} color={green} />
        </TouchableOpacity>

    const closeDrawer = () => props.navigation.closeDrawer();

    const signOut = () => {
        dispatch(logout(null, () => {
            props.navigation.dispatch(CommonActions.reset({
                type: 'stack',
                index: 0,
                routes: [{name: 'auth'}]
            }))},
            (err) => console.log('Logout error ', err)
    ));

    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={styles.profileCloseIconStyle}>
                    <Icons name='close' size={30} color={white} onPress={closeDrawer} />
                </View>
                <View style={[styles.topBarStyle, {width}]}/>
                <Image source={images.curve} style={[styles.imageCurveStyle, {width: width * 3.5, marginLeft: width * 0.055}]} resizeMode='cover' />
                <View style={[styles.avatarImageContainerStyle, {marginRight: -width * .5}]}>
                    <Image source={user ? {uri: user.imageUrl} : images.avatar}  style={styles.imageStyle} resizeMode='cover' />
                </View>
                <View>
                    <Text style={styles.profileTitleStyle}>{user ? user.fullName: ''}</Text>
                    <View style={{width: width * .8, marginTop: defaultSize}}>
                        {items.map(({id, name, image, onPress}) => profileComponent(id, name, image, onPress))}
                    </View>
                </View>
                <View style={{justifyContent: 'space-around'}}>
                    <View style={{width: width * .8, alignItems: 'center', marginTop: defaultSize}}>
                        <Text style={styles.lowerContainerTitleStyle}>Other Services</Text>
                        <View style={styles.lowerOuterContainerStyle}>
                            <View style={styles.lowerProfileComponentContainerStyle}>
                                <Image source={images.finance} />
                                <Text style={styles.lowerTextStyle}>Access Finance</Text>
                            </View>
                            <View style={styles.lowerProfileComponentContainerStyle}>
                                <Image source={images.find} />
                                <Text style={styles.lowerTextStyle}>Find Market</Text>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.buttonContainer, {width: width * .8}]}>
                        <Button
                            title='Logout'
                            backgroundColor={red}
                            borderColor={red}
                            color={white}
                            enabled onPress={signOut}
                        />
                    </View>
                </View>
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
    imageStyle: {
        height: '100%',
        width: '100%'
    },
    profileTitleStyle: {
        fontSize: defaultSize * 1.2,
        fontWeight: 'bold'
    },
    // 
    profileComponentContainerStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: defaultSize * .65,
        alignItems: 'center'
    },
    leftProfileComponentStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profileImageContainerStyle: {
        height: defaultSize * 2.5,
        width: defaultSize * 2
    },
    profileNameTextStyle: {
        fontSize: defaultSize * .8,
        marginLeft: defaultSize
    },
    lowerOuterContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: defaultSize
    },
    lowerProfileComponentContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    // 
    lowerContainerTitleStyle: {
        fontSize: defaultSize * 1.2,
        fontWeight: 'bold',
        color: lightGray
    },
    lowerTextStyle: {
        marginLeft: defaultSize * .5
    },
    buttonContainer: {
        marginTop:defaultSize
    }
});

export default CustomDrawer;