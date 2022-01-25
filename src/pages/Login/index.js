import React, { useEffect, useRef, useState } from 'react';
import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Image, TextInput, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';

import firebase from '../../services/firebase';
import styles from './styles';
import { general, colors, metrics } from '../../styles';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import { editTitleAlert } from '../../components/Actions/titleAlertAction';
import { editTypeAlert } from '../../components/Actions/typeAlertAction';
import { editUidUser } from '../../components/Actions/uidUserAction';
import { editLogin } from '../../components/Actions/loginAction';
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
        if (!email || !password || email.replace(/ /g, '').length < 1 || password.replace(/ /g, '').length < 1) {
            props.editTypeAlert('error');
            props.editTitleAlert('Informe todos os campos');
            props.editVisibilityAlert(true);
            return; 
        }

        setLogin(true);
        await firebase.auth().signInWithEmailAndPassword(email, password)
        .then((v) => {
            let data = {
                uid: v.user.uid,
                // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
                date: new Date(Date.now() + 15 * 24*60*60*1000)
            }
            props.editUidUser(v.user.uid);
            storageUser(data);
            props.editLogin(true);
        })
        .catch((error) => {
            props.editTypeAlert('error');
            props.editTitleAlert('Verifique os campos informados');
            props.editVisibilityAlert(true);
        })
        setLogin(false);
        return;
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
            });

            let data = {
                uid: userInfo.id,
                // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
                date: new Date(Date.now() + 15 * 24*60*60*1000)
            }
            storageUser(data);
            props.editUidUser(userInfo.id);
            props.editLogin(true);
        }
        return;
    }

    async function facebookLogin() {
        // Autenticação com o Facebook
        await Facebook.initializeAsync("623678532217571");

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
            });

            let dataStorage = {
                uid: userInfo.id,
                // Salva no storage a data atual + 15 dias, para deixar o usuário autenticado sem precisar logar em toda entrada do app
                date: new Date(Date.now() + 15 * 24*60*60*1000)
            }
            storageUser(dataStorage);
            props.editUidUser(userInfo.id);
            props.editLogin(true);
        }

    }

    async function storageUser(data) {
        await AsyncStorage.setItem('authUser', JSON.stringify(data))
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
                            onSubmitEditing={loginUser}
                            returnKeyType="done"
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
                                        style={{width: '48%', height: '90%', marginBottom: 2}}
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
        uid : state.user.uid,
        login: state.login.signed
    }
}

const loginConnect = connect(mapStateToProps, { editVisibilityAlert, editTitleAlert, editTypeAlert, editUidUser, editLogin })(Login);

export default loginConnect;