import React, { useEffect, useState } from 'react';
import { View, Text, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { LineChart, PieChart } from 'react-native-svg-charts';
import { ForeignObject, Text as TextSVG }  from 'react-native-svg';

import firebase from '../../services/firebase';
import { numberToReal } from '../../functions';
import { general, metrics, colors, fonts } from '../../styles';
import { Alert } from '../../components/Alert';
import Header from '../../components/Header';
import { editVisibilityAlert } from '../../components/Actions/visibilityAlertAction';
import { editComplete } from '../../components/Actions/completeUserAction';
import styles from './styles';

export function Home(props) {

    const navigation = useNavigation();

    const [balance, setBalance] = useState('R$ 0,00');
    const [hideBalance, setHideBalance] = useState(false);
    const [hideInvest, setHideInvest] = useState(false);
    const [status, setStatus] = useState();

    // Dados para o gráfico de linha Receitas X Despesas
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

    // Dados para o gráfico de rosca Segmento de Despesas
    const dataPieChart = [5, 10, 15, 5, 25];
    const colorPieChartLight = [colors.darkPrimary, colors.strongPurple, colors.lightPurple, colors.strongRed, colors.lightRed];
    const colorPieChartDark = [colors.darkPrimary, colors.strongRed, colors.lightRed, colors.lightBlue, colors.whiteBlue];
    const finalDataPieChart = dataPieChart.map((value, index) => ({
        value,
        key: index,
        svg: {
            fill: props.theme == 'light' ? colorPieChartLight[index] : colorPieChartDark[index]
        }
    }));

    // Criação de labels para o Pie Chart
    const Label = ({ slices }) => {
        return slices.map((slice, index) => {
            const { pieCentroid, data } = slice;
            return (
                <ForeignObject
                    key={index}
                    // Se o valor do chart for menor que 6, ele joga o label um pouco para a direita para não ficar desalinhado
                    x={dataPieChart[index] < 6 ? pieCentroid[0] - 9 : pieCentroid[0] - 12}
                    y={pieCentroid[1] - 8}
                    width={100}
                    height={100}
                >
                    <View>
                        <Text style={styles().labelPieChart}>{data.value}%</Text>
                    </View>
                </ForeignObject>
            )
        })
    }

    useEffect(() => {
        async function completeData() {

            await firebase.firestore().collection('users').doc(props.uid).get()
            .then((v) => {
                props.editComplete(true);
                // Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
                if (!v.data().birthDate) {
                    navigation.navigate('Complete');
                }
            })
        }
        if (!props.complete) {
            completeData();
        }

        async function getData() {
            
            await firebase.firestore().collection('balance').doc(props.uid).collection(props.modality).doc('balance').onSnapshot((snapshot) => {
                if (snapshot.data()) {
                    setBalance(numberToReal(snapshot.data().balance));
                } else {
                    setBalance('R$ 0,00');
                }
            })
        }
        getData();

    }, [props.modality]);

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
                    <Text style={styles(props.theme).balance}>{ !hideBalance ? balance : '** ** ** ** **' }</Text>
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
                            style={{ height: 60 }}
                            contentInset={{ top: 5, bottom: 5 }}
                            data={dataLineChart}
                        />
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
                            <Text style={styles(props.theme).incomeText}>Despesa mensal <Text style={{ fontFamily: fonts.montserratMedium, fontSize: fonts.regular, color: props.theme == 'light' ? colors.strongRed : colors.lightRed }}>-20%</Text><Feather name='arrow-down' size={15} color={props.theme == 'light' ? colors.strongRed : colors.lightRed}/></Text>
                        </View>
                    </View>
                </View>
                <View style={[general(props.theme).card, { flexDirection: 'row' }]}>
                    <View style={styles().segmentChartView}>
                        <PieChart
                            style={{ height: 130 }}
                            data={finalDataPieChart}
                        >
                            <Label/>
                        </PieChart>
                    </View>
                    <View style={styles().segmentLabelView}>
                        <View style={styles().contentLabel}>
                            <View style={[styles().dotView, { backgroundColor: colors.darkPrimary }]}/>
                            <Text style={styles(props.theme).segmentLabelText}>Lazer</Text>
                        </View>
                        <View style={styles().contentLabel}>
                            <View style={[styles().dotView, { backgroundColor: props.theme == 'light' ? colors.lightPurple : colors.lightRed }]}/>
                            <Text style={styles(props.theme).segmentLabelText}>Educação</Text>
                        </View>
                        <View style={styles().contentLabel}>
                            <View style={[styles().dotView, { backgroundColor: props.theme == 'light' ? colors.strongPurple : colors.strongRed }]}/>
                            <Text style={styles(props.theme).segmentLabelText}>Investimentos</Text>
                        </View>
                        <View style={styles().contentLabel}>
                            <View style={[styles().dotView, { backgroundColor: props.theme == 'light' ? colors.lightRed : colors.whiteBlue }]}/>
                            <Text style={styles(props.theme).segmentLabelText}>Necessidades</Text>
                        </View>
                        <View style={styles().contentLabel}>
                            <View style={[styles().dotView, { backgroundColor: props.theme == 'light' ? colors.strongRed : colors.lightBlue }]}/>
                            <Text style={styles(props.theme).segmentLabelText}>Curto e médio prazo</Text>
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
        complete: state.complete.complete,
        modality: state.modality.modality
    }
  }
  
const homeConnect = connect(mapStateToProps, { editVisibilityAlert, editComplete })(Home);

export default homeConnect;