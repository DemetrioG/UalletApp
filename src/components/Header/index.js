import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../services/firebase';
import styles from './styles';
import { metrics, colors } from '../../styles';
import { editName } from '../Actions/nameAction';
import { editMonth } from '../Actions/monthAction';
import { editYear } from '../Actions/yearAction';
import { ModalPicker } from '../ModalPicker';

export function Header(props) {

    const optionsMonth = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const optionsYear = [];
    const [pickerMonthVisible, setPickerMonthVisible] = useState(false);
    const [pickerYearVisible, setPickerYearVisible] = useState(false);

    for (let index = 0; index < 15; index++) {
        optionsYear.push(new Date().getFullYear() + index)
    }

    useEffect(() => {
        async function getData() {
            
            await firebase.firestore().collection('users').doc(props.uid).get()
            .then((v) => {
                // Pega o primeiro nome do usuário
                props.editName((v.data().name).split(' ', 1));
            })
        }

        if (!props.name) {
            getData();
        }
    }, []);

    return (
        <View style={styles().headerView}>
            <ModalPicker
                options={optionsMonth}
                selectedValue={props.editMonth}
                theme={props.theme}
                type='Mês'
                visibility={pickerMonthVisible}
                setVisibility={setPickerMonthVisible}
                value={props.month}
                next={setPickerYearVisible}
            />
            <ModalPicker
                options={optionsYear}
                selectedValue={props.editYear}
                theme={props.theme}
                type='Ano'
                visibility={pickerYearVisible}
                setVisibility={setPickerYearVisible}
                value={props.year}
            />
            <Text style={styles(props.theme).headerText}>Bem vindo, {props.name}!</Text>
            <View style={styles().headerIconView}>
                <TouchableOpacity>
                    <Feather name='calendar' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white} onPress={() => setPickerMonthVisible(true)}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles().spaceIcon}>
                    <Feather name='bell' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles().spaceIcon}>
                    <Feather name='more-horizontal' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        uid : state.user.uid,
        name: state.name.name,
        month: state.date.month,
        year: state.date.year
    }
  }
  
const headerConnect = connect(mapStateToProps, { editName, editMonth, editYear })(Header);

export default headerConnect;