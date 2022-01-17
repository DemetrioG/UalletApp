import React, { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TextInput, TouchableOpacity, ActivityIndicator, Platform, NativeModules } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-facebook';

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
            props.editUidUser(v.user.uid);
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
        const CLIENT_ID = '1027938913805-2uq44iec7nrr8p5c9qqu32nbapu5gfg6.apps.googleusercontent.com';
        const REDIRECT_URI = 'https://auth.expo.io/@demetriog/Uallet';
        const RESPONSE_TYPE = 'token';
        const SCOPE = encodeURI('profile email');

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

        // Autenticação com o Google
        const response = await AuthSession.startAsync({ authUrl });
        
        if (response.type === 'success') {

            // Buscar informações do usuário
            const user = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${response.params.access_token}`);
            const userInfo = await user.json();

            // Cadastrar usuário no banco
            await firebase.firestore().collection('users').doc(userInfo.id).get()
            .then((v) => {
               if (!v.data()) {
                    firebase.firestore().collection('users').doc(userInfo.id).set({
                    name: userInfo.name,
                    email: userInfo.email,
                    typeUser: 'google',
                    dateRegister: firebase.firestore.FieldValue.serverTimestamp()
                    })
               }
            })

            props.editUidUser(userInfo.id);
            navigation.navigate('Home');
        }
        return;
    }

    async function facebookLogin() {
        // Autenticação com o Facebook
        await Facebook.initializeAsync("623678532217571'");

        const response = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email']
        });

        // Buscar informações do usuário
        if (response.type === 'success') {
            const data = await fetch(`https://graph.facebook.com/me?fields=id,name,picture.type(large),email&access_token=${response.token}`);
            
            const userInfo = await data.json();

            // Cadastrar usuário no banco
            await firebase.firestore().collection('users').doc(userInfo.id).get()
            .then((v) => {
                if (!v.data()) {
                    firebase.firestore().collection('users').doc(userInfo.id).set({
                    name: userInfo.name,
                    email: userInfo.email,
                    typeUser: 'facebook',
                    dateRegister: firebase.firestore.FieldValue.serverTimestamp()
                    })
                }
            })
        }

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
                        <TouchableOpacity onPress={() => navigation.navigate('Forgot')}>
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
                            {
                                Platform.OS === 'ios' &&
                                <TouchableOpacity style={styles(null, colors.black).loginWithContainer}>
                                    <Image
                                        source={require('../../../assets/images/appleIcon.png')}
                                        style={{width: '52%', height: '100%'}}
                                    />
                                </TouchableOpacity>
                            }
                            <TouchableOpacity style={styles(null, colors.white).loginWithContainer} onPress={googleLogin}>
                                <Image
                                    source={require('../../../assets/images/googleIcon.png')}
                                    style={{width: '60%', height: '100%'}}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles(null, colors.facebookBlue).loginWithContainer} onPress={facebookLogin}>
                                <Image
                                    source={require('../../../assets/images/facebookIcon.png')}
                                    style={{width: '50%', height: '100%'}}
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