import * as React from "react";
import { View } from "native-base";

import EmptyChart from "../EmptyChart";
import { LoaderContext } from "../../context/Loader/loaderContext";
import { DataContext } from "../../context/Data/dataContext";
import {
  StyledPieChart,
  PieChartLabel,
  SegmentChartView,
  SegmentLabelView,
  ContentLabel,
  DotView,
  SegmentLabelText,
  ChartContainer,
  PieCenter,
} from "./styles";
import { metrics } from "../../styles";
import { getData } from "./query";

interface ISlices {
  slices?: [
    slice: {
      pieCentroid: number[];
      data: {
        key: number;
        svg: object;
      };
      value: number;
    }
  ];
  data: number[];
}

// Criação de labels para o Pie Chart
export const Label = ({ slices, data }: ISlices) => {
  return (
    <>
      {slices?.map((slice, index) => {
        const { pieCentroid, value } = slice;
        return (
          <View key={index}>
            {value !== 0 && (
              <PieChartLabel
                x={pieCentroid[0] + (metrics.screenWidth / 100) * 17.5}
                y={pieCentroid[1] + 57}
              >
                {Math.round(value)}%
              </PieChartLabel>
            )}
          </View>
        );
      })}
    </>
  );
};

const SegmentChart = () => {
  const { data: dataContext } = React.useContext(DataContext);
  const { loader, setLoader } = React.useContext(LoaderContext);
  /**
   * INDEX
   * 0: Leisure
   * 1: Invest
   * 2: Education
   * 3: Short and Medium Time
   * 4: Needs
   */
  const [data, setData] = React.useState([0, 0, 0, 0, 0]);
  const [empty, setEmpty] = React.useState(false);

  React.useEffect(() => {
    getData(dataContext)
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
          segmentChart: true,
        }));
      });
  }, [dataContext]);

  return (
    <>
      {!loader.visible && (
        <ChartContainer>
          {empty ? (
            <EmptyChart
              emphasisText="Parece que você não cadastrou nenhuma despesa para o período"
              iconName="pie-chart"
              helperText="Realize seu primeiro lançamento!"
            />
          ) : (
            <>
              <SegmentChartView>
                <StyledPieChart data={data}>
                  <Label data={data} />
                  <PieCenter />
                </StyledPieChart>
              </SegmentChartView>
              <SegmentLabelView>
                <ContentLabel>
                  <DotView index={0} />
                  <SegmentLabelText>Lazer</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={2} />
                  <SegmentLabelText>Educação</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={1} />
                  <SegmentLabelText>Investimentos</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={4} />
                  <SegmentLabelText>Necessidades</SegmentLabelText>
                </ContentLabel>
                <ContentLabel>
                  <DotView index={3} />
                  <SegmentLabelText>Curto e médio prazo</SegmentLabelText>
                </ContentLabel>
              </SegmentLabelView>
            </>
          )}
        </ChartContainer>
      )}
    </>
  );
};

export default SegmentChart;
