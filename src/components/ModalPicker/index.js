import React, { useState } from 'react';
import { TouchableOpacity, View, Text, Modal, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { connect } from 'react-redux';

import { colors, general } from '../../styles';
import styles from './styles';
import { editMonth } from '../Actions/monthAction';

export function ModalPicker({ options, value, selectedValue, setVisibility, type, visibility, theme, next }) {

    /**
     * @options :array
     */
    const OPTIONS = options;

    const onPressItem = (item, index) => {
        setVisibility(false);
        selectedValue(type == 'Mês' ? index + 1 : item);
        if (next) {
            next(true);
        }
    }
    console.log(value);

    const option = OPTIONS.map((item, index) => {
        return (
            <TouchableOpacity
                style={styles().itemPicker}
                key={index}
                onPress={() => onPressItem(item, index)}
            >
                <Text style={styles(theme).textItem}>{item}</Text>
                <Feather name='chevron-right' size={20} color={theme == 'light' ? colors.darkPrimary : colors.white}/>
            </TouchableOpacity>
        )
    })

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={visibility}
            onRequestClose={() => setVisibility(false)}
        >
            <TouchableWithoutFeedback onPress={() => setVisibility(false)}>
                <View style={[general().containerCenter, styles(theme).backgroundModal]}>
                    <View style={styles(theme).modalView}>
                        <Text style={styles(theme).title}>{type} • {type == 'Mês' ? options[value - 1] : value}</Text>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {option}
                        </ScrollView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}