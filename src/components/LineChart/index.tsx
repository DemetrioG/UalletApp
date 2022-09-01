import * as React from "react";

import EmptyChart from "../EmptyChart";
import { DataContext } from "../../context/Data/dataContext";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { dateMonthNumber } from "../../utils/date.helper";
import {
  ChartContainer,
  ChartView,
  LabelText,
  LabelView,
  PercentualContainer,
  PercentualIcon,
  PercentualText,
  PercentualValue,
  PercentualView,
  StyledLineChart,
} from "./styles";
import { getData } from "./query";

const LineChart = () => {
  const { data: dataContext } = React.useContext(DataContext);
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
    getData(dataContext)
      .then((data) => {
        setEmpty(false);
        if (data) {
          const [income] = data!;
          const [, expense] = data!;

          /**
           * Seta os dados finais para renderização do gráfico
           */
          income && expense && setData([income, expense]);

          /**
           * Seta os labels do gráfico
           */
          setInitLabel(dateMonthNumber("toMonth", dataContext.month - 2));
          setFinalLabel(dateMonthNumber("toMonth", dataContext.month));

          /**
           * Seta os percentuais de Crescimento/Queda
           */

          setIncome(
            income[0] == 0
              ? income[2]
              : ((income[2] - income[0]) / income[0]) * 100
          );
          setExpense(
            expense[0] == 0
              ? expense[2]
              : ((expense[2] - expense[0]) / expense[0]) * 100
          );
        }
      })
      .catch((e) => {
        if (e === "empty") {
          setEmpty(true);
        }
      })
      .finally(() => {
        setLoader((loaderState) => ({
          ...loaderState,
          lineChart: true,
        }));
      });
  }, [dataContext]);

  return (
    <>
      {!loader.visible && (
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
                <PercentualContainer>
                  <PercentualText>
                    Receita mensal{"\u00A0"}
                    {"\u00A0"}
                    {"\u00A0"}
                  </PercentualText>
                  <PercentualValue type="income" percentual={income}>
                    {income}%
                  </PercentualValue>
                  <PercentualIcon percentual={income} type="income" size={15} />
                </PercentualContainer>
                <PercentualContainer>
                  <PercentualText>Despesa mensal{"\u00A0"}</PercentualText>
                  <PercentualValue type="expense" percentual={expense}>
                    {expense}%
                  </PercentualValue>
                  <PercentualIcon
                    percentual={expense}
                    type="expense"
                    size={15}
                  />
                </PercentualContainer>
              </PercentualView>
            </>
          )}
        </ChartContainer>
      )}
    </>
  );
};

export default LineChart;
