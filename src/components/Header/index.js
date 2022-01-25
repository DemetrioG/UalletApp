import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../services/firebase';
import styles from './styles';
import { metrics, colors } from '../../styles';
import { editName } from '../Actions/nameAction';

export function Header(props) {

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
            <Text style={styles(props.theme).headerText}>Bem vindo, {props.name}!</Text>
            <View style={styles().headerIconView}>
                <TouchableOpacity>
                    <Feather name='calendar' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white} onPress={() => navigation.navigate('Complete')}/>
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
        name: state.name.name
    }
  }
  
const headerConnect = connect(mapStateToProps, { editName })(Header);

export default headerConnect;