import * as React from "react";
import { View } from "react-native";

import firebase from "../../services/firebase";
import EmptyChart from "../EmptyChart";
import { DataContext } from "../../context/Data/dataContext";
import { DateContext } from "../../context/Date/dateContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { UserContext } from "../../context/User/userContext";
import { dateMonthNumber, getFinalDateMonth } from "../../utils/date.helper";
import { StyledLoader } from "../../styles/general";
import {
  ChartContainer,
  ChartView,
  LabelText,
  LabelView,
  PercentualIcon,
  PercentualText,
  PercentualValue,
  PercentualView,
  StyledLineChart,
} from "./styles";

export default function LineChart() {
  const { date } = React.useContext(DateContext);
  const { user } = React.useContext(UserContext);
  const { data: userData } = React.useContext(DataContext);
  const { loader, setLoader } = React.useContext(LoaderContext);

  const [data, setData] = React.useState([
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [empty, setEmpty] = React.useState(false);
  const [initLabel, setInitLabel] = React.useState<string | number>("");
  const [finalLabel, setFinalLabel] = React.useState<string | number>("");
  const [income, setIncome] = React.useState(0);
  const [expense, setExpense] = React.useState(0);

  React.useEffect(() => {
    (async function getData() {
      if (date.year !== 0) {
        let initialMonth = date.month - 2;
        let initialYear = date.year;

        if (initialMonth == -1) {
          initialMonth = 11;
          initialYear -= 1;
        } else if (initialMonth == 0) {
          initialMonth = 12;
          initialYear -= 1;
        }
        const initialDate = new Date(
          `${initialMonth}/01/${initialYear} 00:00:00`
        );
        const finalDate = new Date(
          `${date.month}/${getFinalDateMonth(date.month, date.year)}/${
            date.year
          } 23:59:59`
        );

        // Busca no banco os dados referente ao Mês - 2 até Mês atual
        await firebase
          .firestore()
          .collection("entry")
          .doc(user.uid)
          .collection(date.modality)
          .get()
          .then((result) => {
            if (!result.empty) {
              setEmpty(false);
              firebase
                .firestore()
                .collection("entry")
                .doc(user.uid)
                .collection(date.modality)
                .where("date", ">=", initialDate)
                .where("date", "<=", finalDate)
                .onSnapshot((snapshot) => {
                  let incomeData = [0, 0, 0];
                  let expenseData = [0, 0, 0];

                  snapshot.forEach((result) => {
                    const storedDate =
                      new Date(result.data().date * 1000).getMonth() + 1;

                    let index = 0;

                    let firstMonth = date.month - 2;
                    let secondMonth = date.month - 1;
                    const thrirdMonth = date.month;

                    if (firstMonth == -1) {
                      firstMonth = 11;
                    } else if (firstMonth == 0) {
                      firstMonth = 12;
                    }

                    if (secondMonth == -1) {
                      secondMonth = 11;
                    } else if (secondMonth == 0) {
                      secondMonth = 12;
                    }

                    // Faz a separação de cada resultado pelo mês de referência
                    switch (storedDate) {
                      case firstMonth:
                        index = 0;
                        break;

                      case secondMonth:
                        index = 1;
                        break;

                      case thrirdMonth:
                        index = 2;
                        break;
                    }

                    if (result.data().type === "Receita") {
                      incomeData[index] += Math.round(result.data().value);
                    } else {
                      expenseData[index] += Math.round(result.data().value);
                    }
                  });

                  // Seta os dados finais para renderização do gráfico
                  setData([incomeData, expenseData]);

                  // Seta os labels do gráfico
                  setInitLabel(
                    dateMonthNumber("toMonth", date.month - 2, "pt")
                  );
                  setFinalLabel(dateMonthNumber("toMonth", date.month, "pt"));

                  // Seta os percentuais de Crescimento/Queda
                  setIncome(
                    incomeData[0] == 0
                      ? incomeData[2]
                      : ((incomeData[2] - incomeData[0]) / incomeData[0]) * 100
                  );
                  setExpense(
                    expenseData[0] == 0
                      ? expenseData[2]
                      : ((expenseData[2] - expenseData[0]) / expenseData[0]) *
                          100
                  );
                });
            } else {
              setEmpty(true);
            }
          });
        setLoader((loaderState) => ({
          ...loaderState,
          lineChart: true,
        }));
      }
    })();
  }, [date, userData.balance]);

  return (
    <>
      {loader.visible ? (
        <StyledLoader width={140} height={114} radius={15} />
      ) : (
        <ChartContainer>
          {empty ? (
            <EmptyChart
              emphasisText="Parece que não há dados registrados para o balanço"
              iconName="bar-chart-2"
              helperText="Realize seu primeiro lançamento!"
            />
          ) : (
            <>
              <ChartView>
                <StyledLineChart data={data} />
                <LabelView>
                  <LabelText>{initLabel}</LabelText>
                  <LabelText>{finalLabel}</LabelText>
                </LabelView>
              </ChartView>
              <PercentualView>
                <View>
                  <PercentualText>
                    Receita mensal{"\u00A0"}
                    {"\u00A0"}
                    {"\u00A0"}
                    <PercentualValue type="income" percentual={income}>
                      {income}%
                    </PercentualValue>
                    <PercentualIcon
                      percentual={income}
                      type="income"
                      size={15}
                    />
                  </PercentualText>
                </View>
                <View>
                  <PercentualText>
                    Despesa mensal{"\u00A0"}
                    <PercentualValue type="expense" percentual={expense}>
                      {expense}%
                    </PercentualValue>
                    <PercentualIcon
                      percentual={expense}
                      type="expense"
                      size={15}
                    />
                  </PercentualText>
                </View>
              </PercentualView>
            </>
          )}
        </ChartContainer>
      )}
    </>
  );
}
