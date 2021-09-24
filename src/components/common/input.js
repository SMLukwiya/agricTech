import React from 'react';
import {
    View, StyleSheet, TextInput, Text, Appearance
} from 'react-native';
import { colors, defaultSize } from '../../config'

const { white, darkGray } = colors;

const Input = (props) => {
    const { placeholder, error, value, rightComponent, onChangeText, onBlur, touched, keyboardType, secureTextEntry, textAlign } = props;

    // check user theme
    const colorScheme = Appearance.getColorScheme();

    return (
        <View style={styles.container}>
            <View style={styles.textInputContainerStyle}>
                {rightComponent && rightComponent}
                <TextInput
                    style={[styles.textInputStyle, {color: darkGray, textAlign: textAlign}]}
                    placeholder={placeholder}
                    placeholderTextColor={colorScheme === 'dark' ? darkGray : darkGray}
                    value={value}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    keyboardType={keyboardType}
                    autoCompleteType='off'
                    autoCorrect={false}
                    autoCapitalize='none'
                    secureTextEntry={secureTextEntry}
                />
             </View>
             {(!!error && touched) && <Text style={styles.errorTextStyle}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: defaultSize * .6,
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInputStyle: {
        fontSize: defaultSize * .75,
        height: defaultSize * 2.75,
        width: '100%',
        borderRadius: defaultSize * 1.35,
        overflow: 'hidden',
        paddingHorizontal: defaultSize,
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    errorTextStyle: {
        color: 'red',
        fontSize: defaultSize * .7,
        marginLeft: defaultSize
    }
});

export default Input;