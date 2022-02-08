import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, TouchableWithoutFeedback, Keyboard, Animated, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { TextInputMask } from 'react-native-masked-text';

import firebase from '../../services/firebase';
import { convertDate, convertDateToDatabase, realToNumber } from '../../functions/index';
import { general, metrics, colors } from '../../styles';
import styles from './styles';
import Picker from '../../components/Picker';
import Calendar from '../../components/Calendar';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';

export function NewEntry(props) {

    const navigation = useNavigation();
    const opacity = useRef(new Animated.Value(0)).current;
    
    const [register, setRegister] = useState(false);

    const [type, setType] = useState('Receita');
    const [date, setDate] = useState(null);
    const [description, setDescription] = useState(null);
    const [modality, setModality] = useState(null);
    const [segment, setSegment] = useState(null);
    const [value, setValue] = useState(null);
    const [modalityVisible, setModalityVisible] = useState(null);
    const [segmentVisible, setSegmentVisible] = useState(null);
    const [calendar, setCalendar] = useState(false);
    
    const optionsModality = ['Projetado', 'Real'];
    const optionsSegment = ['Lazer', 'Educação', 'Investimentos', 'Necessidades', 'Curto e médio prazo'];

    function onChangeDate(date) {
        setCalendar(Platform.OS === 'ios');
        setDate(convertDate(date));
    }

    function dateFade() {
        if (!calendar) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
            setCalendar(true);
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
            setCalendar(false)
        }
    }

    function closeAndroid() {
        setCalendar(false);
    }

    async function registerEntry() {
        if (!date || !description || !modality || type == 'Despesa' && !segment || !value) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe todos os campos');
            props.editVisibilityAlert(true);
            return; 
        }

        if (date.length < 10) {
            props.editTitleAlert('Verifique a data informada');
            props.editVisibilityAlert(true);
            return; 
        }

        setRegister(true);
        // Atualiza o saldo atual no banco
        let balance;
        await firebase.firestore().collection('balance').doc(props.uid).collection(props.modality).doc('balance').get()
        .then((v) => {
            balance = v.data().balance
        })
        .catch((error) => {
            balance = 0;
        })

        if (type == 'Receita') {
            balance += realToNumber(value);
        } else {
            balance -= realToNumber(value);
        }
        
        await firebase.firestore().collection('balance').doc(props.uid).collection(props.modality).doc('balance').set({
            balance: balance
        })

        let id = 1;
        // Busca o último ID de lançamentos cadastrados no banco para setar o próximo ID
        await firebase.firestore().collection('entry').doc(props.uid).collection(modality).orderBy('id', 'desc').limit(1).get()
        .then((v) => {
            v.forEach((result) => {
                id += result.data().id;
            });
        })

        // Registra o novo lançamento no banco
        await firebase.firestore().collection('entry').doc(props.uid).collection(modality).doc(id.toString()).set({
            id: id,
            date: convertDateToDatabase(date),
            type: type,
            description: description,
            modality: modality,
            segment: segment,
            value: value
        })
        .then((v) => {
            navigation.navigate('Lançamentos');
            props.editTypeAlert('success');
            props.editTitleAlert('Dados cadastrados com sucesso');
            props.editVisibilityAlert(true);
        })
        .catch((error) => {
            props.editTypeAlert('error');
            props.editTitleAlert('Erro ao cadastrar as informações');
            props.editVisibilityAlert(true);
        })
        setRegister(false);
    }

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={[general(props.theme).viewTabContent, { paddingBottom: 0 }]}>
                <View style={[styles().horizontalView, { marginBottom: 0 }]}>
                    <TouchableOpacity onPress={() => navigation.navigate('Lançamentos')}>
                        <Feather name='chevron-left' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors. white} style={{ marginRight: 10 }}/>
                    </TouchableOpacity>
                    <Text style={[general(props.theme).textHeaderScreen, { marginBottom: 0 }]}>Novo Lançamento</Text>
                </View>
                <View style={styles().typeView}>
                    <Text style={styles(props.theme, type).typeText}>{type}</Text>
                    <TouchableOpacity style={styles().changeType} onPress={() => type == 'Receita' ? setType('Despesa') : setType('Receita')}>
                        <Feather name='refresh-cw' size={15} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                    </TouchableOpacity>
                </View>
                <View style={general().containerCenter}>
                    <View>
                        <View style={styles().horizontalView}>
                            <TextInputMask
                                style={general(props.theme).inputDate}
                                placeholder='Data lançamento'
                                placeholderTextColor={colors.lightGray}
                                value={date}
                                type='datetime'
                                maxLength={10}
                                onChangeText={(v) => setDate(v)}
                            />
                            <TouchableOpacity onPress={() => dateFade()}>
                                <Feather name='calendar' size={metrics.iconSize} color={colors.lightGray} style={{ marginLeft: metrics.baseMargin }}/>
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Descrição'
                            placeholderTextColor={colors.lightGray}
                            value={description}
                            onChangeText={(v) => setDescription(v)}
                            maxLength={40}
                        />
                        <Picker
                            options={optionsModality}
                            selectedValue={setModality}
                            value={!modality ? 'Modalidade' : modality}
                            type='Modalidade'
                            visibility={modalityVisible}
                            setVisibility={setModalityVisible}
                        />
                        {
                            type == 'Despesa' &&
                            <Picker
                                options={optionsSegment}
                                selectedValue={setSegment}
                                value={!segment ? 'Segmento' : segment}
                                type='Segmento'
                                visibility={segmentVisible}
                                setVisibility={setSegmentVisible}
                            />
                        }
                        <TextInputMask
                            style={general(props.theme).input}
                            placeholder='Valor'
                            placeholderTextColor={colors.lightGray}
                            value={value}
                            onChangeText={(v) => setValue(v)}
                            type='money'
                        />
                        <TouchableOpacity style={general(null, metrics.smallMargin).button} onPress={registerEntry}>
                            {
                                register ?
                                <ActivityIndicator size={20} color={colors.white}/> : 
                                <Text style={general().buttonText}>CADASTRAR</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={general(props.theme).buttonOutline}>
                            <Text style={general(props.theme).buttonOutlineText}>CADASTRAR DESPESAS FIXAS</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        calendar ?
                        <Animated.View 
                            style={{
                                position: 'absolute',
                                justifyContent: 'flex-end',
                                width: '100%',
                                bottom: 0,
                                opacity
                            }}
                        >
                            <Calendar
                                onClose={Platform.OS === 'ios' ? dateFade : closeAndroid}
                                date={new Date()}
                                onChange={onChangeDate}
                            />
                        </Animated.View> : null
                    }
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
        uid: state.user.uid,
        modality: state.modality.modality
    }
  }
  
const newEntryConnect = connect(mapStateToProps, { editTitleAlert, editTypeAlert, editVisibilityAlert })(NewEntry);

export default newEntryConnect;