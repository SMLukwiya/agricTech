import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, StatusBar, useWindowDimensions, FlatList, TouchableOpacity, Alert, Animated, LayoutAnimation, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import isBetween from 'dayjs/plugin/isBetween';
import { useSelector } from 'react-redux';

import { colors, defaultSize, formatNumber, formatDecNumber } from '../../../../config';
import Fallback from '../../../common/fallback';

const { extraLightGreen, green, darkGray, lightGreen, white } = colors;
const Calendar = lazy(() => import('../../../common/calendar'));
const EmptyComponent = lazy(() => import('../../../common/emptyComponent'));
const Select = lazy(() => import('../../../common/select'));

// extend dayjs
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(isBetween);

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const Stocks = (props) => {
    const { height, width } = useWindowDimensions();

    // redux
    const {purchases} = useSelector(state => state.buy);
    const {suppliers} = useSelector(state => state.supplier)
    const remote = useSelector(state => state.remoteConfigs);
    const {
        weightKgUnitTextLabel, moneyShillingTextLabel, purchasesTextLabel, fromTextLabel, toTextLabel, dateTextLabel,
        farmerTextLabel, productTextLabel, totalWeightTextLabel, totalAmountTextLabel
    } = remote.values;

    // state
    const [calender, setCalender] = useState({ id: '', visible: false, lowerRange: '', upperRange: '' });
    const [state, setState] = useState({purchases: purchases, filter: ''});
    const [supplier, setSupplier] = useState({progress: new Animated.Value(45), name: 'Supplier', open: false});

    const goBack = () => props.navigation.navigate('home');

    // select filter method
    const selectFilterMethod = (type) => {
        if (type === 'date') {
            setSupplier({...supplier, name: 'Supplier'})
        } else {
            setCalender({...calender, lowerRange: '', upperRange: ''})
        }
        setState({...state, filter: type})
    }

    // date today
    const currentDate = `${dayjs().date() + 1}`; // add one to get all purchase records
    const currentMonth = dayjs().month().length > 1 ? `${dayjs().month() + 1}` : `0${dayjs().month() + 1}`;
    const currentYear = `${dayjs().year()}`;

    // switch calender for lower/upper ranges
    const switchCalender = (id) => {
        setCalender({...calender, id, visible: !calender.visible});
    }

    // set calender lower date
    const setCalenderMinRangeHandler = (day) => {
        setCalender({...calender, lowerRange: day.dateString, visible: false });
    }

    // set calender upper range
    const setCalenderMaxRangeHandler = (day) => {
        setCalender({...calender, upperRange: day.dateString, visible: false });
    }

    // check date of purchase and compare with calender range
    const dateBetween = (dateTest, lower, upper) => {
        let date = dayjs(dateTest).format('YYYY-MM-DD');
        return dayjs(date).isBetween(lower, dayjs(upper));
    }

    // sort using date
    const sortSalesDateHandler = () => {
        if (!calender.lowerRange || !calender.upperRange || dayjs(calender.upperRange).isBefore(dayjs(calender.lowerRange))) return; 
        let sales = purchases.filter(item => dateBetween(item.date, calender.lowerRange, calender.upperRange) === true);
        setState({...state, purchases: sales})
    }

    // sort using supplier
    const sortSalesSupplierHandler = () => {
        if (supplier.name === 'Supplier') return;
        let sales = purchases.filter(item => item.individual === supplier.name);
        setState({...state, purchases: sales})
    }

    // open supplier select
    const onToggleSupplierSelect = () => {
        LayoutAnimation.configureNext(transition);
        setSupplier({...supplier, open: !supplier.open });
        Animated.timing(supplier.progress, {
            toValue: supplier.open ? 45 : 150,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // select supplier
    const onSelectSupplier = (type, id, name) => {
        LayoutAnimation.configureNext(transition);
        setSupplier({...supplier, name, open: false });
        Animated.timing(supplier.progress, {
            toValue: 45,
            duration: 200,
            useNativeDriver: false
        }).start()
    }

    // move to add supplier screen
    const onCreateHandler = () => {
        props.navigation.navigate('addsupplier')
    }

    // set date as initial filter method
    useEffect(() => {
        setState({...state, filter: 'date'})
    }, [])

    // run sort on neccesary changes []
    useEffect(() => {
        sortSalesDateHandler();
        sortSalesSupplierHandler()
    }, [calender.lowerRange, calender.upperRange, supplier.name])

    const purchaseItemComponent = ({item: {date, individual, product, totalWeight, totalAmount}}) => 
        <View style={styles.purchaseComponentTitleContainerStyle}>
            <Text style={styles.purchaseComponentTextStyle}>{dayjs(date).format('YYYY-MM-DD')}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{individual}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{product}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{formatDecNumber(totalWeight)} {weightKgUnitTextLabel}</Text>
            <Text style={styles.purchaseComponentTextStyle}>{formatNumber(totalAmount)} {moneyShillingTextLabel}</Text>
        </View>

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <View style={[styles.purchaseHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '85%'}}>
                        <Text style={styles.purchaseHeaderTextStyle}>{purchasesTextLabel}</Text>
                    </View>
                </View>
                <View style={[styles.selectFilterContainerStyle, {width: width * .8}]}>
                    <TouchableOpacity activeOpacity={.8} onPress={() => selectFilterMethod('date')}>
                        <Text style={[styles.filterButtonStyle, {backgroundColor: state.filter === 'date' ? green : white}]}>Filter by date</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} onPress={() => selectFilterMethod('supplier')}>
                        <Text style={[styles.filterButtonStyle, {backgroundColor: state.filter === 'supplier' ? green : white}]}>Filter by supplier</Text>
                    </TouchableOpacity>
                </View>
                {
                    state.filter === 'date' ?
                    <View style={[styles.calenderPickerContainerStyle, {width: width * .8}]}>
                        <View style={styles.calenderComponentContainerStyle}>
                            <Text style={styles.calenderTextstyle}>{fromTextLabel}:</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => switchCalender('min')} style={styles.calenderButtonStyle}>
                                <Text>{calender.lowerRange}</Text>
                                <Icons name='arrow-drop-down' size={40} color={green} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.calenderComponentContainerStyle}>
                            <Text style={styles.calenderTextstyle}>{toTextLabel}:</Text>
                            <TouchableOpacity activeOpacity={.8} onPress={() => switchCalender('max')} style={styles.calenderButtonStyle}>
                                <Text>{calender.upperRange}</Text>
                                <Icons name='arrow-drop-down' size={40} color={green} />
                            </TouchableOpacity>
                        </View>
                    </View> :
                    <View style={{width: width * .65, marginTop: defaultSize}}>
                        <Select
                            height={supplier.progress}
                            onToggleSelector={onToggleSupplierSelect}
                            productName={supplier.name}
                            isProductOpen={supplier.open}
                            productList={suppliers}
                            onProductSelect={onSelectSupplier}
                            buttonTitle='Select supplier'
                            onCreateHandler={onCreateHandler}
                        />
                    </View>
                }
                <View style={{alignItems: 'center'}}>
                    {calender.visible && <Calendar
                        currentDate={`${currentYear}-${currentMonth}-${currentDate}`}
                        maxDate={`${currentYear}-${currentMonth}-${currentDate}`}
                        onDayPress={calender.id === 'min' ? setCalenderMinRangeHandler : setCalenderMaxRangeHandler}
                    />}
                    <View style={{alignItems: 'center'}}>
                        <View style={styles.purchaseHeaderTitleContainerStyle}>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>{dateTextLabel}</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>{farmerTextLabel}</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>{productTextLabel}</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>{totalWeightTextLabel}</Text>
                            <Text style={styles.purchaseHeaderTitleTextStyle}>{totalAmountTextLabel}</Text>
                        </View>
                        <View style={[styles.flatlistContainerStyle, {height: height * .675}]}>
                            {state.purchases.length === 0 ? <EmptyComponent title='No Sales added' />:
                            <FlatList 
                                contentContainerStyle={{justifyContent: 'space-around'}}
                                data={state.purchases}
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
    // 
    selectFilterContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: defaultSize
    },
    filterButtonStyle: {
        borderColor: green,
        borderWidth: 1,
        borderRadius: defaultSize,
        overflow: 'hidden',
        paddingHorizontal: defaultSize,
        paddingVertical: defaultSize * .2
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
        width: '100%'
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