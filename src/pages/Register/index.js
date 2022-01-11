import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';

import { general, colors } from '../../styles';
import firebase from '../../services/firebase';
import { Alert } from '../../components/Alert';
import { editVisibility } from '../../components/Actions/visibilityAction';

export function Register(props) {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [titleModal, setTitleModal] = useState('');
    const [typeModal, setTypeModal] = useState('');

    async function registerUser() {
        if (password !== confirmPassword) {
            setTitleModal('As senhas informadas são diferentes');
            setTypeModal('error');
            props.editVisibility(true);
            return;
        }
    }

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={general().flex}
        keyboardVerticalOffset={-80}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
                {
                    props.modal &&
                    <Alert props={props} text={titleModal} type={typeModal}/>
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
                        />
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Confirme sua senha'
                            placeholderTextColor={colors.lightGray}
                            secureTextEntry={true}
                            value={confirmPassword}
                            onChangeText={(v) => setConfirmPassword(v)}
                        />
                        <TouchableOpacity style={general().button} onPress={registerUser}>
                            <Text style={general().buttonText}>CRIAR CONTA</Text>
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
        modal: state.modal.modal
    }
}

const registerConnect = connect(mapStateToProps, { editVisibility })(Register);

export default registerConnect;

