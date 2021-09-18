import React from 'react';
import { View } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { colors } from '../../config';
const {green} = colors;

const CalenderComponent = (props) => {
    const { currentDate, minDate, maxDate, onDayPress, onMonthChange } = props;
    
    return (
        <View>
            <Calendar 
                minDate={minDate}
                maxDate={maxDate}
                onDayPress={onDayPress}
                monthFormat={'yyyy MM'}
                onMonthChange={onMonthChange}
                hideArrows={false}
                markedDates={{
                    [currentDate]: {selected: true, marked: true, selectedColor: green}
                }}
            />
        </View>
    )
}

export default CalenderComponent;