import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import { general, colors } from '../../styles';
import firebase from '../../services/firebase';
import { Alert } from '../../components/Alert';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';

export function Register(props) {

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [redirect, setRedirect] = useState(null);
    const [register, setRegister] = useState(false);

    async function registerUser() {
        if (!name || !email || !password || !confirmPassword || name.replace(/ /g, '').length < 1 || email.replace(/ /g, '').length < 1 || password.replace(/ /g, '').length < 1) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe todos os campos');
            props.editVisibilityAlert(true);
            return; 
        }

        if (password !== confirmPassword) {
            props.editTypeAlert('error');
            props.editTitleAlert('As senhas informadas são diferentes');
            props.editVisibilityAlert(true);
            return;
        }

        setRegister(true);
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((v) => {
            firebase.firestore().collection('users').doc(v.user.uid).set({
                name: name,
                email: email,
                typeUser: 'default',
                dateRegister: firebase.firestore.FieldValue.serverTimestamp()
            })
            props.editTypeAlert('check');
            props.editTitleAlert('Usuário criado com sucesso');
            props.editVisibilityAlert(true);
            setRedirect('Login');
        })
        .catch((error) => {
            switch (error.code) {
                case 'auth/weak-password':
                    props.editTypeAlert('error');
                    props.editTitleAlert('Sua senha deve ter no mínimo 6 caracteres');
                    props.editVisibilityAlert(true);
                    break;
            
                case 'auth/invalid-email':
                    props.editTypeAlert('error');
                    props.editTitleAlert('O e-mail informado é inválido');
                    props.editVisibilityAlert(true);
                    break;
                
                case 'auth/email-already-in-use':
                    props.editTypeAlert('error');
                    props.editTitleAlert('Usuário já cadastrado');
                    props.editVisibilityAlert(true);
                    break;

                default:
                    props.editTypeAlert('error');
                    props.editTitleAlert('Erro ao cadastrar usuário');
                    props.editVisibilityAlert(true);
                    break;
            }
            setRegister(false);
            return;
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
                    <Alert props={props} text={props.title} type={props.type} redirect={redirect ? redirect : null}/>
                }
                    <View style={general().logoHeader}>
                        <Image
                            source={require('../../../assets/images/logo.png')}
                            style={general().logo}
                        />
                        <Text style={general(props.theme).textUalletHeader}>Uallet</Text>
                    </View>
                    <View style={general().containerHeaderTitle}>
                        <Text style={general(props.theme).headerTitle}>Informe seus dados, que o resto{"\n"}a gente cuida para você!</Text>
                    </View>
                    <View style={general().containerCenter}>
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Nome completo'
                            placeholderTextColor={colors.lightGray}
                            value={name}
                            onChangeText={(v) => setName(v)}
                            maxLength={40}
                        />
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='E-mail'
                            placeholderTextColor={colors.lightGray}
                            keyboardType="email-address"
                            autoCorrect={false}
                            autoCapitalize="none"
                            value={email}
                            onChangeText={(v) => setEmail(v)}
                        />
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Senha'
                            placeholderTextColor={colors.lightGray}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(v) => setPassword(v)}
                            maxLength={20}
                        />
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Confirme sua senha'
                            placeholderTextColor={colors.lightGray}
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={(v) => setConfirmPassword(v)}
                            onSubmitEditing={registerUser}
                            returnKeyType="done"
                            maxLength={20}
                        />
                        <TouchableOpacity style={general().button} onPress={registerUser}>
                            {
                                register ?
                                <ActivityIndicator size={20} color={colors.white}/> : 
                                <Text style={general().buttonText}>CRIAR CONTA</Text>
                            }
                        </TouchableOpacity>
                    </View>
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
        type: state.modal.type
    }
}

const registerConnect = connect(mapStateToProps, { editVisibilityAlert, editTitleAlert, editTypeAlert })(Register);

export default registerConnect;

