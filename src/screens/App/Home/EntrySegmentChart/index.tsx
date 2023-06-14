import * as React from "react";

import { LoaderContext } from "../../../../context/Loader/loaderContext";
import { DataContext } from "../../../../context/Data/dataContext";
import { getData } from "./query";
import SegmentChart from "../../../../components/SegmentChart";

const defaultChartData = [
  {
    label: "Lazer",
    value: 0,
  },
  {
    label: "Investimentos",
    value: 0,
  },
  {
    label: "Educação",
    value: 0,
  },
  {
    label: "Curto e médio prazo",
    value: 0,
  },
  {
    label: "Necessidades",
    value: 0,
  },
];

const EntrySegmentChart = () => {
  const { data: dataContext } = React.useContext(DataContext);
  const {
    loader: { entrySegmentChart },
    setLoader,
  } = React.useContext(LoaderContext);

  const [data, setData] = React.useState(defaultChartData);
  const [empty, setEmpty] = React.useState(false);

  React.useEffect(() => {
    getData(dataContext, defaultChartData)
      .then((data) => {
        setEmpty(false);
        if (data) {
          /**
           * Seta os dados finais para renderização do gráfico
           */
          setData(data);
        }
      })
      .catch((e) => {
        if (e === "empty") {
          setEmpty(true);
        }
      })
      .finally(() => {
        !entrySegmentChart &&
          setLoader((loaderState) => ({
            ...loaderState,
            entrySegmentChart: true,
          }));
      });
  }, [dataContext]);

  return (
    <SegmentChart
      data={data}
      empty={empty}
      emptyText="Parece que você não cadastrou nenhuma despesa para o período"
      screen="home"
    />
  );
};

export default EntrySegmentChart;
