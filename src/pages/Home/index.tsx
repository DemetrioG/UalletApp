import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "styled-components";

import firebase from "../../services/firebase";
import { IThemeProvider } from "../../../App";
import { UserContext } from "../../context/User/userContext";
import { DateContext } from "../../context/Date/dateContext";
import { AlertContext } from "../../context/Alert/alertContext";
import Header from "../../components/Header";
import Alert from "../../components/Alert";
import {
  colorPieChartDark,
  colorPieChartLight,
  Label,
} from "../../components/PieChartComponents";
import {
  dateMonthNumber,
  getFinalDateMonth,
  realToNumber,
  useStateCallback,
  numberToReal,
} from "../../functions";
import {
  Balance,
  CardFooterText,
  CardHeaderText,
  CardHeaderView,
  CardStatusView,
  CardTextView,
  ContentLabel,
  DotView,
  IconContainer,
  IncomeChartLabelText,
  IncomeChartLabelView,
  IncomeChartView,
  IncomeView,
  Invest,
  InvestPercentual,
  LogoCard,
  PercentualIcon,
  PercentualText,
  PercentualValue,
  SegmentChartView,
  SegmentLabelText,
  SegmentLabelView,
  StatusPercentText,
  StatusText,
  StyledLineChart,
  StyledPieChart,
} from "./styles";
import {
  BackgroundContainer,
  Card,
  ScrollViewTab,
  StyledIcon,
  StyledLoader,
} from "../../styles/generalStyled";
import { metrics, colors } from "../../styles";

const LOGO_SMALL = require("../../../assets/images/logoSmall.png");
interface IEntryReturn {
  date: number;
  description: string;
  id: number;
  modality: string;
  segment: string;
  type: string;
  value: string;
}

export default function Home() {
  const THEME: IThemeProvider = useTheme();
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { user, setUser } = React.useContext(UserContext);
  const { date } = React.useContext(DateContext);
  const { alert } = React.useContext(AlertContext);

  const [loader, setLoader] = React.useState(false);
  const [headerLoader, setHeaderLoader] = React.useState(true);
  const [balance, setBalance] = React.useState<string | null>(null);
  const [hideBalance, setHideBalance] = React.useState(false);
  const [hideInvest, setHideInvest] = React.useState(false);

  // Dados para o gráfico de linha Receitas X Despesas
  let incomeChart = [0, 0, 0];
  let expenseChart = [0, 0, 0];
  const [incomePercentual, setIncomePercentual] = React.useState<number>(0);
  const [expensePercentual, setExpensePercentual] = React.useState<number>(0);
  const [initLabel, setInitLabel] = React.useState<null | string | number>(
    null
  );
  const [finalLabel, setFinalLabel] = React.useState<null | string | number>(
    null
  );
  const [lineData, setLineData] = useStateCallback([]);
  const [renderLine, setRenderLine] = React.useState(false);
  const [dataLineChart, setDataLineChart] = useStateCallback([
    {
      data: incomeChart,
      svg: {
        stroke: THEME.theme?.green,
        strokeWidth: 2,
      },
    },
    {
      data: expenseChart,
      svg: {
        stroke: THEME.theme?.red,
        strokeWidth: 2,
      },
    },
  ]);

  // Dados para o gráfico de rosca Segmento de Despesas
  const [pieData, setPieData] = useStateCallback([]);
  const [finalDataPieChart, setFinalDataPieChart] = useStateCallback([]);
  const [renderPie, setRenderPie] = React.useState(false);
  const [dataPieChart, setDataPieChart] = useStateCallback([0, 0, 0, 0, 0]); // INDEX 0: Lazer / 1: Investimentos / 2: Educação / 3: Curto e Médio Prazo / 4: Necessidades

  // Monta o gráfico de Segmento
  function getPieDatabase() {
    let initialDate = Date.parse(`${date.month}/01/${date.year}`);
    let finalDate = Date.parse(
      `${date.month}/${getFinalDateMonth(date.month, date.year)}/${date.year}`
    );

    // Busca no banco os dados referente ao Mês atual
    firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(date.modality)
      .where("type", "==", "Despesa")
      .where("date", ">=", initialDate)
      .where("date", "<=", finalDate)
      .onSnapshot((snapshot) => {
        setPieData([]);
        snapshot.forEach((result) => {
          // Percorre os dados do banco colocando-os para a State
          setPieData(
            (oldArray: number[]) => [...oldArray, result.data()],
            (v: any) => {
              /**
               * Callback retorna os dados alterados da State.
               * Quando ela já tiver com o total de dados retornados do banco, aí é gerado o Gráfico na tela
               */
              if (v.length == snapshot.size - 1) {
                v = [...v, result.data()];

                let LAZER = 0;
                let EDUCACAO = 0;
                let INVESTIMENTOS = 0;
                let NECESSIDADES = 0;
                let CURTOMEDIOPRAZO = 0;

                // Percorre os itens verificando seu segmento para disposição do gráfico
                v.forEach((value: IEntryReturn, index: number) => {
                  switch (value.segment) {
                    case "Lazer":
                      LAZER++;
                      break;

                    case "Educação":
                      EDUCACAO++;
                      break;

                    case "Investimentos":
                      INVESTIMENTOS++;
                      break;

                    case "Necessidades":
                      NECESSIDADES++;
                      break;

                    case "Curto e médio prazo":
                      CURTOMEDIOPRAZO++;
                      break;
                  }

                  if (index == v.length - 1) {
                    // Realiza o cálculo de percentuais
                    const TOTAL =
                      LAZER +
                      EDUCACAO +
                      INVESTIMENTOS +
                      NECESSIDADES +
                      CURTOMEDIOPRAZO;

                    LAZER = (LAZER / TOTAL) * 100;
                    EDUCACAO = (EDUCACAO / TOTAL) * 100;
                    INVESTIMENTOS = (INVESTIMENTOS / TOTAL) * 100;
                    NECESSIDADES = (NECESSIDADES / TOTAL) * 100;
                    CURTOMEDIOPRAZO = (CURTOMEDIOPRAZO / TOTAL) * 100;

                    setDataPieChart(
                      [
                        LAZER,
                        INVESTIMENTOS,
                        EDUCACAO,
                        CURTOMEDIOPRAZO,
                        NECESSIDADES,
                      ],
                      (data: number[]) => {
                        // Mapeia os dados criando um objeto para renderização do gráfico
                        let objPie = data.map((value, index) => ({
                          value,
                          key: index,
                          svg: {
                            fill: THEME.theme?.isOnDarkTheme
                              ? colorPieChartLight[index]
                              : colorPieChartDark[index],
                          },
                        }));
                        setFinalDataPieChart(objPie, () => {
                          setRenderPie(true);
                        });
                      }
                    );
                  }
                });
              }
            }
          );
        });
      });
  }

  // Retorna os dados para a montagem do gráfico de Receita X Despesa
  function getLineDatabase() {
    let initialMonth = date.month - 2;
    let initialYear = date.year;

    if (initialMonth == -1) {
      initialMonth = 11;
      initialYear -= 1;
    } else if (initialMonth == 0) {
      initialMonth = 12;
      initialYear -= 1;
    }
    let initialDate = Date.parse(`${initialMonth}/01/${initialYear}`);
    let finalDate = Date.parse(
      `${date.month}/${getFinalDateMonth(date.month, date.year)}/${date.year}`
    );

    // Busca no banco os dados referente ao Mês - 2 até Mês atual
    firebase
      .firestore()
      .collection("entry")
      .doc(user.uid)
      .collection(date.modality)
      .where("date", ">=", initialDate)
      .where("date", "<=", finalDate)
      .onSnapshot((snapshot) => {
        setLineData([]);
        snapshot.forEach((result) => {
          // Percorre os dados do banco colocando-os para a State
          setLineData(
            (oldArray: IEntryReturn[]) => [...oldArray, result.data()],
            (v: IEntryReturn[]) => {
              /**
               * Callback retorna os dados alterados da State.
               * Quando ela já tiver com o total de dados retornados do banco, aí é gerado o Gráfico na tela
               */
              if (v.length == snapshot.size - 1) {
                let firstMonth = date.month - 2;
                let firstYear = date.year;

                if (firstMonth == -1) {
                  firstMonth = 11;
                  firstYear -= 1;
                } else if (firstMonth == 0) {
                  firstMonth = 12;
                  firstYear -= 1;
                }

                let secondMonth = date.month - 1;
                let secondYear = date.year;

                if (secondMonth == -1) {
                  secondMonth = 11;
                  secondYear -= 1;
                } else if (secondMonth == 0) {
                  secondMonth = 12;
                  secondYear -= 1;
                }

                // Separa os meses de referência do gráfico
                let initialDateFirstMonth = Date.parse(
                  `${firstMonth}/01/${firstYear}`
                );
                let finalDateFirstMonth = Date.parse(
                  `${firstMonth}/${getFinalDateMonth(
                    firstMonth,
                    firstYear
                  )}/${firstYear}`
                );
                let initialDateSecondMonth = Date.parse(
                  `${secondMonth}/01/${secondYear}`
                );
                let finalDateSecondMonth = Date.parse(
                  `${secondMonth}/${getFinalDateMonth(
                    secondMonth,
                    secondYear
                  )}/${secondYear}`
                );
                let initialDateThirdMonth = Date.parse(
                  `${date.month}/01/${date.year}`
                );
                let finalDateThirdMonth = Date.parse(
                  `${date.month}/${getFinalDateMonth(date.month, date.year)}/${
                    date.year
                  }`
                );

                // No banco, busca pelos dados acumulado dos meses, e abaixo, separa os valores de cada mês para gerar o gráfico
                incomeChart = [0, 0, 0];
                expenseChart = [0, 0, 0];
                v.forEach(({ date, type, value }) => {
                  let index = 0;

                  if (
                    date >= initialDateFirstMonth &&
                    date <= finalDateFirstMonth
                  ) {
                    index = 0;
                  } else if (
                    date >= initialDateSecondMonth &&
                    date <= finalDateSecondMonth
                  ) {
                    index = 1;
                  } else if (
                    date >= initialDateThirdMonth &&
                    date <= finalDateThirdMonth
                  ) {
                    index = 2;
                  }
                  switch (type) {
                    case "Receita":
                      incomeChart[index] += realToNumber(value);
                      break;

                    case "Despesa":
                      expenseChart[index] += realToNumber(value);
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
                setInitLabel(dateMonthNumber("toMonth", date.month - 2, "pt"));
                setFinalLabel(dateMonthNumber("toMonth", date.month, "pt"));

                // Seta os percentuais de Crescimento/Queda
                setIncomePercentual(
                  incomeChart[0] == 0
                    ? incomeChart[2]
                    : ((incomeChart[2] - incomeChart[0]) / incomeChart[0]) * 100
                );
                setExpensePercentual(
                  expenseChart[0] == 0
                    ? expenseChart[2]
                    : ((expenseChart[2] - expenseChart[0]) / expenseChart[0]) *
                        100
                );
              }
            }
          );
        });
      });
  }

  // Retorna o Saldo atual
  function getBalance() {
    if (date.month) {
      firebase
        .firestore()
        .collection("balance")
        .doc(user.uid)
        .collection(date.modality)
        .doc(date.month.toString())
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setBalance(numberToReal(snapshot.data()?.balance));
          } else {
            setBalance("R$ 0,00");
          }
        });
    }
  }

  React.useEffect(() => {
    function completeData() {
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((v) => {
          setUser((userState) => ({
            ...userState,
            complete: true,
          }));
          // Verifica se tem todas as informações de usuário preenchidas no banco, se não, builda a tela de preenchimento
          if (!v.data()?.birthDate) {
            navigate("Complete");
          }
        });
    }
    if (!user.complete) {
      completeData();
    }

    getBalance();
    getLineDatabase();
    getPieDatabase();
  }, [date.modality, date.month, date.year]);

  if (
    balance &&
    renderLine &&
    incomePercentual &&
    expensePercentual &&
    renderPie &&
    loader &&
    !headerLoader
  ) {
    setLoader(false);
  }

  return (
    <BackgroundContainer>
      {alert.visibility && <Alert />}
      <Header loader={loader} setLoader={setHeaderLoader} />
      <ScrollViewTab showsVerticalScrollIndicator={false}>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Saldo atual</CardHeaderText>
              <IconContainer
                marginTop={4}
                onPress={() => setHideBalance(!hideBalance)}
              >
                <StyledIcon name={!hideBalance ? "eye" : "eye-off"} size={15} />
              </IconContainer>
            </CardTextView>
            <View>
              <LogoCard source={LOGO_SMALL} width={1} />
            </View>
          </CardHeaderView>
          {loader ? (
            <StyledLoader width={160} height={30} />
          ) : (
            <Balance>{!hideBalance ? balance : "** ** ** ** **"}</Balance>
          )}
        </Card>
        <Card>
          <CardStatusView>
            <StatusText bold={true}>Você está indo bem</StatusText>
          </CardStatusView>
          <CardStatusView>
            <StatusText>
              Sua média de gastos variáveis semanal está representando{" "}
              <StatusPercentText>3%</StatusPercentText> de sua renda
            </StatusText>
          </CardStatusView>
          <View>
            <StatusText bold={true}>Continue!! ⚡</StatusText>
          </View>
        </Card>
        <Card>
          <CardHeaderView>
            <CardTextView>
              <CardHeaderText>Patrimônio investido</CardHeaderText>
              <IconContainer onPress={() => setHideInvest(!hideInvest)}>
                <StyledIcon name={!hideInvest ? "eye" : "eye-off"} size={15} />
              </IconContainer>
            </CardTextView>
            <TouchableOpacity>
              <StyledIcon name="maximize-2" size={metrics.iconSize} />
            </TouchableOpacity>
          </CardHeaderView>
          <Invest>{!hideInvest ? "R$ 153.000,00" : "** ** ** ** **"}</Invest>
          <CardTextView>
            <CardFooterText>Rendimento semanal</CardFooterText>
            <InvestPercentual>55%</InvestPercentual>
            <StyledIcon name="arrow-up" size={15} />
          </CardTextView>
        </Card>
        <Card style={{ flexDirection: "row", minHeight: 150 }}>
          {loader ? (
            <StyledLoader width={145} height={120} />
          ) : (
            <IncomeChartView>
              <StyledLineChart data={dataLineChart} />
              <IncomeChartLabelView>
                <IncomeChartLabelText>{initLabel}</IncomeChartLabelText>
                <IncomeChartLabelText>{finalLabel}</IncomeChartLabelText>
              </IncomeChartLabelView>
            </IncomeChartView>
          )}
          <IncomeView>
            {loader ? (
              <StyledLoader width={140} height={10} />
            ) : (
              <View>
                <PercentualText>
                  Receita mensal{"\u00A0"}
                  <PercentualValue percentual={incomePercentual} type="income">
                    {incomePercentual}%
                  </PercentualValue>
                  <PercentualIcon
                    percentual={incomePercentual}
                    type="income"
                    size={15}
                  />
                </PercentualText>
              </View>
            )}
            {loader ? (
              <StyledLoader width={140} height={10} />
            ) : (
              <View>
                <PercentualText>
                  Despesa mensal{"\u00A0"}
                  <PercentualValue
                    percentual={expensePercentual}
                    type="expense"
                  >
                    {expensePercentual}%
                  </PercentualValue>
                  <PercentualIcon
                    percentual={expensePercentual}
                    type="expense"
                    size={15}
                  />
                </PercentualText>
              </View>
            )}
          </IncomeView>
        </Card>
        <Card style={{ flexDirection: "row" }}>
          <SegmentChartView>
            {loader ? (
              <StyledLoader width={140} height={140} radius={100} />
            ) : (
              <StyledPieChart data={finalDataPieChart}>
                <Label data={dataPieChart} />
              </StyledPieChart>
            )}
          </SegmentChartView>
          <SegmentLabelView>
            <ContentLabel>
              <DotView backgroundColor={colors.darkPrimary} />
              <SegmentLabelText>Lazer</SegmentLabelText>
            </ContentLabel>
            <ContentLabel>
              <DotView
                backgroundColor={
                  !THEME.theme?.isOnDarkTheme
                    ? colors.lightPurple
                    : colors.lightRed
                }
              />
              <SegmentLabelText>Educação</SegmentLabelText>
            </ContentLabel>
            <ContentLabel>
              <DotView
                backgroundColor={
                  !THEME.theme?.isOnDarkTheme
                    ? colors.strongPurple
                    : colors.strongRed
                }
              />
              <SegmentLabelText>Investimentos</SegmentLabelText>
            </ContentLabel>
            <ContentLabel>
              <DotView
                backgroundColor={
                  !THEME.theme?.isOnDarkTheme
                    ? colors.lightRed
                    : colors.whiteBlue
                }
              />
              <SegmentLabelText>Necessidades</SegmentLabelText>
            </ContentLabel>
            <ContentLabel>
              <DotView
                backgroundColor={
                  !THEME.theme?.isOnDarkTheme
                    ? colors.strongRed
                    : colors.lightBlue
                }
              />
              <SegmentLabelText>Curto e médio prazo</SegmentLabelText>
            </ContentLabel>
          </SegmentLabelView>
        </Card>
      </ScrollViewTab>
    </BackgroundContainer>
  );
}
