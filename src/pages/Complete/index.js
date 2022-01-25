import React, { useState } from 'react';
import { View, Text, Keyboard, TouchableWithoutFeedback, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInputMask } from 'react-native-masked-text';
import { connect } from 'react-redux';

import firebase from '../../services/firebase';
import { general, colors } from '../../styles';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import Picker from '../../components/Picker';
import { Alert } from '../../components/Alert';

export function Complete(props) {

    const navigation = useNavigation();

    const [birthDate, setBirthDate] = useState(null);
    const [income, setIncome] = useState(null);
    const [gender, setGender] = useState(null);
    const [profile, setProfile] = useState(null);
    const [data, setData] = useState(false);

    const [genderVisible, setGenderVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    
    const optionsGender = ['Feminino', 'Masculino'];
    const optionsProfile = ['Investidor', 'Poupador', 'Gastador'];

    async function registerData() {
        if (!birthDate || !gender || !income || !profile) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe todos os campos');
            props.editVisibilityAlert(true);
            return; 
        } else if (income == 'R$0,00') {
            props.editTitleAlert('Informe uma Renda Média');
            props.editVisibilityAlert(true);
            return; 
        }

        await firebase.firestore().collection('users').doc(props.uid).get()
        .then((v) => {
            if (v.data()) {
                firebase.firestore().collection('users').doc(props.uid).set({
                    birthDate: birthDate,
                    gender: gender,
                    income: income,
                    profile: profile 
                }, {merge: true})
                .then((v) => {
                    navigation.navigate('Home');
                    props.editTypeAlert('success');
                    props.editTitleAlert('Dados cadastrados com sucesso');
                    props.editVisibilityAlert(true);
                }).catch((error) => {
                    props.editTypeAlert('error');
                    props.editTitleAlert('Erro ao cadastrar as informações');
                    props.editVisibilityAlert(true);
                })
            }
        })
    }

    return (
        <KeyboardAvoidingView
        behavior="padding"
        style={general().flex}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -80 : -280}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
                {
                    props.visibility &&
                    <Alert props={props} text={props.title} type={props.type}/>
                }
                    <View style={general().logoHeader}>
                        <Text style={general(props.theme).textHeader}>Complete seu cadastro</Text>
                    </View>
                    <View style={general().containerHeaderTitle}>
                        <Text style={general(props.theme).headerTitle}>Seus dados serão utilizados para melhorar{"\n"}sua experiência dentro do app.</Text>
                    </View>
                    <ScrollView contentContainerStyle={general().scrollViewCenter}>
                        <TextInputMask
                            placeholder='Data de nascimento'
                            placeholderTextColor={colors.lightGray}
                            style={general(props.theme).input}
                            type='datetime'
                            value={birthDate}
                            onChangeText={(v) => setBirthDate(v)}
                            maxLength={10}
                        />
                        <Picker 
                            options={optionsGender} 
                            selectedValue={setGender} 
                            value={!gender ? 'Sexo' : gender} 
                            type='Sexo' 
                            visibility= {genderVisible} 
                            setVisibility={setGenderVisible}
                        />
                        <TextInputMask
                            style={general(props.theme).input}
                            placeholder='Renda média'
                            placeholderTextColor={colors.lightGray}
                            value={income}
                            onChangeText={(v) => setIncome(v)}
                            type='money'
                        />
                        <Picker 
                            options={optionsProfile} 
                            selectedValue={setProfile} 
                            value={!profile ? 'Perfil' : profile} 
                            type='Perfil' 
                            visibility= {profileVisible} 
                            setVisibility={setProfileVisible}
                        />
                        <TouchableOpacity style={general().button} onPress={registerData}>
                            {
                                data ?
                                <ActivityIndicator size={20} color={colors.white}/> : 
                                <Text style={general().buttonText}>CONFIRMAR</Text>
                            }
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
        uid : state.user.uid,
        login: state.login.signed
    }
}

const completeConnect = connect(mapStateToProps, { editVisibilityAlert, editTitleAlert, editTypeAlert })(Complete);

export default completeConnect;