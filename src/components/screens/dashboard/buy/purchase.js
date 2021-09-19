import React, { Suspense, lazy, useState } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, FlatList, TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';
import { useSelector } from 'react-redux';

import { colors, defaultSize } from '../../../../config';
import Fallback from '../../../common/fallback';

const { extraLightGreen, green, darkGray, lightGreen } = colors;
const Calendar = lazy(() => import('../../../common/calendar'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));

// extend dayjs
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

const Stocks = (props) => {
    const { height, width } = useWindowDimensions();

    // redux
    const {purchases} = useSelector(state => state.buy);

    // state
    const [calender, setCalender] = useState({ id: '', visible: false, lowerRange: '', upperRange: '' });
    const [state, setState] = useState({purchases: purchases})

    const goBack = () => props.navigation.navigate('home');

    // date today
    const currentDate = `${dayjs().date() + 1}`; // add one to get all purchase records
    const currentMonth = dayjs().month().length > 1 ? `${dayjs().month() + 1}` : `0${dayjs().month() + 1}`;
    const currentYear = `${dayjs().year()}`;

    const switchCalender = (id) => {
        setCalender({...calender, id, visible: !calender.visible});
    }

    // set calender dates
    const setCalenderMinRangeHandler = (day) => {
        setCalender({...calender, lowerRange: day.dateString, visible: false });
    }

    const setCalenderMaxRangeHandler = (day) => {
        setCalender({...calender, upperRange: day.dateString, visible: false });
    }

    console.log(dayjs(dayjs(state.purchases[0].date)).isBetween(state.lowerRange, dayjs(state.upperRange)))

    const sortSalesHandler = () => {
        
    }

    const purchaseItemComponent = ({item: {date, individual, product, totalWeight, totalAmount}}) => 
        <View style={styles.purchaseComponentTitleContainerStyle}>
            <Text style={styles.purchaseComponentTextStyle}>{dayjs(date).format('YYYY-DD-MM')}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{individual}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{product}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{totalWeight} kgs</Text>
            <Text style={styles.purchaseComponentTextStyle}>{totalAmount} UGX</Text>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.purchaseHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.purchaseHeaderTextStyle}>Purchases</Text>
                    </View>
                </View>
                <View style={{alignItems: 'center'}}>
                    <View style={[styles.calenderPickerContainerStyle, {width: width * .8}]}>
                        <View style={styles.calenderComponentContainerStyle}>
                            <Text style={styles.calenderTextstyle}>From:</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => switchCalender('min')} style={styles.calenderButtonStyle}>
                                <Text>{calender.lowerRange}</Text>
                                <Icons name='arrow-drop-down' size={40} color={green} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.calenderComponentContainerStyle}>
                            <Text style={styles.calenderTextstyle}>To:</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => switchCalender('max')} style={styles.calenderButtonStyle}>
                                <Text>{calender.upperRange}</Text>
                                <Icons name='arrow-drop-down' size={40} color={green} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {calender.visible && <Calendar
                        currentDate={`${currentYear}-${currentMonth}-${currentDate}`}
                        maxDate={`${currentYear}-${currentMonth}-${currentDate}`}
                        onDayPress={calender.id === 'min' ? setCalenderMinRangeHandler : setCalenderMaxRangeHandler}
                    />}
                    <View>
                        <View style={styles.purchaseHeaderTitleContainerStyle}>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>Date</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>Farmer</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>Product</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>Tot Wgt</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>Tot Amt</Text>
                        </View>
                        <View style={[styles.flatlistContainerStyle, {height: height * .675}]}>
                            {state.purchases.length === 0 ? <EmptyComponent title='No Sales added' />:
                            <FlatList 
                                contentContainerStyle={{justifyContent: 'space-around'}}
                                data={purchases}
                                keyExtractor={(item) => item.id}
                                renderItem={purchaseItemComponent}
                            />} 
                        </View>
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
        backgroundColor: 'white'
    },
    purchaseHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4,
        width: '100%',
        alignItems: 'center'
    },
    purchaseHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    calenderPickerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: defaultSize
    },
    calenderComponentContainerStyle: {
        width: '40%'
    },
    calenderButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: defaultSize,
        borderRadius: defaultSize * 1.5,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: green
    },
    calenderTextstyle: {
        fontSize: defaultSize * .85,
        fontWeight: 'bold'
    },
    purchaseHeaderTitleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: defaultSize * 2,
        height: defaultSize * 3
    },
    purchaseHeaderTitleTextStyle: {
        width: '19%',
        height: '100%',
        textAlign: 'center',
        backgroundColor: extraLightGreen,
        marginHorizontal: defaultSize * .5
    },
    flatlistContainerStyle: {
        width: '100%',
    },
    purchaseComponentTitleContainerStyle: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: defaultSize * .35
    },
    purchaseComponentTextStyle: {
        width: '19.5%',
        height: '100%',
        textAlign: 'center',
        backgroundColor: lightGreen
    },
});

export default Stocks;