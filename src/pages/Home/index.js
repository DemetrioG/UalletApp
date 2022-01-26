import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { LineChart, Grid } from 'react-native-svg-charts';

import firebase from '../../services/firebase';
import { general, metrics, colors, fonts } from '../../styles';
import { Alert } from '../../components/Alert';
import Header from '../../components/Header';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import styles from './styles';

export function Home(props) {

    const [hideBalance, setHideBalance] = useState(false);
    const [hideInvest, setHideInvest] = useState(false);
    const [status, setStatus] = useState();
    const incomeChart = [50, 10, 40];
    const expenseChart = [10, 20, 10];
    const dataLineChart = [
        {
            data: incomeChart,
            svg: { stroke: props.theme == 'light' ? colors.strongGreen : colors.lightGreen, strokeWidth: 2 }
        },
        {
            data: expenseChart,
            svg: { stroke: props.theme == 'light' ? colors.strongRed : colors.lightRed, strokeWidth: 2 }
        }
    ];

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
        <View style={[general().flex, general().padding, general(props.theme).backgroundColor]}>
        {
            props.visibility &&
            <Alert props={props} text={props.title} type={props.type}/>
        }
            <Header/>
            <ScrollView showsVerticalScrollIndicator={false} style={general().scrollViewTab}>
                <View style={general(props.theme).card}>
                    <View style={styles().cardHeaderView}>
                        <View style={styles().cardTextView}>
                            <Text style={styles(props.theme).cardHeaderText}>Saldo atual</Text>
                            <TouchableOpacity style={[styles().spaceIcon, { marginTop: 4 }]} onPress={() => !hideBalance ? setHideBalance(true) : setHideBalance(false)}>
                                <Feather name={!hideBalance ? 'eye' : 'eye-off'} size={15} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Image source={require('../../../assets/images/logoSmall.png')} width={1} style={styles().logoCard}/>
                        </View>
                    </View>
                    <Text style={styles(props.theme).balance}>{ !hideBalance ? 'R$ 13.000,00' : '** ** ** ** **' }</Text>
                </View>
                <View style={general(props.theme).card}>
                    <View style={styles().cardStatusView}>
                        <Text style={styles(props.theme).statusBoldText}>Você está indo bem</Text>
                    </View>
                    <View style={styles().cardStatusView}>
                        <Text style={styles(props.theme).statusText}>Sua média de gastos variáveis semanal está representando <Text style={{ fontFamily: fonts.montserratExtraBold, color: props.theme == 'light' ? colors.strongGreen : colors.lightGreen }}>3%</Text> de sua renda</Text>
                    </View>
                    <View>
                        <Text style={styles(props.theme).statusBoldText}>Continue!! ⚡</Text>
                    </View>
                </View>
                <View style={general(props.theme).card}>
                    <View style={styles().cardHeaderView}>
                        <View style={styles().cardTextView}>
                            <Text style={styles(props.theme).cardHeaderText}>Patrimônio investido</Text>
                            <TouchableOpacity style={[styles().spaceIcon, { marginTop: 4 }]} onPress={() => !hideInvest ? setHideInvest(true) : setHideInvest(false)}>
                                <Feather name={!hideInvest ? 'eye' : 'eye-off'} size={15} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                            <Feather name='maximize-2' size={metrics.iconSize} color={props.theme == 'light' ? colors.darkPrimary : colors.white}/>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles(props.theme).invest}>{ !hideInvest ? 'R$ 153.000,00' : '** ** ** ** **' }</Text>
                    <View style={styles().cardTextView}>
                        <Text style={styles(props.theme).cardFooterText}>Rendimento semanal</Text>
                        <Text style={{ fontFamily: fonts.montserratMedium, fontSize: 14, color: props.theme == 'light' ? colors.strongGreen : colors.lightGreen }}>55%</Text>
                        <Feather name='arrow-up' size={15} color={props.theme == 'light' ? colors.strongGreen : colors.lightGreen}/>
                    </View>
                </View>
                <View style={[general(props.theme).card, { flexDirection: 'row' }]}>
                    <View style={styles(props.theme).incomeChartView}>
                        <LineChart
                            style={{ height: 60, shadowOpacity: 1, shadowOffset: { height: 2 }, shadowColor: props.theme == 'light' ? colors.strongGreen : colors.lightGreen }}
                            contentInset={{ top: 5, bottom: 5 }}
                            data={dataLineChart}
                        >
                        </LineChart>
                        <View style={styles(props.theme).incomeChartLabelView}>
                            <Text style={styles(props.theme).incomeChartLabelText}>Jan</Text>
                            <Text style={styles(props.theme).incomeChartLabelText}>Mar</Text>
                        </View>
                    </View>
                    <View style={styles().incomeView}>
                        <View>
                            <Text style={styles(props.theme).incomeText}>Receita mensal <Text style={{ fontFamily: fonts.montserratMedium, fontSize: fonts.regular, color: props.theme == 'light' ? colors.strongGreen : colors.lightGreen }}>10%</Text><Feather name='arrow-up' size={15} color={props.theme == 'light' ? colors.strongGreen : colors.lightGreen}/></Text>
                        </View>
                        <View>
                            <Text style={styles(props.theme).incomeText}>Custo mensal <Text style={{ fontFamily: fonts.montserratMedium, fontSize: fonts.regular, color: props.theme == 'light' ? colors.strongRed : colors.lightRed }}>-20%</Text><Feather name='arrow-down' size={15} color={props.theme == 'light' ? colors.darkRed : colors.lightRed}/></Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
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