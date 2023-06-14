import * as React from "react";
import { Text, View, VStack } from "native-base";

import EmptyChart from "../EmptyChart";
import { LoaderContext } from "../../context/Loader/loaderContext";
import {
  StyledPieChart,
  PieChartLabel,
  SegmentChartView,
  SegmentLabelView,
  ContentLabel,
  DotView,
  ChartContainer,
  PieCenter,
} from "./styles";
import { fonts, metrics } from "../../styles";
import { Skeleton } from "@styles/general";

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

export interface IChartData {
  label: string;
  value: number;
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

const SegmentChart = ({
  data,
  empty,
  emptyText,
  screen,
}: {
  data: IChartData[];
  empty: boolean;
  emptyText: string;
  screen: "home" | "invest";
}) => {
  const {
    loader: { homeVisible, investVisible },
  } = React.useContext(LoaderContext);

  const loader = screen === "home" ? homeVisible : investVisible;
  const chartValues = data.map(({ value }) => value);

  return (
    <>
      {!loader ? (
        <ChartContainer>
          {empty ? (
            <EmptyChart
              emphasisText={emptyText}
              iconName="pie-chart"
              helperText="Realize seu primeiro lançamento!"
            />
          ) : (
            <>
              <SegmentChartView>
                <StyledPieChart data={chartValues}>
                  <Label data={chartValues} />
                  <PieCenter />
                </StyledPieChart>
              </SegmentChartView>
              <SegmentLabelView>
                {data.map(({ label, value }, index) => {
                  return (
                    <VStack key={index}>
                      {value ? (
                        <ContentLabel>
                          <DotView index={index} />
                          <Text fontSize={fonts.regular}>{label}</Text>
                        </ContentLabel>
                      ) : null}
                    </VStack>
                  );
                })}
              </SegmentLabelView>
            </>
          )}
        </ChartContainer>
      ) : (
        <Skeleton isLoaded={!loader} h={130} width={"full"} />
      )}
    </>
  );
};

export default SegmentChart;
