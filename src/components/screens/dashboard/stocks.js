import React, { Suspense, lazy, useState, useEffect } from 'react';
import {
    View, StyleSheet, Text, Image, StatusBar, useWindowDimensions, ScrollView, Animated, LayoutAnimation, UIManager
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialIcons';
import { PieChart, BarChart} from 'react-native-chart-kit';
import { useSelector } from 'react-redux';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

import { colors, images, defaultSize, capitalize } from '../../../config';
import Fallback from '../../common/fallback';

const { white, green, blue, darkGray, purple, lightGray } = colors;
const Select = lazy(() => import('../../common/select'));
const TopCornerImage = lazy(() => import('../../common/topCornerComponent'));
const HeaderRight = lazy(() => import('../../common/secondHeader'));
const PageLogo = lazy(() => import('../../common/pageLogo'));

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const months = [
    {name: 'Jan-Jun', type: 'stockIn', id: 'one'},
    {name: 'Jul-Dec', type: 'stockIn', id: 'two'}
]

const outmonths = [
    {name: 'Jan-Jun', type: 'stockOut', id: 'one'},
    {name: 'Jul-Dec', type: 'stockOut', id: 'two'}
]

const transition = LayoutAnimation.create(200, 'easeInEaseOut', 'scaleY');

const Stocks = (props) => {
    const { width } = useWindowDimensions();

    // redux
    const products = useSelector(state => state.product);

    // state
    const [stockIn, setStockIn] = useState({progress: new Animated.Value(45) , name: 'Stock in', open: false});
    const [stockOut, setStockOut] = useState({progress: new Animated.Value(45), name: 'Stock out', open: false});
    const [stockValues, setStockValues] = useState({coffee: {labels: [], datasets: []}, cocoa: {labels: [], datasets: []}, maize: {labels: [], datasets: []}, rice: {labels: [], datasets: []}})
    const [stockOutValues, setStockOutValues] = useState({coffee: {labels: [], datasets: []}, cocoa: {labels: [], datasets: []}, maize: {labels: [], datasets: []}, rice: {labels: [], datasets: []}})

    const goBack = () => props.navigation.navigate('home');

    const onToggleSelector = (id, name) => {
        LayoutAnimation.configureNext(transition);
        if (id === 'stockIn') {
            setStockIn({...stockIn, open: !stockIn.open, name });
            Animated.timing(stockIn.progress, {
                toValue: stockIn.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setStockOut({...stockOut, open: !stockOut.open, name });
            Animated.timing(stockOut.progress, {
                toValue: stockOut.open ? 45 : 150,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
    }

    const onProductSelect = (type, id, name) => {
        console.log(type)
        LayoutAnimation.configureNext(transition);
        if (type === 'stockIn') {
            setStockIn({...stockIn, name, open: false });
            Animated.timing(stockIn.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        } else {
            setStockOut({...stockOut, name, open: false });
            Animated.timing(stockOut.progress, {
                toValue: 45,
                duration: 200,
                useNativeDriver: false
            }).start()
        }
    }

    const dataFirstHalf = () => {
        // sort the values in order
        // stock input
        let coffeeValues = [], coffeeSortedLabel = [], coffeeSortedValues = [], 
        cocoaValues = [], cocoaSortedLabel = [], cocoaSortedValues = [],
        maizeValues = [], maizeSortedLabel = [], maizeSortedValues = [],
        riceValues = [], riceSortedLabel = [], riceSortedValues = [],

        // stock output
        coffeeOutValues = [], coffeeSortedOutLabel = [], coffeeSortedOutValues = [], 
        cocoaOutValues = [], cocoaSortedOutLabel = [], cocoaSortedOutValues = [],
        maizeOutValues = [], maizeSortedOutLabel=[], maizeSortedOutValues = [],
        riceOutValues = [], riceSortedoutLabel = [], riceSortedOutValues = []

        products.stockIn.forEach(item => {
            if (item.name === 'Coffee') {
                for (key in item['Coffee'].data) {
                    coffeeValues.push({label: item['Coffee'].data[key].label, order: item['Coffee'].data[key].order, data: item['Coffee'].data[key].data})
                    coffeeValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Cocoa') {
                for (key in item['Cocoa'].data) {
                    cocoaValues.push({label: item['Cocoa'].data[key].label, order: item['Cocoa'].data[key].order, data: item['Cocoa'].data[key].data})
                    cocoaValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Maize') {
                for (key in item['Maize'].data) {
                    maizeValues.push({label: item['Maize'].data[key].label, order: item['Maize'].data[key].order, data: item['Maize'].data[key].data})
                    maizeValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Rice') {
                for (key in item['Rice'].data) {
                    riceValues.push({label: item['Rice'].data[key].label, order: item['Rice'].data[key].order, data: item['Rice'].data[key].data})
                    riceValues.sort((a, b) => a.order - b.order)
                }
            }
        });

        products.stockOut.forEach(item => {
            if (item.name === 'Coffee') {
                for (key in item['Coffee'].data) {
                    coffeeOutValues.push({label: item['Coffee'].data[key].label, order: item['Coffee'].data[key].order, data: item['Coffee'].data[key].data})
                    coffeeOutValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Cocoa') {
                for (key in item['Cocoa'].data) {
                    cocoaOutValues.push({label: item['Cocoa'].data[key].label, order: item['Cocoa'].data[key].order, data: item['Cocoa'].data[key].data})
                    cocoaOutValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Maize') {
                for (key in item['Maize'].data) {
                    maizeOutValues.push({label: item['Maize'].data[key].label, order: item['Maize'].data[key].order, data: item['Maize'].data[key].data})
                    maizeOutValues.sort((a, b) => a.order - b.order)
                }
            } else if (item.name === 'Rice') {
                for (key in item['Rice'].data) {
                    riceOutValues.push({label: item['Rice'].data[key].label, order: item['Rice'].data[key].order, data: item['Rice'].data[key].data})
                    riceOutValues.sort((a, b) => a.order - b.order)
                }
            }
        });

        // coffee
        coffeeValues.map(item => coffeeSortedLabel.push(item.label)); 
        coffeeValues.map(item => coffeeSortedValues.push({label: item.label, data: parseInt(item.data)}));
        // cocoa
        cocoaValues.map(item => cocoaSortedLabel.push(item.label)); 
        cocoaValues.map(item => cocoaSortedValues.push({label: item.label, data: parseInt(item.data)}));
        // maize
        maizeValues.map(item => maizeSortedLabel.push(item.label)); 
        maizeValues.map(item => maizeSortedValues.push({label: item.label, data: parseInt(item.data)}));
        // rice
        riceValues.map(item => riceSortedLabel.push(item.label)); 
        riceValues.map(item => riceSortedValues.push({label: item.label, data: parseInt(item.data)}));

        // * stock output *//
        // coffee
        coffeeOutValues.map(item => coffeeSortedOutLabel.push(item.label)); 
        coffeeOutValues.map(item => coffeeSortedOutValues.push({label: item.label, data: parseInt(item.data)}));
        // cocoa
        cocoaOutValues.map(item => cocoaSortedOutLabel.push(item.label)); 
        cocoaOutValues.map(item => cocoaSortedOutValues.push({label: item.label, data: parseInt(item.data)}));
        // maize
        maizeOutValues.map(item => maizeSortedOutLabel.push(item.label)); 
        maizeOutValues.map(item => maizeSortedOutValues.push({label: item.label, data: parseInt(item.data)}));
        // rice
        riceOutValues.map(item => riceSortedoutLabel.push(item.label)); 
        riceOutValues.map(item => riceSortedOutValues.push({label: item.label, data: parseInt(item.data)}));

        setStockValues({
            ...stockValues,
            coffee: {
                ...stockValues.coffee,
                labels: coffeeSortedLabel,
                datasets: coffeeSortedValues
            },
            cocoa: {
                ...stockValues.cocoa,
                labels: cocoaSortedLabel,
                datasets: cocoaSortedValues
            },
            maize: {
                ...stockValues.maize,
                labels: maizeSortedLabel,
                datasets: maizeSortedValues
            },
            rice: {
                ...stockValues.rice,
                labels: riceSortedLabel,
                datasets: riceSortedValues
            },
        })

        // stock output
        setStockOutValues({
            ...stockOutValues,
            coffee: {
                ...stockOutValues.coffee,
                labels: coffeeSortedOutLabel,
                datasets: coffeeSortedOutValues
            },
            cocoa: {
                ...stockOutValues.cocoa,
                labels: cocoaSortedOutLabel,
                datasets: cocoaSortedOutValues
            },
            maize: {
                ...stockOutValues.maize,
                labels: maizeSortedOutLabel,
                datasets: maizeSortedOutValues
            },
            rice: {
                ...stockOutValues.rice,
                labels: riceSortedoutLabel,
                datasets: riceSortedOutValues
            },
        })
        
    }

    let productList = []
    for (key in stockValues) {
        productList.push({name: key})
    }

    useEffect(() => {
        dataFirstHalf();
    }, [])

    const chartConfig = {
        backgroundColor: white,
        backgroundGradientFrom: white,
        backgroundGradientTo: white,
        decimalPlaces: 2,
        color: (opacity = 1) => white,
        labelColor: (opacity = 1) => darkGray,
        fillShadowGradient: purple,
        fillShadowGradientOpacity: 1,
        useShadowColorFromDataset: false,
        strokeWidth: 1,
        barPercentage: 0.8,
        useShadowColorFromDataset: false
    }

    return (
        <Suspense fallback={<Fallback />}>
            <StatusBar translucent barStyle='dark-content' backgroundColor='transparent' />
            <SafeAreaView style={[styles.container, {width}]} edges={['bottom']}>
                <PageLogo />
                <View style={[styles.createAccountHeaderStyle, {width: width * .8}]}>
                    <Icons name='arrow-back-ios' size={25} onPress={goBack} />
                    <View style={{width: '90%'}}>
                        <Text style={styles.createAccountHeaderTextStyle}>Your Stocks</Text>
                    </View>
                    <TopCornerImage image={images.stockIcon} />
                    <HeaderRight navigation={props.navigation} />
                </View>
                <View style={[styles.containerStyle, {width: width * .8}]}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={styles.stockInTitleStyle}>Stock in</Text>
                        <View style={styles.selectContainerStyle}>
                            <Select
                                height={stockIn.progress}
                                onToggleSelector={() => onToggleSelector('stockIn', 'Select range')}
                                productName={stockIn.name}
                                isProductOpen={stockIn.open}
                                productList={months}
                                onProductSelect={onProductSelect}
                                buttonTitle='Create new stockIn'
                                onCreateHandler={() => onCreateHandler('stockIn')}
                            />
                        </View>
                        <View>
                            {productList.map(({name}) => 
                                stockValues[name] && stockValues[name].datasets ? 
                                <View key={name} style={styles.barChartContainerStyle} >
                                    <Text style={styles.stockProductName}>{capitalize(name)}</Text>
                                    <VictoryChart 
                                        theme={VictoryTheme.material}
                                        minDomain={{ y: 0 }}
                                        origin={{y: 0}}
                                        domainPadding={{ x: 14 }}>
                                        <VictoryAxis
                                            tickValues={stockValues[name].labels}
                                            tickFormat={stockValues[name].labels} />
                                        <VictoryAxis
                                            dependentAxis
                                            minDomain={{y:0}}
                                            tickFormat={(x) => `${x}`}
                                            />
                                        <VictoryBar
                                            data={stockValues[name].datasets}
                                            x="label"
                                            y="data"  
                                            style={{ data: { fill: purple } }}
                                            alignment="middle"
                                            barRatio={0.7}
                                        />
                                    </VictoryChart>
                                </View> :
                                <React.Fragment />
                            )}
                        </View>

                        <Text style={styles.stockInTitleStyle}>Stock Out</Text>
                        <View style={styles.selectContainerStyle}>
                            <Select
                                height={stockOut.progress}
                                onToggleSelector={() => onToggleSelector('stockOut', 'Select range')}
                                productName={stockOut.name}
                                isProductOpen={stockOut.open}
                                productList={outmonths}
                                onProductSelect={onProductSelect}
                                buttonTitle='Create new stockOut'
                                onCreateHandler={() => onCreateHandler('stockOut')}
                            />
                        </View>
                        <View>
                            {productList.map(({name}) => 
                                stockOutValues[name] && stockOutValues[name].datasets ? 
                                <View key={name} style={styles.barChartContainerStyle} >
                                    <Text style={styles.stockProductName}>{capitalize(name)}</Text>
                                    <VictoryChart 
                                        theme={VictoryTheme.material}
                                        minDomain={{ y: 0 }}
                                        origin={{y: 0}}
                                        domainPadding={{ x: 14 }}>
                                        <VictoryAxis
                                            tickValues={stockOutValues[name].labels}
                                            tickFormat={stockOutValues[name].labels} />
                                        <VictoryAxis
                                            dependentAxis
                                            minDomain={{y:0}}
                                            tickFormat={(x) => `${x}`}
                                            />
                                        <VictoryBar
                                            data={stockOutValues[name].datasets}
                                            x="label"
                                            y="data"  
                                            style={{ data: { fill: purple } }}
                                            alignment="middle"
                                            barRatio={0.7}
                                        />
                                    </VictoryChart>
                                </View> :
                                <React.Fragment />
                            )}
                        </View>
                        
                    </ScrollView>
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
    createAccountHeaderStyle: {
        flexDirection: 'row',
        marginTop: defaultSize * 4.5,
        width: '100%',
        alignItems: 'center'
    },
    createAccountHeaderTextStyle: {
        textAlign: 'center',
        fontSize: defaultSize * 1.25,
        fontWeight: 'bold'
    },
    containerStyle: {
        marginTop: defaultSize * 2,
        paddingBottom: defaultSize * 12
    },
    selectContainerStyle: {},
    stockInTitleStyle: {
        fontSize: defaultSize * 1.1,
        marginBottom: defaultSize,
        marginLeft: defaultSize * .5
    },
    stockProductName: {
        fontSize: defaultSize,
        fontWeight: 'bold'
    },
    barChartContainerStyle: {
        marginVertical: defaultSize * 2,
    },
    graphStyle: {
        borderLeftWidth: 1,
        borderLeftColor: lightGray,
        borderBottomColor: lightGray,
        borderBottomWidth: 1
    }
});

export default Stocks;