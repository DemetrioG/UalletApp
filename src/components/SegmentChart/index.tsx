import { Center, HStack, Text, View, VStack } from "native-base";

import EmptyChart from "../EmptyChart";
import { StyledPieChart } from "./styles";
import { metrics } from "../../styles";
import { IChartData, ISlices } from "./types";
import When from "../When";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

const Label = ({ slices }: ISlices) => {
  return (
    <>
      {slices?.map((slice, index) => {
        const { pieCentroid, value } = slice;
        const x = pieCentroid[0] + (metrics.screenWidth / 100) * 17.5;
        const y = pieCentroid[1] + 43;
        return (
          <View key={index}>
            <When is={value !== 0}>
              <Text position="absolute" top={y} left={x}>
                {Math.round(value)}%
              </Text>
            </When>
          </View>
        );
      })}
    </>
  );
};

export const SegmentChart = ({
  data,
  empty,
}: {
  data: IChartData[];
  empty: boolean;
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
            <VStack w="50%">
              <StyledPieChart data={chartValues}>
                <Label data={chartValues} />
              </StyledPieChart>
            </VStack>
            <VStack w="50%">
              {data.map(({ label, value }, index) => {
                return (
                  <When is={!!value}>
                    <VStack key={index} justifyContent="center" flex={1}>
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
                    </VStack>
                  </When>
                );
              })}
            </VStack>
          </HStack>
        </When>
      </Center>
    </>
  );
};
