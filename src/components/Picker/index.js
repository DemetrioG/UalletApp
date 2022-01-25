import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import { colors, general, metrics } from '../../styles';
import styles from './styles';
import { editPicker } from '../Actions/pickerVisibility';

export function Picker({ options, selectedValue, theme, value, type, visibility, setVisibility }) {

    /**
     * @options :array
     */
    const OPTIONS = options;

    const onPressItem = (option) => {
        setVisibility(false);
        selectedValue(option);
    }

    const option = OPTIONS.map((item, index) => {
        return (
            <TouchableOpacity
                style={styles().itemPicker}
                key={index}
                onPress={() => onPressItem(item)}
            >
                <Text style={styles(theme).textItem}>{item}</Text>
                <Feather name='chevron-right' size={20} color={theme == 'light' ? colors.darkPrimary : colors.white}/>
            </TouchableOpacity>
        )
    })

    return (
        <View style={[general().input, styles().alignVertical]}>
            <TouchableOpacity style={styles().spaceItens} onPress={() => setVisibility(true)}>
                <Text style={[styles().pickerText, { color: value == type ? colors.lightGray : theme == 'light' ? colors.darkPrimary : colors.white }]}>{value}</Text>
                <Feather name='chevron-down' size={20} color={colors.lightGray}/>
            </TouchableOpacity>
            <Modal
                transparent={true}
                animationType='fade'
                visible={visibility}
                onRequestClose={() => setVisibility(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisibility(false)}>
                    <View style={[general().containerCenter, styles(theme).backgroundModal]}>
                        <View style={styles(theme).modalView}>
                            <Text style={styles(theme).title}>{type}</Text>
                            <ScrollView>
                                {option}
                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        picker: state.picker.modalVisibility
    }
}

const pickerConnect = connect(mapStateToProps, { editPicker })(Picker);

export default pickerConnect;