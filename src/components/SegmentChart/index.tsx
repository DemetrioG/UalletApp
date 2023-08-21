import { Center, HStack, Text, VStack } from "native-base";

import { ChartProps } from "./types";
import When from "../When";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { VictoryPie } from "victory-native";

export const SegmentChart = ({ data }: { data: ChartProps[] }) => {
  const { theme }: IThemeProvider = useTheme();

  return (
    <Center>
      <HStack>
        <VStack w="50%">
          <VictoryPie
            data={data}
            width={200}
            height={200}
            colorScale={["blue"]}
            innerRadius={25}
            animate
          />
        </VStack>
        <VStack w="50%">
          {data.map(({ x, y }, index) => {
            return (
              <When is={!!y} key={index}>
                <VStack justifyContent="center" flex={1}>
                  <HStack alignItems="center" space={2}>
                    <VStack
                      w="10px"
                      h="10px"
                      borderRadius="500px"
                      backgroundColor={theme?.colorPieChart[index]}
                    />
                    <Text fontSize="14px" fontWeight={700}>
                      {y.toFixed(0)}%
                    </Text>
                    <Text
                      fontSize="14px"
                      numberOfLines={1}
                      style={{
                        flex: 1,
                        overflow: "hidden",
                      }}
                    >
                      {x}
                    </Text>
                  </HStack>
                </VStack>
              </When>
            );
          })}
        </VStack>
      </HStack>
    </Center>
  );
};
