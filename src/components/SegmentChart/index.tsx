import { Center, HStack, Text, VStack } from "native-base";

import { EmptyChart } from "../EmptyChart";
import { StyledPieChart } from "./styles";
import { ChartProps } from "./types";
import When from "../When";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

export const SegmentChart = ({ data }: { data: ChartProps[] }) => {
  const { theme }: IThemeProvider = useTheme();
  const chartValues = data.map(({ value }) => value);
  const isEmpty = !data.length;

  return (
    <>
      <Center>
        <When is={isEmpty}>
          <EmptyChart actionText="Realize seu primeiro lançamento" />
        </When>
        <When is={!isEmpty}>
          <HStack>
            <VStack w="50%">
              <StyledPieChart data={chartValues} />
            </VStack>
            <VStack w="50%">
              {data.map(({ label, value }, index) => {
                return (
                  <When is={!!value} key={index}>
                    <VStack justifyContent="center" flex={1}>
                      <HStack alignItems="center" space={2}>
                        <VStack
                          w="10px"
                          h="10px"
                          borderRadius="100%"
                          backgroundColor={theme?.colorPieChart[index]}
                        />
                        <Text fontSize="14px" fontWeight={700}>
                          {value.toFixed(0)}%
                        </Text>
                        <Text
                          fontSize="14px"
                          numberOfLines={1}
                          style={{
                            flex: 1,
                            overflow: "hidden",
                          }}
                        >
                          {label}
                        </Text>
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
