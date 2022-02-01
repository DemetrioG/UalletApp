import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../services/firebase';
import styles from './styles';
import { metrics, colors, general } from '../../styles';
import { editName } from '../Actions/nameAction';
import { editMonth } from '../Actions/monthAction';
import { editYear } from '../Actions/yearAction';
import { editModality } from '../Actions/modalityAction';
import ModalPicker from '../ModalPicker';

export function Header(props) {

    const [menu, setMenu] = useState(false);
    const index = { zIndex: 5 };

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

    function changeModality() {
        props.editModality(props.modality == 'Real' ? 'Projetado' : 'Real');
    }

    return (
        <View style={[styles().headerView, Platform.OS === 'ios' ? index : null]}>
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
                <TouchableOpacity style={styles().spaceIcon} onPress={() => menu ? setMenu(false) : setMenu(true)}>
                    <Feather name='more-horizontal' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                </TouchableOpacity>
            </View>
            {
                menu &&
                <View style={styles().menuView}>
                    <View style={styles().itemView}>
                        <Text style={styles().itemText}>{props.modality}</Text>
                        <TouchableOpacity style={styles().smallIconPadding} onPress={changeModality}>
                            <Feather name='refresh-cw' size={15} color={colors.white}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles().itemView}>
                        <Text style={styles().itemText}>Configurações</Text>
                        <TouchableOpacity style={styles().smallIconPadding}>
                            <Feather name='settings' size={15} color={colors.white}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles().itemView}>
                        <TouchableOpacity style={styles().logoutButton}>
                            <Text style={styles().logoutText}>LOGOUT</Text>
                            <Feather name='power' size={15} color={colors.lightRed}/>
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        uid : state.user.uid,
        name: state.name.name,
        month: state.date.month,
        year: state.date.year,
        modality: state.modality.modality
    }
  }
  
const headerConnect = connect(mapStateToProps, { editName, editMonth, editYear, editModality })(Header);

export default headerConnect;