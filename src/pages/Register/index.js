import { View, Text, TouchableOpacity, Image, TextInput, TouchableWithoutFeedback, Keyboard, Appearance } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { general, colors } from '../../styles';
import styles from './styles';
import { connect } from 'react-redux';

export function Register(props) {

    const navigation = useNavigation();

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
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
                    style={general().input}
                    placeholder='Nome completo'
                    placeholderTextColor={colors.lightGray}
                    value={props.theme}
                />
                <TextInput
                    style={general().input}
                    placeholder='E-mail'
                    placeholderTextColor={colors.lightGray}
                />
                <TextInput
                    style={general().input}
                    placeholder='Senha'
                    placeholderTextColor={colors.lightGray}
                />
                <TextInput
                    style={general().input}
                    placeholder='Confirme sua senha'
                    placeholderTextColor={colors.lightGray}
                />
                <TouchableOpacity style={general().button}>
                    <Text style={general().buttonText}>CRIAR CONTA</Text>
                </TouchableOpacity>
            </View>
        </View>
        </TouchableWithoutFeedback>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
    }
}

const registerConnect = connect(mapStateToProps)(Register);

export default registerConnect;

