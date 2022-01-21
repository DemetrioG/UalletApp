import React, { useState } from 'react';
import { KeyboardAvoidingView, View, Platform, TouchableWithoutFeedback, Keyboard, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';

import firebase from '../../services/firebase';
import { general, colors, metrics } from '../../styles';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import { Alert } from '../../components/Alert';

export function ForgotPassword(props) {

    const navigation = useNavigation();

    const [email, setEmail] = useState(null);
    const [send, setSend] = useState(false);

    async function sendPassword() {

        if (!email) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe o e-mail de recuperação');
            props.editVisibilityAlert(true);
            return; 
        }
        setSend(true);
        await firebase.auth().sendPasswordResetEmail(email)
        .then((v) => {
            setSend(false);
            navigation.navigate('Login');
            props.editTypeAlert('check');
            props.editTitleAlert('E-mail de redefinição enviado!\nVerifique sua caixa de SPAM');
            props.editVisibilityAlert(true);
        })
        .catch((error) => {
            setSend(false);
            props.editTypeAlert('error');
            props.editTitleAlert('E-mail não encontrado');
            props.editVisibilityAlert(true);
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
                        <Text style={general(props.theme).textHeader}>Recuperar senha</Text>
                    </View>
                    <View style={general().containerHeaderTitle}>
                        <Text style={general(props.theme).headerTitle}>Digite o e-mail cadastrado na sua conta.{"\n"}Enviaremos um e-mail para recuperação{"\n"}da senha.</Text>
                    </View>
                    <View style={general().containerCenter}>
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
                        <TouchableOpacity style={general(null, metrics.doubleBaseMargin).button} onPress={sendPassword}>
                            {
                                send ?
                                <ActivityIndicator size={20} color={colors.white}/> :
                                <Text style={general().buttonText}>ENVIAR</Text>
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
        type: state.modal.type,
        uid : state.user.uid
    }
}

const forgotConnect = connect(mapStateToProps, { editTitleAlert, editTypeAlert, editVisibilityAlert })(ForgotPassword);

export default forgotConnect;