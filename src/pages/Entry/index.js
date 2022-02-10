import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Animated, Platform, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';

import { sleep, getBalance } from '../../functions/index';
import firebase from '../../services/firebase';
import { colors, general, metrics } from '../../styles';
import styles from './styles';

export function Entry(props) {

    const navigation = useNavigation();
    
    const [SWITCH, setSWITCH] = useState(false);
    const [info, setInfo] = useState(false);
    const [entryList, setEntryList] = useState([]);
    const [emptyData, setEmptyData] = useState(false);
    const [balance, setBalance] = useState('R$ 0,00');
    const empty = require('../../../assets/icons/emptyData.json');
    const loading = require('../../../assets/icons/blueLoading.json');
    
    // Pega o mês de referência do App para realizar a busca dos registros
    const [initialDate, setInitialDate] = useState(Date.parse(`${new Date().getFullYear()}/${props.month}/1`));
    const [finalDate, setFinalDate] = useState(Date.parse(`${new Date().getFullYear().toString()}/${props.month}/31`));

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        
        async function getEntry() {
            
            // Busca os registros dentro do período de referência
            setEmptyData(false);
            await sleep(1000);
            await firebase.firestore().collection('entry').doc(props.uid).collection(props.modality).where('date', '>=', initialDate).where('date', '<=', finalDate).orderBy('date', 'desc').onSnapshot((snapshot) => {
                setEntryList([]);
                if (snapshot.docs.length > 0) {
                    snapshot.forEach((result) => {
                        setEntryList(oldArray => [...oldArray, result.data()])
                    })
                } else {
                    setEmptyData(true);
                }
            })
        } getEntry();

        getBalance(firebase, props, setBalance);

    }, [props.modality]);

    function ItemList({item}) {          
        return (
            <View style={styles().itemView}>
                <View style={styles().descriptionView}>
                    <Text style={styles().descriptionText}>{item.description}</Text>
                </View>
                <View style={styles().valueView}>
                    <Text style={styles(props.theme, item.type).valueText}>{item.type == 'Receita' ? '+R$' : '-R$'}</Text>
                    <Text style={styles(props.theme, item.type).valueText}>{item.value.replace('R$', '')}</Text>
                </View>
                <View style={styles().moreView}>
                    <TouchableOpacity onPress={() => navigation.navigate('NovoLançamento', item)}>
                        <Feather name='more-horizontal' size={15} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    function infoFade() {
        if (!info) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true
            }).start();
            setInfo(true);
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            }).start();
            setInfo(false);
        }
    }

    return (
            <View style={general(props.theme).viewTabContent}>
                <Text style={general(props.theme).textHeaderScreen}>Lançamentos</Text>
                <View style={[general().spaceBetween, styles().buttonHeaderView]}>
                    <TouchableOpacity style={[general(props.theme).buttonOutline, general().buttonSmall]}>
                        <Text style={general(props.theme).buttonOutlineText}>FILTROS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[general(props.theme).button, general().buttonSmall]} onPress={() => navigation.navigate('NovoLançamento')}>
                        <Text style={general().buttonText}>NOVO</Text>
                    </TouchableOpacity>
                </View>
                <Text style={general(props.theme).textHeaderScreen}>Últimos lançamentos</Text>
                {
                    !emptyData &&
                    <View style={general().spaceAround}>
                        <Text style={general(props.theme).label}>Descrição</Text>
                        <Text style={general(props.theme).label}>Valor</Text>
                    </View>
                }
                {
                    entryList.length > 0 ?
                    <FlatList
                        data={entryList}
                        keyExtractor={item => item.id}
                        renderItem={ ({ item }) => <ItemList item={item}/> }
                    /> :
                    <View style={general().containerCenter}>
                        {
                            !emptyData ?
                            <LottieView
                                source={loading}
                                autoPlay={true}
                                loop={true}
                                style={styles().iconLoading}
                            /> :
                            <View style={general().containerCenter}>
                                <LottieView
                                    source={empty}
                                    autoPlay={true}
                                    loop={false}
                                    style={styles().iconEmpty}
                                />
                                <View style={styles(props.theme).loadingView}>
                                    <Text style={styles(props.theme).loadingText}>Seus lançamentos aparecerão aqui</Text>
                                </View>
                            </View>
                        }
                    </View>
                }
                <View style={styles().incomeView}>
                    <Text style={general(props.theme).label}>Saldo atual:</Text>
                    <Text style={styles(props.theme).incomeText}>{balance}</Text>
                </View>
                <View style={styles().autoEntryView}>
                    <Text style={[general(props.theme).textHeaderScreen, { marginTop: Platform.OS === 'ios' ? 13 : 10 }]}>Lançamentos automáticos</Text>
                    <Switch
                        value={SWITCH}
                        onChange={() => SWITCH ? setSWITCH(false) : setSWITCH(true)}
                        thumbColor={colors.strongBlue}
                        trackColor={{ true: colors.lightBlue, false: props.theme == 'light' ? colors.gray : colors.infoBlack }}
                        style={{ marginLeft: 5 }}
                    />
                    <Feather name='info' size={metrics.iconSize} color={colors.gray} style={styles().infoIcon} onPress={infoFade}/>
                    <Animated.View style={[styles().infoView, { opacity }]}>
                        <View style={styles().triangle}/>
                        <Text style={styles().infoText}>Integre seu app com suas contas bancárias</Text>
                    </Animated.View>
                </View>
            </View>
    );
}

const mapStateToProps = (state) => {
    return {
        theme: state.theme.theme,
        visibility: state.modal.visibility,
        title: state.modal.title,
        type: state.modal.type,
        uid: state.user.uid,
        modality: state.modality.modality,
        month: state.date.month
    }
  }
  
const entryConnect = connect(mapStateToProps)(Entry);

export default entryConnect;