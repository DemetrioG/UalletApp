import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Feather from 'react-native-vector-icons/Feather';
import { LineChart, PieChart } from 'react-native-svg-charts';
import { ForeignObject, Text as TextSVG }  from 'react-native-svg';

import firebase from '../../services/firebase';
import { dateMonthNumber, getBalance, getFinalDateMonth, realToNumber, useStateCallback } from '../../functions';
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
    let incomeChart = [0, 0, 0];
    let expenseChart = [0, 0, 0];
    const [incomePercentual, setIncomePercentual] = useState(0);
    const [expensePercentual, setExpensePercentual] = useState(0);
    const [initLabel, setInitLabel] = useState(null);
    const [finalLabel, setFinalLabel] = useState(null); 
    const [lineData, setLineData] = useStateCallback([]);
    const [renderLine, setRenderLine] = useState(false);
    const [dataLineChart, setDataLineChart] = useStateCallback([
        {
            data: incomeChart,
            svg: { stroke: props.theme == 'light' ? colors.strongGreen : colors.lightGreen, strokeWidth: 2 }
        },
        {
            data: expenseChart,
            svg: { stroke: props.theme == 'light' ? colors.strongRed : colors.lightRed, strokeWidth: 2 }
        }
    ]);

    // Dados para o gráfico de rosca Segmento de Despesas
    const [pieData, setPieData] = useStateCallback([]);
    const [finalDataPieChart, setFinalDataPieChart] = useStateCallback([]);
    const [renderPie, setRenderPie] = useState(false);
    const [dataPieChart, setDataPieChart] = useStateCallback([0, 0, 0, 0, 0]); // INDEX 0: Lazer / 1: Investimentos / 2: Educação / 3: Curto e Médio Prazo / 4: Necessidades
    const colorPieChartLight = [colors.darkPrimary, colors.strongPurple, colors.lightPurple, colors.strongRed, colors.lightRed];
    const colorPieChartDark = [colors.darkPrimary, colors.strongRed, colors.lightRed, colors.lightBlue, colors.whiteBlue];

    async function getPieDatabase() {

        let initialDate = Date.parse(`${props.month}/01/${props.year}`);
        let finalDate = Date.parse(`${props.month}/${getFinalDateMonth(props.month, props.year)}/${props.year}`);

        // Busca no banco os dados referente ao Mês atual
        firebase.firestore().collection('entry').doc(props.uid).collection(props.modality)
        .where('type', '==', 'Despesa')
        .where('date', '>=', initialDate)
        .where('date', '<=', finalDate)
        .onSnapshot((snapshot) => {
            setPieData([]);
            snapshot.forEach((result) => {
                // Percorre os dados do banco colocando-os para a State
                setPieData(oldArray => [...oldArray, result.data()], (v) => {
                    /**
                     * Callback retorna os dados alterados da State.
                     * Quando ela já tiver com o total de dados retornados do banco, aí é gerado o Gráfico na tela
                     */
                    if (v.length == snapshot.size - 1) {
                        
                        v = [...v, result.data()];

                        let L = 0;
                        let E = 0;
                        let I = 0;
                        let N = 0;
                        let CM = 0;

                        // Percorre os itens verificando seu segmento para disposição do gráfico
                        v.forEach((value, index) => {
                            switch (value.segment) {
                                case 'Lazer':
                                    L++
                                    break;
                            
                                case 'Educação':
                                    E++
                                    break;

                                case 'Investimentos':
                                    I++
                                    break;

                                case 'Necessidades':
                                    N++
                                    break;
                                
                                case 'Curto e médio prazo':
                                    CM++
                                    break;
                            }
                            
                            if (index == v.length - 1) {

                                // Realiza o cálculo de percentuais
                                const TOTAL = L + E + I + N + CM;
                                L =  (L / TOTAL * 100);
                                E =  (E / TOTAL * 100);
                                I =  (I / TOTAL * 100);
                                N =  (N / TOTAL * 100);
                                CM = (CM / TOTAL * 100);
                                
                                setDataPieChart([L, I, E, CM, N], (data) => {
                                    
                                    // Mapeia os dados criando um objeto para renderização do gráfico
                                    let objPie = data.map((value, index) => ({
                                        value,
                                        key: index,
                                        svg: {
                                            fill: props.theme == 'light' ? colorPieChartLight[index] : colorPieChartDark[index]
                                        }
                                    }));
                                    setFinalDataPieChart(objPie, () => {
                                        setRenderPie(true);
                                    })
                                })
                            }
                        })
                    }
                })
            })
        })
    }

    // Criação de labels para o Pie Chart
    const Label = ({ slices }) => {
        return slices.map((slice, index) => {
            const { pieCentroid, data, value } = slice;
            return (
                value !== 0 ?
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
                </ForeignObject> : null
            )
        })
    }

    // Retorna os dados para a montagem do gráfico de Receita X Despesa
    async function getLineDatabase() {
    
        let initialMonth = props.month - 2;
        let initialYear = props.year;
        
        if (initialMonth == -1) {
            initialMonth = 11;
            initialYear -= 1;
        } else if (initialMonth == 0) {
            initialMonth = 12;
            initialYear -= 1;
        }
        let initialDate = Date.parse(`${initialMonth}/01/${initialYear}`);
        let finalDate = Date.parse(`${props.month}/${getFinalDateMonth(props.month, props.year)}/${props.year}`);

        // Busca no banco os dados referente ao Mês - 2 até Mês atual
        firebase.firestore().collection('entry').doc(props.uid).collection(props.modality)
        .where('date', '>=', initialDate)
        .where('date', '<=', finalDate)
        .onSnapshot((snapshot) => {
            setLineData([]);
            snapshot.forEach((result) => {
                // Percorre os dados do banco colocando-os para a State
                setLineData(oldArray => [...oldArray, result.data()], (v) => {
                    /**
                     * Callback retorna os dados alterados da State.
                     * Quando ela já tiver com o total de dados retornados do banco, aí é gerado o Gráfico na tela
                     */
                    if (v.length == snapshot.size - 1) {
                        let firstMonth = props.month - 2;
                        let firstYear = props.year;

                        if (firstMonth == -1) {
                            firstMonth = 11;
                            firstYear -= 1;
                        } else if (firstMonth == 0) {
                            firstMonth = 12;
                            firstYear -= 1;
                        }

                        let secondMonth = props.month - 1;
                        let secondYear = props.year;

                        if (secondMonth == -1) {
                            secondMonth = 11;
                            secondYear -= 1;
                        } else if (secondMonth == 0) {
                            secondMonth = 12;
                            secondYear -= 1;
                        }

                        // Separa os meses de referência do gráfico
                        let initialDateFirstMonth = Date.parse(`${firstMonth}/01/${firstYear}`);
                        let finalDateFirstMonth = Date.parse(`${firstMonth}/${getFinalDateMonth(firstMonth, firstYear)}/${firstYear}`);
                        let initialDateSecondMonth = Date.parse(`${secondMonth}/01/${secondYear}`);
                        let finalDateSecondMonth = Date.parse(`${secondMonth}/${getFinalDateMonth(secondMonth, secondYear)}/${secondYear}`);
                        let initialDateThirdMonth = Date.parse(`${props.month}/01/${props.year}`);
                        let finalDateThirdMonth = Date.parse(`${props.month}/${getFinalDateMonth(props.month, props.year)}/${props.year}`);

                        // No banco, busca pelos dados acumulado dos meses, e abaixo, separa os valores de cada mês para gerar o gráfico
                        incomeChart = [0, 0, 0];
                        expenseChart = [0, 0, 0];
                        v.forEach((value) => {
                            let index;

                            if (value.date >= initialDateFirstMonth && value.date <= finalDateFirstMonth) {
                                index = 0;
                            } else if (value.date >= initialDateSecondMonth && value.date <= finalDateSecondMonth) {
                                index = 1;
                            } else if (value.date >= initialDateThirdMonth && value.date <= finalDateThirdMonth) {
                                index = 2;
                            }
                            switch (value.type) {
                                case 'Receita':
                                    incomeChart[index] += realToNumber(value.value);
                                    break;

                                case 'Despesa':
                                    expenseChart[index] += realToNumber(value.value);
                                    break;
                            }
                        });

                        // Monta o objeto com os dados vindos do Banco
                        let newData = [...dataLineChart];
                        for (let i = 0; i < 3; i++) {
                            newData[0].data[i] = incomeChart[i];
                            newData[1].data[i] = expenseChart[i];
                        }
                        setDataLineChart(newData, () => {
                            setRenderLine(true);
                        });

                        // Seta os labels do gráfico
                        setInitLabel(dateMonthNumber('toMonth', props.month - 2, 'pt'));
                        setFinalLabel(dateMonthNumber('toMonth', props.month, 'pt'));

                        // Seta os percentuais de Crescimento/Queda
                        setIncomePercentual(incomeChart[0] == 0 ? incomeChart[2] : (incomeChart[2] - incomeChart[0]) / incomeChart[0] * 100);
                        setExpensePercentual(expenseChart[0] == 0 ? expenseChart[2] : (expenseChart[2] - expenseChart[0]) / expenseChart[0] * 100);
                    }
                });
            });
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

        // Retorna o Saldo atual
        getBalance(firebase, props, setBalance);

        // Monta o gráfico de Receita X Despesa
        getLineDatabase();

        // Monta o gráfico de Segmento
        getPieDatabase();
        
    }, [props.modality, props.month, props.year]);

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
                <View style={[general(props.theme).card, { flexDirection: 'row', minHeight: 150 }]}>
                    <View style={styles(props.theme).incomeChartView}>
                        {
                            renderLine &&
                            <LineChart
                                style={{ height: 60 }}
                                contentInset={{ top: 5, bottom: 5 }}
                                data={dataLineChart}
                            />
                        }
                        <View style={styles(props.theme).incomeChartLabelView}>
                            <Text style={styles(props.theme).incomeChartLabelText}>{initLabel}</Text>
                            <Text style={styles(props.theme).incomeChartLabelText}>{finalLabel}</Text>
                        </View>
                    </View>
                    <View style={styles().incomeView}>
                        <View>
                            <Text style={styles(props.theme).incomeText}>Receita mensal <Text style={{ fontFamily: fonts.montserratMedium, fontSize: fonts.regular, color: incomePercentual > 0 ? props.theme == 'light' ? colors.strongGreen : colors.lightGreen : props.theme == 'light' ? colors.strongRed : colors.lightRed }}>{incomePercentual}%</Text><Feather name={incomePercentual > 0 ? 'arrow-up' : 'arrow-down'} size={15} color={incomePercentual > 0 ? props.theme == 'light' ? colors.strongGreen : colors.lightGreen : props.theme == 'light' ? colors.strongRed : colors.lightRed}/></Text>
                        </View>
                        <View>
                            <Text style={styles(props.theme).incomeText}>Despesa mensal <Text style={{ fontFamily: fonts.montserratMedium, fontSize: fonts.regular, color: expensePercentual < 0 ? props.theme == 'light' ? colors.strongGreen : colors.lightGreen : props.theme == 'light' ? colors.strongRed : colors.lightRed }}>{expensePercentual}%</Text><Feather name={expensePercentual > 0 ? 'arrow-up' : 'arrow-down'} size={15} color={expensePercentual < 0 ? props.theme == 'light' ? colors.strongGreen : colors.lightGreen : props.theme == 'light' ? colors.strongRed : colors.lightRed}/></Text>
                        </View>
                    </View>
                </View>
                <View style={[general(props.theme).card, { flexDirection: 'row' }]}>
                    <View style={styles().segmentChartView}>
                        {
                            renderPie &&
                            <PieChart
                                style={{ height: 130 }}
                                data={finalDataPieChart}
                            >
                                <Label/>
                            </PieChart>
                        }
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
        modality: state.modality.modality,
        month: state.date.month,
        year: state.date.year
    }
  }
  
const homeConnect = connect(mapStateToProps, { editVisibilityAlert, editComplete })(Home);

export default homeConnect;