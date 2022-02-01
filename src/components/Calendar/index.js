import React, { useState } from 'react';
import { View, Text, Platform, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { connect } from 'react-redux';

import styles from './styles';
import { colors } from '../../styles';

export function Calendar({ onClose, date, onChange, theme }) {

    const [dateNow, setDateNow] = useState(new Date(date));

    return (
        <View>
            {
                Platform.OS === 'ios' &&
                <View style={styles(theme).headerDate}>
                    <TouchableOpacity onPress={() => onClose()}>
                        <Text style={styles(theme).dateText}>FECHAR</Text>
                    </TouchableOpacity>
                </View>
            }
            <DateTimePicker
                value={dateNow}
                mode='date'
                display='spinner'
                style={{ backgroundColor: theme == 'light' ? colors.lightPrimary : colors.darkPrimary }}
                onChange={(event, date) => {
                    const currentDate = date || dateNow;
                    setDateNow(currentDate);
                    onChange(currentDate);
                }}
            />
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
  }
  
const calendarConnect = connect(mapStateToProps)(Calendar);

export default calendarConnect;