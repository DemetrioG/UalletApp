import * as React from "react";

import { LoaderContext } from "@context/Loader/loaderContext";
import { DataContext } from "@context/Data/dataContext";
import SegmentChart from "@components/SegmentChart";
import { getData } from "./query";
import { useIsFocused } from "@react-navigation/native";

const defaultChartData = [
  {
    label: "Renda Fixa, LCI e LCA",
    value: 0,
  },
  {
    label: "Ações",
    value: 0,
  },
  {
    label: "FIIs",
    value: 0,
  },
  {
    label: "Fiagro",
    value: 0,
  },
  {
    label: "Criptomoedas",
    value: 0,
  },
  {
    label: "ETF's",
    value: 0,
  },
  {
    label: "BDR's",
    value: 0,
  },
];

const AssetSegmentChart = () => {
  const { data: dataContext } = React.useContext(DataContext);
  const { setLoader } = React.useContext(LoaderContext);

  const [data, setData] = React.useState(defaultChartData);
  const [empty, setEmpty] = React.useState(false);

  const isFocused = useIsFocused();

  React.useEffect(() => {
    isFocused &&
      getData(defaultChartData)
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
          setLoader((loaderState) => ({
            ...loaderState,
            assetSegmentChart: true,
          }));
        });
  }, [dataContext, isFocused]);

  return (
    <SegmentChart
      data={data}
      empty={empty}
      emptyText="Parece que você não cadastrou nenhum ativo"
      screen="invest"
    />
  );
};

export default AssetSegmentChart;
