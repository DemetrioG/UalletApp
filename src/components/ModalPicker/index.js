import React, { useEffect } from 'react';
import { TouchableOpacity, View, Text, Modal, ScrollView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { colors, general } from '../../styles';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ModalPicker({ options, value, selectedValue, setVisibility, type, visibility, theme, next }) {

    /**
     * @options :array
     */
    const OPTIONS = options;

    const onPressItem = (item, index) => {
        setVisibility(false);
        storageData(type == 'Mês' ? index + 1 : item);
        if (next) {
            next(true);
        }
    }

    async function storageData(data) {
        await AsyncStorage.setItem(type, JSON.stringify(data))
    }

    const option = OPTIONS.map((item, index) => {
        return (
            <TouchableOpacity
                style={styles().itemPicker}
                key={index}
                onPress={() => onPressItem(item, index)}
            >
                <Text style={styles(theme, type).textItem}>{item}</Text>
                <Feather name='chevron-right' size={20} color={theme == 'light' ? colors.darkPrimary : colors.white}/>
            </TouchableOpacity>
        )
    })

    // Pega a referência de Mês e Ano, e joga para o Redux month e year
    useEffect(() => {
        async function loadStorage() {
            const refMonth = await AsyncStorage.getItem('Mês');
            const refYear = await AsyncStorage.getItem('Ano');

            if (refMonth && refYear) {
                selectedValue(type == 'Mês' ? refMonth : type == 'Ano' ? refYear : null);
            }
        }

        loadStorage();
    });

    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={visibility}
            onRequestClose={() => setVisibility(false)}
        >
            <View style={[general().containerCenter, styles(theme).backgroundModal]}>
                <View style={styles(theme).modalView}>
                    <View style={styles().headerView}>
                        <Text style={styles(theme).title}>{type} • {type == 'Mês' ? options[value - 1] : value}</Text>
                        <Feather name='x' size={20} color={colors.lightRed} onPress={() => setVisibility(false)}/>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {option}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}