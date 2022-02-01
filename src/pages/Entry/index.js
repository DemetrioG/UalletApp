import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Animated, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import { colors, general, metrics } from '../../styles';
import styles from './styles';

export function Entry(props) {

    const navigation = useNavigation();

    const [SWITCH, setSWITCH] = useState(false);
    const [info, setInfo] = useState(false);

    const opacity = useRef(new Animated.Value(0)).current;

    function infoFade() {
        if (!info) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
            setInfo(true);
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
            setInfo(false);
        }
    }

    return (
            <View style={general(props.theme).viewTabContent}>
                <Text style={general(props.theme).textHeaderScreen}>Lançamentos</Text>
                <View style={[general().spaceBetween, styles().buttonHeaderView]}>
                    <TouchableOpacity style={[general(props.theme).buttonOutline, general().buttonSmall]}>
                        <Text style={general(props.theme).buttonOutlineText}>FILTROS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[general(props.theme).button, general().buttonSmall]} onPress={() => navigation.navigate('NovoLançamento')}>
                        <Text style={general().buttonText}>NOVO</Text>
                    </TouchableOpacity>
                </View>
                <Text style={general(props.theme).textHeaderScreen}>Últimos lançamentos</Text>
                <View style={general().spaceAround}>
                    <Text style={general(props.theme).label}>Descrição</Text>
                    <Text style={general(props.theme).label}>Valor</Text>
                </View>
                <ScrollView style={styles().scrollList}>

                </ScrollView>
                <View style={styles().incomeView}>
                    <Text style={general(props.theme).label}>Saldo atual:</Text>
                    <Text style={styles(props.theme).incomeText}>R$ 13.000,00</Text>
                </View>
                <View style={styles().autoEntryView}>
                    <Text style={[general(props.theme).textHeaderScreen, { marginTop: Platform.OS === 'ios' ? 13 : 10 }]}>Lançamentos automáticos</Text>
                    <Switch
                        value={SWITCH}
                        onChange={() => SWITCH ? setSWITCH(false) : setSWITCH(true)}
                        thumbColor={colors.strongBlue}
                        trackColor={{ true: colors.lightBlue, false: props.theme == 'light' ? colors.gray : colors.infoBlack }}
                        style={{ marginLeft: 5 }}
                    />
                    <Feather name='info' size={metrics.iconSize} color={colors.gray} style={styles().infoIcon} onPress={infoFade}/>
                    <Animated.View style={[styles().infoView, { opacity }]}>
                        <View style={styles().triangle}/>
                        <Text style={styles().infoText}>Integre seu app com suas contas bancárias</Text>
                    </Animated.View>
                </View>
            </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
    }
  }
  
const entryConnect = connect(mapStateToProps)(Entry);

export default entryConnect;