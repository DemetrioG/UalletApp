import { Center, HStack, Text, View, VStack } from "native-base";

import EmptyChart from "../EmptyChart";
import {
  StyledPieChart,
  PieChartLabel,
  SegmentChartView,
  SegmentLabelView,
  ContentLabel,
  DotView,
  PieCenter,
} from "./styles";
import { fonts, metrics } from "../../styles";
import { IChartData, ISlices } from "./types";
import When from "../When";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

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
                y={pieCentroid[1] + 43}
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
  const { theme }: IThemeProvider = useTheme();
  const chartValues = data.map(({ value }) => value);

  return (
    <>
      <Center>
        <When is={empty}>
          <EmptyChart actionText="Realize seu primeiro lançamento" />
        </When>
        <When is={!empty}>
          <HStack>
            <SegmentChartView>
              <StyledPieChart data={chartValues}>
                <Label data={chartValues} />
              </StyledPieChart>
            </SegmentChartView>
            <SegmentLabelView>
              {data.map(({ label, value }, index) => {
                return (
                  <VStack key={index}>
                    <When is={!!value}>
                      <HStack alignItems="center" space={2}>
                        <VStack
                          w="10px"
                          h="10px"
                          borderRadius="100%"
                          backgroundColor={theme?.colorPieChart[index]}
                        />
                        <Text fontSize="14px" fontWeight={700}>
                          {value}%
                        </Text>
                        <Text fontSize="14px">{label}</Text>
                      </HStack>
                    </When>
                  </VStack>
                );
              })}
            </SegmentLabelView>
          </HStack>
        </When>
      </Center>
    </>
  );
};

export default SegmentChart;
