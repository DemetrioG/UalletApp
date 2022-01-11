import React, { useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Google from 'expo-google-app-auth';

import firebase from '../../services/firebase';
import styles from './styles';
import { general, colors, metrics } from '../../styles';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';
import { editUidUser } from '../../components/Actions/uidUserAction';
import { Alert } from '../../components/Alert';


export function Login(props) {

    const navigation = useNavigation();
    const sheetRef = useRef(null);
    const snapPoints = ['25%'];
    
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [login, setLogin] = useState(false);

    async function loginUser() {
        if (!email || !password) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe todos os campos');
            props.editVisibilityAlert(true);
            return; 
        }

        setLogin(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then((v) => {
            editUidUser(v.user.uid);
            setLogin(false);
            navigation.navigate('Home');
        })
        .catch((error) => {
            props.editTypeAlert('error');
            props.editTitleAlert('Verifique os campos informados');
            props.editVisibilityAlert(false);
            return;
        })
    }

    async function googleLogin() {
        const config = 
        { iosClientId : '1027938913805-4qdqjrdu21vcn0383i1j0epl5hiduru5.apps.googleusercontent.com',
          androidClientId : '1027938913805-9938f3foql9etb4a5a6i5f5t4spa82j7.apps.googleusercontent.com',
          scopes : ['profile', 'email']
        }

        await Google.logInAsync(config)
        .then((v) => {
            console.log(v);
        })
        .catch((error) => {
            console.log(error);
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
                        <Image
                            source={require('../../../assets/images/logo.png')}
                            style={general().logo}
                        />
                        <Text style={general(props.theme).textUalletHeader}>Uallet</Text>
                    </View>
                    <View style={general().containerHeaderTitle}>
                        <Text style={general(props.theme).headerTitle}>É um prazer ter você aqui novamente.{"\n"}Realize seu login abaixo!</Text>
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
                        <TextInput
                            style={general(props.theme).input}
                            placeholder='Senha'
                            placeholderTextColor={colors.lightGray}
                            secureTextEntry={true}
                            value={password}
                            onChangeText={(v) => setPassword(v)}
                        />
                        <TouchableOpacity style={general(null, metrics.doubleBaseMargin).button} onPress={loginUser}>
                            {
                                login ?
                                <ActivityIndicator size={20} color={colors.white}/> :
                                <Text style={general().buttonText}>ENTRAR</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSheetOpen(true)}>
                            <Text style={styles(props.theme).actionText}>Prefere entrar com as redes sociais?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles(props.theme).actionText}>Esqueceu sua senha?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            {
                sheetOpen &&
                <BottomSheet
                ref={sheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                onClose={() => setSheetOpen(false)}
                handleIndicatorStyle={styles().sheetIndicator}
                backgroundStyle={styles(props.theme).sheetBackground}
                style={styles().sheetContainer}
                >
                    <BottomSheetView>
                        <View style={styles().sheetView}>
                            <TouchableOpacity style={styles(null, colors.black).loginWithContainer}>
                                <Image
                                    source={require('../../../assets/images/appleIcon.png')}
                                    style={{width: '82%', height: '100%'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(null, colors.white).loginWithContainer} onPress={googleLogin}>
                                <Image
                                    source={require('../../../assets/images/googleIcon.png')}
                                    style={{width: '100%', height: '100%'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(null, colors.facebookBlue).loginWithContainer}>
                                <Image
                                    source={require('../../../assets/images/facebookIcon.png')}
                                    style={{width: '100%', height: '100%'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(null, props.theme == 'light' ? colors.white : colors.black).loginWithContainer}>
                                <Image
                                    source={require('../../../assets/images/microsoftIcon.png')}
                                    style={{width: '100%', height: '100%'}}
                                />
                            </TouchableOpacity>
                        </View>
                    </BottomSheetView>
                </BottomSheet>
            }
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

const loginConnect = connect(mapStateToProps, { editVisibilityAlert, editTitleAlert, editTypeAlert, editUidUser })(Login);

export default loginConnect;