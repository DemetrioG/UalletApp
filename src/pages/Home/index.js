import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';

import firebase from '../../services/firebase';
import { general, metrics, colors } from '../../styles';
import { Alert } from '../../components/Alert';
import Header from '../../components/Header';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import styles from './styles';

export function Home(props) {

    const [name, setName] = useState();
    const [hideIncome, setHideIncome] = useState(false);

    useEffect(() => {
        async function getData() {

            await firebase.firestore().collection('users').doc(props.uid).get()
            .then((v) => {
                // Verifica se tem todas as informações preenchidas no banco, se não, builda a tela de preenchimento
                if (!v.data().birthDate) {
                    navigation.navigate('Complete');
                }
            })
        }
        getData();

    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
            {
                props.visibility &&
                <Alert props={props} text={props.title} type={props.type}/>
            }
                <Header/>
                <View style={general(props.theme).card}>
                    <View style={styles().cardHeaderView}>
                        <View style={styles().cardHeaderTextView}>
                            <Text style={styles(props.theme).cardHeaderText}>Saldo atual</Text>
                            <TouchableOpacity style={[styles().spaceIcon, { marginTop: 4 }]} onPress={() => !hideIncome ? setHideIncome(true) : setHideIncome(false)}>
                                <Feather name={!hideIncome ? 'eye' : 'eye-off'} size={15} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Image source={require('../../../assets/images/logoSmall.png')} width={1} style={styles().logoCard}/>
                        </View>
                    </View>
                    <Text style={styles(props.theme).income}>{ !hideIncome ? 'R$ 13.000,00' : '** ** ** ** **' }</Text>
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
        uid : state.user.uid,
    }
  }
  
const homeConnect = connect(mapStateToProps, { editVisibilityAlert })(Home);

export default homeConnect;